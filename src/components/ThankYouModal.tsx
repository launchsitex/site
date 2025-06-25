import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface ThankYouModalProps {
  show: boolean;
  onClose: () => void;
}

const ThankYouModal: React.FC<ThankYouModalProps> = ({ show, onClose }) => {
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [show]);
  
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="relative bg-secondary-light rounded-xl p-8 max-w-md w-full animate-fade-in">
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors"
          aria-label="סגור"
        >
          <X size={24} />
        </button>
        
        <div className="flex flex-col items-center text-center">
          <div className="bg-primary/20 p-4 rounded-full mb-6">
            <CheckCircle size={48} className="text-primary" />
          </div>
          
          <h3 className="text-2xl font-bold mb-4">הפרטים נשלחו בהצלחה ✅</h3>
          <p className="text-gray-300 mb-6">נחזור אליך בהקדם האפשרי!</p>
          
          <button
            onClick={onClose}
            className="bg-primary hover:bg-primary-dark text-secondary font-bold py-3 px-8 rounded-md transition-all duration-300"
          >
            סגור
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThankYouModal;