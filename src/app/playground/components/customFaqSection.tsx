'use client';

import React, { useState, useEffect, useRef } from 'react';
import Modal from '@/components/modal';
import ChatBuble from './chatBuble';
import { FaArrowUp, FaTimes } from 'react-icons/fa';
import geminiClient from '@/services/gemini-client';

interface FaqItem {
  question: string;
  answer: string;
}

interface ChatMessage {
  text: string;
  isUser: boolean;
}

interface GeminiConfig {
  parts: { input: string; output: string }[];
  system_prompts: {
    faq_section: string;
  };
}

interface CustomFaqSectionProps {
  geminiConfig: GeminiConfig | null;
}

const CustomFaqSection: React.FC<CustomFaqSectionProps> = ({ geminiConfig }) => {
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const inputChatBoxRef = useRef<HTMLTextAreaElement>(null);

  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [faqError, setFaqError] = useState('');

  const [chatConversation, setChatConversation] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatAsking, setIsChatAsking] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [faqSystemPrompt, setFaqSystemPrompt] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedFaqs = sessionStorage.getItem('customFaqs');
      if (storedFaqs) {
        setFaqs(JSON.parse(storedFaqs));
      }

      const hasDismissedBanner = localStorage.getItem('hasDismissedFaqBanner');
      if (!hasDismissedBanner) {
        setShowBanner(true);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('customFaqs', JSON.stringify(faqs));
    }
  }, [faqs]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatConversation]);

  useEffect(() => {
    if (geminiConfig) {
      setFaqSystemPrompt(geminiConfig.system_prompts.faq_section);
    }
  }, [geminiConfig]);

  const handleAddFaq = () => {
    setFaqError('');
    if (faqs.length >= 3) {
      setFaqError('You can only add a maximum of 3 FAQ pairs.');
      return;
    }

    if (newQuestion.trim() && newAnswer.trim()) {
      setFaqs([...faqs, { question: newQuestion, answer: newAnswer }]);
      setNewQuestion('');
      setNewAnswer('');
      setIsModalOpen(false);
    }
  };

  const handleDeleteFaq = (index: number) => {
    const updatedFaqs = faqs.filter((_, i) => i !== index);
    setFaqs(updatedFaqs);
  };

  const handleChatInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setChatInput(e.target.value);
  };

  const handleChatKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isChatAsking) {
      e.preventDefault();
      handleChatSubmit();
    }
  };

  const handleChatSubmit = async () => {
    if (!chatInput.trim() || isChatAsking) return;

    const userQuestion = chatInput;
    setChatConversation((prev) => [...prev, { text: userQuestion, isUser: true }]);
    setChatInput('');
    setIsChatAsking(true);

    try {
      // Convert FAQs to ChatHistoryItem format
      const formattedFaqs = faqs.flatMap(faq => [
        { role: 'user' as const, parts: [{ text: faq.question }] },
        { role: 'model' as const, parts: [{ text: faq.answer }] },
      ]);

      // Convert current chatConversation to ChatHistoryItem format
      const currentChatHistory = chatConversation.map(msg => ({
        role: msg.isUser ? 'user' : 'model',
        parts: [{ text: msg.text }],
      })) as { role: 'user' | 'model'; parts: { text: string }[] }[];

      // Combine formatted FAQs and current chat history
      const fullChatHistory = [...formattedFaqs, ...currentChatHistory];

      const FAQ_BOT_SYSTEM_INSTRUCTION = faqSystemPrompt;

      const responseStream = await geminiClient.askGeminiStream(
        fullChatHistory,
        userQuestion,
        FAQ_BOT_SYSTEM_INSTRUCTION
      );
      
      let streamedAnswer = '';
      const reader = responseStream.getReader();
      const decoder = new TextDecoder();

      setChatConversation((prev) => [...prev, { text: '', isUser: false }]);

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                break;
              }
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  streamedAnswer += parsed.text;
                  setChatConversation((prev) => {
                    const lastMessage = prev[prev.length - 1];
                    if (!lastMessage.isUser) {
                      return [...prev.slice(0, -1), { text: streamedAnswer, isUser: false }];
                    }
                    return [...prev, { text: streamedAnswer, isUser: false }];
                  });
                }
              } catch (parseError) {
                // Ignore parse errors for incomplete JSON
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      setChatConversation((prev) => [...prev, { text: 'Something went wrong while fetching the answer.', isUser: false }]);
      console.error(error);
    } finally {
      setIsChatAsking(false);
    }
  };

  const handleDismissBanner = () => {
    setShowBanner(false);
    localStorage.setItem('hasDismissedFaqBanner', 'true');
  };

  return (
    <section id="faq-section" className="py-12 bg-gradient-to-b from-white to-sky-100 sm:py-16 lg:py-20 w-full">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 flex flex-col-reverse lg:flex-row gap-8">
        {/* FAQ Chatbot Section (Main Content) */}
        <div className="w-full lg:w-3/4 flex flex-col h-[80vh] border-2 border-gray-300 rounded-3xl bg-white shadow-md">
          {showBanner && (
            <div className="bg-sky-100 border-b border-sky-200 text-sky-800 px-4 py-3 rounded-t-3xl flex items-center justify-between text-sm">
              <p className="font-medium">
                👋 Welcome! Add custom FAQs to train your AI assistant.
              </p>
              <button
                onClick={handleDismissBanner}
                className="text-sky-600 hover:text-sky-800 focus:outline-none"
                aria-label="Dismiss onboarding banner"
              >
                <FaTimes className="h-4 w-4" />
              </button>
            </div>
          )}
          <div className="flex h-12 w-full flex-col items-center justify-center border-b-2 border-gray-300 bg-white pt-1 rounded-t-3xl">
            <h1 className="font-bold text-gray-700">Your Personalized AI Assistant</h1>
          </div>
          <div ref={chatBoxRef} className="flex h-full w-full flex-col items-center justify-start overflow-y-auto overflow-x-hidden px-3 py-3 bg-white">
            {chatConversation.length === 0 ? (
              <p className="text-center text-gray-500 mt-4">Try me by add new pairs of FAQ!</p>
            ) : (
              chatConversation.map((msg, idx) => (
                <ChatBuble key={idx} chat={msg.text} isLoading={isChatAsking && !msg.isUser && idx === chatConversation.length - 1} isUser={msg.isUser} />
              ))
            )}
          </div>
          <div className="mb-1 flex h-20 w-full items-center justify-center hover:cursor-text" onClick={() => inputChatBoxRef.current?.focus()}>
            <form
              className="h-15 mx-2 flex w-full items-center justify-between gap-5 rounded-3xl border border-gray-700 bg-white px-3 py-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleChatSubmit();
              }}
            >
              <textarea
                ref={inputChatBoxRef}
                className="h-full w-full resize-none text-sm focus:outline-none"
                placeholder={isChatAsking ? "Looking for the answer" : "Ask about your custom FAQs..."}
                onChange={handleChatInputChange}
                onKeyPress={handleChatKeyPress}
                value={chatInput}
                rows={1}
              />
              <button
                className="rounded-full bg-sky-400 p-3 text-white hover:bg-sky-500 active:bg-gray-300 disabled:bg-gray-300"
                type="submit"
                disabled={isChatAsking || chatInput.length === 0}
              >
                <FaArrowUp className="text-white" />
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Management Sidebar */}
        <div className="w-full lg:w-1/4 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Manage FAQs</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-sky-500 text-white py-2 px-4 rounded-lg hover:bg-sky-600 transition-colors duration-200 font-medium"
            >
              Add New FAQ
            </button>
            {faqError && (
              <p className="text-red-500 text-sm mt-2">{faqError}</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Current FAQs ({faqs.length}/3)</h3>
            {faqs.length === 0 ? (
              <p className="text-gray-500 text-sm">No FAQs added yet. Click "Add New FAQ" to get started!</p>
            ) : (
              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-800 text-sm">Q: {faq.question}</h4>
                      <button
                        onClick={() => handleDeleteFaq(index)}
                        className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0"
                        aria-label="Delete FAQ"
                      >
                        <FaTimes className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="text-gray-600 text-xs">A: {faq.answer.substring(0, 100)}{faq.answer.length > 100 ? '...' : ''}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for adding new FAQ */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Add New FAQ</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
                Question
              </label>
              <textarea
                id="question"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                rows={2}
                placeholder="Enter your question here..."
              />
            </div>
            <div>
              <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-1">
                Answer
              </label>
              <textarea
                id="answer"
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                rows={4}
                placeholder="Enter the answer here..."
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleAddFaq}
              disabled={!newQuestion.trim() || !newAnswer.trim()}
              className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Add FAQ
            </button>
          </div>
        </div>
      </Modal>
    </section>
  );
};

export default CustomFaqSection;
