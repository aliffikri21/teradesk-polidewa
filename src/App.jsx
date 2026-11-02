import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import Features from './components/Features';
import AboutUs from './components/AboutUs';
import Footer from './components/Footer';
import ContactModal from './components/ContactModal';
import LoginModal from './components/LoginModal';
import AdminDashboardPage from './components/admin/AdminDashboardPage';
import FeaturesPortal from './components/FeaturesPortal';
import ServiceDispatcher from './components/services/ServiceDispatcher';
import { initialDefaultAccounts } from './data/defaultAccounts';

function App() {
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined' && window.location.pathname === '/admin') {
      return { page: 'admin', serviceId: null };
    }
    return { page: 'landing', serviceId: null };
  });
  const [authUser, setAuthUser] = useState(null); // null = Guest, object = Authenticated pengurus
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [pendingTarget, setPendingTarget] = useState(null);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Registered accounts state with local storage fallback
  const [registeredAccounts, setRegisteredAccounts] = useState(() => {
    try {
      const saved = localStorage.getItem('teradesk_dev_accounts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return initialDefaultAccounts;
  });

  // Persist registered accounts changes
  useEffect(() => {
    try {
      localStorage.setItem('teradesk_dev_accounts', JSON.stringify(registeredAccounts));
    } catch {
      // ignore
    }
  }, [registeredAccounts]);

  // Synchronize browser history and popstate (back/forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname === '/admin') {
        setCurrentView({ page: 'admin', serviceId: null });
      } else {
        setCurrentView((prev) => (prev.page === 'admin' ? { page: 'landing', serviceId: null } : prev));
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Global keyboard shortcut (Ctrl + Shift + D) to toggle Admin Dashboard page
  useEffect(() => {
    const handleGlobalKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setCurrentView((prev) => {
          if (prev.page === 'admin') {
            if (window.location.pathname !== '/') window.history.pushState(null, '', '/');
            return { page: 'landing', serviceId: null };
          } else {
            if (window.location.pathname !== '/admin') window.history.pushState(null, '', '/admin');
            return { page: 'admin', serviceId: null };
          }
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  // Guarantee that on page refresh (initial mount), session is completely destroyed
  useEffect(() => {
    sessionStorage.clear();
  }, []);

  const handleNavigate = (page, serviceId = null, pushHistory = true) => {
    if (page === 'landing') {
      setCurrentView({ page: 'landing', serviceId: null });
      if (pushHistory && window.location.pathname !== '/') {
        window.history.pushState(null, '', '/');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (page === 'admin') {
      setCurrentView({ page: 'admin', serviceId: null });
      if (pushHistory && window.location.pathname !== '/admin') {
        window.history.pushState(null, '', '/admin');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // If guest attempts to open workspace (portal or service page)
    if (!authUser) {
      setPendingTarget({ page, serviceId });
      setIsLoginOpen(true);
      return;
    }

    // If already authenticated
    setCurrentView({ page, serviceId });
    if (pushHistory && window.location.pathname !== '/') {
      window.history.pushState(null, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (userProfile) => {
    setAuthUser(userProfile);
    setIsLoginOpen(false);
    const target = pendingTarget || { page: 'portal', serviceId: null };
    setCurrentView(target);
    setPendingTarget(null);
    if (window.location.pathname !== '/') {
      window.history.pushState(null, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setAuthUser(null);
    sessionStorage.clear();
    setCurrentView({ page: 'landing', serviceId: null });
    if (window.location.pathname !== '/') {
      window.history.pushState(null, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Developer Dashboard account actions
  const handleAddAccount = (newAccount) => {
    setRegisteredAccounts((prev) => [newAccount, ...prev]);
  };

  const handleUpdatePassword = (nim, newPassword) => {
    setRegisteredAccounts((prev) =>
      prev.map((acc) => (acc.nim === nim ? { ...acc, password: newPassword } : acc))
    );
  };

  const handleDeleteAccount = (nim) => {
    setRegisteredAccounts((prev) => prev.filter((acc) => acc.nim !== nim));
  };

  const handleResetAccounts = () => {
    if (window.confirm('Kembalikan seluruh daftar akun ke 5 akun demo bawaan sistem?')) {
      setRegisteredAccounts(initialDefaultAccounts);
    }
  };

  const handleImpersonate = (account) => {
    setAuthUser(account);
    setCurrentView({ page: 'portal', serviceId: null });
    if (window.location.pathname !== '/') {
      window.history.pushState(null, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getTargetTitle = () => {
    if (!pendingTarget) return null;
    if (pendingTarget.serviceId) {
      const titles = {
        par: 'PAR (Program Approval Request)',
        archive: 'Digitalisasi Arsip & Persuratan',
        asset: 'Digitalisasi Aset & Inventaris',
        finance: 'Kas & Reimbursement Anggaran',
        attendance: 'Presensi Digital & QR Code Acara',
        timeline: 'Master Timeline & Kalender Kerja',
        hr: 'Database Anggota & Tata Kelola SDM',
        helpdesk: 'Helpdesk Internal & Request Desain',
      };
      return titles[pendingTarget.serviceId] || 'Layanan Workspace TeraDesk';
    }
    return 'Workspace Hub Organisasi';
  };

  return (
    <div className="min-h-screen bg-[#060D25] text-white font-sans selection:bg-amber-400 selection:text-slate-950 flex flex-col">
      {currentView.page === 'landing' ? (
        <>
          {/* Hero Section with Embedded Nav & Sliced Widgets */}
          <Hero
            onOpenContact={() => setIsContactOpen(true)}
            onNavigateToPortal={(serviceId) =>
              handleNavigate(serviceId ? 'service' : 'portal', serviceId)
            }
          />

          {/* Fitur Unggulan Section (8 Cards Grid on Light Background) */}
          <Features
            onNavigateToPortal={(serviceId) =>
              handleNavigate(serviceId ? 'service' : 'portal', serviceId)
            }
          />

          {/* Tentang Kami Section (Text & 3 Photos Gallery) */}
          <AboutUs />

          {/* Footer Section (Brand, Newsletter, Socials, Phone, Copyright) */}
          <Footer
            onNavigateToPortal={() => handleNavigate('portal')}
            onOpenDevDashboard={() => handleNavigate('admin')}
          />
        </>
      ) : currentView.page === 'admin' ? (
        /* Halaman Baru: Admin & Developer Dashboard Dedicated Page */
        <>
          <AdminDashboardPage
            onBackToLanding={() => handleNavigate('landing')}
            onNavigateToPortal={() => handleNavigate('portal')}
            onNavigateToService={(serviceId) => handleNavigate('service', serviceId)}
            accounts={registeredAccounts}
            onAddAccount={handleAddAccount}
            onUpdatePassword={handleUpdatePassword}
            onDeleteAccount={handleDeleteAccount}
            onResetAccounts={handleResetAccounts}
            onImpersonate={handleImpersonate}
            onForceDestroySession={handleLogout}
            authUser={authUser}
          />
          <Footer
            onNavigateToPortal={() => handleNavigate('portal')}
            onOpenDevDashboard={() => handleNavigate('admin')}
          />
        </>
      ) : currentView.page === 'service' ? (
        /* Halaman Layanan Spesifik (PAR, Arsip, Aset, Kas, dsb.) */
        <>
          <ServiceDispatcher
            serviceId={currentView.serviceId}
            onBackToPortal={() => handleNavigate('portal')}
            onBackToLanding={() => handleNavigate('landing')}
            onSelectService={(serviceId) => handleNavigate('service', serviceId)}
            authUser={authUser}
            onLogout={handleLogout}
          />
          <Footer
            onNavigateToPortal={() => handleNavigate('portal')}
            onOpenDevDashboard={() => handleNavigate('admin')}
          />
        </>
      ) : (
        /* Halaman Khusus Portal Fitur & Katalog Aplikasi Organisasi */
        <>
          <FeaturesPortal
            onBackToLanding={() => handleNavigate('landing')}
            onOpenContact={() => setIsContactOpen(true)}
            onSelectService={(serviceId) => handleNavigate('service', serviceId)}
            authUser={authUser}
            onLogout={handleLogout}
          />
          <Footer
            onNavigateToPortal={() => handleNavigate('portal')}
            onOpenDevDashboard={() => handleNavigate('admin')}
          />
        </>
      )}

      {/* Login Modal for Guests Accessing Workspace */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => {
          setIsLoginOpen(false);
          setPendingTarget(null);
        }}
        onSuccess={handleLoginSuccess}
        targetServiceTitle={getTargetTitle()}
        accounts={registeredAccounts}
        onOpenDevDashboard={() => handleNavigate('admin')}
      />

      {/* Floating Developer Console Quick Button (Visible when not on admin page) */}
      {currentView.page !== 'admin' && (
        <button
          onClick={() => handleNavigate('admin')}
          className="fixed bottom-5 right-5 z-40 bg-[#0b1330]/90 hover:bg-[#121c45] text-amber-400 hover:text-amber-300 border border-amber-400/40 hover:border-amber-400 px-3.5 py-2.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-2 text-xs font-mono font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer group min-h-[44px]"
          title="Buka Halaman Admin Dashboard (Shortcut: Ctrl + Shift + D)"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse group-hover:bg-amber-300"></span>
          <span>⚡ Admin Dashboard</span>
          <span className="hidden sm:inline text-[10px] text-gray-400 font-normal">
            ({registeredAccounts.length} Akun)
          </span>
        </button>
      )}

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
}

export default App;
