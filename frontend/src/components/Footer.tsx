import { Link } from 'react-router-dom';
import { FaTwitter, FaInstagram, FaTiktok } from 'react-icons/fa';
import logoLight from '../assets/logo-light.png';

export function Footer() {
  return (
    <footer className="bg-[#263238] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-6 lg:gap-8">
          {/* Left Section - Logo and Tagline */}
          <div className="flex flex-col items-center lg:items-start gap-3">
            <Link to="/" className="flex items-center gap-3">
              <img 
                src={logoLight} 
                alt="Loucadora" 
                className="h-8 lg:h-12 cursor-pointer hover:opacity-80 transition-opacity" 
              />
            </Link>
            <p className="text-body-sm text-white/90 text-center lg:text-left">
              O carro ideal para sua ocasião
            </p>
          </div>

          {/* Center Section - Disclaimer */}
          <div className="flex-1 flex items-center justify-center">
            <p className="text-body-sm text-white/90 text-center">
              Desenvolvido por Alura. Projeto fictício sem fins comerciais.
            </p>
          </div>

          {/* Right Section - Social Media */}
          <div className="flex flex-col items-center lg:items-end gap-3">
            <h3 className="font-heading text-body-md font-bold text-white">
              Siga nossas redes:
            </h3>
            <div className="flex items-center gap-4">
              <a
                href="https://twitter.com/aluraonline"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center border-2 border-[#E0A86B] rounded-full hover:bg-[#E0A86B]/20 transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter className="w-5 h-5 text-[#E0A86B]" />
              </a>
              <a
                href="https://www.instagram.com/aluraonline"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center border-2 border-[#E0A86B] rounded-full hover:bg-[#E0A86B]/20 transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="w-5 h-5 text-[#E0A86B]" />
              </a>
              <a
                href="https://www.tiktok.com/@aluraonline"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center border-2 border-[#E0A86B] rounded-full hover:bg-[#E0A86B]/20 transition-colors"
                aria-label="TikTok"
              >
                <FaTiktok className="w-5 h-5 text-[#E0A86B]" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

