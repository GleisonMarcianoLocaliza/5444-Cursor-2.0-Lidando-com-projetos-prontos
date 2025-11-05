import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocations } from '../contexts/LocationsContext';
import { useSearch } from '../contexts/SearchContext';
import { MdLocationOn, MdCalendarToday, MdArrowDropDown } from 'react-icons/md';

export function SearchBox() {
  const navigate = useNavigate();
  const { locations = [] } = useLocations();
  const { setSearchData } = useSearch();
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [returnLocation, setReturnLocation] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [returnTime, setReturnTime] = useState('');

  const showReturnLocation = pickupLocation.trim().length > 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate pickup location
    if (!pickupLocation.trim()) {
      alert('Por favor, informe o local de retirada');
      return;
    }

    try {
      // Get location data
      const pickupLocationData = locations.find(loc => loc.id === Number(pickupLocation));
      const returnLocationData = returnLocation ? locations.find(loc => loc.id === Number(returnLocation)) : undefined;

      // Save search data
      const searchData = {
        pickupLocation,
        pickupDate,
        pickupTime,
        returnLocation,
        returnDate,
        returnTime,
        pickupLocationData,
        returnLocationData
      };

      setSearchData(searchData);

      // Build search query with location
      const searchQuery = pickupLocationData?.name || pickupLocation.trim();

      // Navigate to search page with query
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    } catch (error) {
      console.error('Erro ao processar busca:', error);
      // Fallback: navegar sem salvar dados
      navigate(`/search?q=${encodeURIComponent(pickupLocation)}`);
    }
  };

  return (
    <section className="bg-primary-pure py-8 sm:py-10 lg:py-12" aria-label="Formulário de busca de veículos">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSearch} className="flex flex-col gap-4">
          {/* Primeira linha: Retirada */}
          <div>
            <label htmlFor="pickup-location" className="text-neutral-white font-medium text-body-sm mb-2 block">
              Retirada
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-3 sm:gap-4">
              {/* Local de retirada */}
              <div className="sm:col-span-3">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-text" aria-hidden="true">
                    <MdLocationOn className="w-5 h-5" />
                  </span>
                  <select
                    id="pickup-location"
                    value={pickupLocation}
                    onChange={(e) => {
                      setPickupLocation(e.target.value);
                      setReturnLocation(e.target.value); // Seleciona automaticamente o mesmo local para devolução
                    }}
                    className="w-full pl-10 pr-4 py-3 text-body-md border border-neutral-divisor rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-pure focus:border-transparent bg-neutral-white cursor-pointer"
                    aria-label="Local de retirada"
                    required
                  >
                    <option value="">Selecione um local</option>
                    {locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.emoji} {location.name} - {location.city}/{location.state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Data */}
              <div className="sm:col-span-2">
                <input
                  id="pickup-date"
                  type="date"
                  value={pickupDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => {
                    setPickupDate(e.target.value);
                    // Se a data de devolução não estiver preenchida, abre o date picker automaticamente
                    if (!returnDate) {
                      setTimeout(() => {
                        const returnDateInput = document.getElementById('return-date-input') as HTMLInputElement;
                        if (returnDateInput) {
                          returnDateInput.showPicker?.();
                        }
                      }, 100);
                    }
                  }}
                  onClick={(e) => {
                    e.currentTarget.showPicker?.();
                  }}
                  className="w-full px-4 py-3 text-body-md border border-neutral-divisor rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-pure focus:border-transparent cursor-pointer"
                  aria-label="Data de retirada"
                />
              </div>

              {/* Horário */}
              <div className="sm:col-span-1">
                <div className="relative">
                  <select
                    id="pickup-time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full appearance-none px-4 py-3 text-body-md border border-neutral-divisor rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-pure focus:border-transparent bg-neutral-white cursor-pointer"
                    aria-label="Horário de retirada"
                  >
                    <option value="">Horário</option>
                    <option value="08:00">08:00</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="12:00">12:00</option>
                    <option value="13:00">13:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                    <option value="17:00">17:00</option>
                    <option value="18:00">18:00</option>
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-text pointer-events-none" aria-hidden="true">
                    <MdArrowDropDown className="w-5 h-5" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Segunda linha: Devolução (condicional) */}
          {showReturnLocation && (
            <div>
              <label className="text-neutral-white font-medium text-body-sm mb-2 block">
                Devolução
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-6 gap-3 sm:gap-4">
                {/* Local de devolução */}
                <div className="sm:col-span-3">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-text">
                      <MdLocationOn className="w-5 h-5" />
                    </span>
                    <select
                      value={returnLocation}
                      onChange={(e) => setReturnLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 text-body-md border border-neutral-divisor rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-pure focus:border-transparent bg-neutral-white cursor-pointer"
                    >
                      <option value="">Selecione um local</option>
                      {locations.map((location) => (
                        <option key={location.id} value={location.id}>
                          {location.emoji} {location.name} - {location.city}/{location.state}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Data */}
                <div className="sm:col-span-2">
                  <input
                    id="return-date-input"
                    type="date"
                    value={returnDate}
                    min={pickupDate ? new Date(new Date(pickupDate).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                    onChange={(e) => setReturnDate(e.target.value)}
                    onClick={(e) => {
                      e.currentTarget.showPicker?.();
                    }}
                    className="w-full px-4 py-3 text-body-md border border-neutral-divisor rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-pure focus:border-transparent cursor-pointer"
                  />
                </div>

                {/* Horário */}
                <div className="sm:col-span-1">
                  <div className="relative">
                    <select
                      value={returnTime}
                      onChange={(e) => setReturnTime(e.target.value)}
                      className="w-full appearance-none px-4 py-3 text-body-md border border-neutral-divisor rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-pure focus:border-transparent bg-neutral-white cursor-pointer"
                    >
                      <option value="">Horário</option>
                      <option value="08:00">08:00</option>
                      <option value="09:00">09:00</option>
                      <option value="10:00">10:00</option>
                      <option value="11:00">11:00</option>
                      <option value="12:00">12:00</option>
                      <option value="13:00">13:00</option>
                      <option value="14:00">14:00</option>
                      <option value="15:00">15:00</option>
                      <option value="16:00">16:00</option>
                      <option value="17:00">17:00</option>
                      <option value="18:00">18:00</option>
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-text pointer-events-none">
                      <MdArrowDropDown className="w-5 h-5" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Terceira linha: Botão Buscar */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-secondary-pure hover:bg-secondary-dark text-neutral-white font-medium px-8 py-3 rounded-lg transition-colors text-body-md w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-secondary-dark focus:ring-offset-2"
              aria-label="Buscar veículos disponíveis"
            >
              Buscar
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
