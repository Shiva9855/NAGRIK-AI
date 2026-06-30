import React from 'react';
import { 
  Building2, 
  MapPin, 
  Compass, 
  PlusCircle, 
  Award, 
  User, 
  BookOpen,
  Bell,
  ShieldAlert,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

import { UserProfile } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: 'citizen' | 'official';
  setUserRole: (role: 'citizen' | 'official') => void;
  notificationsCount: number;
  setNotificationsOpen: (open: boolean) => void;
  points: number;
  userProfile: UserProfile | null;
  onLogout: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  highlight?: boolean;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  notificationsCount,
  setNotificationsOpen,
  points,
  userProfile,
  onLogout
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const citizenNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Citizen Portal', icon: Compass },
    { id: 'feed', label: 'Community Feed', icon: ShieldAlert },
    { id: 'map', label: 'Live Map', icon: MapPin },
    { id: 'report', label: 'Report Issue', icon: PlusCircle, highlight: true },
    { id: 'leaderboard', label: 'Leaderboard', icon: Award },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'help', label: 'Help & FAQ', icon: BookOpen },
  ];

  const officialNavItems: NavItem[] = [
    { id: 'authority', label: 'Official Console', icon: Building2 },
    { id: 'feed', label: 'Civic Grievances', icon: ShieldAlert },
    { id: 'map', label: 'Dispatch Map', icon: MapPin },
    { id: 'help', label: 'Guidelines', icon: BookOpen },
  ];

  const currentNavItems = userRole === 'citizen' ? citizenNavItems : officialNavItems;

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800" id="main-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => setActiveTab('landing')}>
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-500 text-slate-900 font-bold text-xl shadow-md shadow-emerald-500/20 mr-2.5">
              N
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
                Nagrik<span className="text-white">AI</span>
              </span>
              <p className="text-[9px] text-emerald-400 font-medium tracking-widest uppercase">Civic Engine</p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center space-x-1">
            {currentNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              if (item.highlight) {
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className="flex items-center px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-all duration-200 shadow-lg shadow-emerald-500/10 ml-2 animate-pulse hover:animate-none"
                    id={`nav-${item.id}`}
                  >
                    <Icon className="w-4.5 h-4.5 mr-1.5" />
                    {item.label}
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive 
                      ? 'bg-slate-800 text-emerald-400 border border-slate-700/50' 
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  }`}
                  id={`nav-${item.id}`}
                >
                  <Icon className="w-4 h-4 mr-1.5" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Role Toggle & Alerts */}
          <div className="hidden sm:flex items-center space-x-3">
            {userProfile ? (
              <>
                {/* XP Points Indicator */}
                {userRole === 'citizen' && (
                  <div className="flex items-center px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-emerald-400">
                    <Sparkles className="w-3.5 h-3.5 mr-1.5 text-yellow-400 fill-yellow-400" />
                    <span>{points} XP</span>
                  </div>
                )}

                {/* Role Switcher Button */}
                <div className="flex items-center rounded-lg bg-slate-950 p-1 border border-slate-800">
                  <button
                    onClick={() => {
                      setUserRole('citizen');
                      setActiveTab('dashboard');
                    }}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                      userRole === 'citizen' 
                        ? 'bg-emerald-500 text-slate-950 shadow-sm' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Citizen
                  </button>
                  <button
                    onClick={() => {
                      setUserRole('official');
                      setActiveTab('authority');
                    }}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                      userRole === 'official' 
                        ? 'bg-emerald-500 text-slate-950 shadow-sm' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Authority
                  </button>
                </div>

                {/* User Info & Sign Out */}
                <div className="flex items-center space-x-2 pl-1.5 border-l border-slate-800">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-extrabold text-xs flex items-center justify-center">
                    {userProfile.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="hidden md:block text-left mr-1">
                    <p className="text-[11px] font-bold text-slate-200 leading-tight max-w-[90px] truncate">{userProfile.name}</p>
                    <p className="text-[9px] text-emerald-400/80 font-medium leading-none capitalize mt-0.5">{userRole}</p>
                  </div>
                  <button
                    onClick={onLogout}
                    className="px-2 py-1 text-[10px] font-extrabold text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 border border-rose-950/20 rounded-md transition-all cursor-pointer"
                    title="Sign Out"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => setActiveTab('auth')}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md shadow-emerald-500/15 cursor-pointer flex items-center space-x-1"
              >
                <span>Sign In / Sign Up</span>
              </button>
            )}

            {/* Notification Bell */}
            <button 
              onClick={() => setNotificationsOpen(true)}
              className="relative p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Bell className="w-5 h-5" />
              {notificationsCount > 0 && (
                <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-slate-900 animate-bounce">
                  {notificationsCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden space-x-2">
            <button 
              onClick={() => setNotificationsOpen(true)}
              className="relative p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 transition-colors mr-1"
            >
              <Bell className="w-5 h-5" />
              {notificationsCount > 0 && (
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-rose-500"></span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
          {userProfile ? (
            <>
              {/* Mobile Account Details & Logout */}
              <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-850 rounded-lg mb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded bg-emerald-500/10 text-emerald-400 font-extrabold flex items-center justify-center text-xs">
                    {userProfile.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">{userProfile.name}</p>
                    <p className="text-[10px] text-slate-500 leading-none mt-0.5">{userProfile.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-2.5 py-1 text-xs font-bold text-rose-400 bg-rose-950/20 border border-rose-950/25 rounded cursor-pointer"
                >
                  Logout
                </button>
              </div>

              {/* Mobile Role Switcher */}
              <div className="flex items-center justify-between px-3 py-2 bg-slate-950 rounded-lg border border-slate-800 mb-3">
                <span className="text-xs text-slate-400 font-medium">Demo Role:</span>
                <div className="flex space-x-1">
                  <button
                    onClick={() => {
                      setUserRole('citizen');
                      setActiveTab('dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className={`px-2.5 py-1 text-xs font-semibold rounded ${
                      userRole === 'citizen' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
                    }`}
                  >
                    Citizen
                  </button>
                  <button
                    onClick={() => {
                      setUserRole('official');
                      setActiveTab('authority');
                      setMobileMenuOpen(false);
                    }}
                    className={`px-2.5 py-1 text-xs font-semibold rounded ${
                      userRole === 'official' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
                    }`}
                  >
                    Authority
                  </button>
                </div>
              </div>
            </>
          ) : (
            <button
              onClick={() => {
                setActiveTab('auth');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-sm transition-all shadow-md shadow-emerald-500/15 mb-3 cursor-pointer"
            >
              Sign In / Create Account
            </button>
          )}

          {currentNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  item.highlight
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : isActive
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700/50'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-4.5 h-4.5 mr-2.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}
