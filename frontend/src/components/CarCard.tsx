import { Link } from 'react-router-dom';
import { memo, useState } from 'react';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { getImageUrl } from '../utils/imageUtils';

interface CarCardProps {
  id: string | number;
  title: string;
  shortTitle: string;
  price: number;
  image: string;
}

export const CarCard = memo(function CarCard({ id, title, shortTitle, price, image }: CarCardProps) {
  const { isAuthenticated } = useAuth();
  const { isFavorite, addFavorite, removeFavorite, isLoading: favoritesLoading } = useFavorites();
  const [isLoading, setIsLoading] = useState(false);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      // Aqui você pode abrir o modal de login
      // Por enquanto, apenas mostra um alert
      alert('Faça login para favoritar carros');
      return;
    }

    setIsLoading(true);
    try {
      if (isFavorite(Number(id))) {
        await removeFavorite(Number(id));
      } else {
        await addFavorite(Number(id));
      }
    } catch (error) {
      console.error('Erro ao favoritar:', error);
      alert('Erro ao favoritar carro');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <article className="bg-neutral-white rounded-lg shadow-elevation-1 overflow-hidden hover:shadow-elevation-2 transition-shadow">
      {/* Image */}
      <div className="bg-neutral-divisor p-6 flex items-center justify-center min-h-[200px] relative">
        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          disabled={isLoading || favoritesLoading}
          className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-sm transition-all hover:shadow-md disabled:opacity-50"
          aria-label={isFavorite(Number(id)) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          {isLoading || favoritesLoading ? (
            <div className="w-5 h-5 border-2 border-neutral-text border-t-transparent rounded-full animate-spin" />
          ) : isFavorite(Number(id)) ? (
            <MdFavorite className="w-5 h-5 text-red-500" />
          ) : (
            <MdFavoriteBorder className="w-5 h-5 text-neutral-text hover:text-red-500" />
          )}
        </button>

        <img
          src={getImageUrl(image)}
          alt={`${title} - Imagem do veículo`}
          className="w-full h-auto object-contain max-h-[180px]"
          style={{ imageRendering: 'auto' }}
        />
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="font-heading font-semibold text-heading-xs text-neutral-black mb-1 line-clamp-2 min-h-[3rem]">
          {title}
        </h3>

        {/* Subtitle */}
        <p className="text-body-md text-neutral-text mb-4">
          {shortTitle}
        </p>

        {/* Price */}
        <div className="mb-4" aria-label={`Preço: R$ ${price} por diária`}>
          <span className="font-heading font-bold text-heading-sm text-neutral-black">
            R${price}
          </span>
          <span className="text-body-md text-neutral-text">
            /diária
          </span>
        </div>

        {/* Button */}
        <Link
          to={`/car/${id}`}
          className="block w-full bg-primary-pure hover:bg-primary-dark text-neutral-white font-medium py-3 px-6 rounded-lg transition-colors text-body-md text-center focus:outline-none focus:ring-2 focus:ring-primary-pure focus:ring-offset-2"
          aria-label={`Ver detalhes do ${title}`}
        >
          Ver detalhes
        </Link>
      </div>
    </article>
  );
});
