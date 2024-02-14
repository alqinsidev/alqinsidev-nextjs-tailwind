'use-client'

import React from 'react'
import {
  FaEnvelopeSquare,
  FaGithubSquare,
  FaInstagramSquare,
  FaLinkedin,
  FaTwitterSquare,
} from 'react-icons/fa'

const Footer = () => {
  return (
    <div className='flex h-full w-full flex-col items-center justify-center gap-5 bg-gray-800'>
      <div className='font-mono text-white'>Visit me on</div>
      <div className='flex items-center justify-between gap-4'>
        <a
          className='text-[32px] text-white hover:text-blue-500'
          href='https://linkedin.com/in/alqinsi'
          target='_blank'
        >
          <FaLinkedin />
        </a>
        <a
          className='text-[32px] text-white hover:text-gray-300'
          href='https://github.com/alqinsidev'
          target='_blank'
        >
          <FaGithubSquare />
        </a>
        <a
          className='text-[32px] text-white hover:text-pink-500'
          href='https://instagram.com/alqinsi'
          target='_blank'
        >
          <FaInstagramSquare />
        </a>
        <a
          className='text-[32px] text-white hover:text-sky-500'
          href='https://x.com/padlanalqinsi'
          target='_blank'
        >
          <FaTwitterSquare />
        </a>
        <a
          className='text-[32px] text-white hover:text-red-500'
          href='mailto:padlanalqinsi@gmail.com'
        >
          <FaEnvelopeSquare />
        </a>
      </div>
    </div>
  )
}

export default Footer
