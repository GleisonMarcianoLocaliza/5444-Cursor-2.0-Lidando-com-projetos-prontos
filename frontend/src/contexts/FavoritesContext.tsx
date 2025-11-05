import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { 
  getFavorites, 
  addFavorite, 
  removeFavorite
} from '../services/favoritesService';
import type { Favorite } from '../services/favoritesService';
import { useAuth } from './AuthContext';

interface FavoritesContextType {
  favorites: Favorite[];
  isLoading: boolean;
  isInitialized: boolean;
  addFavorite: (carId: number) => Promise<void>;
  removeFavorite: (carId: number) => Promise<void>;
  isFavorite: (carId: number) => boolean;
  loadFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

interface FavoritesProviderProps {
  children: ReactNode;
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { isAuthenticated } = useAuth();

  // Carregar favoritos quando usuário estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites();
    } else {
      setFavorites([]);
      setIsInitialized(false);
    }
  }, [isAuthenticated]);

  const loadFavorites = async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    try {
      const favoritesData = await getFavorites();
      setFavorites(favoritesData);
      setIsInitialized(true);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
      setIsInitialized(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFavorite = async (carId: number) => {
    if (!isAuthenticated) {
      throw new Error('Usuário não autenticado');
    }

    try {
      await addFavorite(carId);
      await loadFavorites(); // Recarregar lista
    } catch (error) {
      throw error;
    }
  };

  const handleRemoveFavorite = async (carId: number) => {
    if (!isAuthenticated) {
      throw new Error('Usuário não autenticado');
    }

    try {
      await removeFavorite(carId);
      await loadFavorites(); // Recarregar lista
    } catch (error) {
      throw error;
    }
  };

  const handleIsFavorite = (carId: number): boolean => {
    return favorites.some(fav => fav.carId === carId);
  };

  const value = {
    favorites,
    isLoading,
    isInitialized,
    addFavorite: handleAddFavorite,
    removeFavorite: handleRemoveFavorite,
    isFavorite: handleIsFavorite,
    loadFavorites
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites deve ser usado dentro de um FavoritesProvider');
  }
  return context;
}
