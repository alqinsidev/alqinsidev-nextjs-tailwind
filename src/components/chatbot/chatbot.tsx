'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaArrowUp } from 'react-icons/fa';
import ChatBuble from './components/chatBuble';
import geminiService from '@/services/gemini';
import { sendGTMEvent } from '@next/third-parties/google';

interface QuestionForm {
  question: string;
}

const leftVariants = {
  start: { opacity: 0, x: -20 },
  end: { opacity: 1, x: 0, transition: { duration: 0.7 } },
};

const ChatBot: React.FC = () => {
  const chatBox = useRef<HTMLDivElement>(null);
  const inputChatBox = useRef<HTMLTextAreaElement>(null);
  const [isAsking, setIsAsking] = useState(false);
  const [formData, setFormData] = useState<QuestionForm>({ question: '' });
  const [conversation, setConversation] = useState<string[]>(['Ask something about Padlan']);
  const [parts, setParts] = useState<string[]>([]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatBox.current) {
      chatBox.current.scrollTo({ top: chatBox.current.scrollHeight, behavior: 'smooth' });
    }
  }, [conversation]);

  // Handle input change
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ question: e.target.value });
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent | React.KeyboardEvent) => {
      e.preventDefault();
      if (isAsking || !formData.question.trim()) return;

      setIsAsking(true);
      let eventSuccess = true;

      const userQuestion = formData.question.trim();
      setConversation((prev) => [...prev, userQuestion]);
      setFormData({ question: '' });

      try {
        const answerStream = await geminiService.askGeminiStream(userQuestion, parts);
        let streamedAnswer = '';

        // Add a placeholder for the AI response
        setConversation((prev) => [...prev, '...']);

        for await (const chunk of answerStream.stream) {
          const message = chunk.candidates?.[0]?.content?.parts?.[0]?.text;
          if (message) {
            streamedAnswer += message;
            setConversation((prev) => [...prev.slice(0, -1), streamedAnswer]); // Update last message
          }
        }
        setParts((prev) => [...prev, userQuestion, streamedAnswer]);
      } catch (error) {
        console.error(error);
        eventSuccess = false;
        setConversation((prev) => [...prev.slice(0, -1), 'Something went wrong']);
      } finally {
        sendGTMEvent({ event: 'btn_playground_ask_ai_clicked', value: eventSuccess });
        setIsAsking(false);
      }
    },
    [isAsking, formData.question, parts]
  );

  return (
    <motion.div
      variants={leftVariants}
      initial="start"
      animate="end"
      className="flex h-[80vh] w-full flex-col items-center justify-between rounded-2xl border-2 border-gray-500 bg-gray-100 md:w-1/2 lg:w-[25vw] lg:h-[60vh] shadow-xl"
    >
      <div className="flex h-10 w-full flex-col items-center justify-center rounded-t-2xl border-b-2 bg-white pt-1">
        <h1 className="font-bold text-sm">Padlan Personal Bot</h1>
        <span className="font-extralight text-xs text-gray-300">v.0.9.0</span>
      </div>

      {/* Chat Messages */}
      <div ref={chatBox} className="flex h-full w-full flex-col items-center justify-start overflow-y-auto px-3 py-2">
        {conversation.map((chat, idx) => (
          <ChatBuble key={idx} chat={chat} index={idx} isLoading={false} />
        ))}
      </div>

      {/* Chat Input */}
      <div className="mb-1 flex h-16 w-full items-center justify-center hover:cursor-text" onClick={() => inputChatBox.current?.focus()}>
        <form className="h-14 flex w-full items-center gap-3 bg-white px-3 py-1 rounded-b-2xl" onSubmit={handleSubmit}>
          <textarea
            ref={inputChatBox}
            className="h-full w-full resize-none text-xs focus:outline-none"
            placeholder={isAsking ? 'Looking for the answer...' : 'Who is Padlan?'}
            name="question"
            onChange={handleChange}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit(e)}
            value={formData.question}
            rows={1}
            disabled={isAsking}
          />
          <button
            className="rounded-full bg-sky-400 p-2 text-white hover:bg-sky-500 active:bg-gray-300 disabled:bg-gray-300"
            type="submit"
            disabled={isAsking || formData.question.length === 0}
          >
            <FaArrowUp className="text-white text-sm" />
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default ChatBot;
