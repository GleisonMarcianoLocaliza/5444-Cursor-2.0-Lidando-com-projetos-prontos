import { createContext, useContext, useState, ReactNode } from 'react';

export interface Location {
  id: number;
  name: string;
  address: string;
  description: string;
  emoji: string;
  city: string;
  state: string;
  createdAt: string;
}

export interface SearchData {
  pickupLocation: string;
  pickupDate: string;
  pickupTime: string;
  returnLocation: string;
  returnDate: string;
  returnTime: string;
  pickupLocationData?: Location;
  returnLocationData?: Location;
}

interface SearchContextType {
  searchData: SearchData | null;
  setSearchData: (data: SearchData | null) => void;
  clearSearchData: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    // Retornar valores padrão em vez de lançar erro para evitar quebra da aplicação
    return {
      searchData: null,
      setSearchData: () => {},
      clearSearchData: () => {}
    };
  }
  return context;
};

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider = ({ children }: SearchProviderProps) => {
  const [searchData, setSearchData] = useState<SearchData | null>(null);

  const clearSearchData = () => {
    setSearchData(null);
  };

  const value: SearchContextType = {
    searchData,
    setSearchData,
    clearSearchData
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};
