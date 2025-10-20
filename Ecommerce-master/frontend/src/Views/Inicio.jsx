import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useVehicles } from '../context/VehiclesContext'; // <--- Usa el Context
import Card from '../components/Card'; // <--- Importa el componente Card

const Inicio = () => {
  const { vehicles, loading, error } = useVehicles(); // <--- Obtén datos del Context
  const [currentIndex, setCurrentIndex] = useState(0);

  // Mostrar 5 autos para el carrusel
  const carouselCars = vehicles.slice(0, 5);
  
  // Función para ir al siguiente grupo de 3 autos
  const nextSlide = () => {
    // Si estamos en la última posición posible (índice 2), volvemos al inicio
    if (currentIndex >= carouselCars.length - 3) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Función para ir al grupo anterior de 3 autos
  const prevSlide = () => {
    // Si estamos al inicio, vamos a la última posición posible
    if (currentIndex <= 0) {
      setCurrentIndex(Math.max(0, carouselCars.length - 3));
    } else {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Obtener los 3 autos visibles actualmente
  const visibleCars = carouselCars.slice(currentIndex, currentIndex + 3);

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

      {/* Carrusel de Autos Destacados */}
      <div className="p-10">
        <h2 className="text-2xl font-bold mb-6">Autos Destacados</h2>
        
        {/* Contenedor del carrusel */}
        <div className="relative">
          {/* Botón anterior */}
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-colors duration-200 cursor-pointer"
            disabled={carouselCars.length <= 3}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Grid de autos visibles */}
          <div className="mx-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {visibleCars.map((vehiculo, index) => (
              <Card key={`vehiculo-${vehiculo.idVehiculo || vehiculo.id || currentIndex + index}`} vehiculo={vehiculo} />
            ))}
          </div>

          {/* Botón siguiente */}
          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-colors duration-200 cursor-pointer"
            disabled={carouselCars.length <= 3}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Indicadores de posición */}
        {carouselCars.length > 3 && (
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: Math.max(1, carouselCars.length - 2) }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  currentIndex === index ? 'bg-gray-800' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Inicio;