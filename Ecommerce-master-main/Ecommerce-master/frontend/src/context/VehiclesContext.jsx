import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import loadVehiclesWithImages from '../data/autos';

// Context para manejar vehículos de forma centralizada
const VehiclesContext = createContext();

export const useVehicles = () => {
  const context = useContext(VehiclesContext);
  if (!context) {
    throw new Error('useVehicles debe ser usado dentro de VehiclesProvider');
  }
  return context;
};

export const VehiclesProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false); // Flag simple para evitar fetches dobles

  const fetchVehicles = useCallback(async (forceRefresh = false) => {
    // Si ya hemos hecho fetch y no es un refresh forzado, no hacer nada
    if (hasFetched && !forceRefresh) {
      console.log('🔄 Ya se han cargado los vehículos, usando cache');
      return vehicles;
    }

    try {
      console.log('🚀 Cargando vehículos desde API...');
      setLoading(true);
      setError(null);
      
      const vehiclesData = await loadVehiclesWithImages();
      
      setVehicles(vehiclesData);
      setHasFetched(true);
      setError(null);
      
      console.log('✅ Vehículos cargados y guardados en context:', vehiclesData.length);
      return vehiclesData;
      
    } catch (err) {
      console.error('❌ Error al cargar vehículos:', err);
      setError('Error al cargar vehículos');
      setHasFetched(true); // Marcar como intentado aunque falle
      return [];
    } finally {
      setLoading(false);
    }
  }, [hasFetched, vehicles]); // Dependencias mínimas

  // Cargar vehículos al inicializar el context - solo una vez
  useEffect(() => {
    if (!hasFetched) {
      console.log('🎯 Iniciando carga inicial de vehículos...');
      fetchVehicles();
    }
  }, []); // Sin dependencias para que se ejecute solo una vez

  // Función para obtener un vehículo específico por ID - memoizada
  const getVehicleById = useCallback((id) => {
    const vehicleId = parseInt(id, 10);
    return vehicles.find(vehicle => vehicle.idVehiculo === vehicleId);
  }, [vehicles]);

  // Función para refrescar los datos - memoizada
  const refreshVehicles = useCallback(() => {
    return fetchVehicles(true);
  }, [fetchVehicles]);

  // Memoizar el value para evitar re-renders innecesarios - SIN fetchVehicles
  const value = useMemo(() => ({
    vehicles,
    loading,
    error,
    getVehicleById,
    refreshVehicles
  }), [vehicles, loading, error, getVehicleById, refreshVehicles]);

  return (
    <VehiclesContext.Provider value={value}>
      {children}
    </VehiclesContext.Provider>
  );
};

export default VehiclesContext;