import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../services/api';

export interface Location {
  id: number;
  name: string;
  address: string;
  description: string;
  emoji: string;
  city: string;
  state: string;
  createdAt: string;
}

interface LocationsContextType {
  locations: Location[];
  loading: boolean;
  error: string | null;
  getLocationById: (id: number) => Location | undefined;
}

const LocationsContext = createContext<LocationsContextType | undefined>(undefined);

export const useLocations = () => {
  const context = useContext(LocationsContext);
  if (!context) {
    // Retornar valores padrão em vez de lançar erro para evitar quebra da aplicação
    return {
      locations: [],
      loading: false,
      error: null,
      getLocationById: () => undefined
    };
  }
  return context;
};

interface LocationsProviderProps {
  children: ReactNode;
}

export const LocationsProvider = ({ children }: LocationsProviderProps) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      setError(null);
      const locations = await api.getLocations();
      setLocations(locations);
    } catch (err) {
      console.error('Erro ao buscar locais:', err);
      setError('Erro ao carregar locais');
    } finally {
      setLoading(false);
    }
  };

  const getLocationById = (id: number): Location | undefined => {
    return locations.find(location => location.id === id);
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const value: LocationsContextType = {
    locations,
    loading,
    error,
    getLocationById
  };

  return (
    <LocationsContext.Provider value={value}>
      {children}
    </LocationsContext.Provider>
  );
};
