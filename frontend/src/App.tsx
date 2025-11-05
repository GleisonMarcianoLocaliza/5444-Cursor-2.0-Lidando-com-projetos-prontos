import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home, Search, Categories, CategoryDetail, Detail, Favorites, Account, Reservation, Reservations } from './pages';
import { CarsProvider } from './contexts/CarsContext';
import { CategoriesProvider } from './contexts/CategoriesContext';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { LocationsProvider } from './contexts/LocationsContext';
import { SearchProvider } from './contexts/SearchContext';
import { ErrorBoundary, ScrollToTop } from './components';

function App() {
	return (
		<ErrorBoundary>
			<BrowserRouter>
				<ScrollToTop />
				<AuthProvider>
					<FavoritesProvider>
						<CategoriesProvider>
							<CarsProvider>
								<LocationsProvider>
									<SearchProvider>
										<Routes>
											<Route path="/" element={<Home />} />
											<Route path="/search" element={<Search />} />
											<Route path="/categories" element={<Categories />} />
											<Route path="/categories/:id" element={<CategoryDetail />} />
											<Route path="/car/:id" element={<Detail />} />
											<Route path="/reservation/:id" element={<Reservation />} />
											<Route path="/favorites" element={<Favorites />} />
											<Route path="/account" element={<Account />} />
											<Route path="/reservations" element={<Reservations />} />
										</Routes>
									</SearchProvider>
								</LocationsProvider>
							</CarsProvider>
						</CategoriesProvider>
					</FavoritesProvider>
				</AuthProvider>
			</BrowserRouter>
		</ErrorBoundary>
	);
}

export default App;
