import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary-light py-6 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400">
              © {currentYear} LaunchSite. כל הזכויות שמורות.
            </p>
          </div>
          
          <div className="flex items-center">
            <p className="text-gray-400 flex items-center">
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;