import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../contexts/FavoritesContext';
import { useAuth } from '../contexts/AuthContext';
import { CarCard, Breadcrumb, Header, Footer } from '../components';
import { MdFavorite, MdHome } from 'react-icons/md';

export function Favorites() {
  const { favorites, isLoading } = useFavorites();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      // Os favoritos já são carregados automaticamente pelo FavoritesContext
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-text mb-4">
              Faça login para ver seus favoritos
            </h1>
            <p className="text-neutral-text">
              Entre na sua conta para acessar seus carros favoritos.
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
      
      {/* Breadcrumbs */}
      <Breadcrumb 
        items={[
          { label: 'Favoritos' }
        ]} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título da seção */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <MdFavorite className="w-8 h-8 text-primary-pure" />
            <h1 className="text-3xl font-bold text-neutral-text">
              Meus Favoritos
            </h1>
          </div>
          <p className="text-neutral-text">
            {favorites.length === 0 
              ? 'Você ainda não tem carros favoritos'
              : `${favorites.length} carro${favorites.length !== 1 ? 's' : ''} favoritado${favorites.length !== 1 ? 's' : ''}`
            }
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-pure"></div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && favorites.length === 0 && (
          <div className="text-center py-12">
            <MdFavorite className="w-16 h-16 text-neutral-divisor mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-neutral-text mb-2">
              Nenhum favorito ainda
            </h2>
            <p className="text-neutral-text mb-6">
              Comece favoritando carros que você gostar!
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-pure text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <MdHome className="w-4 h-4" />
              Ver carros disponíveis
            </Link>
          </div>
        )}

        {/* Favorites Grid */}
        {!isLoading && favorites.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((favorite) => (
              <CarCard
                key={favorite.id}
                id={favorite.carId}
                title={favorite.title}
                shortTitle={favorite.shortTitle}
                price={favorite.price}
                image={favorite.image}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
