import { useParams } from 'react-router-dom';
import { Header, Footer, Breadcrumbs, CarCard, CarCardSkeleton } from '../components';
import { useCategories } from '../contexts/CategoriesContext';
import { useCars } from '../contexts/CarsContext';

export function CategoryDetail() {
  const { id } = useParams<{ id: string }>();
  const { getCategoryById, loading: categoriesLoading } = useCategories();
  const { cars: allCars, loading: carsLoading } = useCars();

  const loading = categoriesLoading || carsLoading;
  const category = getCategoryById(Number(id));
  const cars = allCars.filter(car => car.categoryId === Number(id));

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-background">
        <Header />
        <Breadcrumbs items={[{ label: 'Categorias', path: '/categories' }, { label: 'Carregando...' }]} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12">
            <div className="h-10 bg-neutral-divisor rounded w-64 mb-4 animate-pulse" />
            <div className="h-6 bg-neutral-divisor rounded w-96 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <CarCardSkeleton key={index} />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-neutral-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="font-heading text-heading-xl text-neutral-black mb-4">
              Categoria não encontrada
            </h1>
            <p className="text-body-md text-neutral-text">
              A categoria que você procura não existe.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-background">
      <Header />
      <Breadcrumbs
        items={[
          { label: 'Categorias', path: '/categories' },
          { label: category.title }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Header */}
        <div className="mb-12">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="font-heading text-heading-xl lg:text-heading-xxl text-neutral-black mb-3">
                {category.title}
              </h1>
              <p className="text-body-lg text-neutral-text max-w-3xl">
                {category.description}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 mt-6">
            <div className="bg-neutral-white rounded-lg px-6 py-4 shadow-elevation-1">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-pure" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-body-xs text-neutral-text">Disponíveis</p>
                  <p className="font-heading text-heading-sm text-neutral-black">{cars.length} {cars.length === 1 ? 'veículo' : 'veículos'}</p>
                </div>
              </div>
            </div>

            <div className="bg-neutral-white rounded-lg px-6 py-4 shadow-elevation-1">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-secondary-light/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-secondary-pure" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-body-xs text-neutral-text">A partir de</p>
                  <p className="font-heading text-heading-sm text-neutral-black">
                    R${Math.min(...cars.map(c => c.price))}/dia
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cars Grid */}
        {cars.length > 0 ? (
          <div>
            <h2 className="font-heading text-heading-lg text-neutral-black mb-6">
              Veículos Disponíveis
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car) => (
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
          </div>
        ) : (
          <div className="text-center py-16 bg-neutral-white rounded-lg shadow-elevation-1">
            <div className="w-24 h-24 bg-neutral-divisor rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-neutral-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-heading text-heading-md text-neutral-black mb-2">
              Nenhum veículo disponível
            </h3>
            <p className="text-body-md text-neutral-text">
              No momento não temos veículos disponíveis nesta categoria.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
