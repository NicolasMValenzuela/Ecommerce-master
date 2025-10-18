import React from 'react';
import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';

const Card = ({ auto }) => {
  console.log('Renderizando Card para auto:', auto);
  const { agregarAlCarrito } = useCarrito();
  const sinStock = !auto.stock || auto.stock <= 0;

  return (
    <div className="relative group">
      {/* Etiqueta de Agotado */}
      {sinStock && (
        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded z-10">
          AGOTADO
        </div>
      )}

      <Link to={`/catalogo/${auto.idVehiculo}`}>
        <div className={`bg-gray-900 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition ${sinStock ? 'opacity-50' : ''}`}>
          {auto.imageUrl ? (
            <img className="w-full h-48 object-cover" src={auto.imageUrl} alt={`${auto.marca} ${auto.modelo}`} />
          ) : (
            <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          <div className="p-4">
              <h3 className="text-white font-semibold text-lg">{`${auto.marca} ${auto.modelo}`}</h3>
              {/* Usamos auto.anio que viene del backend */}
              <h3 className="text-white font-semibold text-lg">{`$${auto.precioBase}`}</h3>
              <p className="text-gray-400 text-sm">{`${auto.anio}, ${auto.kilometraje.toLocaleString()} km`}</p>
          </div>
        </div>
      </Link>

      {/* Botón de agregar al carrito (deshabilitado si no hay stock) */}
      {!sinStock && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            agregarAlCarrito(auto);
          }}
          className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Agregar al carrito"
        >
          {/* Ícono de carrito SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m13-9l2 9m-5-9V6a2 2 0 10-4 0v3" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Card;