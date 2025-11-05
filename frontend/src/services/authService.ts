import { API_BASE_URL } from './api';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

// Gerenciar token no localStorage
export const getToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const setToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('authToken');
};

export const validateCurrentPassword = async (currentPassword: string): Promise<boolean> => {
  const token = getToken();
  if (!token) {
    throw new Error('Token não encontrado');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/validate-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ currentPassword })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.message || 'Erro ao validar senha');
    }

    const data = await response.json();
    return data.isValid;
  } catch (error) {
    console.error('Erro ao validar senha:', error);
    throw error;
  }
};

export const updateUserProfile = async (userData: {
  name: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
}): Promise<User> => {
  const token = getToken();
  if (!token) {
    throw new Error('Token não encontrado');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/update-profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.message || 'Erro ao atualizar perfil');
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    throw error;
  }
};

// Registrar usuário
export const registerUser = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao registrar usuário');
  }

  const result = await response.json();
  setToken(result.token);
  return result;
};

// Login
export const loginUser = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao fazer login');
  }

  const result = await response.json();
  setToken(result.token);
  return result;
};

// Obter usuário atual
export const getCurrentUser = async (): Promise<{ user: User }> => {
  const token = getToken();
  if (!token) {
    throw new Error('Token não encontrado');
  }

  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      removeToken();
      throw new Error('Token expirado');
    }
    const error = await response.json();
    throw new Error(error.error || 'Erro ao buscar usuário');
  }

  return await response.json();
};

// Logout
export const logoutUser = (): void => {
  removeToken();
};
