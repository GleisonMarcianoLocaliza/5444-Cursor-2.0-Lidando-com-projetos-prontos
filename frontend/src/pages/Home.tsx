import { Header, Footer, SearchBox, CarCard, CarCardSkeleton, Banner } from '../components';
import { useCars } from '../contexts/CarsContext';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { useState, useEffect } from 'react';
import type { Car } from '../types';

export function Home() {
  const { getRandomCars } = useCars();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [randomCars, setRandomCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    const fetchCars = async () => {
      try {
        setLoading(true);
        setError(null);
        let cars: Car[];
        if (isAuthenticated) {
          try {
            cars = await api.getRecommendedCars(6);
          } catch {
            cars = await getRandomCars(6);
          }
        } else {
          cars = await getRandomCars(6);
        }
        setRandomCars(cars);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar veículos');
        console.error('Error fetching cars for home:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [getRandomCars, isAuthenticated, authLoading]);

  return (
    <div className="min-h-screen bg-neutral-background">
      <Header />
      <SearchBox />
      <Banner />

      {/* Car Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="font-heading text-heading-lg text-neutral-black mb-8">
          Veículos Disponíveis
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <CarCardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-body-md text-feedback-negative">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {randomCars.map((car) => (
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
        )}
      </div>
      <Footer />
    </div>
  );
}
