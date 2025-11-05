import type { Category, Car } from '../types/index';
import type { Location } from '../contexts/LocationsContext';

// URL base da API - pode ser configurada via variável de ambiente VITE_API_BASE_URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// Helper para obter token de autenticação
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Helper para criar headers com autenticação
const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const api = {
  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${API_BASE_URL}/category`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return response.json();
  },

  async getCategoryById(id: number): Promise<Category> {
    const response = await fetch(`${API_BASE_URL}/category/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch category');
    }
    return response.json();
  },

  async getCars(): Promise<Car[]> {
    const response = await fetch(`${API_BASE_URL}/car`);
    if (!response.ok) {
      throw new Error('Failed to fetch cars');
    }
    return response.json();
  },

  async getRandomCars(limit: number = 6): Promise<Car[]> {
    const response = await fetch(`${API_BASE_URL}/car/random?limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch random cars');
    }
    return response.json();
  },

  async getCarById(id: number): Promise<Car> {
    const response = await fetch(`${API_BASE_URL}/car/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch car');
    }
    return response.json();
  },

  async getCarsByCategory(categoryId: number): Promise<Car[]> {
    const response = await fetch(`${API_BASE_URL}/car?categoryId=${categoryId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch cars by category');
    }
    return response.json();
  },

  async searchCars(searchQuery: string): Promise<Car[]> {
    const response = await fetch(`${API_BASE_URL}/car?search=${encodeURIComponent(searchQuery)}`);
    if (!response.ok) {
      throw new Error('Failed to search cars');
    }
    return response.json();
  },

  async getLocations(): Promise<Location[]> {
    const response = await fetch(`${API_BASE_URL}/locations`);
    if (!response.ok) {
      throw new Error('Failed to fetch locations');
    }
    return response.json();
  },

  async getLocationById(id: number): Promise<Location> {
    const response = await fetch(`${API_BASE_URL}/locations/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch location');
    }
    return response.json();
  }
};

// Exportar helpers para uso em outros serviços
export { getAuthHeaders };
