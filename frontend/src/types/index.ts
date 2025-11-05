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

export interface Category {
  id: number | string;
  title: string;
  description: string;
}

export interface Car {
  id: number | string;
  title: string;
  shortTitle: string;
  description: string;
  categoryId: number;
  price: number;
  image: string;
  specs?: {
    passengers: number;
    transmission: string;
    fuel: string;
    year: number;
    airConditioning: boolean;
    trunk: string;
  };
  features?: string[];
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Favorite {
  id: number;
  carId: number;
  title: string;
  shortTitle: string;
  price: number;
  image: string;
  createdAt: string;
}

export interface ReservationData {
  carId: number;
  pickupLocation: string;
  pickupDate: string;
  pickupTime: string;
  returnLocation: string;
  returnDate: string;
  returnTime: string;
}

export interface ProtectionPlan {
  id: string;
  name: string;
  features: string[];
  pricePerDay: number;
}

export type ProtectionPlanType = 'basica' | 'padrao' | 'avancada' | null;

export interface CompletedReservation {
  id: string;
  userId: number;
  car: {
    id: number;
    title: string;
    image: string;
    price: number;
  };
  pickupDate: string;
  pickupTime: string;
  pickupLocation: string;
  returnDate: string;
  returnTime: string;
  returnLocation: string;
  protectionPlan: {
    id: string;
    name: string;
    pricePerDay: number;
  };
  paymentMethod: 'pix' | 'card';
  totalValue: number;
  createdAt: string;
  status: 'confirmed' | 'upcoming' | 'completed';
}