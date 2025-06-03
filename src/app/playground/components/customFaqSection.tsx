'use client';

import React, { useState, useEffect, useRef } from 'react';
import Modal from '@/components/modal'; // Import the new Modal component
import ChatBuble from './chatBuble'; // Reusing ChatBuble
import { FaArrowUp, FaTimes } from 'react-icons/fa'; // Reusing icon
import geminiService from '@/services/gemini'; // Reusing gemini service

interface FaqItem {
  question: string;
  answer: string;
}

interface ChatMessage {
  text: string;
  isUser: boolean;
}

const CustomFaqSection: React.FC = () => {
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const inputChatBoxRef = useRef<HTMLTextAreaElement>(null);

  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [faqError, setFaqError] = useState(''); // New state for FAQ limit error

  const [chatConversation, setChatConversation] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatAsking, setIsChatAsking] = useState(false);
  const [showBanner, setShowBanner] = useState(false); // New state for contextual banner

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedFaqs = sessionStorage.getItem('customFaqs');
      if (storedFaqs) {
        setFaqs(JSON.parse(storedFaqs));
      }

      // Check if the banner has been dismissed
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

  const handleAddFaq = () => {
    setFaqError(''); // Clear previous errors
    if (faqs.length >= 3) {
      setFaqError('You can only add a maximum of 3 FAQ pairs.');
      return;
    }

    if (newQuestion.trim() && newAnswer.trim()) {
      setFaqs([...faqs, { question: newQuestion, answer: newAnswer }]);
      setNewQuestion('');
      setNewAnswer('');
      setIsModalOpen(false); // Close modal after adding
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


      // Combine formatted FAQs, and current chat history
      const fullChatHistory = [...formattedFaqs, ...currentChatHistory];

      // Define a system instruction for the FAQ bot
      const FAQ_BOT_SYSTEM_INSTRUCTION = `You has a job to ONLY answer user question based on the data. **DON'T EVER TO ANSWER EXCEPT FROM THE DATA PROVIDED AND ANSWER POLITELLY**`;

      const answerStream = (await geminiService.askGeminiStream(
        fullChatHistory,
        userQuestion, // The actual user question
        FAQ_BOT_SYSTEM_INSTRUCTION
      )).stream;
      let streamedAnswer = '';

      setChatConversation((prev) => [...prev, { text: '', isUser: false }]); // Placeholder for streamed answer

      for await (const chunk of answerStream) {
        const message = chunk.candidates?.[0].content.parts[0].text;
        if (message) {
          streamedAnswer += message;
          setChatConversation((prev) => {
            const lastMessage = prev[prev.length - 1];
            if (!lastMessage.isUser) {
              return [...prev.slice(0, -1), { text: streamedAnswer, isUser: false }];
            }
            return [...prev, { text: streamedAnswer, isUser: false }];
          });
        }
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
              className="h-15 mx-2 flex w-full items-center justify-between gap-5 rounded-3xl border border-gray-300 bg-white px-3 py-2 shadow-md"
              onSubmit={(e) => { e.preventDefault(); handleChatSubmit(); }}
            >
              <textarea
                ref={inputChatBoxRef}
                className="h-full w-full resize-none text-sm focus:outline-none text-gray-700"
                placeholder={isChatAsking ? "Thinking..." : "Ask a question about your FAQs..."}
                name="chatInput"
                onChange={handleChatInputChange}
                onKeyPress={handleChatKeyPress}
                value={chatInput}
                rows={1}
              />
              <button
                className="rounded-full bg-sky-400 p-3 text-white hover:bg-sky-500 active:bg-blue-800 disabled:bg-gray-300 shadow-md"
                type="submit"
                disabled={isChatAsking || chatInput.length === 0}
              >
                <FaArrowUp className="text-white" />
              </button>
            </form>
          </div>
        </div>

        {/* FAQ List and Add Button (Sidebar) */}
        <div className="w-full lg:w-1/4 flex flex-col">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h2 className="text-2xl font-bold leading-tight text-gray-700 sm:text-3xl">
              Empower Your AI: Build Your Custom FAQ Knowledge Base
            </h2>
            <p className="max-w-xl mx-auto mt-4 text-base leading-7 text-gray-600">
              Create a personalized knowledge base for your AI. Add questions and answers that your bot can learn from and respond to instantly.
            </p>
            <div className="relative inline-block group">
              <button
                onClick={() => setIsModalOpen(true)}
                className={`mt-6 px-6 py-3 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg transition-shadow duration-200 ${faqs.length >= 3 ? 'bg-gray-400 cursor-not-allowed' : 'bg-sky-400 hover:bg-sky-500'}`}
                disabled={faqs.length >= 3}
              >
                Add New FAQ
              </button>
              {faqs.length >= 3 && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-max px-3 py-2 text-sm font-medium text-white bg-gray-700 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  Maximum 3 FAQ pairs reached. Delete existing FAQs to add more.
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-gray-700"></div>
                </div>
              )}
            </div>
          </div>

          <div className="max-w-3xl mx-auto space-y-2 overflow-y-auto lg:h-80"> 
            {(
              faqs.map((faq, index) => (
                <div key={index} className="p-4 bg-white border-2 border-gray-300 rounded-xl shadow-sm even:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-md font-semibold text-gray-700">{faq.question}</h3>
                    <button
                      className='ml-2'
                      onClick={() => handleDeleteFaq(index)}
                    >
                      <FaTimes className="text-gray-400 hover:text-red-400" />
                    </button>
                  </div>
                  <p className="mt-1 text-sm text-gray-700">{faq.answer}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal for adding new FAQ */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New FAQ" onSubmit={handleAddFaq}>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter your question"
            value={newQuestion}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewQuestion(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && newQuestion.trim() && newAnswer.trim()) {
                handleAddFaq();
              }
            }}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 shadow-sm"
          />
          <input
            type="text"
            placeholder="Enter your answer"
            value={newAnswer}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewAnswer(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && newQuestion.trim() && newAnswer.trim()) {
                handleAddFaq();
              }
            }}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 shadow-sm"
          />
          {faqError && <p className="text-red-500 text-sm">{faqError}</p>} {/* Display error message */}
          <button onClick={handleAddFaq} className="w-full px-4 py-2 text-white bg-sky-400 rounded-md hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg transition-shadow duration-200">
            Add FAQ
          </button>
        </div>
      </Modal>
    </section>
  );
};

export default CustomFaqSection;
