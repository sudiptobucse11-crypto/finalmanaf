import React, { useState } from 'react';
import { ViewName, Book, UserRole } from './types';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/common/Toast';

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

import { HomeView } from './views/HomeView';
import { AboutView } from './views/AboutView';
import { HistoryView } from './views/HistoryView';
import { FounderView } from './views/FounderView';
import { DonorsView } from './views/DonorsView';
import { BooksView } from './views/BooksView';
import { DigitalLibraryView } from './views/DigitalLibraryView';
import { NoticesView } from './views/NoticesView';
import { EventsView } from './views/EventsView';
import { GalleryView } from './views/GalleryView';
import { ContactView } from './views/ContactView';
import { FAQView } from './views/FAQView';
import { AuthModal } from './views/AuthModal';
import { AccessDeniedView } from './views/AccessDeniedView';

import { SuperAdminDashboard } from './views/dashboards/SuperAdminDashboard';
import { LibraryAdminDashboard } from './views/dashboards/LibraryAdminDashboard';
import { LibrarianDashboard } from './views/dashboards/LibrarianDashboard';
import { MemberDashboard } from './views/dashboards/MemberDashboard';

import { BookDetailModal } from './components/common/BookDetailModal';
import { ChangePasswordModal } from './components/common/ChangePasswordModal';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewName>('home');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const { user } = useAuth();

  // Navigation handler guaranteed to be a valid function
  const handleNavigate = (view: ViewName) => {
    if (view === 'login' || view === 'register') {
      setCurrentView(view);
    } else if (view === 'dashboard') {
      if (!user) {
        setCurrentView('login');
      } else {
        setCurrentView('dashboard');
      }
    } else {
      setCurrentView(view);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
  };

  const renderDashboardByRole = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
      case 'SUPER_ADMIN':
      case 'LIBRARY_ADMIN':
      case 'LIBRARIAN':
        return <LibraryAdminDashboard />;
      case 'MEMBER':
      default:
        return <MemberDashboard onSelectBook={handleSelectBook} onNavigate={handleNavigate} />;
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView onNavigate={handleNavigate} onSelectBook={handleSelectBook} />;
      case 'about':
        return <AboutView onNavigate={handleNavigate} />;
      case 'history':
        return <HistoryView />;
      case 'founder':
        return <FounderView />;
      case 'donors':
        return <DonorsView />;
      case 'books':
        return <BooksView onSelectBook={handleSelectBook} onNavigate={handleNavigate} />;
      case 'digital-library':
        return <DigitalLibraryView />;
      case 'notices':
        return <NoticesView />;
      case 'events':
        return <EventsView />;
      case 'gallery':
        return <GalleryView />;
      case 'contact':
        return <ContactView />;
      case 'faq':
        return <FAQView />;
      case 'login':
        return <AuthModal initialMode="login" onNavigate={handleNavigate} />;
      case 'register':
        return <AuthModal initialMode="register" onNavigate={handleNavigate} />;
      case 'dashboard':
        return user ? renderDashboardByRole(user.role) : <AuthModal initialMode="login" onNavigate={handleNavigate} />;
      case 'super-admin':
      case 'admin':
        if (!user) return <AuthModal initialMode="login" onNavigate={handleNavigate} />;
        if (user.role === 'MEMBER') {
          return <AccessDeniedView onNavigate={handleNavigate} requiredRole="ADMIN" />;
        }
        return <LibraryAdminDashboard />;
      case 'member':
        if (!user) return <AuthModal initialMode="login" onNavigate={handleNavigate} />;
        return <MemberDashboard onSelectBook={handleSelectBook} onNavigate={handleNavigate} />;
      case 'access-denied':
        return <AccessDeniedView onNavigate={handleNavigate} />;
      default:
        return <HomeView onNavigate={handleNavigate} onSelectBook={handleSelectBook} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFEF2] dark:bg-[#1A1415] text-[#2D2424] dark:text-[#FDFBF7] flex flex-col font-sans transition-colors duration-200">
      
      {/* Top Navigation */}
      <Navbar currentView={currentView} onNavigate={handleNavigate} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {renderCurrentView()}
      </main>

      {/* Book Detail Modal */}
      {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}

      {/* Forced Password Change Modal for First-time Admin Login */}
      {user && user.mustChangePassword && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="bg-amber-500 text-slate-950 p-3 rounded-t-2xl font-bold text-xs flex items-center justify-between">
              <span>নিরাপত্তা সতর্কতা: প্রথমবার লগইনের পাসওয়ার্ড পরিবর্তন আবশ্যক</span>
            </div>
            <ChangePasswordModal onClose={() => {}} />
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
