import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { CartProvider } from './context/CartContext';
import { SiteHeader } from './components/common/SiteHeader';
import { Footer } from './components/common/Footer';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { RequireRole, GuestOnly } from './components/common/RequireRole';
import { RunningDogTransition } from './components/common/RunningDogTransition';

import { HomePage } from './pages/HomePage';
import { BrowsePetsPage } from './pages/BrowsePetsPage';
import { PetDetailsPage } from './pages/PetDetailsPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { ShopPage } from './pages/ShopPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { DeliveryTrackingPage } from './pages/DeliveryTrackingPage';
import { SheltersPage } from './pages/SheltersPage';
import { ShelterDetailsPage } from './pages/ShelterDetailsPage';
import { DashboardPage } from './pages/DashboardPage';
import { MessagesPage } from './pages/MessagesPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => (
  <BrowserRouter>
    <RunningDogTransition />
    <AuthProvider>
      <FavoritesProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen bg-[#FCE8D0] text-[#3E1F1A] pb-16 md:pb-0">
            <SiteHeader />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/browse" element={<BrowsePetsPage />} />
                <Route path="/pets/:id" element={<PetDetailsPage />} />
                <Route path="/favorites" element={<RequireRole roles={['adopter']}><FavoritesPage /></RequireRole>} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/checkout" element={<RequireRole roles={['adopter']}><CheckoutPage /></RequireRole>} />
                <Route path="/orders/:id/delivery" element={<RequireRole roles={['adopter', 'admin']}><DeliveryTrackingPage /></RequireRole>} />
                <Route path="/shelters" element={<SheltersPage />} />
                <Route path="/shelters/:id" element={<ShelterDetailsPage />} />
                <Route path="/dashboard" element={<RequireRole><DashboardPage /></RequireRole>} />
                <Route path="/profile" element={<RequireRole><ProfilePage /></RequireRole>} />
                <Route path="/messages" element={<RequireRole roles={['adopter', 'owner', 'shelter']}><MessagesPage /></RequireRole>} />
                <Route path="/login" element={<GuestOnly><LoginPage /></GuestOnly>} />
                <Route path="/register" element={<GuestOnly><RegisterPage /></GuestOnly>} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
            <MobileBottomNav />
          </div>
        </CartProvider>
      </FavoritesProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
