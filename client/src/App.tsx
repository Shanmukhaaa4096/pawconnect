import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { BrowsePetsPage } from './pages/BrowsePetsPage';
import { PetDetailsPage } from './pages/PetDetailsPage';
import { SheltersPage } from './pages/SheltersPage';
import { ShelterDetailsPage } from './pages/ShelterDetailsPage';
import { DashboardPage } from './pages/DashboardPage';
import { MessagesPage } from './pages/MessagesPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FavoritesProvider>
          <div className="flex flex-col min-h-screen bg-slate-50 font-sans selection:bg-orange-500 selection:text-white">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/browse" element={<BrowsePetsPage />} />
                <Route path="/pets/:id" element={<PetDetailsPage />} />
                <Route path="/shelters" element={<SheltersPage />} />
                <Route path="/shelters/:id" element={<ShelterDetailsPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/messages" element={<MessagesPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </FavoritesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
