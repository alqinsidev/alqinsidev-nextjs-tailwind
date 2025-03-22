'use client'

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaChevronDown, FaRobot } from 'react-icons/fa';
import ChatBot from '@/components/chatbot/chatbot';

const FloatingChatButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showOnboard, setShowOnboard] = useState(false);

  useEffect(() => {
    const hasSeenOnboard = localStorage.getItem('hasSeenOnboard');
    if (!hasSeenOnboard) {
        setTimeout(()=> setShowOnboard(true), 2000)

      localStorage.setItem('hasSeenOnboard', 'true');
      setTimeout(() => setShowOnboard(false), 7000); // Auto close after 3s
    }
  }, []);

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-sky-400 hover:bg-sky-500 text-white p-4 rounded-full shadow-lg transition duration-300"
        >
          {isOpen ? <FaChevronDown size={24} /> : <FaRobot size={24} />}
        </button>
      </div>

      {/* Onboarding Message */}
      <AnimatePresence>
        {showOnboard && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="fixed bottom-20 right-6 bg-white shadow-lg p-4 rounded-lg w-64 z-50"
          >
            <p className="text-sm text-gray-700">👋 Welcome! Click the chat button to start a conversation.</p>
            <button
              className="mt-2 text-blue-500 text-sm underline"
              onClick={() => setShowOnboard(false)}
            >
              Got it!
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ChatBot Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="fixed bottom-24 right-5 z-50"
          >
            <ChatBot />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChatButton;
