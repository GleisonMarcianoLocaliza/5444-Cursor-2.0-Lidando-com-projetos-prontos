import { Header, Footer, Breadcrumbs, CategoryCard, CategoryCardSkeleton } from '../components';
import { useCategories } from '../contexts/CategoriesContext';
import { useCars } from '../contexts/CarsContext';

export function Categories() {
  const { categories, loading: categoriesLoading } = useCategories();
  const { cars, loading: carsLoading } = useCars();

  const loading = categoriesLoading || carsLoading;

  const getCategoryCarCount = (categoryId: number) => {
    return cars.filter(car => car.categoryId === categoryId).length;
  };

  return (
    <div className="min-h-screen bg-neutral-background">
      <Header />
      <Breadcrumbs items={[{ label: 'Categorias' }]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="font-heading text-heading-xl lg:text-heading-xxl text-neutral-black mb-4">
            Escolha por Categoria
          </h1>
          <p className="text-body-lg text-neutral-text max-w-3xl">
            Encontre o carro perfeito para sua necessidade. Navegue pelas categorias e descubra
            nossa frota completa de veículos disponíveis para locação.
          </p>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <CategoryCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                id={Number(category.id)}
                title={category.title}
                description={category.description}
                carCount={getCategoryCarCount(Number(category.id))}
              />
            ))}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 bg-primary-light/30 rounded-lg p-8">
          <h2 className="font-heading text-heading-md text-neutral-black mb-4">
            Não encontrou o que procura?
          </h2>
          <p className="text-body-md text-neutral-text mb-6">
            Entre em contato conosco! Nossa equipe está pronta para ajudá-lo a encontrar
            o veículo ideal para suas necessidades específicas.
          </p>
          <button className="bg-primary-pure hover:bg-primary-dark text-neutral-white font-medium px-6 py-3 rounded-lg transition-colors">
            Falar com um especialista
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
