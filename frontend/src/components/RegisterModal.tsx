import { useState } from 'react';
import { MdClose, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import logo from '../assets/logo-dark.png';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (name: string, email: string, password: string) => void;
  onOpenLogin: () => void;
}

export function RegisterModal({ isOpen, onClose, onRegister, onOpenLogin }: RegisterModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }
    
    if (password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    onRegister(name, email, password);
  };

  const handleGoogleRegister = () => {
    // Implementar cadastro com Google
    console.log('Cadastro com Google');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-md relative my-16 min-h-fit">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-text hover:text-neutral-black transition-colors"
          aria-label="Fechar"
        >
          <MdClose className="w-6 h-6" />
        </button>

        <div className="p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <img src={logo} alt="Loucadora" className="h-12 mx-auto mb-2" />        
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-body-sm font-medium text-neutral-black mb-2">
                Nome completo
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Insira seu nome completo"
                className="w-full px-4 py-3 border border-neutral-divisor rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-pure focus:border-transparent"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-body-sm font-medium text-neutral-black mb-2">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Insira seu e-mail"
                className="w-full px-4 py-3 border border-neutral-divisor rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-pure focus:border-transparent"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-body-sm font-medium text-neutral-black mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Insira sua senha"
                  className="w-full px-4 py-3 pr-12 border border-neutral-divisor rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-pure focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-text hover:text-neutral-black transition-colors"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <MdVisibilityOff className="w-5 h-5" /> : <MdVisibility className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-body-sm font-medium text-neutral-black mb-2">
                Confirmar senha
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme sua senha"
                  className="w-full px-4 py-3 pr-12 border border-neutral-divisor rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-pure focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-text hover:text-neutral-black transition-colors"
                  aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showConfirmPassword ? <MdVisibilityOff className="w-5 h-5" /> : <MdVisibility className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full bg-primary-pure text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
            >
              Criar conta
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-neutral-divisor"></div>
            <span className="px-4 text-body-sm text-neutral-text">Ou cadastrar com</span>
            <div className="flex-1 border-t border-neutral-divisor"></div>
          </div>

          {/* Google Register Button */}
          <button
            onClick={handleGoogleRegister}
            className="w-full flex items-center justify-center gap-3 py-3 border border-neutral-divisor rounded-lg text-neutral-text hover:bg-neutral-background transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="font-medium">Google</span>
          </button>

          {/* Login Link */}
          <div className="text-center mt-6">
            <button 
              onClick={onOpenLogin}
              className="text-body-sm text-neutral-text hover:text-primary-pure transition-colors"
            >
              Já tenho uma conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
