import type { CompletedReservation } from '../types';
import { getAuthHeaders, API_BASE_URL } from './api';

// Gerar ID único para reserva (mantido para compatibilidade, mas será descartado pelo backend)
export const generateReservationId = (): string => {
  return `res_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Salvar reserva via API
export const saveReservation = async (reservation: any): Promise<CompletedReservation> => {
  try {
    console.log('Enviando dados da reserva:', reservation);
    console.log('Headers de autenticação:', getAuthHeaders());
    
    const response = await fetch(`${API_BASE_URL}/reservations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(reservation)
    });

    console.log('Status da resposta:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro da API:', errorData);
      throw new Error(errorData.error || 'Falha ao salvar reserva');
    }

    const result = await response.json();
    console.log('Reserva salva com sucesso:', result);
    return result;
  } catch (error) {
    console.error('Erro ao salvar reserva:', error);
    throw error;
  }
};

// Buscar todas as reservas do usuário via API
export const getReservations = async (): Promise<CompletedReservation[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/reservations`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Falha ao carregar reservas');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao carregar reservas:', error);
    throw error;
  }
};

// Buscar reserva específica por ID via API
export const getReservationById = async (reservationId: string): Promise<CompletedReservation | null> => {
  try {
    // Extrair ID numérico do formato "res_123"
    const numericId = reservationId.replace('res_', '');
    
    const response = await fetch(`${API_BASE_URL}/reservations/${numericId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      const errorData = await response.json();
      throw new Error(errorData.error || 'Falha ao buscar reserva');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar reserva:', error);
    throw error;
  }
};

// Atualizar status de uma reserva (não implementado no backend ainda)
export const updateReservationStatus = async (): Promise<boolean> => {
  try {
    // Por enquanto, retorna false pois não está implementado no backend
    console.warn('updateReservationStatus não implementado no backend');
    return false;
  } catch (error) {
    console.error('Erro ao atualizar status da reserva:', error);
    return false;
  }
};

// Remover reserva via API
export const removeReservation = async (reservationId: string): Promise<boolean> => {
  try {
    // Extrair ID numérico do formato "res_123"
    const numericId = reservationId.replace('res_', '');
    
    const response = await fetch(`${API_BASE_URL}/reservations/${numericId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Falha ao cancelar reserva');
    }

    return true;
  } catch (error) {
    console.error('Erro ao remover reserva:', error);
    throw error;
  }
};

