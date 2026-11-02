import React, { useState } from 'react';
import Hero from './components/Hero';
import Features from './components/Features';
import AboutUs from './components/AboutUs';
import Footer from './components/Footer';
import ContactModal from './components/ContactModal';
import FeaturesPortal from './components/FeaturesPortal';

function App() {
  const [currentPage, setCurrentPage] = useState('landing'); // 'landing' | 'portal'
  const [isContactOpen, setIsContactOpen] = useState(false);

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#060D25] text-white font-sans selection:bg-amber-400 selection:text-slate-950 flex flex-col">
      {currentPage === 'landing' ? (
        <>
          {/* Hero Section with Embedded Nav & Sliced Widgets */}
          <Hero
            onOpenContact={() => setIsContactOpen(true)}
            onNavigateToPortal={() => handleNavigate('portal')}
          />

          {/* Fitur Unggulan Section (8 Cards Grid on Light Background) */}
          <Features onNavigateToPortal={() => handleNavigate('portal')} />

          {/* Tentang Kami Section (Text & 3 Photos Gallery) */}
          <AboutUs />

          {/* Footer Section (Brand, Newsletter, Socials, Phone, Copyright) */}
          <Footer onNavigateToPortal={() => handleNavigate('portal')} />
        </>
      ) : (
        /* Halaman Khusus Portal Fitur & Aplikasi Organisasi */
        <>
          <FeaturesPortal
            onBackToLanding={() => handleNavigate('landing')}
            onOpenContact={() => setIsContactOpen(true)}
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
