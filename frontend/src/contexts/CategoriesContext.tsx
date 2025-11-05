import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Category } from '../types/index';
import { api } from '../services/api';

interface CategoriesContextData {
	categories: Category[];
	loading: boolean;
	error: string | null;
	getCategoryById: (id: number | string) => Category | undefined;
	refreshCategories: () => Promise<void>;
}

const CategoriesContext = createContext<CategoriesContextData | undefined>(undefined);

interface CategoriesProviderProps {
	children: ReactNode;
}

export function CategoriesProvider({ children }: CategoriesProviderProps) {
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchCategories = async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await api.getCategories();
			setCategories(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to fetch categories');
			console.error('Error fetching categories:', err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCategories();
	}, []);

	const getCategoryById = (id: number | string) => {
		return categories.find((category) => String(category.id) === String(id));
	};

	const refreshCategories = async () => {
		await fetchCategories();
	};

	return (
		<CategoriesContext.Provider
			value={{
				categories,
				loading,
				error,
				getCategoryById,
				refreshCategories,
			}}
		>
			{children}
		</CategoriesContext.Provider>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCategories() {
	const context = useContext(CategoriesContext);
	if (context === undefined) {
		throw new Error('useCategories must be used within a CategoriesProvider');
	}
	return context;
}
