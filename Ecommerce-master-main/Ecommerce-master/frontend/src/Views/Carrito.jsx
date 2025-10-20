import React, { useState } from "react";
import { useCarrito } from "../context/CarritoContext";
import { Link, useNavigate } from "react-router-dom";
import { fetchConToken } from "../api/api";

export default function Carrito() {
  const { carrito, quitarDelCarrito, isAuthenticated, user } = useCarrito();
  const navigate = useNavigate();
  const [formaDePago, setFormaDePago] = useState("TARJETA");

  // --- LÓGICA DE CÁLCULO EN TIEMPO REAL ---
  const { subtotal, descuento, total } = useMemo(() => {
    if (!carrito || !carrito.items || carrito.items.length === 0) {
      return { subtotal: 0, descuento: 0, total: 0 };
    }

    const sub = carrito.items.reduce((acc, item) => acc + (item.valor || 0), 0);
    
    let desc = 0;
    if (formaDePago === 'EFECTIVO') {
      desc = sub * 0.10; // 10% de descuento
    } else if (formaDePago === 'TRANSFERENCIA') {
      desc = sub * 0.05; // 5% de descuento
    }
    
    const tot = sub - desc;

    return { subtotal: sub, descuento: desc, total: tot };
  }, [carrito, formaDePago]);

  const handleCheckout = () => {
    if (!carrito || !carrito.idCarrito) return;
    
    const datosCheckout = { formaDePago: formaDePago }; 

      const pedidoGenerado = await fetchConToken(
        `/carritos/${carrito.idCarrito}/checkout`, 
        'POST', 
        formaDePagoObj
      );

      console.log('Respuesta del checkout:', pedidoGenerado);

      // Éxito en la compra
      setShowConfirmModal(false);
      alert(`¡Compra realizada con éxito! 🎉\n\nPedido #${pedidoGenerado.idPedido}\nTotal: $${pedidoGenerado.costoTotal?.toFixed(2)}\nEstado: ${pedidoGenerado.estado}`);
      
      // Navegar y recargar para actualizar el carrito
      navigate('/');
      window.location.reload();
      
    } catch (error) {
      console.error("Error completo en el checkout:", error);
      
      // Manejo específico de errores de stock
      if (error.message.includes('stock')) {
        alert(`❌ Error de Stock\n\n${error.message}\n\nPor favor, verifica la disponibilidad de los vehículos en tu carrito.`);
      } else if (error.message.includes('vacío')) {
        alert("❌ Tu carrito está vacío. Agrega algunos vehículos antes de proceder con la compra.");
      } else if (error.message.includes('confirmado')) {
        alert("❌ Este carrito ya ha sido procesado. Se creará un nuevo carrito en tu próxima compra.");
        window.location.reload();
      } else if (error.message.includes('No se pudo conectar')) {
        alert("❌ Error de Conexión\n\nNo se pudo conectar al servidor. Verifica que el backend esté ejecutándose en el puerto 4002.");
      } else if (error.message.includes('No autorizado')) {
        alert("❌ Sesión Expirada\n\nTu sesión ha expirado. Por favor, inicia sesión nuevamente.");
        navigate('/login');
      } else {
        alert(`❌ Error al procesar la compra\n\n${error.message || 'Hubo un problema inesperado. Por favor, inténtalo de nuevo.'}`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Usuario no autenticado
  if (!isAuthenticated) {
    // ... (código para usuario no logueado)
  }

  if (!carrito || !carrito.items) {
    return <p className="mt-20">Cargando carrito...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-20 bg-white p-8 rounded shadow min-h-[300px]">
      <h2 className="text-2xl font-bold mb-6">Carrito de compras</h2>
      {carrito.items.length === 0 ? (
        <p className="text-gray-600">El carrito está vacío.</p>
      ) : (
        <>
          <ul>
            {carrito.items.map((item, index) => (
              <li key={`carrito-item-${item.vehiculoId}-${index}`} className="flex items-center justify-between mb-4">
                <div>
                  <span className="font-semibold">Vehículo ID: {item.vehiculoId}</span>
                  <span className="ml-4 text-gray-500">Valor: ${item.valor?.toFixed(2) || '0.00'}</span>
                </div>
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => quitarDelCarrito(item.id)}
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Selecciona la forma de pago:</h3>
          <div className="flex flex-col space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="formaDePago"
                value="TARJETA"
                checked={formaDePago === "TARJETA"}
                onChange={(e) => setFormaDePago(e.target.value)}
                className="mr-2"
              />
              Tarjeta
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="formaDePago"
                value="EFECTIVO"
                checked={formaDePago === "EFECTIVO"}
                onChange={(e) => setFormaDePago(e.target.value)}
                className="mr-2"
              />
              Efectivo
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="formaDePago"
                value="TRANSFERENCIA"
                checked={formaDePago === "TRANSFERENCIA"}
                onChange={(e) => setFormaDePago(e.target.value)}
                className="mr-2"
              />
              Transferencia
            </label>
          </div>
        </div>

        <button
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={handleCheckout}
        >
          Comprar
        </button>
        </>
      )}
      <div className="mt-6">
        <Link to="/catalogo" className="text-blue-600 hover:underline">Volver al catálogo</Link>
      </div>
    </div>
  );
}