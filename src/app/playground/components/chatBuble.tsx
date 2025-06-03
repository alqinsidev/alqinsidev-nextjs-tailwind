'use client'

import React from 'react'
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from 'framer-motion'
import remarkBreaks from 'remark-breaks';

interface ChatBubleProps {
  chat: string;
  isLoading: boolean;
  isUser?: boolean; // Add isUser prop
}

const ChatBuble: React.FC<ChatBubleProps> = ({ chat, isLoading, isUser = false }) => {
  const isBot = !isUser; // Determine if it's a bot message

  const chatBubbleVariants = {
    init: {
      opacity: 0,
    },
    steady: {
      opacity: 1,
    },
    steadyBot: { // Renamed from steadyGemini
      opacity: 1,
      transition: {
        delay: .3,
      },
    },
  }
  return (
    <motion.div
      variants={chatBubbleVariants}
      initial='init'
      animate={isBot ? 'steadyBot' : 'steady'} // Use isBot
      className={`m-3 flex w-full items-start gap-3 font-mono ${isUser ? 'justify-end' : 'justify-start'}`} // Adjust justify based on isUser
    >
      {isBot && ( // Show AI avatar for bot messages
        <div className='flex h-[36px] w-[36px] items-center justify-center rounded-full bg-gradient-to-br from-sky-300 to-sky-200 p-4'>
          <p className='font-bold text-white'>AI</p>
        </div>
      )}
      <div
        className={`p-3 ${isBot ? 'rounded-r-lg bg-white' : 'rounded-l-lg bg-gradient-to-b from-sky-100 to-sky-50 text-gray-700 '}`} // Adjust styling based on isBot
      >
        {isLoading ? (
          <p className=' text-sm text-gray-400'>
            please wait
            {'..........'.split('').map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.4 }}
              >
                {char}
              </motion.span>
            ))}
          </p>
        ) : (
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}
            components={{ 
              p: ({ ...props }) => <p className="text-sm text-gray-700 leading-relaxed pb-5" {...props} />,
              a: ({ ...props }) => <a className="text-sm text-blue-400 leading-relaxed" {...props} />,
              li: ({ ...props }) => <li className="text-sm text-gray-700 leading-relaxed" {...props} />,
              ul: ({ ...props }) => <ul className="text-sm text-gray-700 leading-relaxed pb-5" {...props} />,
            }}>
            {chat}
          </ReactMarkdown>
        )}
      </div>
    </motion.div>
  )
}

export default ChatBuble
