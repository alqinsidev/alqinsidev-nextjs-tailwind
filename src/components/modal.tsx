'use client';

import React, { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  onSubmit?: () => void; // Added onSubmit prop
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title, onSubmit }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        const target = event.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          if (onSubmit) {
            onSubmit();
          } else {
            onClose();
          }
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div ref={modalRef} className="bg-white rounded-3xl shadow-xl p-6 w-11/12 md:w-1/2 lg:w-1/3 max-h-[90vh] overflow-y-auto relative border-2 border-gray-300"> {/* Changed rounded-lg to rounded-3xl, added border */}
        <div className="flex justify-between items-center border-b border-gray-300 pb-3 mb-4"> {/* Added border-gray-300 */}
          <h2 className="text-xl font-semibold text-gray-700">{title || 'Modal'}</h2> {/* Added text-gray-700 */}
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl leading-none">
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
