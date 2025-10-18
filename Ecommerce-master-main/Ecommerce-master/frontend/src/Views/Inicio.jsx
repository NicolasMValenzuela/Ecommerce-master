import React from 'react';
import { Link } from 'react-router-dom';
import { useVehicles } from '../context/VehiclesContext'; // <--- Usa el Context

const Inicio = () => {
  const { vehicles, loading, error } = useVehicles(); // <--- Obtén datos del Context

  // Puedes mostrar solo algunos autos destacados si quieres:
  const featuredCars = vehicles.slice(0, 3);

  // Mostrar loading o error si es necesario
  if (loading) {
    return (
      <div className="bg-white text-gray-900 min-h-screen pt-24 flex justify-center items-center">
        <div className="text-xl">Cargando vehículos destacados...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white text-gray-900 min-h-screen pt-24 flex justify-center items-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white text-gray-900 min-h-screen pt-24">
      {/* Banner principal centrado */}
      <div className="flex flex-col justify-center items-center h-[350px] bg-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 text-center drop-shadow">
          Experimenta el Futuro de la Conducción
        </h1>
        <p className="text-lg max-w-xl text-gray-700 text-center">
          Descubre una selección de vehículos premium, meticulosamente diseñados para rendimiento y lujo. En NewCar, redefinimos la experiencia automotriz, ofreciendo un servicio inigualable y un proceso de compra en línea sin problemas.
        </p>
      </div>

      {/* Autos Destacados */}
      <div className="p-10">
        <h2 className="text-2xl font-bold mb-6">Autos Destacados</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {featuredCars.map((car, index) => (
            <div key={`featured-car-${car.idVehiculo || car.id || index}`} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow hover:shadow-lg transition">
              {car.imageUrl ? (
                <img 
                  src={car.imageUrl} 
                  alt={`${car.marca} ${car.modelo}`} 
                  className="w-full h-56 object-cover"
                />
              ) : (
                <div className="w-full h-56 bg-gray-200 flex items-center justify-center">
                  <svg className="w-20 h-20 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              <div className="p-4">
                <h3 className="text-xl font-semibold">{car.marca} {car.modelo} {car.anio}</h3>
                <p className="text-gray-500 mb-4">KM: {car.kilometraje.toLocaleString()}</p>
                <Link
                  to={`/catalogo/${car.idVehiculo || car.id}`}
                  className="inline-block bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition"
                >
                  Ver Más
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Inicio;