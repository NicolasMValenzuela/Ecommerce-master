import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Obtenemos los nuevos valores del contexto
  const { carrito, isAuthenticated, logout } = useCarrito(); 
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout(); // Llama a la función de logout del contexto
    navigate('/login'); // Redirige al login
  };

  return (
    <nav className="bg-gray-900 shadow-lg fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/Inicio" className="text-white text-xl font-bold hover:text-blue-400 transition-colors">
              NewCar
            </Link>
          </div>

          {/* Menú de Escritorio */}
          <ul className="hidden md:flex items-baseline space-x-4">
            <li><Link to="/Inicio" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Inicio</Link></li>
            <li><Link to="/catalogo" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Catálogo</Link></li>
            <li><Link to="/nosotros" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Nosotros</Link></li>
            <li><Link to="/contacto" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Contacto</Link></li>
            
            {isAuthenticated ? (
              <>
                <li>
                  <button onClick={handleLogout} className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Logout
                  </button>
                </li>
                <li>
                  <Link to="/carrito" className="relative text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Carrito
                    {/* VERIFICACIÓN SEGURA: Chequeamos que carrito y carrito.items existan */}
                    {carrito && carrito.items && carrito.items.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2">
                        {carrito.items.length}
                      </span>
                    )}
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
              </li>
            )}
          </ul>

          {/* ... (resto del código para el menú móvil, que no necesita cambios) ... */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;