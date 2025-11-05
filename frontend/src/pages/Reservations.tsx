import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Header, Footer, Breadcrumb } from '../components';
import { getReservations, removeReservation } from '../services/reservationsService';
import { MdCalendarToday, MdLocationOn, MdCreditCard, MdQrCode, MdCheckCircle, MdCancel } from 'react-icons/md';
import type { CompletedReservation } from '../types';
import { getImageUrl } from '../utils/imageUtils';

export function Reservations() {
  const { user, isAuthenticated } = useAuth();
  const [reservations, setReservations] = useState<CompletedReservation[]>([]);
  const [reservationsLoading, setReservationsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadReservations();
    }
  }, [user]);

  const loadReservations = async () => {
    if (!user) return;
    
    setReservationsLoading(true);
    try {
      const userReservations = await getReservations();
      setReservations(userReservations);
    } catch (error) {
      console.error('Erro ao carregar reservas:', error);
      alert('Erro ao carregar reservas. Tente novamente.');
    } finally {
      setReservationsLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId: string) => {
    if (!user) return;
    
    if (window.confirm('Tem certeza que deseja cancelar esta reserva?')) {
      try {
        await removeReservation(reservationId);
        // Recarregar a lista de reservas
        await loadReservations();
        alert('Reserva cancelada com sucesso!');
      } catch (error) {
        console.error('Erro ao cancelar reserva:', error);
        alert('Erro ao cancelar reserva. Tente novamente.');
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-text mb-4">
              Faça login para acessar suas reservas
            </h1>
            <p className="text-neutral-text">
              Entre na sua conta para visualizar suas reservas.
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
          { label: 'Minhas Reservas' }
        ]} 
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header da página */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <MdCalendarToday className="w-8 h-8 text-primary-pure" />
            <h1 className="text-3xl font-bold text-neutral-text">
              Minhas Reservas
            </h1>
          </div>
          <p className="text-neutral-text">
            Visualize e gerencie todas as suas reservas de veículos.
          </p>
        </div>

        {/* Lista de Reservas */}
        <div className="bg-neutral-white rounded-lg shadow-elevation-1 p-6 lg:p-8">
          {reservationsLoading ? (
            <div className="text-center py-8">
              <p className="text-neutral-text">Carregando reservas...</p>
            </div>
          ) : reservations.length === 0 ? (
            <div className="text-center py-8">
              <MdCheckCircle className="w-16 h-16 text-neutral-divisor mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-text mb-2">
                Nenhuma reserva encontrada
              </h3>
              <p className="text-neutral-text mb-4">
                Você ainda não fez nenhuma reserva. Que tal começar agora?
              </p>
              <button
                onClick={() => window.location.href = '/'}
                className="bg-primary-pure text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
              >
                Fazer uma reserva
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {reservations.map((reservation) => (
                <div key={reservation.id} className="border border-neutral-divisor rounded-lg p-6 hover:shadow-elevation-1 transition-shadow">
                  <div className="flex gap-6">
                    {/* Imagem do carro - lado esquerdo */}
                    <div className="flex-shrink-0">
                      <img
                        src={getImageUrl(reservation.car.image)}
                        alt={reservation.car.title}
                        className="w-40 h-28 object-contain bg-neutral-divisor rounded-lg"
                      />
                    </div>

                    {/* Dados da reserva - lado direito */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-medium text-body-md text-neutral-black mb-1">
                            {reservation.car.title}
                          </h3>
                          <p className="text-body-sm text-neutral-text mb-2">
                            Reserva #{reservation.id.split('_')[1]}
                          </p>
                          <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            reservation.status === 'confirmed' 
                              ? 'bg-feedback-positive/20 text-feedback-positive' 
                              : reservation.status === 'upcoming'
                              ? 'bg-feedback-attention/20 text-feedback-attention'
                              : 'bg-neutral-divisor text-neutral-text'
                          }`}>
                            {reservation.status === 'confirmed' ? 'Confirmada' : 
                             reservation.status === 'upcoming' ? 'Próxima' : 'Concluída'}
                          </div>
                        </div>
                        
                        {/* Botão Cancelar */}
                        <button 
                          onClick={() => handleCancelReservation(reservation.id)}
                          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <MdCancel className="w-4 h-4" />
                          <span className="text-sm font-medium">Cancelar</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <MdCalendarToday className="w-4 h-4 text-neutral-text" />
                          <span className="text-body-sm text-neutral-text">
                            <strong>Retirada:</strong> {new Date(reservation.pickupDate).toLocaleDateString('pt-BR')} às {reservation.pickupTime}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <MdCalendarToday className="w-4 h-4 text-neutral-text" />
                          <span className="text-body-sm text-neutral-text">
                            <strong>Devolução:</strong> {new Date(reservation.returnDate).toLocaleDateString('pt-BR')} às {reservation.returnTime}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <MdLocationOn className="w-4 h-4 text-neutral-text" />
                          <span className="text-body-sm text-neutral-text">
                            <strong>Local:</strong> {reservation.pickupLocation}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {reservation.paymentMethod === 'pix' ? (
                            <MdQrCode className="w-4 h-4 text-neutral-text" />
                          ) : (
                            <MdCreditCard className="w-4 h-4 text-neutral-text" />
                          )}
                          <span className="text-body-sm text-neutral-text">
                            <strong>Pagamento:</strong> {reservation.paymentMethod === 'pix' ? 'PIX' : 'Cartão de Crédito'}
                          </span>
                        </div>
                      </div>

                      {/* Preço e botão cancelar na parte inferior */}
                      <div className="border-t border-neutral-divisor pt-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-body-md text-neutral-black">Valor total:</span>
                          <span className="font-heading text-heading-md text-primary-pure">
                            R$ {reservation.totalValue.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
