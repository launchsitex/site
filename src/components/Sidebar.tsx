import React, { useState, useEffect } from 'react';
import { Home, User, Mail, Settings, Phone, FileText, Send, Menu, X, HelpCircle, CreditCard, Layout, MessageSquare, Accessibility, Facebook, Instagram, MessageCircle, Rocket } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface SidebarProps {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileMenuOpen, toggleMobileMenu }) => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const socialLinks = [
    { 
      icon: <Facebook size={20} />, 
      href: 'https://facebook.com/',
      label: 'Facebook'
    },
    { 
      icon: <Instagram size={20} />, 
      href: 'https://www.instagram.com/launchsitex',
      label: 'Instagram'
    },
    { 
      icon: <MessageCircle size={20} />, 
      href: 'https://wa.me/972000000000',
      label: 'WhatsApp'
    }
  ];
  
  const navItems = [
    { icon: <Home size={20} />, label: 'בית', href: '/#home' },
    { icon: <User size={20} />, label: 'אודות', href: '/#about' },
    { icon: <FileText size={20} />, label: 'שירותים', href: '/#services' },
    { icon: <Layout size={20} />, label: 'דוגמאות', href: '/#portfolio' },
    { icon: <MessageSquare size={20} />, label: 'המלצות', href: '/#testimonials' },
    { icon: <CreditCard size={20} />, label: 'מסלולים', href: '/#pricing' },
    { icon: <HelpCircle size={20} />, label: 'שאלות נפוצות', href: '/#faq' },
    { icon: <Mail size={20} />, label: 'צור קשר', href: '/#contact' },
    { icon: <Accessibility size={20} />, label: 'הצהרת נגישות', href: '/accessibility' },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <header 
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-secondary shadow-lg' : 'bg-transparent'
        }`}
      >
        <nav className="container mx-auto px-4">
          <div className="hidden lg:flex items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 text-primary">
              <div className="bg-primary/20 p-2 rounded-lg">
                <Rocket size={24} />
              </div>
              <span className="font-bold text-xl">LaunchSite</span>
            </div>

            {/* Navigation Items (Centered) */}
            <div className="flex-1 flex items-center justify-center gap-2">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    (location.pathname === '/' && item.href.includes('#') && location.hash === item.href.split('#')[1]) ||
                    (location.pathname === item.href)
                      ? 'text-primary bg-primary/10'
                      : 'text-white hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                </a>
              ))}
            </div>

            {/* Social Media Icons (Left) */}
            <div className="flex items-center gap-4 mr-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-primary transition-colors"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Button */}
      <button 
        className="fixed top-4 right-4 z-50 bg-secondary p-2 rounded-lg shadow-lg text-primary lg:hidden"
        onClick={toggleMobileMenu}
        aria-label="תפריט"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 bg-secondary/95 backdrop-blur-sm z-40 transform transition-transform duration-300 lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="h-full flex flex-col items-center justify-between p-4">
          {/* Navigation Items */}
          <div className="flex-1 flex items-center">
            <div className="space-y-4">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className={`flex items-center gap-3 px-6 py-3 rounded-lg transition-colors ${
                    (location.pathname === '/' && item.href.includes('#') && location.hash === item.href.split('#')[1]) ||
                    (location.pathname === item.href)
                      ? 'text-primary bg-primary/10'
                      : 'text-white hover:bg-white/5'
                  }`}
                  onClick={toggleMobileMenu}
                >
                  {item.icon}
                  <span className="text-lg font-medium">{item.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Social Media Icons at Bottom */}
          <div className="flex justify-center gap-6 py-6 border-t border-gray-800 w-full">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-primary transition-colors"
                aria-label={link.label}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;