import { getToken } from './authService';
import { API_BASE_URL } from './api';

export interface Favorite {
  id: number;
  carId: number;
  title: string;
  shortTitle: string;
  price: number;
  image: string;
  createdAt: string;
}

// Obter token de autenticação
const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// Listar favoritos do usuário
export const getFavorites = async (): Promise<Favorite[]> => {
  const response = await fetch(`${API_BASE_URL}/favorites`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Token expirado');
    }
    const error = await response.json();
    throw new Error(error.error || 'Erro ao buscar favoritos');
  }

  return await response.json();
};

// Adicionar favorito
export const addFavorite = async (carId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/favorites/${carId}`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Token expirado');
    }
    const error = await response.json();
    throw new Error(error.error || 'Erro ao adicionar favorito');
  }
};

// Remover favorito
export const removeFavorite = async (carId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/favorites/${carId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Token expirado');
    }
    const error = await response.json();
    throw new Error(error.error || 'Erro ao remover favorito');
  }
};

// Verificar se carro é favorito
export const isFavorite = async (carId: number): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}/favorites/${carId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Token expirado');
    }
    const error = await response.json();
    throw new Error(error.error || 'Erro ao verificar favorito');
  }

  const result = await response.json();
  return result.isFavorite;
};
