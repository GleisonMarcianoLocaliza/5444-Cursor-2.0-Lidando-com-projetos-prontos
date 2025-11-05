import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import logo from '../assets/logo-dark.png';
import { MdSearch, MdCategory, MdPerson, MdLogout, MdAccountCircle, MdFavorite, MdKeyboardArrowDown, MdCalendarToday } from 'react-icons/md';
import { LoginModal, RegisterModal } from './';
import { useAuth } from '../contexts/AuthContext';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, login, register, logout, isLoading } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      setIsLoginModalOpen(false);
    } catch (error) {
      console.error('Erro no login:', error);
      // Mostrar erro para o usuário
      alert(error instanceof Error ? error.message : 'Erro ao fazer login');
    }
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    try {
      await register(name, email, password);
      setIsRegisterModalOpen(false);
    } catch (error) {
      console.error('Erro no cadastro:', error);
      // Mostrar erro para o usuário
      alert(error instanceof Error ? error.message : 'Erro ao criar conta');
    }
  };

  const openRegisterModal = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const openLoginModal = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  // Fechar menu quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleUserMenuAction = (action: string) => {
    setIsUserMenuOpen(false);
    if (action === 'account') {
      navigate('/account');
    } else if (action === 'favorites') {
      navigate('/favorites');
    } else if (action === 'reservations') {
      navigate('/reservations');
    }
  };

  return (
    <header className="bg-neutral-white border-b border-neutral-divisor">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 lg:gap-8">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src={logo} alt="Loucadora" className="h-6 lg:h-12 cursor-pointer hover:opacity-80 transition-opacity" />
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="w-full md:flex-1 md:max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="O que você procura?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 text-body-sm sm:text-body-md border border-neutral-divisor rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-pure focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-text hover:text-primary-pure transition-colors"
                aria-label="Buscar"
              >
                <MdSearch className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Categories Link */}
          <Link
            to="/categories"
            className="flex items-center gap-2 text-body-md font-medium text-neutral-text hover:text-primary-pure transition-colors"
          >
            <MdCategory className="w-5 h-5" />
            <span className="hidden sm:inline">Categorias</span>
          </Link>

          {/* Login/User Section */}
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={toggleUserMenu}
                className="flex items-center gap-2 text-body-md font-medium text-neutral-text hover:text-primary-pure transition-colors"
                aria-label="Menu do usuário"
              >
                <span className="text-body-sm text-neutral-text">
                  Olá, {user?.name}
                </span>
                <MdKeyboardArrowDown 
                  className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} 
                />
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-divisor z-50">
                  <div className="py-1">
                    <button
                      onClick={() => handleUserMenuAction('account')}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-neutral-text hover:bg-neutral-divisor transition-colors"
                    >
                      <MdAccountCircle className="w-4 h-4" />
                      Minha Conta
                    </button>
                    <button
                      onClick={() => handleUserMenuAction('reservations')}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-neutral-text hover:bg-neutral-divisor transition-colors"
                    >
                      <MdCalendarToday className="w-4 h-4" />
                      Minhas Reservas
                    </button>
                    <button
                      onClick={() => handleUserMenuAction('favorites')}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-neutral-text hover:bg-neutral-divisor transition-colors"
                    >
                      <MdFavorite className="w-4 h-4" />
                      Favoritos
                    </button>
                    <hr className="my-1 border-neutral-divisor" />
                    <button
                      onClick={logout}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-neutral-text hover:bg-neutral-divisor transition-colors"
                    >
                      <MdLogout className="w-4 h-4" />
                      Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center gap-2 text-body-md font-medium text-neutral-text hover:text-primary-pure transition-colors"
              aria-label="Entrar"
            >
              <MdPerson className="w-5 h-5" />
              <span className="hidden sm:inline">Entrar</span>
            </button>
          )}
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
        onOpenRegister={openRegisterModal}
        isLoading={isLoading}
      />

      {/* Register Modal */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onRegister={handleRegister}
        onOpenLogin={openLoginModal}
      />
    </header>
  );
}
