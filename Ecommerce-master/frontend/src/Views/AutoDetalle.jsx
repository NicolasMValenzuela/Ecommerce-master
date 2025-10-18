import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";

export default function AutoDetalle() {
  const { id } = useParams();
  const [auto, setAuto] = useState(null);
  const { agregarAlCarrito } = useCarrito();

  useEffect(() => {
    fetch(`http://localhost:4002/vehicles/${id}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => setAuto(data))
      .catch(error => console.error("Error al obtener detalle:", error));
  }, [id]);

  if (!auto) {
    return <div className="p-8 mt-20 text-center">Cargando...</div>;
  }

  const sinStock = !auto.stock || auto.stock <= 0;

  return (
    <div className="max-w-2xl mx-auto mt-20 bg-white p-8 rounded shadow">
      <div className="w-full h-64 bg-gray-200 rounded mb-4 flex items-center justify-center">Imagen no disponible</div>
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