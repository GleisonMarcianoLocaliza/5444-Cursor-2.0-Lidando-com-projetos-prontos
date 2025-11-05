import { Link } from 'react-router-dom';
import { memo } from 'react';
import { MdCheckCircle, MdChevronRight } from 'react-icons/md';

interface CategoryCardProps {
  id: number;
  title: string;
  description: string;
  carCount?: number;
}

export const CategoryCard = memo(function CategoryCard({ id, title, description, carCount = 0 }: CategoryCardProps) {
  return (
    <Link
      to={`/categories/${id}`}
      className="group relative bg-neutral-white rounded-lg shadow-elevation-1 hover:shadow-elevation-3 transition-all duration-300 overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary-pure focus:ring-offset-2"
      aria-label={`Ver ${carCount} ${carCount === 1 ? 'carro' : 'carros'} da categoria ${title}`}
    >
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-light/20 to-transparent group-hover:from-primary-pure/30 transition-colors" aria-hidden="true" />

      {/* Content */}
      <article className="relative p-8">
        {/* Icon */}
        <div className="w-16 h-16 bg-primary-pure rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" aria-hidden="true">
          <MdCheckCircle className="w-8 h-8 text-neutral-white" />
        </div>

        {/* Title */}
        <h3 className="font-heading text-heading-sm text-neutral-black mb-3 group-hover:text-primary-pure transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-body-md text-neutral-text mb-6 line-clamp-2">
          {description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="text-body-sm text-neutral-text">
            {carCount} {carCount === 1 ? 'carro' : 'carros'} disponíveis
          </span>

          <div className="w-8 h-8 bg-primary-pure rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform" aria-hidden="true">
            <MdChevronRight className="w-4 h-4 text-neutral-white" />
          </div>
        </div>
      </article>

      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-secondary-pure/10 rounded-bl-full" aria-hidden="true" />
    </Link>
  );
});
