import { useState, useEffect } from 'react';
import { MdClose, MdCreditCard, MdLocationOn, MdQrCode } from 'react-icons/md';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPayment: (paymentData: PaymentData) => void;
  totalValue: number;
}

interface PaymentData {
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  cardholderName: string;
  country: string;
  address: string;
  paymentMethod: 'pix' | 'card';
}

export function PaymentModal({ isOpen, onClose, onPayment, totalValue }: PaymentModalProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [country, setCountry] = useState('Brasil');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix'>('pix');
  const [pixLoading, setPixLoading] = useState(false);
  const [showPixQr, setShowPixQr] = useState(false);

  // Reset estados PIX quando muda o método de pagamento ou quando modal fecha
  useEffect(() => {
    if (!isOpen) {
      setPixLoading(false);
      setShowPixQr(false);
    } else if (paymentMethod !== 'pix') {
      setPixLoading(false);
      setShowPixQr(false);
    }
  }, [isOpen, paymentMethod]);

  // Auto-gera QR code PIX: loading aparece imediatamente, QR code após 1 segundo
  useEffect(() => {
    if (isOpen && paymentMethod === 'pix' && !showPixQr) {
      // Inicia o loading imediatamente
      setPixLoading(true);
      setShowPixQr(false);
      
      // Após 1 segundo, mostra o QR code
      const timer = setTimeout(() => {
        setPixLoading(false);
        setShowPixQr(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, paymentMethod]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const paymentData: PaymentData = {
      cardNumber,
      expiryDate,
      cvc,
      cardholderName,
      country,
      address,
      paymentMethod: 'card'
    };
    onPayment(paymentData);
  };

  const handlePixPayment = () => {
    setPixLoading(true);
    setShowPixQr(false);
    
    // Simular loading por 1 segundo
    setTimeout(() => {
      setPixLoading(false);
      setShowPixQr(true);
    }, 1000);
  };

  const handlePixCompleted = () => {
    // Simular pagamento realizado
    onPayment({
      cardNumber: 'PIX',
      expiryDate: '',
      cvc: '',
      cardholderName: 'PIX Payment',
      country: 'Brasil',
      address: 'PIX',
      paymentMethod: 'pix'
    });
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + ' / ' + v.substring(2, 4);
    }
    return v;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-2xl relative my-16 min-h-fit">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-text hover:text-neutral-black transition-colors"
          aria-label="Fechar"
        >
          <MdClose className="w-6 h-6" />
        </button>

        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="font-heading text-heading-md text-neutral-black mb-1">
              Finalizar Pagamento
            </h2>
            <p className="text-body-sm text-neutral-text">
              Valor total: R$ {totalValue.toFixed(2).replace('.', ',')}
            </p>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('pix')}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-colors ${
                  paymentMethod === 'pix'
                    ? 'border-secondary-pure bg-secondary-pure text-white'
                    : 'border-neutral-divisor bg-white text-neutral-text hover:border-secondary-pure'
                }`}
              >
                <MdQrCode className="w-5 h-5" />
                <span className="font-medium text-body-sm">Pagar com PIX</span>
              </button>
              
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-colors ${
                  paymentMethod === 'card'
                    ? 'border-secondary-pure bg-secondary-pure text-white'
                    : 'border-neutral-divisor bg-white text-neutral-text hover:border-secondary-pure'
                }`}
              >
                <MdCreditCard className="w-5 h-5" />
                <span className="font-medium text-body-sm">Cartão de Crédito</span>
              </button>
            </div>
          </div>

          {/* PIX Payment Section */}
          {paymentMethod === 'pix' && (
            <div className="space-y-4">
              {!pixLoading && !showPixQr && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handlePixPayment}
                    className="w-full bg-secondary-pure text-white py-3 px-4 rounded-lg font-medium text-body-md hover:bg-secondary-dark transition-colors"
                  >
                    Gerar QR Code PIX
                  </button>
                </div>
              )}

              {pixLoading && (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-secondary-pure"></div>
                  <p className="mt-3 text-body-sm text-neutral-text">Gerando QR Code...</p>
                </div>
              )}

              {showPixQr && (
                <div className="text-center space-y-4">
                  <div className="bg-neutral-divisor rounded-lg p-4">
                    <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center border-2 border-dashed border-neutral-text">
                      <div className="text-center">
                        <MdQrCode className="w-16 h-16 mx-auto text-neutral-text mb-2" />
                        <p className="text-body-xs text-neutral-text">QR Code PIX</p>
                        <p className="text-body-xs text-neutral-text mt-1">Escaneie com seu app</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-secondary-pure text-white rounded-lg p-3">
                    <p className="font-medium text-center text-body-sm">
                      Valor: R$ {totalValue.toFixed(2).replace('.', ',')}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handlePixCompleted}
                    className="w-full bg-secondary-pure text-white py-3 px-4 rounded-lg font-medium text-body-md hover:bg-secondary-dark transition-colors"
                  >
                    Pagamento realizado
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Card Payment Form */}
          {paymentMethod === 'card' && (
            <form onSubmit={handleSubmit} className="space-y-4">
            {/* Dados do cartão */}
            <div className="space-y-3">
              <h3 className="font-heading text-body-md text-neutral-black flex items-center gap-2">
                <MdCreditCard className="w-4 h-4" />
                Dados do cartão
              </h3>
              
              {/* Card Number */}
              <div>
                <label htmlFor="cardNumber" className="block text-body-xs font-medium text-neutral-black mb-1">
                  Número do cartão
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="1234 1234 1234 1234"
                  maxLength={19}
                  className="w-full px-3 py-2 border border-neutral-divisor rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-pure focus:border-transparent"
                  required
                />
                {/* Card logos */}
                <div className="flex gap-2 mt-1">
                  <div className="text-xs text-neutral-text">VISA</div>
                  <div className="text-xs text-neutral-text">Mastercard</div>
                  <div className="text-xs text-neutral-text">JCB</div>
                  <div className="text-xs text-neutral-text">Discover</div>
                </div>
              </div>

              {/* Expiry and CVC */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="expiryDate" className="block text-body-xs font-medium text-neutral-black mb-1">
                    Validade
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                    placeholder="MM / AA"
                    maxLength={7}
                    className="w-full px-3 py-2 border border-neutral-divisor rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-pure focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="cvc" className="block text-body-xs font-medium text-neutral-black mb-1">
                    CVC
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="cvc"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="CVC"
                      maxLength={4}
                      className="w-full px-3 py-2 pr-10 border border-neutral-divisor rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-pure focus:border-transparent"
                      required
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <MdCreditCard className="w-4 h-4 text-neutral-text" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Nome do titular */}
            <div>
              <h3 className="font-heading text-body-md text-neutral-black mb-2">
                Nome do titular do cartão
              </h3>
              <input
                type="text"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                placeholder="Nome completo"
                className="w-full px-3 py-2 border border-neutral-divisor rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-pure focus:border-transparent"
                required
              />
            </div>

            {/* Endereço de cobrança */}
            <div className="space-y-3">
              <h3 className="font-heading text-body-md text-neutral-black flex items-center gap-2">
                <MdLocationOn className="w-4 h-4" />
                Endereço de cobrança
              </h3>
              
              <div>
                <label htmlFor="country" className="block text-body-xs font-medium text-neutral-black mb-1">
                  País
                </label>
                <select
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-divisor rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-pure focus:border-transparent"
                  required
                >
                  <option value="Brasil">Brasil</option>
                  <option value="Argentina">Argentina</option>
                  <option value="Chile">Chile</option>
                  <option value="Colômbia">Colômbia</option>
                </select>
              </div>

              <div>
                <label htmlFor="address" className="block text-body-xs font-medium text-neutral-black mb-1">
                  Endereço
                </label>
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Informe um endereço"
                  className="w-full px-3 py-2 border border-neutral-divisor rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-pure focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  className="mt-1 text-body-xs text-secondary-pure hover:text-secondary-dark transition-colors underline"
                >
                  Preencha o endereço manualmente
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-secondary-pure text-white py-3 rounded-lg font-medium text-body-md hover:bg-secondary-dark transition-colors"
            >
              Finalizar Pagamento
            </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
