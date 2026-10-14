import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MobileMenu } from './MobileMenu';
import { GuestHeader } from './headers/GuestHeader';
import { AdopterHeader } from './headers/AdopterHeader';
import { OwnerHeader } from './headers/OwnerHeader';
import { ShelterHeader } from './headers/ShelterHeader';
import { AdminHeader } from './headers/AdminHeader';

/** Picks the header built for the signed-in role. Each one has its own structure, not just its own colours. */
export const SiteHeader: React.FC = () => {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const open = () => setMenuOpen(true);

  const bar =
    user?.role === 'adopter' ? <AdopterHeader onMenu={open} /> :
    user?.role === 'owner' ? <OwnerHeader onMenu={open} /> :
    user?.role === 'shelter' ? <ShelterHeader onMenu={open} /> :
    user?.role === 'admin' ? <AdminHeader onMenu={open} /> :
    <GuestHeader onMenu={open} />;

  return (
    <>
      {bar}
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
};
