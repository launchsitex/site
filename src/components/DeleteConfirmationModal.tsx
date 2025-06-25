import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmationModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ show, onClose, onConfirm }) => {
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
          <div className="bg-red-500/20 p-4 rounded-full mb-6">
            <AlertTriangle size={48} className="text-red-500" />
          </div>
          
          <h3 className="text-2xl font-bold mb-4">האם אתה בטוח?</h3>
          <p className="text-gray-300 mb-6">האם אתה בטוח שברצונך למחוק פנייה זו?</p>
          
          <div className="flex gap-4">
            <button
              onClick={onConfirm}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-md transition-all duration-300"
            >
              כן, מחק
            </button>
            <button
              onClick={onClose}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-md transition-all duration-300"
            >
              ביטול
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;