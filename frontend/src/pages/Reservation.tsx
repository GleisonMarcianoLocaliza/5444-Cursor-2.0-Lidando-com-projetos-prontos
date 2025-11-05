import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Header, Footer, Breadcrumbs, PaymentModal, ConfirmationModal } from '../components';
import { useCars } from '../contexts/CarsContext';
import { useCategories } from '../contexts/CategoriesContext';
import { useLocations } from '../contexts/LocationsContext';
import { useAuth } from '../contexts/AuthContext';
import { MdEdit, MdDelete, MdExpandMore, MdExpandLess, MdCheckCircle } from 'react-icons/md';
import { saveReservation } from '../services/reservationsService';
import type { ReservationData, ProtectionPlan, ProtectionPlanType, CompletedReservation } from '../types';
import { getImageUrl } from '../utils/imageUtils';

export function Reservation() {
	const { id } = useParams<{ id: string }>();
	const location = useLocation();
	const navigate = useNavigate();
	const { getCarById, loading: carsLoading } = useCars();
	const { loading: categoriesLoading } = useCategories();
	const { getLocationById } = useLocations();
	const { user } = useAuth();
	
	const [selectedPlan, setSelectedPlan] = useState<ProtectionPlanType>('basica');
	const [expandedPlan, setExpandedPlan] = useState<string | null>(null);
	const [reservationData, setReservationData] = useState<ReservationData | null>(null);
	const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
	const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
	const [completedReservation, setCompletedReservation] = useState<CompletedReservation | null>(null);

	const loading = carsLoading || categoriesLoading;
	const car = getCarById(Number(id));

	// Dados dos planos de proteção
	const protectionPlans: ProtectionPlan[] = [
		{
			id: 'basica',
			name: 'Básica',
			features: [
				'Proteção contra furto',
				'Proteção contra incêndio',
				'Perda total do veículo'
			],
			pricePerDay: 50
		},
		{
			id: 'padrao',
			name: 'Padrão',
			features: [
				'Proteção contra furto',
				'Proteção contra incêndio',
				'Perda total do veículo',
				'Danos e/ou avarias causados por colisões e/ ou eventos adversos',
				'Redução de Coparticipação'
			],
			pricePerDay: 100
		},
		{
			id: 'avancada',
			name: 'Avançada',
			features: [
				'Proteção contra furto',
				'Proteção contra incêndio',
				'Perda total do veículo',
				'Danos e/ou avarias causados por colisões e/ ou eventos adversos',
				'Redução de Coparticipação',
				'Proteção contra roubo',
				'Danos a vidros e pneus',
				'Proteção contra Terceiros',
				'Isenção total de Coparticipação'
			],
			pricePerDay: 150
		}
	];

	// Capturar dados da navegação
	useEffect(() => {
		if (location.state) {
			setReservationData(location.state as ReservationData);
		}
	}, [location.state]);

	if (loading) {
		return (
			<div className='min-h-screen bg-neutral-background'>
				<Header />
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
					<div className='text-center'>
						<p className='text-body-md text-neutral-text'>Carregando...</p>
					</div>
				</div>
				<Footer />
			</div>
		);
	}

	if (!car || !reservationData) {
		return (
			<div className='min-h-screen bg-neutral-background'>
				<Header />
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
					<div className='text-center'>
						<h1 className='font-heading text-heading-xl text-neutral-black mb-4'>
							Dados de reserva não encontrados
						</h1>
						<p className='text-body-md text-neutral-text'>
							Por favor, preencha os dados na página anterior.
						</p>
					</div>
				</div>
				<Footer />
			</div>
		);
	}

	// Cálculos
	const pickupDate = new Date(reservationData.pickupDate);
	const returnDate = new Date(reservationData.returnDate);
	const timeDiff = returnDate.getTime() - pickupDate.getTime();
	const numberOfDays = Math.max(1, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));
	const dailyTotal = numberOfDays * car.price;
	const selectedPlanData = protectionPlans.find(plan => plan.id === selectedPlan);
	const protectionTotal = selectedPlanData ? numberOfDays * selectedPlanData.pricePerDay : 0;
	const totalValue = dailyTotal + protectionTotal;

	const handlePlanSelection = (planId: ProtectionPlanType) => {
		if (selectedPlan === planId) {
			setSelectedPlan(null);
		} else {
			setSelectedPlan(planId);
		}
	};

	const handlePlanToggle = (planId: string) => {
		if (expandedPlan === planId) {
			setExpandedPlan(null);
		} else {
			setExpandedPlan(planId);
		}
	};

	const handlePayment = () => {
		setIsPaymentModalOpen(true);
	};

	const handlePaymentSubmit = async (paymentData: any) => {
		if (!user || !car || !reservationData) return;

		// Salvar via API
		try {
			// Preparar dados no formato esperado pelo backend
			const apiReservationData = {
				carId: Number(car.id),
				pickupLocation: getLocationById(Number(reservationData.pickupLocation))?.name || reservationData.pickupLocation,
				pickupDate: reservationData.pickupDate,
				pickupTime: reservationData.pickupTime,
				returnLocation: getLocationById(Number(reservationData.returnLocation))?.name || reservationData.returnLocation,
				returnDate: reservationData.returnDate,
				returnTime: reservationData.returnTime,
				protectionPlan: selectedPlanData ? {
					id: selectedPlanData.id,
					name: selectedPlanData.name,
					pricePerDay: selectedPlanData.pricePerDay
				} : {
					id: 'none',
					name: 'Sem proteção',
					pricePerDay: 0
				},
				paymentMethod: paymentData.paymentMethod,
				totalValue
			};

			const savedReservation = await saveReservation(apiReservationData);
			
			// Fechar modal de pagamento e abrir modal de confirmação
			setIsPaymentModalOpen(false);
			setCompletedReservation(savedReservation);
			setIsConfirmationModalOpen(true);
		} catch (error) {
			console.error('Erro ao salvar reserva:', error);
			alert('Erro ao salvar reserva. Tente novamente.');
		}
	};

	const handleClosePaymentModal = () => {
		setIsPaymentModalOpen(false);
	};

	const handleCloseConfirmationModal = () => {
		setIsConfirmationModalOpen(false);
		navigate('/');
	};

	const handleViewReservations = () => {
		setIsConfirmationModalOpen(false);
		navigate('/reservations');
	};

	return (
		<div className='min-h-screen bg-neutral-background'>
			<Header />
			<Breadcrumbs items={[
				{ label: 'Home', path: '/' }, 
				{ label: 'Detalhes', path: `/car/${car.id}` }, 
				{ label: 'Reserva' }
			]} />

			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12'>
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
					{/* Coluna Esquerda - Planos de Proteção */}
					<div className='lg:col-span-1 space-y-6'>
						<div className='bg-security-dark text-neutral-white rounded-lg p-6'>
							<h2 className='font-heading text-heading-sm text-neutral-white mb-3'>
								Adicione mais segurança
							</h2>
							<p className='text-body-sm text-neutral-white/90'>
								Escolha uma proteção para o seu aluguel (opcional):
							</p>
						</div>

						<div className='space-y-4'>
							{protectionPlans.map((plan) => {
								const isExpanded = expandedPlan === plan.id;
								const isSelected = selectedPlan === plan.id;
								
								return (
									<div key={plan.id} className={`rounded-lg shadow-elevation-1 overflow-hidden transition-all ${
										isSelected 
											? 'bg-neutral-white border-2 border-primary-pure' 
											: 'bg-neutral-white border-2 border-transparent'
									}`}>
										{/* Header - Sempre visível */}
										<button
											onClick={() => handlePlanToggle(plan.id)}
											className='w-full p-6 flex items-center justify-between hover:bg-neutral-divisor/50 transition-colors'
										>
											<div className='flex-1 text-left flex items-center gap-3'>
												{isSelected && (
													<MdCheckCircle className='w-6 h-6 text-primary-pure flex-shrink-0' />
												)}
												<div>
													<h3 className='font-heading text-heading-md text-neutral-black mb-2'>
														{plan.name}
													</h3>
													<p className='font-heading text-heading-sm text-neutral-black mb-1'>
														R${plan.pricePerDay}/diária
													</p>
												</div>
											</div>
											{isExpanded ? (
												<MdExpandLess className='w-6 h-6 text-neutral-text flex-shrink-0' />
											) : (
												<MdExpandMore className='w-6 h-6 text-neutral-text flex-shrink-0' />
											)}
										</button>

										{/* Conteúdo expandível */}
										{isExpanded && (
											<div className='px-6 pb-6 border-t border-neutral-divisor'>
												<ul className='space-y-1 my-6'>
													{plan.features.map((feature, index) => (
														<li key={index} className='flex items-center gap-2'>
															<span className='text-primary-pure'>•</span>
															<span className='text-body-sm text-neutral-text'>{feature}</span>
														</li>
													))}
												</ul>

												<button
													onClick={(e) => {
														e.stopPropagation();
														handlePlanSelection(plan.id as ProtectionPlanType);
													}}
													className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
														isSelected
															? 'bg-security-dark text-neutral-white hover:bg-security-pure'
															: 'bg-primary-pure text-neutral-white hover:bg-primary-dark'
													}`}
												>
													{isSelected ? 'Remover' : 'Adicionar'}
												</button>
											</div>
										)}
									</div>
								);
							})}
						</div>
					</div>

					{/* Coluna Direita - Resumo da Reserva */}
					<div className='lg:col-span-2'>
						<div className='bg-primary-pure text-neutral-white rounded-lg p-6 mb-6'>
							<h2 className='font-heading text-heading-lg text-neutral-white'>
								Resumo da sua reserva
							</h2>
						</div>

						<div className='bg-neutral-white rounded-lg shadow-elevation-1 p-6 space-y-6'>
							{/* Veículo */}
							<div className='border-b border-neutral-divisor pb-4'>
								<div className='flex justify-between items-start mb-3'>
									<h3 className='font-heading text-heading-sm text-neutral-black'>Veículo</h3>
									<button className='flex items-center gap-1 text-primary-pure hover:text-primary-dark transition-colors'>
										<MdEdit className='w-4 h-4' />
										<span className='text-body-xs'>Editar</span>
									</button>
								</div>
								<div className='flex gap-4'>
									<img
										src={getImageUrl(car.image)}
										alt={car.title}
										className='w-32 h-24 object-contain bg-neutral-divisor rounded'
									/>
									<div className='flex-1'>
										<p className='font-medium text-body-lg text-neutral-black mb-1'>
											{car.title}
										</p>
										<p className='text-body-md text-neutral-text'>
											{car.description}
										</p>
									</div>
								</div>
							</div>

							{/* Retirada e Devolução */}
							<div className='border-b border-neutral-divisor pb-4'>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
									{/* Retirada */}
									<div>
										<div className='flex justify-between items-start mb-3'>
											<h3 className='font-heading text-heading-sm text-neutral-black'>Retirada</h3>
											<button className='flex items-center gap-1 text-primary-pure hover:text-primary-dark transition-colors'>
												<MdEdit className='w-4 h-4' />
												<span className='text-body-xs'>Editar</span>
											</button>
										</div>
										<div className='space-y-1'>
											<p className='text-body-sm text-neutral-text'>
												<strong>Data:</strong> {new Date(reservationData.pickupDate).toLocaleDateString('pt-BR')}
											</p>
											<p className='text-body-sm text-neutral-text'>
												<strong>Horário:</strong> {reservationData.pickupTime}
											</p>
											<p className='text-body-sm text-neutral-text'>
												<strong>Local:</strong> {getLocationById(Number(reservationData.pickupLocation))?.name || reservationData.pickupLocation}
											</p>
											{getLocationById(Number(reservationData.pickupLocation)) && (
												<p className='text-body-xs text-neutral-text'>
													{getLocationById(Number(reservationData.pickupLocation))?.address}
												</p>
											)}
										</div>
									</div>

									{/* Devolução */}
									<div>
										<div className='flex justify-between items-start mb-3'>
											<h3 className='font-heading text-heading-sm text-neutral-black'>Devolução</h3>
											<button className='flex items-center gap-1 text-primary-pure hover:text-primary-dark transition-colors'>
												<MdEdit className='w-4 h-4' />
												<span className='text-body-xs'>Editar</span>
											</button>
										</div>
										<div className='space-y-1'>
											<p className='text-body-sm text-neutral-text'>
												<strong>Data:</strong> {new Date(reservationData.returnDate).toLocaleDateString('pt-BR')}
											</p>
											<p className='text-body-sm text-neutral-text'>
												<strong>Horário:</strong> {reservationData.returnTime}
											</p>
											<p className='text-body-sm text-neutral-text'>
												<strong>Local:</strong> {getLocationById(Number(reservationData.returnLocation))?.name || reservationData.returnLocation}
											</p>
											{getLocationById(Number(reservationData.returnLocation)) && (
												<p className='text-body-xs text-neutral-text'>
													{getLocationById(Number(reservationData.returnLocation))?.address}
												</p>
											)}
										</div>
									</div>
								</div>
							</div>

							{/* Diárias */}
							<div className='border-b border-neutral-divisor pb-4'>
								<div className='flex justify-between items-start mb-3'>
									<h3 className='font-heading text-heading-sm text-neutral-black'>Diárias</h3>
								</div>
								<div className='flex justify-between items-center'>
									<p className='text-body-sm text-neutral-text'>
										{numberOfDays}x R$ {car.price.toFixed(2).replace('.', ',')}
									</p>
									<p className='font-medium text-body-sm text-neutral-black'>
										R$ {dailyTotal.toFixed(2).replace('.', ',')}
									</p>
								</div>
							</div>

							{/* Proteção */}
							{selectedPlan && selectedPlanData && (
								<div className='border-b border-neutral-divisor pb-4'>
									<div className='flex justify-between items-start mb-3'>
										<h3 className='font-heading text-heading-sm text-neutral-black'>Proteção</h3>
										<button 
											onClick={() => setSelectedPlan(null)}
											className='flex items-center gap-1 text-feedback-negative hover:text-feedback-negative/80 transition-colors'
										>
											<MdDelete className='w-4 h-4' />
											<span className='text-body-xs'>Remover</span>
										</button>
									</div>
									<div className='space-y-2'>
										<p className='font-medium text-body-sm text-neutral-black'>
											{selectedPlanData.name}
										</p>
										<div className='flex justify-between items-center'>
											<p className='text-body-sm text-neutral-text'>
												{numberOfDays}x R$ {selectedPlanData.pricePerDay.toFixed(2).replace('.', ',')}
											</p>
											<p className='font-medium text-body-sm text-neutral-black'>
												R$ {protectionTotal.toFixed(2).replace('.', ',')}
											</p>
										</div>
									</div>
								</div>
							)}

							{/* Valor Total */}
							<div className='bg-primary-pure text-neutral-white rounded-lg p-4'>
								<div className='flex justify-between items-center'>
									<span className='font-heading text-heading-md text-neutral-white'>
										Valor total:
									</span>
									<span className='font-heading text-heading-lg text-neutral-white'>
										R$ {totalValue.toFixed(2).replace('.', ',')}
									</span>
								</div>
							</div>

							{/* Botão de Pagamento */}
							<button 
								onClick={handlePayment}
								className='w-full bg-secondary-pure text-neutral-white py-4 px-6 rounded-lg font-heading text-heading-md hover:bg-secondary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-secondary-pure focus:ring-offset-2'
							>
								Prosseguir para pagamento
							</button>
						</div>
					</div>
				</div>
			</div>

			<Footer />

			{/* Payment Modal */}
			<PaymentModal
				isOpen={isPaymentModalOpen}
				onClose={handleClosePaymentModal}
				onPayment={handlePaymentSubmit}
				totalValue={totalValue}
			/>

			{/* Confirmation Modal */}
			{completedReservation && (
				<ConfirmationModal
					isOpen={isConfirmationModalOpen}
					onClose={handleCloseConfirmationModal}
					onViewReservations={handleViewReservations}
					reservationData={completedReservation}
				/>
			)}
		</div>
	);
}
