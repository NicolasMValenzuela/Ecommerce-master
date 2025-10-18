import { useParams } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import { useVehicles } from "../context/VehiclesContext";

export default function AutoDetalle() {
  const { id } = useParams();
  const { agregarAlCarrito } = useCarrito();
  const { getVehicleById, loading, vehicles } = useVehicles();

  // Obtener el vehículo desde el Context
  const auto = getVehicleById(id);

  if (loading) {
    return <div className="p-8 mt-20 text-center">Cargando vehículos...</div>;
  }

  if (!auto && vehicles.length > 0) {
    return <div className="p-8 mt-20 text-center">Vehículo no encontrado</div>;
  }

  if (!auto) {
    return <div className="p-8 mt-20 text-center">Cargando...</div>;
  }

  const sinStock = !auto.stock || auto.stock <= 0;

  return (
    <div className="max-w-2xl mx-auto mt-20 bg-white p-8 rounded shadow">
      {auto.imageUrl ? (
        <img 
          src={auto.imageUrl} 
          alt={`${auto.marca} ${auto.modelo}`}
          className="w-full h-64 object-cover rounded mb-4"
        />
      ) : (
        <div className="w-full h-64 bg-gray-200 rounded mb-4 flex items-center justify-center">
          <svg className="w-20 h-20 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
      )}
      <h2 className="text-2xl font-bold mb-2">{auto.marca} {auto.modelo} ({auto.anio})</h2>
      <p className="mb-2 text-gray-700">Kilometraje: {auto.kilometraje.toLocaleString()} km</p>
      <p className="mb-4 font-semibold">Precio: ${auto.precioBase.toLocaleString()}</p>
      <p className="mb-4 font-semibold">Stock: {sinStock ? "Agotado" : `${auto.stock} unidades`}</p>
      
      <button
        className={`px-6 py-2 rounded text-white transition ${sinStock ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        onClick={() => agregarAlCarrito(auto)}
        disabled={sinStock}
      >
        {sinStock ? "Sin stock" : "Agregar al carrito"}
      </button>
    </div>
  );
}