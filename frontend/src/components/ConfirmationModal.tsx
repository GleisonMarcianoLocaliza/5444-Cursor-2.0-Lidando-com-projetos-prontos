import { MdClose, MdCheckCircle, MdCalendarToday, MdLocationOn, MdCreditCard, MdQrCode } from 'react-icons/md';
import type { CompletedReservation } from '../types';
import { getImageUrl } from '../utils/imageUtils';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewReservations: () => void;
  reservationData: CompletedReservation;
}

export function ConfirmationModal({ isOpen, onClose, onViewReservations, reservationData }: ConfirmationModalProps) {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-text hover:text-neutral-black transition-colors"
          aria-label="Fechar"
        >
          <MdClose className="w-6 h-6" />
        </button>

        <div className="p-6">
          {/* Success Icon and Title */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-feedback-positive rounded-full flex items-center justify-center mx-auto mb-4">
              <MdCheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="font-heading text-heading-md text-neutral-black mb-2">
              Reserva confirmada com sucesso!
            </h2>
            <p className="text-body-sm text-neutral-text">
              Sua reserva foi processada e você receberá um e-mail de confirmação.
            </p>
          </div>

          {/* Reservation Summary */}
          <div className="bg-neutral-divisor rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={getImageUrl(reservationData.car.image)}
                alt={reservationData.car.title}
                className="w-12 h-8 object-contain bg-white rounded"
              />
              <div>
                <h3 className="font-medium text-body-sm text-neutral-black">
                  {reservationData.car.title}
                </h3>
                <p className="text-body-xs text-neutral-text">
                  Reserva #{reservationData.id.split('_')[1]}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MdCalendarToday className="w-4 h-4 text-neutral-text" />
                <span className="text-body-xs text-neutral-text">
                  <strong>Retirada:</strong> {formatDate(reservationData.pickupDate)} às {formatTime(reservationData.pickupTime)}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <MdCalendarToday className="w-4 h-4 text-neutral-text" />
                <span className="text-body-xs text-neutral-text">
                  <strong>Devolução:</strong> {formatDate(reservationData.returnDate)} às {formatTime(reservationData.returnTime)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <MdLocationOn className="w-4 h-4 text-neutral-text" />
                <span className="text-body-xs text-neutral-text">
                  <strong>Local:</strong> {reservationData.pickupLocation}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {reservationData.paymentMethod === 'pix' ? (
                  <MdQrCode className="w-4 h-4 text-neutral-text" />
                ) : (
                  <MdCreditCard className="w-4 h-4 text-neutral-text" />
                )}
                <span className="text-body-xs text-neutral-text">
                  <strong>Pagamento:</strong> {reservationData.paymentMethod === 'pix' ? 'PIX' : 'Cartão de Crédito'}
                </span>
              </div>
            </div>

            <div className="border-t border-neutral-text/20 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="font-medium text-body-sm text-neutral-black">Valor total:</span>
                <span className="font-heading text-heading-sm text-primary-pure">
                  R$ {reservationData.totalValue.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={onViewReservations}
              className="w-full bg-secondary-pure text-white py-3 px-4 rounded-lg font-medium text-body-md hover:bg-secondary-dark transition-colors"
            >
              Ver minhas reservas
            </button>
            
            <button
              onClick={onClose}
              className="w-full bg-neutral-divisor text-neutral-text py-3 px-4 rounded-lg font-medium text-body-md hover:bg-neutral-text hover:text-white transition-colors"
            >
              Voltar ao início
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

