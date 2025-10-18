import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchConToken } from '../api/api';

const CarritoContext = createContext();

export function useCarrito() {
  return useContext(CarritoContext);
}

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken'));

  useEffect(() => {
    if (isAuthenticated) {
      fetchConToken('/carritos/mine')
        .then(data => {
          const itemsMapeados = data.items.map(item => ({
              ...item,
              id: item.vehiculoId,
          }));
          setCarrito({ ...data, items: itemsMapeados });
        })
        .catch(error => console.error("Error al cargar el carrito:", error));
    } else {
      setCarrito(null);
    }
  }, [isAuthenticated]);

  const login = (token) => {
    localStorage.setItem('accessToken', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setIsAuthenticated(false);
  };

  const agregarAlCarrito = (auto) => {
    if (!isAuthenticated || !carrito) return;

    const itemParaApi = {
      vehiculo: { idVehiculo: auto.idVehiculo },
      valor: auto.precioBase,
      cantidad: 1,
    };

    fetchConToken(`/carritos/${carrito.idCarrito}/items`, 'POST', itemParaApi)
      .then(carritoActualizado => {
        setCarrito(carritoActualizado);
        alert(`${auto.marca} ${auto.modelo} agregado al carrito!`);
      })
      .catch(error => console.error("Error al agregar al carrito:", error));
  };

  const quitarDelCarrito = (itemId) => {
    if (!isAuthenticated) return;

    fetchConToken(`/carritos/items/${itemId}`, 'DELETE')
      .then(() => {
        setCarrito(prev => ({
          ...prev,
          items: prev.items.filter(item => item.id !== itemId)
        }));
      })
      .catch(error => console.error("Error al quitar del carrito:", error));
  };

  const vaciarCarrito = () => {
    console.log("Funcionalidad de vaciar carrito pendiente de implementación en backend.");
  };

  const value = {
    carrito,
    isAuthenticated,
    login,
    logout,
    agregarAlCarrito,
    quitarDelCarrito,
    vaciarCarrito
  };

  return (
    <CarritoContext.Provider value={value}>
      {children}
    </CarritoContext.Provider>
  );
}