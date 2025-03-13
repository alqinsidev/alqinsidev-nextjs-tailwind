'use client'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import ChatBuble from './components/chatBuble'
import { FaArrowUp } from 'react-icons/fa'
import geminiService from '@/services/gemini'
import { motion } from 'framer-motion'

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

const PlaygroundPage = () => {
  const chatBox = useRef<HTMLDivElement>(null)
  const inputChatBox = useRef<HTMLTextAreaElement>(null)
  const [isAsking, setIsAsking] = useState<boolean>(false)
  const [formData, setFormData] = useState<QuestionForm>({ question: '' })
  const [conversation, setConversation] = useState([
    'Ask something about Padlan',
  ])
  const [parts, setParts] = useState<string[]>([])

  useEffect(() => {
    if (chatBox.current) {
      chatBox.current.scrollTop = chatBox.current?.scrollHeight
    }
  }, [conversation])

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
    e.preventDefault();
    setIsAsking(true);
  
    const userQuestion = formData.question;
    setConversation((prev) => [...prev, userQuestion]); // Append user question first
    setFormData({ question: '' });
  
    try {
      const answerStream = (await handleAskGemini(userQuestion, parts));
      let streamedAnswer = '';
  
      // Append an empty message for the answer
      setConversation((prev) => [...prev, '']);
  
      for await (const chunk of answerStream) {
        const message = chunk.candidates?.[0].content.parts[0].text;
        if (message) {
          streamedAnswer += message;
          setConversation((prev) => [...prev.slice(0, -1), streamedAnswer]);
        }
      }
  
      setParts((prev) => [...prev, userQuestion, streamedAnswer]);
    } catch (error) {
      setConversation((prev) => [...prev, 'Something went wrong']);
      console.error(error);
    } finally {
      setIsAsking(false);
    }
  };
  

  const handleAskGemini = async (question: string, parts: string[]) => {
    try {
      return (await geminiService.askGeminiStream(question, parts)).stream
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return (
    <div className='flex min-h-screen w-full flex-col lg:flex-row-reverse items-center justify-center bg-sky-50 pt-20'>
      <motion.div variants={rightVariants} initial="start" animate="end" className='lg:h-[80vh] flex flex-col w-full lg:w-1/3 lg:justify-start justify-center items-center'>
        <div className='my-5 flex w-full flex-row items-center justify-center gap-5 px-4'>
          <Image
            className=''
            width={120}
            height={120}
            src={
              'https://firebasestorage.googleapis.com/v0/b/alqinsidev-project.appspot.com/o/alqinsidev-web%2Fassets%2Fstatic%2Fchat.svg?alt=media&token=d91c1962-8be3-4879-9783-7939177a4ae4'
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
        <div ref={chatBox} className='flex h-full w-full flex-col items-center justify-start overflow-y-auto overflow-x-hidden px-3 py-3 odd:justify-end'>
          {conversation.map((chat: string, idx: number) => (
            <ChatBuble key={idx} chat={chat} index={idx} isLoading={false} />
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
  )
}

export default PlaygroundPage
