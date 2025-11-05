import { API_BASE_URL } from '../services/api';

/**
 * Converte uma URL relativa de imagem (ex: /car-models/image.png) 
 * em uma URL absoluta do backend (ex: http://localhost:3001/car-models/image.png)
 */
export function getImageUrl(imagePath: string): string {
  // Se já for uma URL absoluta, retorna como está
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Remove barra inicial se existir e adiciona ao API_BASE_URL
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${API_BASE_URL}${cleanPath}`;
}

