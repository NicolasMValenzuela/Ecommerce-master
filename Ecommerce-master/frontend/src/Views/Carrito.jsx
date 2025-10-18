import React from "react";
import { useCarrito } from "../context/CarritoContext";
import { Link, useNavigate } from "react-router-dom";
import { fetchConToken } from "../api/api";

export default function Carrito() {
  const { carrito, quitarDelCarrito, isAuthenticated } = useCarrito();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!carrito || !carrito.idCarrito) return;
    const formaDePago = { formaDePago: "TARJETA" }; // Simulación

    fetchConToken(`/carritos/${carrito.idCarrito}/checkout`, 'POST', formaDePago)
      .then(pedidoGenerado => {
        alert("¡Compra realizada con éxito! Tu pedido ha sido generado.");
        navigate('/');
        window.location.reload(); // Forzamos recarga para actualizar todo
      })
      .catch(error => {
        console.error("Error en el checkout:", error);
        alert("Hubo un problema al procesar tu compra. Es posible que no haya stock suficiente.");
      });
  };

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
            {carrito.items.map((item) => (
              <li key={item.id} className="flex items-center justify-between mb-4">
                <div>
                  <span className="font-semibold">Vehículo ID: {item.vehiculoId}</span>
                  <span className="ml-4 text-gray-500">Valor: ${item.valor.toFixed(2)}</span>
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