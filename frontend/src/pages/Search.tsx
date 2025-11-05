import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header, Footer, Breadcrumbs, CarCard, CarCardSkeleton } from '../components';
import { useCars } from '../contexts/CarsContext';
import { useCategories } from '../contexts/CategoriesContext';
import { api } from '../services/api';

export function Search() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  const { cars, loading: carsLoading } = useCars();
  const { categories, loading: categoriesLoading } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<string>('price-asc');
  const [searchResults, setSearchResults] = useState<Car[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery) {
        setIsSearching(true);
        try {
          const results = await api.searchCars(searchQuery);
          setSearchResults(results);
        } catch (error) {
          console.error('Erro ao buscar carros:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    };
    
    performSearch();
  }, [searchQuery]);

  // Usar searchResults quando houver busca, senão usar todos os carros
  const carsToFilter = searchQuery ? searchResults : cars;

  // Filter and sort logic
  const filteredCars = useMemo(() => {
    return carsToFilter
      .filter(car => {
        // Category filter
        if (selectedCategory !== 'all' && car.categoryId !== selectedCategory) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'name') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [carsToFilter, selectedCategory, sortBy]);

  const loading = isSearching || carsLoading || categoriesLoading;

  return (
    <div className="min-h-screen bg-neutral-background">
      <Header />
      <Breadcrumbs items={[{ label: 'Busca' }]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-heading-xl lg:text-heading-xxl text-neutral-black mb-2">
            {searchQuery ? `Veículos disponíveis em "${searchQuery}"` : 'Todos os Veículos'}
          </h1>
          <p className="text-body-md text-neutral-text">
            {filteredCars.length} {filteredCars.length === 1 ? 'veículo disponível' : 'veículos disponíveis'}
          </p>
        </div>

        {/* Filters and Sort */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <CarCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <>
            <div className="bg-neutral-white rounded-lg shadow-elevation-1 p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Category Filter */}
                <div className="flex-1">
                  <label className="block text-body-sm font-medium text-neutral-black mb-2">
                    Categoria
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      key="all"
                      onClick={() => setSelectedCategory('all')}
                      className={`px-4 py-2 rounded-lg text-body-sm font-medium transition-colors ${
                        selectedCategory === 'all'
                          ? 'bg-primary-pure text-neutral-white'
                          : 'bg-neutral-divisor text-neutral-text hover:bg-neutral-text/10'
                      }`}
                    >
                      Todas
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(Number(category.id))}
                        className={`px-4 py-2 rounded-lg text-body-sm font-medium transition-colors ${
                          selectedCategory === Number(category.id)
                            ? 'bg-primary-pure text-neutral-white'
                            : 'bg-neutral-divisor text-neutral-text hover:bg-neutral-text/10'
                        }`}
                      >
                        {category.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div className="lg:w-64">
                  <label className="block text-body-sm font-medium text-neutral-black mb-2">
                    Ordenar por
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-2 border border-neutral-divisor rounded-lg text-body-md focus:outline-none focus:ring-2 focus:ring-primary-pure focus:border-transparent"
                  >
                    <option value="price-asc">Menor preço</option>
                    <option value="price-desc">Maior preço</option>
                    <option value="name">Nome (A-Z)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            {filteredCars.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCars.map((car) => (
                  <CarCard
                    key={car.id}
                    id={car.id}
                    title={car.title}
                    shortTitle={car.shortTitle}
                    price={car.price}
                    image={car.image}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-neutral-divisor rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-neutral-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-heading text-heading-md text-neutral-black mb-2">
                  Nenhum veículo encontrado
                </h3>
                <p className="text-body-md text-neutral-text mb-6">
                  Tente ajustar os filtros ou buscar por outra categoria
                </p>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="bg-primary-pure hover:bg-primary-dark text-neutral-white font-medium px-6 py-3 rounded-lg transition-colors"
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
