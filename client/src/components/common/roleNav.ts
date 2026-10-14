import { LucideIcon, PawPrint, ShoppingBag, Building2, MessageCircle, Home, LayoutGrid, Star, Users, FileText, Sparkles, Compass } from 'lucide-react';
import { UserRole } from '../../types';

export interface NavItem {
  to: string; // path, optionally with ?tab=
  label: string;
  short: string; // label for the mobile bottom bar
  icon: LucideIcon;
  /** Dashboard item shown as active when no ?tab= is present. */
  isDefault?: boolean;
}

export interface BarTheme {
  bg: string;
  text: string;
  brand: string;
  activeBg: string;
  activeText: string;
  hoverBg: string;
  tag?: string;
}

export const BAR_THEME: Record<'guest' | UserRole, BarTheme> = {
  guest: { bg: '#FCE8D0', text: '#4A2218', brand: '#8E3B22', activeBg: '#4A2218', activeText: '#FCE8D0', hoverBg: '#F8DDBF' },
  adopter: { bg: '#FCE8D0', text: '#4A2218', brand: '#8E3B22', activeBg: '#4A2218', activeText: '#FCE8D0', hoverBg: '#F8DDBF' },
  owner: { bg: '#FBE3A1', text: '#4A2218', brand: '#4A2218', activeBg: '#4A2218', activeText: '#FBE3A1', hoverBg: '#F5D56E', tag: 'Owner' },
  shelter: { bg: '#8E3B22', text: '#FCE8D0', brand: '#FCE8D0', activeBg: '#FCE8D0', activeText: '#8E3B22', hoverBg: '#A94A28', tag: 'Shelter' },
  admin: { bg: '#3E1F1A', text: '#FCE8D0', brand: '#FCE8D0', activeBg: '#E8873F', activeText: '#3E1F1A', hoverBg: '#5A2A22', tag: 'Admin' },
};

export const navFor = (role?: UserRole): NavItem[] => {
  switch (role) {
    case 'adopter':
      return [
        { to: '/browse', label: 'Find pets', short: 'Adopt', icon: PawPrint },
        { to: '/shop', label: 'Shop', short: 'Shop', icon: ShoppingBag },
        { to: '/shelters', label: 'Shelters', short: 'Shelters', icon: Building2 },
        { to: '/messages', label: 'Messages', short: 'Chat', icon: MessageCircle },
      ];
    case 'owner':
      return [
        { to: '/dashboard?tab=desk', label: 'My pets', short: 'My pets', icon: Home, isDefault: true },
        { to: '/dashboard?tab=board', label: 'Applicants', short: 'Board', icon: LayoutGrid },
        { to: '/messages', label: 'Messages', short: 'Chat', icon: MessageCircle },
        { to: '/browse', label: 'Browse', short: 'Browse', icon: Compass },
      ];
    case 'shelter':
      return [
        { to: '/dashboard?tab=pets', label: 'Listings', short: 'Listings', icon: PawPrint, isDefault: true },
        { to: '/dashboard?tab=applications', label: 'Applications', short: 'Apps', icon: FileText },
        { to: '/dashboard?tab=reviews', label: 'Reviews', short: 'Reviews', icon: Star },
        { to: '/messages', label: 'Messages', short: 'Chat', icon: MessageCircle },
      ];
    case 'admin':
      return [
        { to: '/dashboard?tab=overview', label: 'Overview', short: 'Overview', icon: Sparkles, isDefault: true },
        { to: '/dashboard?tab=users', label: 'Users', short: 'Users', icon: Users },
        { to: '/dashboard?tab=shelters', label: 'Shelters', short: 'Shelters', icon: Building2 },
        { to: '/dashboard?tab=listings', label: 'Listings', short: 'Listings', icon: PawPrint },
      ];
    default:
      return [
        { to: '/browse', label: 'Adopt pets', short: 'Adopt', icon: PawPrint },
        { to: '/shop', label: 'Pet shop', short: 'Shop', icon: ShoppingBag },
        { to: '/shelters', label: 'Shelters', short: 'Shelters', icon: Building2 },
      ];
  }
};

/** Active when the path matches and, for tabbed links, the ?tab= matches (or is absent for the default tab). */
export const isNavActive = (item: NavItem, pathname: string, search: string): boolean => {
  const [path, query = ''] = item.to.split('?');
  if (pathname !== path) return false;
  const want = new URLSearchParams(query).get('tab');
  if (!want) return true;
  const have = new URLSearchParams(search).get('tab');
  return have ? have === want : Boolean(item.isDefault);
};
