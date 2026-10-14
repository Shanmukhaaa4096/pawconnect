import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { MobileDrawer } from './components/common/MobileDrawer';

// Pages
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
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <BrowserRouter>
      <AuthProvider>
        <FavoritesProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen bg-[#F3E6E6] text-[#292323]">
              {/* Top Navigation */}
              <Navbar onOpenDrawer={() => setDrawerOpen(true)} />

              {/* Mobile Slide-Out Drawer (Screen 3) */}
              <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

              {/* Page View */}
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/browse" element={<BrowsePetsPage />} />
                  <Route path="/pets/:id" element={<PetDetailsPage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/orders/:id/delivery" element={<DeliveryTrackingPage />} />
                  <Route path="/shelters" element={<SheltersPage />} />
                  <Route path="/shelters/:id" element={<ShelterDetailsPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/messages" element={<MessagesPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>

              {/* Desktop Footer */}
              <Footer />

              {/* Mobile Bottom Navigation (Screens 4, 5, 6, 7, 8, 10) */}
              <MobileBottomNav />
            </div>
          </CartProvider>
        </FavoritesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
