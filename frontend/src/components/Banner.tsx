import bannerImage from '../assets/banner.png';

export function Banner() {
  return (
    <section className="relative w-full bg-secondary-pure overflow-hidden">
      {/* Image Container */}
      <div className="relative h-[300px] sm:h-[400px] lg:h-[500px]">
        <img
          src={bannerImage}
          alt="Banner"
          className="w-full h-full object-cover object-center"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-secondary-pure/80 via-secondary-pure/40 to-transparent" />
      </div>

      {/* Text Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-xl lg:max-w-2xl">
            <h1 className="font-heading text-heading-lg sm:text-heading-xl lg:text-heading-xxl text-neutral-white mb-4">
              <span className="text-primary-pure">Loucura</span> é não andar em um desses
            </h1>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block">
        <div className="flex gap-4">
          <svg width="60" height="100" viewBox="0 0 60 100" fill="none">
            <path
              d="M0 50L30 25L30 75L0 50Z"
              fill="currentColor"
              className="text-primary-pure opacity-80"
            />
          </svg>
          <svg width="60" height="100" viewBox="0 0 60 100" fill="none">
            <path
              d="M0 50L30 25L30 75L0 50Z"
              fill="currentColor"
              className="text-primary-pure opacity-60"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
