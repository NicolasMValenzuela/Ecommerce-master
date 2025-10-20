import React, { useState, useEffect } from "react";
import { useCarrito } from "../context/CarritoContext";
import { Link, useNavigate } from "react-router-dom";
import { fetchConToken } from "../api/api";

export default function Carrito() {
  const { carrito, quitarDelCarrito, isAuthenticated, user } = useCarrito();
  const navigate = useNavigate();
  const [formaDePago, setFormaDePago] = useState("TARJETA");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [vehicleDetails, setVehicleDetails] = useState({});
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Debug: Mostrar información de autenticación
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    console.log('Estado de autenticación:', {
      isAuthenticated,
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : null,
      user,
      carrito: carrito ? { 
        idCarrito: carrito.idCarrito, 
        itemCount: carrito.items?.length,
        isLoading: carrito.isLoading,
        error: carrito.error
      } : null
    });
  }, [isAuthenticated, user, carrito]);

  // Obtener detalles completos de los vehículos en el carrito
  useEffect(() => {
    if (carrito?.items && carrito.items.length > 0) {
      setIsLoadingDetails(true);
      const promises = carrito.items.map(item => 
        fetchConToken(`/vehicles/${item.vehiculoId}`)
          .then(vehiculo => ({ [item.vehiculoId]: vehiculo }))
          .catch(error => {
            console.error(`Error cargando vehículo ${item.vehiculoId}:`, error);
            return { [item.vehiculoId]: null };
          })
      );

      Promise.all(promises)
        .then(results => {
          const details = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
          setVehicleDetails(details);
        })
        .finally(() => setIsLoadingDetails(false));
    }
  }, [carrito?.items]);

  const calcularTotal = () => {
    if (!carrito?.items) return 0;
    return carrito.items.reduce((total, item) => {
      const vehiculo = vehicleDetails[item.vehiculoId];
      const precio = vehiculo?.precioBase || item.valor || 0;
      const cantidad = item.cantidad || 1;
      return total + (precio * cantidad);
    }, 0);
  };

  const handleCheckout = async () => {
    if (!carrito || !carrito.idCarrito) {
      alert("Error: No se puede procesar el carrito.");
      return;
    }

    console.log('Iniciando checkout con:', {
      carritoId: carrito.idCarrito,
      formaDePago: formaDePago,
      itemCount: carrito.items?.length
    });

    setIsProcessing(true);
    
    try {
      // Crear el objeto FormaDePago según el backend
      const formaDePagoObj = {
        formaDePago: formaDePago // Enum: TARJETA, EFECTIVO, TRANSFERENCIA
      };

      console.log('Enviando solicitud de checkout:', formaDePagoObj);

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
    return (
      <div className="min-h-screen pt-24 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-2xl mx-auto p-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceso Requerido</h2>
            <p className="text-gray-600 mb-6">Necesitas iniciar sesión para ver tu carrito de compras.</p>
            <div className="space-x-4">
              <Link 
                to="/login" 
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Iniciar Sesión
              </Link>
              <Link 
                to="/register" 
                className="inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Carrito cargando
  if (!carrito || carrito.isLoading || isLoadingDetails) {
    return (
      <div className="min-h-screen pt-24 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto p-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-lg text-gray-600">Cargando tu carrito...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error de backend
  if (carrito?.error) {
    return (
      <div className="min-h-screen pt-24 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto p-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <svg className="w-16 h-16 mx-auto text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Problema de Conexión</h2>
            <p className="text-gray-600 mb-6">
              {carrito.error === 'backend_offline' 
                ? 'No se pudo conectar al servidor. Verifica que el backend esté ejecutándose.'
                : carrito.error === 'unauthorized'
                ? 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
                : `Error: ${carrito.error}`
              }
            </p>
            <div className="space-x-4">
              {carrito.error === 'unauthorized' ? (
                <Link 
                  to="/login" 
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Iniciar Sesión
                </Link>
              ) : (
                <button 
                  onClick={() => window.location.reload()} 
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Reintentar
                </button>
              )}
              <Link 
                to="/catalogo" 
                className="inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Ir al Catálogo
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const total = calcularTotal();
  const itemCount = carrito?.items?.length || 0;

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header del Carrito */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mi Carrito</h1>
              <p className="text-gray-600">
                {user?.firstName ? `¡Hola, ${user.firstName}!` : ''} 
                {itemCount > 0 ? ` Tienes ${itemCount} vehículo${itemCount > 1 ? 's' : ''} en tu carrito` : ' Tu carrito está vacío'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-3xl font-bold text-green-600">${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-blue-600">Inicio</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link to="/catalogo" className="hover:text-blue-600">Catálogo</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">Carrito</span>
          </div>
        </div>
        {/* Contenido del Carrito */}
        {itemCount === 0 ? (
          /* Carrito Vacío */
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="mb-6">
              <svg className="w-24 h-24 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h3>
            <p className="text-gray-600 mb-8">¡Descubre nuestra increíble selección de vehículos y encuentra el auto perfecto para ti!</p>
            <Link 
              to="/catalogo" 
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Explorar Catálogo
            </Link>
          </div>
        ) : (
          /* Lista de Vehículos */
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Vehículos en tu carrito</h2>
                <div className="space-y-4">
                  {carrito.items.map((item, index) => {
                    const vehiculo = vehicleDetails[item.vehiculoId];
                    const precio = vehiculo?.precioBase || item.valor || 0;
                    const cantidad = item.cantidad || 1;
                    const subtotal = precio * cantidad;

                    return (
                      <div key={`carrito-item-${item.vehiculoId}-${index}`} className="flex items-center space-x-6 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        {/* Imagen del vehículo */}
                        <div className="flex-shrink-0">
                          {vehiculo?.imageUrl ? (
                            <img 
                              src={vehiculo.imageUrl} 
                              alt={`${vehiculo.marca} ${vehiculo.modelo}`}
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                              <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Información del vehículo */}
                        <div className="flex-grow">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {vehiculo ? `${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.anio}` : `Vehículo ${item.vehiculoId}`}
                          </h3>
                          {vehiculo && (
                            <div className="mt-1 space-y-1">
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Color:</span> {vehiculo.color}
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Kilometraje:</span> {vehiculo.kilometraje?.toLocaleString()} km
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Stock disponible:</span> {vehiculo.stock} unidades
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Precio y cantidad */}
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Precio unitario</p>
                          <p className="text-lg font-semibold text-gray-900">${precio.toLocaleString('es-AR')}</p>
                          <p className="text-sm text-gray-500 mt-2">Cantidad: {cantidad}</p>
                        </div>

                        {/* Subtotal */}
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Subtotal</p>
                          <p className="text-xl font-bold text-green-600">${subtotal.toLocaleString('es-AR')}</p>
                        </div>

                        {/* Botón eliminar */}
                        <div className="flex-shrink-0">
                          <button
                            onClick={() => quitarDelCarrito(item.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar del carrito"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            {/* Sección de Checkout */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Finalizar Compra</h2>
              
              {/* Resumen del pedido */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Subtotal ({itemCount} vehículo{itemCount > 1 ? 's' : ''})</span>
                  <span className="text-gray-900 font-medium">${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-green-600">${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* Selección de forma de pago */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Forma de Pago</h3>
                <div className="space-y-3">
                  {[
                    { value: 'TARJETA', label: 'Tarjeta de Crédito/Débito', icon: '💳' },
                    { value: 'EFECTIVO', label: 'Efectivo', icon: '💵' },
                    { value: 'TRANSFERENCIA', label: 'Transferencia Bancaria', icon: '🏦' }
                  ].map((opcion) => (
                    <label key={opcion.value} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="formaDePago"
                        value={opcion.value}
                        checked={formaDePago === opcion.value}
                        onChange={(e) => setFormaDePago(e.target.value)}
                        className="mr-3"
                      />
                      <span className="mr-3 text-lg">{opcion.icon}</span>
                      <span className="font-medium text-gray-900">{opcion.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowConfirmModal(true)}
                  disabled={isProcessing}
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.2 8M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
                      </svg>
                      Confirmar Compra
                    </>
                  )}
                </button>
                <Link 
                  to="/catalogo" 
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center"
                >
                  Seguir Comprando
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Confirmación */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Confirmar Compra</h3>
              <p className="text-gray-600 mb-4">
                ¿Estás seguro de que deseas proceder con la compra de {itemCount} vehículo{itemCount > 1 ? 's' : ''} por un total de ${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}?
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Forma de pago: <span className="font-medium">{formaDePago}</span>
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isProcessing ? 'Procesando...' : 'Sí, Comprar'}
                </button>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  disabled={isProcessing}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}