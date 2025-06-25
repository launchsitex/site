import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import ContactForm from './components/ContactForm';
import ThankYouModal from './components/ThankYouModal';
import WhatsAppButton from './components/WhatsAppButton';
import Footer from './components/Footer';
import ScrollAnimation from './components/ScrollAnimation';
import Testimonials from './components/Testimonials';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import DealsManagement from './components/DealsManagement';
import AccessibilityStatement from './components/AccessibilityStatement';
import { useAuth } from './hooks/useAuth';
import { pageVisitsAPI } from './lib/api';
import { testConnection } from './lib/database';

function MainContent() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const contactRef = useRef<HTMLDivElement>(null);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);
  
  return (
    <div className="min-h-screen bg-secondary text-white overflow-x-hidden">
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen} 
        toggleMobileMenu={toggleMobileMenu} 
      />
      
      <main className="pt-16"> {/* Added padding-top to account for fixed header */}
        <Hero scrollToContact={scrollToContact} />
        
        <ScrollAnimation>
          <About />
        </ScrollAnimation>
        
        <ScrollAnimation>
          <Services />
        </ScrollAnimation>
        
        <ScrollAnimation>
          <Portfolio />
        </ScrollAnimation>
        
        <ScrollAnimation>
          <Testimonials />
        </ScrollAnimation>
        
        <ScrollAnimation>
          <Pricing />
        </ScrollAnimation>
        
        <ScrollAnimation>
          <FAQ />
        </ScrollAnimation>
        
        <div ref={contactRef}>
          <ScrollAnimation>
            <ContactForm setShowThankYou={setShowThankYou} />
          </ScrollAnimation>
        </div>
        
        <Footer />
      </main>
      
      <WhatsAppButton />
      
      <ThankYouModal 
        show={showThankYou} 
        onClose={() => setShowThankYou(false)} 
      />
    </div>
  );
}

function App() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Test database connection on app start
    testConnection();

    // Track page visit
    const trackVisit = async () => {
      try {
        const referrer = document.referrer;
        let source = 'Direct';

        if (referrer) {
          const url = new URL(referrer);
          if (url.hostname.includes('google')) {
            source = 'Google';
          } else if (url.hostname.includes('facebook')) {
            source = 'Facebook';
          } else if (url.hostname.includes('instagram')) {
            source = 'Instagram';
          } else {
            source = url.hostname;
          }
        }

        await pageVisitsAPI.track({
          page_id: window.location.pathname || '/',
          source,
          user_agent: navigator.userAgent,
        });
      } catch (error) {
        console.error('Error tracking visit:', error);
      }
    };

    trackVisit();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/accessibility" element={<AccessibilityStatement />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin" 
          element={
            isAuthenticated ? <AdminPanel /> : <Navigate to="/admin/login" />
          } 
        />
        <Route 
          path="/admin/deals" 
          element={
            isAuthenticated ? <DealsManagement /> : <Navigate to="/admin/login" />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;