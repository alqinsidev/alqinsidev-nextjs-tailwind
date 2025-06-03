'use client'
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ChatBuble from './chatBuble';
import { FaArrowUp } from 'react-icons/fa';
import Image from 'next/image';
import geminiService from '@/services/gemini';
import { sendGTMEvent } from '@next/third-parties/google'


interface QuestionForm {
  question: string
}

const rightVariants = {
  start: {
    opacity: 0,
    x: 20,
  },
  end: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 1.2
    }
  }
}
const leftVariants = {
  start: {
    opacity: 0,
    x: -20
  },
  end: {
    opacity: 1,
    x: 0,
    transition: {
      duration: .7,
    }
  }
}

const PersonalBotSection: React.FC = () => {
  const chatBox = useRef<HTMLDivElement>(null)
  const inputChatBox = useRef<HTMLTextAreaElement>(null)
  const [isAsking, setIsAsking] = useState<boolean>(false)
  const [formData, setFormData] = useState<QuestionForm>({ question: '' })
  interface PersonalBotChatMessage {
    text: string;
    isUser: boolean;
  }

  const [conversation, setConversation] = useState<PersonalBotChatMessage[]>([
    { text: 'Ask something about Padlan', isUser: false },
  ]);
  const [parts, setParts] = useState<string[]>([]); // This will store raw strings for now, to be converted to ChatHistoryItem
  const [preloadedHistory, setPreloadedHistory] = useState<{ role: 'user' | 'model'; parts: { text: string }[] }[]>([]);

  const PERSONAL_BOT_SYSTEM_INSTRUCTION = "You are padlan personal assistant that can speak english or bahasa indonesia based on user input. Give your answer using markdown format. Answer user question based on the data, Always give a suggestion by giving 1 or 2 follow up question on the end of your answer to living the conversation. Also use emoticon to give a humble persona";

  useEffect(() => {
    if (chatBox.current) {
      chatBox.current.scrollTop = chatBox.current?.scrollHeight;
    }
  }, [conversation]);

  useEffect(() => {
    const fetchPreloadedConfig = async () => {
      try {
        const config = await geminiService.getConfig();
        const formattedPreloadedParts = config.parts.flatMap(({ input, output }) => [
          { role: 'user' as const, parts: [{ text: input }] },
          { role: 'model' as const, parts: [{ text: output }] },
        ]);
        setPreloadedHistory(formattedPreloadedParts);
      } catch (error) {
        console.error("Failed to fetch preloaded Gemini config:", error);
      }
    };
    fetchPreloadedConfig();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isAsking) {

      e.preventDefault();

      handleSubmit(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    let eventSuccess = true;
    e.preventDefault();
    setIsAsking(true);
  
    const userQuestion = formData.question;
    setConversation((prev) => [...prev, { text: userQuestion, isUser: true }]); // Append user question first
    setFormData({ question: '' });
  
    // Convert current conversation parts to ChatHistoryItem format for Gemini
    const currentChatHistoryForGemini = parts.map((text, idx) => ({
      role: idx % 2 === 0 ? 'user' : 'model', // Assuming even indices are user, odd are model
      parts: [{ text: text }],
    })) as { role: 'user' | 'model'; parts: { text: string }[] }[];

    // Combine preloaded history with current chat history
    const fullChatHistory = [...preloadedHistory, ...currentChatHistoryForGemini];
  
    try {
      const answerStream = (await geminiService.askGeminiStream(
        fullChatHistory,
        userQuestion,
        PERSONAL_BOT_SYSTEM_INSTRUCTION
      )).stream;
      let streamedAnswer = '';
  
      // Append an empty message for the answer
      setConversation((prev) => [...prev, { text: '', isUser: false }]);
  
      for await (const chunk of answerStream) {
        const message = chunk.candidates?.[0].content.parts[0].text;
        if (message) {
          streamedAnswer += message;
          setConversation((prev) => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage && !lastMessage.isUser) { // Ensure it's the bot's last message
              return [...prev.slice(0, -1), { text: streamedAnswer, isUser: false }];
            }
            // This case should ideally not be hit if the placeholder is always added first
            return [...prev, { text: streamedAnswer, isUser: false }];
          });
        }
      }
  
      // Update parts and chatHistory for next turn
      setParts((prev) => [...prev, userQuestion, streamedAnswer]);
    } catch (error) {
      eventSuccess = false;
      setConversation((prev) => [...prev, { text: 'Something went wrong', isUser: false }]); // Ensure it's a ChatMessage object
      console.error(error);
    } finally {
      sendGTMEvent({
        event: "btn_playground_ask_ai_clicked",
        value: eventSuccess
      });
      setIsAsking(false);
    }
  };

  return (
    <div className='flex min-h-screen w-full flex-col lg:flex-row-reverse items-center justify-center bg-sky-50'>
      <motion.div variants={rightVariants} initial="start" animate="end" className='lg:h-[80vh] flex flex-col w-full lg:w-1/3 lg:justify-start justify-center items-center'>
        <div className='my-5 flex w-full flex-row items-center justify-center gap-5 px-4'>
          <Image
            className=''
            width={120}
            height={120}
            src={
              'https://firebasestorage.googleapis.com/v0/b/alqinsidev-project.appspot.com/o/static-assets%2Fplayground-assets.svg?alt=media&token=624cf2a4-f4b8-48a7-901f-df8310beb98a'
            }
            alt='image cannot be loaded'
          />
          <div className='flex flex-col justify-center items-center text-center border-2 border-gray-700 p-2 rounded-3xl rounded-bl-none bg-sky-100'>
            <p className='font-extrabold text-lg text-gray-700'>Get my virtual assistance at the ease of your hand</p>
            <p className='font-extralight text-xs'>AI Chatbot Powered by Gemini AI </p>
          </div>
        </div>
        <div className='text-center lg:ml-10 p-5 m-3 bg-green-50 border-2 border-gray-700 rounded-lg'>
          <p className='font-lg font-sans text-gray-700'>Leveraging the power of <span className='font-bold'>Gemini Pro</span>, you can ask my virtual chatbot assistant for digging some information of me!</p>
        </div>
        <div className='text-center lg:ml-10 p-5 m-3 bg-sky-100 border-2 border-gray-700 rounded-lg'>
          <p className='font-lg font-sans text-gray-700'>Another related project to Gemini AI, you can access it on my <span className='font-extrabold hover:text-sky-700'><a href="https://github.com/alqinsidev/go-gemini-sandbox" target="_blank">repo</a></span></p>
        </div>
      </motion.div>
      <motion.div variants={leftVariants} initial="start" animate="end" className='mb-4 flex h-[90vh] w-[95%] flex-col items-center justify-between rounded-3xl border-2 border-gray-500 bg-gray-100 md:w-2/3 lg:w-[30vw] lg:h-[80vh]'>
        <div className='flex h-12 w-full flex-col items-center justify-center rounded-t-3xl border-b-2 bg-white pt-1'>
          <h1 className='font-bold'>Padlan Personal Bot</h1>
          <span className='font-extralight text-xs text-gray-300'>v.0.9.0</span>
        </div>
        <div ref={chatBox} className='flex h-full w-full flex-col items-center justify-start overflow-y-auto overflow-x-hidden px-3 py-3'>
          {conversation.map((msg, idx) => (
            <ChatBuble key={idx} chat={msg.text} isLoading={isAsking && !msg.isUser && idx === conversation.length - 1} isUser={msg.isUser} />
          ))}
        </div>
        <div className='mb-1 flex h-20 w-full items-center justify-center hover:cursor-text' onClick={() => inputChatBox.current?.focus()}>
          <form
            className='h-15 mx-2 flex w-full items-center justify-between gap-5 rounded-3xl border border-gray-700 bg-white px-3 py-2'
            onSubmit={handleSubmit}
          >
            <textarea
              ref={inputChatBox}
              className='h-full w-full resize-none text-sm focus:outline-none'
              placeholder={isAsking ? "Looking for the answer" : "Who is Padlan?"}
              name='question'
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              value={formData.question}
              rows={1}
            />
            <button
              className='rounded-full bg-sky-400 p-3 text-white hover:bg-sky-500 active:bg-gray-300 disabled:bg-gray-300'
              type='submit'
              disabled={isAsking || formData.question.length === 0}
            >
              <FaArrowUp className='text-white' />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default PersonalBotSection;
