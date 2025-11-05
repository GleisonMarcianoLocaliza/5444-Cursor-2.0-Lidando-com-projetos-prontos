import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="bg-neutral-white border-b border-neutral-divisor">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <nav className="flex items-center gap-2 text-sm">
          <Link 
            to="/" 
            className="text-neutral-text hover:text-primary-pure transition-colors"
          >
            Home
          </Link>
          
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <div key={index} className="flex items-center gap-2">
                {/* SVG Separator */}
                <svg
                  className="w-4 h-4 text-neutral-text"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>

                {/* Item */}
                {isLast || !item.href ? (
                  <span className="font-semibold text-neutral-text">
                    {item.label}
                  </span>
                ) : (
                  <Link 
                    to={item.href} 
                    className="text-neutral-text hover:text-primary-pure transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
