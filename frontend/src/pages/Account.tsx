import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Header, Footer, Breadcrumb } from '../components';
import { updateUserProfile } from '../services/authService';
import { MdPerson, MdEmail, MdEdit, MdSave, MdCancel, MdLock } from 'react-icons/md';

export function Account() {
  const { user, isAuthenticated, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name,
        email: user.email
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setMessage(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(prev => ({
      ...prev,
      name: user?.name || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
    setMessage(null);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      // Validação: se preencheu nova senha, todos os campos de senha são obrigatórios
      if (formData.newPassword || formData.currentPassword || formData.confirmPassword) {
        if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
          throw new Error('Para alterar a senha, todos os campos de senha são obrigatórios');
        }
      }

      // Validação básica apenas no frontend
      if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        throw new Error('Nova senha e confirmação não coincidem');
      }

      // Preparar dados para envio
      const updateData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        ...(formData.newPassword && {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      };

      // Atualizar perfil (backend fará todas as validações)
      const updatedUser = await updateUserProfile(updateData);
      
      // Atualizar contexto com dados do usuário
      updateUser(updatedUser);
      
      setMessage({ type: 'success', text: 'Dados atualizados com sucesso!' });
      setIsEditing(false);
      
      // Limpar campos de senha
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Erro ao atualizar dados' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-text mb-4">
              Faça login para acessar sua conta
            </h1>
            <p className="text-neutral-text">
              Entre na sua conta para gerenciar seus dados.
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
          { label: 'Minha Conta' }
        ]} 
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header da página */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <MdPerson className="w-8 h-8 text-primary-pure" />
            <h1 className="text-3xl font-bold text-neutral-text">
              Minha Conta
            </h1>
          </div>
          <p className="text-neutral-text">
            Gerencie suas informações pessoais e configurações de conta.
          </p>
        </div>

        {/* Mensagem de feedback */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Formulário */}
        <div className="bg-neutral-white rounded-lg shadow-elevation-1 p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-neutral-text">
              Informações Pessoais
            </h2>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-primary-pure text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                <MdEdit className="w-4 h-4" />
                Editar
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-divisor text-neutral-text rounded-lg hover:bg-neutral-text hover:text-white transition-colors"
                >
                  <MdCancel className="w-4 h-4" />
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-pure text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  <MdSave className="w-4 h-4" />
                  {isLoading ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-neutral-text mb-2">
                Nome completo
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-neutral-divisor rounded-lg text-body-md focus:outline-none focus:ring-2 focus:ring-primary-pure focus:border-transparent disabled:bg-neutral-divisor disabled:cursor-not-allowed"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-neutral-text mb-2">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-neutral-divisor rounded-lg text-body-md focus:outline-none focus:ring-2 focus:ring-primary-pure focus:border-transparent disabled:bg-neutral-divisor disabled:cursor-not-allowed"
                />
                <MdEmail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-text" />
              </div>
            </div>

            {/* Alteração de senha - só aparece quando editando */}
            {isEditing && (
              <div className="border-t border-neutral-divisor pt-6">
                <h3 className="text-lg font-semibold text-neutral-text mb-4 flex items-center gap-2">
                  <MdLock className="w-5 h-5" />
                  Alterar senha
                </h3>
                <p className="text-sm text-neutral-text mb-4">
                  Deixe em branco se não quiser alterar a senha.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-text mb-2">
                      Senha atual
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-neutral-divisor rounded-lg text-body-md focus:outline-none focus:ring-2 focus:ring-primary-pure focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-text mb-2">
                      Nova senha
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-neutral-divisor rounded-lg text-body-md focus:outline-none focus:ring-2 focus:ring-primary-pure focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-text mb-2">
                      Confirmar nova senha
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-neutral-divisor rounded-lg text-body-md focus:outline-none focus:ring-2 focus:ring-primary-pure focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Ações da conta */}
        <div className="mt-8 bg-neutral-white rounded-lg shadow-elevation-1 p-6 lg:p-8">
          <h2 className="text-xl font-semibold text-neutral-text mb-6">
            Ações da Conta
          </h2>
          
          <div className="space-y-4">
            <button
              onClick={logout}
              className="w-full sm:w-auto px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Sair da conta
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
