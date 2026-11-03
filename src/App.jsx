import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import Features from './components/Features';
import AboutUs from './components/AboutUs';
import Footer from './components/Footer';
import ContactModal from './components/ContactModal';
import LoginPage from './components/LoginPage';
import AdminDashboardPage from './components/admin/AdminDashboardPage';
import FeaturesPortal from './components/FeaturesPortal';
import ServiceDispatcher from './components/services/ServiceDispatcher';
import { initialDefaultAccounts } from './data/defaultAccounts';

function App() {
  const [pendingTarget, setPendingTarget] = useState(() => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname === '/admin') {
        return { page: 'admin', serviceId: null };
      }
      if (window.location.pathname.startsWith('/service/')) {
        const sid = window.location.pathname.replace('/service/', '').trim();
        return { page: 'service', serviceId: sid };
      }
    }
    return null;
  });

  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname === '/admin') {
        // Tamu yang mengakses /admin langsung diarahkan ke form login terlebih dahulu
        return { page: 'login', serviceId: null };
      }
      if (window.location.pathname === '/login') {
        return { page: 'login', serviceId: null };
      }
      if (window.location.pathname.startsWith('/service/')) {
        // Tamu yang mengakses /service/:id langsung diarahkan ke form login terlebih dahulu
        return { page: 'login', serviceId: null };
      }
    }
    return { page: 'landing', serviceId: null };
  });

  const [authUser, setAuthUser] = useState(null); // null = Guest, object = Authenticated pengurus
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Registered accounts state dengan pembersihan data lama agar hanya akun Alif Fikri yang aktif
  const [registeredAccounts, setRegisteredAccounts] = useState(() => {
    try {
      localStorage.removeItem('teradesk_dev_accounts');
      localStorage.removeItem('teradesk_dev_accounts_v2');
      const saved = localStorage.getItem('teradesk_dev_accounts_v3');
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
      localStorage.setItem('teradesk_dev_accounts_v3', JSON.stringify(registeredAccounts));
    } catch {
      // ignore
    }
  }, [registeredAccounts]);

  // Synchronize browser history and popstate (back/forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname === '/admin') {
        setCurrentView({ page: 'admin', serviceId: null });
      } else if (window.location.pathname === '/login') {
        setCurrentView({ page: 'login', serviceId: null });
      } else {
        setCurrentView((prev) => (prev.page === 'admin' || prev.page === 'login' ? { page: 'landing', serviceId: null } : prev));
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
      if (!authUser) {
        setPendingTarget({ page: 'admin', serviceId: null });
        if (pushHistory && window.location.pathname !== '/login') {
          window.history.pushState(null, '', '/login');
        }
        setCurrentView({ page: 'login', serviceId: null });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      setCurrentView({ page: 'admin', serviceId: null });
      if (pushHistory && window.location.pathname !== '/admin') {
        window.history.pushState(null, '', '/admin');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (page === 'login') {
      setCurrentView({ page: 'login', serviceId });
      if (pushHistory && window.location.pathname !== '/login') {
        window.history.pushState(null, '', '/login');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // If guest attempts to open workspace (portal or service page)
    if (!authUser) {
      setPendingTarget({ page, serviceId });
      if (pushHistory && window.location.pathname !== '/login') {
        window.history.pushState(null, '', '/login');
      }
      setCurrentView({ page: 'login', serviceId });
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
    const target = pendingTarget || { page: 'portal', serviceId: null };
    setCurrentView(target);
    setPendingTarget(null);
    const targetPath = target.page === 'admin' ? '/admin' : '/';
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
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

  const handleUpdateAccount = (originalNim, updatedAccount) => {
    setRegisteredAccounts((prev) =>
      prev.map((acc) => (acc.nim === originalNim ? { ...acc, ...updatedAccount } : acc))
    );
    if (authUser && authUser.nim === originalNim) {
      setAuthUser((prev) => ({ ...prev, ...updatedAccount }));
    }
  };

  const handleDeleteAccount = (nim) => {
    setRegisteredAccounts((prev) => prev.filter((acc) => acc.nim !== nim));
  };

  const handleResetAccounts = () => {
    if (window.confirm('Kembalikan seluruh daftar akun ke akun bawaan sistem?')) {
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
    if (pendingTarget.page === 'admin') {
      return 'Admin & Developer Dashboard';
    }
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
    <div className={`min-h-screen font-sans flex flex-col ${
      currentView.page === 'landing'
        ? 'bg-[#060D25] text-white landing-page-root'
        : 'bg-[#F8FAFC] text-slate-800 selection:bg-blue-600 selection:text-white'
    }`}>
      {currentView.page === 'landing' ? (
        <div className="landing-page-root w-full flex flex-col">
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
        </div>
      ) : currentView.page === 'login' ? (
        /* Halaman Baru: Dedicated Login Page (Trendy Clean White Palette) */
        <LoginPage
          onBackToLanding={() => handleNavigate('landing')}
          onSuccess={handleLoginSuccess}
          targetServiceTitle={getTargetTitle()}
          accounts={registeredAccounts}
          onOpenDevDashboard={() => handleNavigate('admin')}
        />
      ) : currentView.page === 'admin' ? (
        /* Halaman Baru: Admin & Developer Dashboard Dedicated Page */
        <AdminDashboardPage
          onBackToLanding={() => handleNavigate('landing')}
          onNavigateToPortal={() => handleNavigate('portal')}
          onNavigateToService={(serviceId) => handleNavigate('service', serviceId)}
          accounts={registeredAccounts}
          onAddAccount={handleAddAccount}
          onUpdateAccount={handleUpdateAccount}
          onUpdatePassword={handleUpdatePassword}
          onDeleteAccount={handleDeleteAccount}
          onResetAccounts={handleResetAccounts}
          onImpersonate={handleImpersonate}
          onForceDestroySession={handleLogout}
          authUser={authUser}
        />
      ) : currentView.page === 'service' ? (
        /* Halaman Layanan Spesifik (PAR, Arsip, Aset, Kas, dsb.) */
        <ServiceDispatcher
          serviceId={currentView.serviceId}
          onBackToPortal={() => handleNavigate('portal')}
          onBackToLanding={() => handleNavigate('landing')}
          onSelectService={(serviceId) => handleNavigate('service', serviceId)}
          authUser={authUser}
          onLogout={handleLogout}
        />
      ) : (
        /* Halaman Khusus Portal Fitur & Katalog Aplikasi Organisasi */
        <FeaturesPortal
          onBackToLanding={() => handleNavigate('landing')}
          onOpenContact={() => setIsContactOpen(true)}
          onSelectService={(serviceId) => handleNavigate('service', serviceId)}
          authUser={authUser}
          onLogout={handleLogout}
        />
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
