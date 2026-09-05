import React, { useState } from 'react';
import { ViewName, UserRole } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../lib/storage';
import { SafeImage } from '../common/SafeImage';
import { 
  BookOpen, 
  Moon, 
  Sun, 
  Globe, 
  User as UserIcon, 
  LogOut, 
  LogIn,
  Menu, 
  X, 
  LayoutDashboard,
  Sparkles,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  currentView: ViewName;
  onNavigate: (view: ViewName) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainNavItems: { id: ViewName; labelBn: string; labelEn: string }[] = [
    { id: 'home', labelBn: 'হোম', labelEn: 'Home' },
    { id: 'about', labelBn: 'আমাদের সম্পর্কে', labelEn: 'About' },
    { id: 'history', labelBn: 'ইতিহাস', labelEn: 'History' },
    { id: 'founder', labelBn: 'প্রতিষ্ঠাতা', labelEn: 'Founder' },
    { id: 'donors', labelBn: 'দাতা সদস্য', labelEn: 'Donors' },
    { id: 'books', labelBn: 'বইয়ের তালিকা', labelEn: 'Books' },
    { id: 'digital-library', labelBn: 'ডিজিটাল ই-বুক', labelEn: 'E-Library' },
    { id: 'notices', labelBn: 'নোটিশ', labelEn: 'Notices' },
    { id: 'events', labelBn: 'ইভেন্ট', labelEn: 'Events' },
    { id: 'gallery', labelBn: 'গ্যালারি', labelEn: 'Gallery' },
    { id: 'contact', labelBn: 'যোগাযোগ', labelEn: 'Contact' },
    { id: 'faq', labelBn: 'প্রশ্নোত্তর', labelEn: 'FAQ' },
  ];

  const handleNavClick = (view: ViewName) => {
    if (typeof onNavigate === 'function') {
      onNavigate(view);
    }
    setMobileMenuOpen(false);
  };

  const getRoleBadge = (role: UserRole) => {
    return (
      <span className="label bg-[#e2e8f0] dark:bg-slate-800 text-[#0f172a] dark:text-slate-200 px-2.5 py-1 rounded-[4px]">
        {role === 'MEMBER' ? 'MEMBER' : 'ADMIN'}: {user?.fullName?.split(' ')[0] || 'ইউজার'}
      </span>
    );
  };

  const getUserDashboardView = (role?: UserRole): ViewName => {
    if (!role) return 'dashboard';
    if (role === 'MEMBER') return 'member';
    return 'admin';
  };

  // Build role-specific navigation menu bar
  const getNavItems = () => {
    const baseItems = [...mainNavItems];
    if (!user) return baseItems;

    const roleSpecificLinks: { id: ViewName; labelBn: string; labelEn: string }[] = [];

    if (user.role === 'MEMBER') {
      roleSpecificLinks.push(
        { id: 'member', labelBn: 'মেম্বার ড্যাশবোর্ড', labelEn: 'Member Dashboard' }
      );
    } else {
      roleSpecificLinks.push(
        { id: 'admin', labelBn: 'এডমিন কন্ট্রোল প্যানেল', labelEn: 'Admin Control Panel' },
        { id: 'member', labelBn: 'মেম্বার ভিউ', labelEn: 'Member View' }
      );
    }

    return [...roleSpecificLinks, ...baseItems];
  };

  const navItemsToDisplay = getNavItems();

  return (
    <div className="relative lg:sticky lg:top-0 z-40 w-full px-4 sm:px-6 pt-3 sm:pt-4 pb-2 transition-colors">
      <header className="max-w-7xl mx-auto bg-white dark:bg-[#261E20] rounded-[24px] px-4 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between shadow-[0_10px_40px_rgba(45,36,36,0.03)] dark:shadow-none border border-black/5 dark:border-white/10 transition-all">
        {/* Left Branding matching Variation 3 */}
        <button 
          onClick={() => handleNavClick('home')} 
          className="flex items-center gap-3.5 text-left group focus:outline-hidden"
        >
          <div 
            style={{ width: '40px', height: '40px', background: 'var(--accent)', borderRadius: '10px' }} 
            className="shrink-0 flex items-center justify-center shadow-xs transition-transform group-hover:scale-105"
          >
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-serif text-base sm:text-lg lg:text-xl font-bold tracking-tight text-[#2D2424] dark:text-[#FFF9F0] group-hover:text-[#E85D75] transition-colors leading-tight">
              স্পিকার আঃ জব্বার খান স্মৃতি লাইব্রেরি
            </h1>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              স্থাপিত: ২০০১ • ভূতেরদিয়া, বাবুগঞ্জ, বরিশাল
            </div>
          </div>
        </button>

        {/* Desktop Navigation Links matching Variation 3 */}
        <nav className="hidden lg:flex items-center gap-3.5 xl:gap-5">
          <button onClick={() => handleNavClick('about')} className={`text-xs xl:text-sm font-semibold transition-colors ${currentView === 'about' ? 'text-[#E85D75] font-bold' : 'text-[#2D2424] dark:text-[#FFF9F0] opacity-70 hover:opacity-100 hover:text-[#E85D75]'}`}>
            {language === 'bn' ? 'আমাদের সম্পর্কে' : 'About'}
          </button>
          <button onClick={() => handleNavClick('history')} className={`text-xs xl:text-sm font-semibold transition-colors ${currentView === 'history' ? 'text-[#E85D75] font-bold' : 'text-[#2D2424] dark:text-[#FFF9F0] opacity-70 hover:opacity-100 hover:text-[#E85D75]'}`}>
            {language === 'bn' ? 'ইতিহাস' : 'History'}
          </button>
          <button onClick={() => handleNavClick('books')} className={`text-xs xl:text-sm font-semibold transition-colors ${currentView === 'books' ? 'text-[#E85D75] font-bold' : 'text-[#2D2424] dark:text-[#FFF9F0] opacity-70 hover:opacity-100 hover:text-[#E85D75]'}`}>
            {language === 'bn' ? 'বইয়ের তালিকা' : 'Books'}
          </button>
          <button onClick={() => handleNavClick('digital-library')} className={`text-xs xl:text-sm font-semibold transition-colors ${currentView === 'digital-library' ? 'text-[#E85D75] font-bold' : 'text-[#2D2424] dark:text-[#FFF9F0] opacity-70 hover:opacity-100 hover:text-[#E85D75]'}`}>
            {language === 'bn' ? 'ডিজিটাল ই-বুক' : 'E-Books'}
          </button>
          <button onClick={() => handleNavClick('founder')} className={`text-xs xl:text-sm font-semibold transition-colors ${currentView === 'founder' ? 'text-[#E85D75] font-bold' : 'text-[#2D2424] dark:text-[#FFF9F0] opacity-70 hover:opacity-100 hover:text-[#E85D75]'}`}>
            {language === 'bn' ? 'প্রতিষ্ঠাতা' : 'Founder'}
          </button>
          <button onClick={() => handleNavClick('contact')} className={`text-xs xl:text-sm font-semibold transition-colors ${currentView === 'contact' ? 'text-[#E85D75] font-bold' : 'text-[#2D2424] dark:text-[#FFF9F0] opacity-70 hover:opacity-100 hover:text-[#E85D75]'}`}>
            {language === 'bn' ? 'যোগাযোগ' : 'Contact'}
          </button>
        </nav>

        {/* Right Controls & Login Action */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
            className="px-3 py-1.5 rounded-full text-xs font-bold border border-slate-200 dark:border-slate-700 text-[#2D2424] dark:text-[#FFF9F0] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="ভাষা পরিবর্তন / Switch Language"
          >
            {language === 'bn' ? 'EN' : 'বাংলা'}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-slate-200 dark:border-slate-700 text-[#2D2424] dark:text-[#FFF9F0] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="থিম পরিবর্তন"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-[#F4D35E]" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <button
                id="header-dashboard-btn"
                onClick={() => handleNavClick(getUserDashboardView(user.role))}
                style={{ background: 'var(--ink)', color: 'white', borderRadius: '15px' }}
                className="px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold flex items-center gap-1.5 hover:opacity-90 transition-all shadow-xs"
                title="ড্যাশবোর্ডে যান"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>{user.fullName?.split(' ')[0] || 'ড্যাশবোর্ড'}</span>
              </button>
              <button
                id="header-logout-btn"
                onClick={logout}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-500 hover:text-rose-600 transition-colors"
                title="লগআউট"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              id="header-login-btn"
              onClick={() => handleNavClick('login')}
              style={{ background: 'var(--ink)', color: 'white', padding: '8px 20px', borderRadius: '15px', border: 'none', fontWeight: 'bold' }}
              className="text-xs sm:text-sm hover:opacity-90 transition-all flex items-center gap-1.5 shadow-sm"
              title="লগইন / প্রবেশ করুন"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'লগইন' : 'Login'}</span>
            </button>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-[#2D2424] dark:text-white"
            aria-label="মেনু খুলুন"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Sub-bar for other sections on Desktop */}
      <div className="max-w-7xl mx-auto px-4 mt-2 hidden lg:flex items-center justify-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-400">
        <button onClick={() => handleNavClick('donors')} className="hover:text-[#E85D75] transition-colors">দাতা সদস্য</button>
        <span>•</span>
        <button onClick={() => handleNavClick('notices')} className="hover:text-[#E85D75] transition-colors">নোটিশ বোর্ড</button>
        <span>•</span>
        <button onClick={() => handleNavClick('events')} className="hover:text-[#E85D75] transition-colors">ইভেন্ট</button>
        <span>•</span>
        <button onClick={() => handleNavClick('gallery')} className="hover:text-[#E85D75] transition-colors">ফটোগ্যালারি</button>
        <span>•</span>
        <button onClick={() => handleNavClick('faq')} className="hover:text-[#E85D75] transition-colors">প্রশ্নোত্তর</button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden max-w-7xl mx-auto mt-2 bg-white dark:bg-[#261E20] rounded-[24px] shadow-lg border border-black/5 dark:border-white/10 p-5 space-y-4">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            {navItemsToDisplay.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  currentView === item.id
                    ? 'bg-[#E85D75] text-white font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {language === 'bn' ? item.labelBn : item.labelEn}
              </button>
            ))}
          </div>

          <div>
            {user ? (
              <div className="flex gap-2">
                <button
                  onClick={() => handleNavClick(getUserDashboardView(user.role))}
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-[#2D2424] text-white"
                >
                  ড্যাশবোর্ড
                </button>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white"
                >
                  লগআউট
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                style={{ background: 'var(--ink)', color: 'white', borderRadius: '15px' }}
                className="w-full py-2.5 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>লগইন / নিবন্ধন</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
