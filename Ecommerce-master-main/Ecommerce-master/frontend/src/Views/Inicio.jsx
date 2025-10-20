import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useVehicles } from '../context/VehiclesContext'; // <--- Usa el Context
import Card from '../components/Card';

const Inicio = () => {
  const { vehicles, loading, error } = useVehicles(); // <--- Obtén datos del Context
  const [currentSlide, setCurrentSlide] = useState(0);

  // Puedes mostrar solo algunos autos destacados si quieres:
  const featuredCars = vehicles.slice(0, 6); // Aumentamos a 6 para el carousel
  const carsPerSlide = 3; // Número de carros por slide
  const totalSlides = Math.ceil(featuredCars.length / carsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

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

      {/* Autos Destacados - Carousel */}
      <div className="p-10">
        <h2 className="text-2xl font-bold mb-6 text-center">Autos Destacados</h2>
        
        {featuredCars.length > 0 ? (
          <div className="relative">
            {/* Carousel Container */}
            <div className="overflow-hidden rounded-lg">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className="grid md:grid-cols-3 gap-6 px-4">
                      {featuredCars
                        .slice(slideIndex * carsPerSlide, (slideIndex + 1) * carsPerSlide)
                        .map((car, index) => (
                          <div key={`featured-car-${car.idVehiculo || car.id || index}`}>
                            <Card vehiculo={car} />
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            {totalSlides > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute cursor-pointer left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-70 hover:bg-opacity-90 text-white p-3 rounded-full shadow-lg transition-all duration-200 z-10"
                  aria-label="Anterior"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={nextSlide}
                  className="absolute cursor-pointer right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-70 hover:bg-opacity-90 text-white p-3 rounded-full shadow-lg transition-all duration-200 z-10"
                  aria-label="Siguiente"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Dots Indicator */}
            {totalSlides > 1 && (
              <div className="flex justify-center mt-6 space-x-2">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      index === currentSlide 
                        ? 'bg-blue-600 scale-110' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Ir al slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            No hay vehículos destacados disponibles
          </div>
        )}
      </div>
    </div>
  );
};

export default Inicio;