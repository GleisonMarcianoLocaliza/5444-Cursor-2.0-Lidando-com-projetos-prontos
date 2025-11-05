import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Car } from '../types/index';
import { api } from '../services/api';

interface CarsContextData {
	cars: Car[];
	loading: boolean;
	error: string | null;
	getCarById: (id: number | string) => Car | undefined;
	getCarsByCategory: (categoryId: number) => Car[];
	refreshCars: () => Promise<void>;
	getRandomCars: (limit?: number) => Promise<Car[]>;
}

const CarsContext = createContext<CarsContextData | undefined>(undefined);

interface CarsProviderProps {
	children: ReactNode;
}

export function CarsProvider({ children }: CarsProviderProps) {
	const [cars, setCars] = useState<Car[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchCars = async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await api.getCars();
			setCars(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to fetch cars');
			console.error('Error fetching cars:', err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCars();
	}, []);

	const getCarById = (id: number | string) => {
		return cars.find((car) => String(car.id) === String(id));
	};

	const getCarsByCategory = (categoryId: number) => {
		return cars.filter((car) => car.categoryId === categoryId);
	};

	const refreshCars = async () => {
		await fetchCars();
	};

	const getRandomCars = async (limit: number = 6) => {
		try {
			return await api.getRandomCars(limit);
		} catch (err) {
			console.error('Error fetching random cars:', err);
			throw err;
		}
	};

	return (
		<CarsContext.Provider
			value={{
				cars,
				loading,
				error,
				getCarById,
				getCarsByCategory,
				refreshCars,
				getRandomCars,
			}}
		>
			{children}
		</CarsContext.Provider>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCars() {
	const context = useContext(CarsContext);
	if (context === undefined) {
		throw new Error('useCars must be used within a CarsProvider');
	}
	return context;
}
