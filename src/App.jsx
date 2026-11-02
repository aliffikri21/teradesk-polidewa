import React, { useState } from 'react';
import Hero from './components/Hero';
import Features from './components/Features';
import AboutUs from './components/AboutUs';
import Footer from './components/Footer';
import ContactModal from './components/ContactModal';
import FeaturesPortal from './components/FeaturesPortal';
import ServiceDispatcher from './components/services/ServiceDispatcher';

function App() {
  const [currentView, setCurrentView] = useState({ page: 'landing', serviceId: null });
  const [isContactOpen, setIsContactOpen] = useState(false);

  const handleNavigate = (page, serviceId = null) => {
    setCurrentView({ page, serviceId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          <Footer onNavigateToPortal={() => handleNavigate('portal')} />
        </>
      ) : currentView.page === 'service' ? (
        /* Halaman Layanan Spesifik (PAR, Arsip, Aset, Kas, dsb.) */
        <>
          <ServiceDispatcher
            serviceId={currentView.serviceId}
            onBackToPortal={() => handleNavigate('portal')}
            onBackToLanding={() => handleNavigate('landing')}
            onSelectService={(serviceId) => handleNavigate('service', serviceId)}
          />
          <Footer onNavigateToPortal={() => handleNavigate('portal')} />
        </>
      ) : (
        /* Halaman Khusus Portal Fitur & Katalog Aplikasi Organisasi */
        <>
          <FeaturesPortal
            onBackToLanding={() => handleNavigate('landing')}
            onOpenContact={() => setIsContactOpen(true)}
            onSelectService={(serviceId) => handleNavigate('service', serviceId)}
          />
          <Footer onNavigateToPortal={() => handleNavigate('portal')} />
        </>
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
