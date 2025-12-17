/* eslint-disable react/no-unescaped-entities */
"use client";
import { Project } from '@/domain/response'
import React, { useState, useEffect } from 'react'
import ProjectCard from './components/projectCard'
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion'
import { FaFileAlt } from 'react-icons/fa'

const rightVariants = {
  start: {
    opacity: 0,
    x: 20,
  },
  end: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 2
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
      duration: 2,
    }
  }
}

const PortfolioPage = () => {
  const [portfolios, setPortfolios] = useState<Project[]>([])
  const [showTooltip, setShowTooltip] = useState(true)

  useEffect(() => {
    getData()
    const timer = setTimeout(() => {
      setShowTooltip(false)
    }, 5000)
    return () => clearTimeout(timer)
  }, [])


  async function getData() {
    const res = await fetch('/api/portfolio')
    if (!res.ok) {
      throw new Error('Failed to fetch data')
    }
    const data = await res.json()
    setPortfolios(data)
  }

  return (
    <div className='w-full flex flex-col justify-center items-center'>
      <div className='h-full min-h-screen w-screen flex flex-col md:flex-row justify-center items-center md:px-36 bg-gradient-to-b from-sky-100 to-white pt-20'>
        <motion.div variants={leftVariants} initial="start" animate="end" className='h-1/2 md:h-full md:w-1/2 relative flex justify-center py-12'>
          <Image
            src={'https://firebasestorage.googleapis.com/v0/b/alqinsidev-project.appspot.com/o/static-assets%2Fportfolio-banner.svg?alt=media&token=bff577d2-19af-4870-8c60-7fee72b731d6'}
            width={600}
            height={500}
            alt='Portfolio banner illustration'
            priority
            className='w-full h-auto max-w-[600px] max-h-[500px] object-contain drop-shadow-lg'
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
          />
        </motion.div>
        <motion.div variants={rightVariants} initial="start" animate="end" className='h-1/2 md:h-full w-screen md:w-2/3 flex flex-col justify-start md:justify-center items-center lg:items-start py-10 md:pr-10 lg:mb-32'>
          <h1 className='text-center lg:text-justify px-5 md:px-0 font-sans font-extrabold text-gray-700 text-3xl w-full'>MY PORTFOLIO</h1>
          <p className='text-center lg:text-justify lg:text-lg px-5 md:px-0 py-3 w-full'>Welcome to my portfolio section, as a software engineer let me introduce you some valuable work's of mine</p>
          <p className='text-center lg:text-justify lg:text-lg px-5 md:px-0 w-full'>Keep visit this page, I'm constantly expanding my portfolio with new and exciting projects, so be sure to check back and explore the full range of my capabilities.</p>
        </motion.div>
      </div>
      <div className='w-full md:px-[5vw] flex flex-col md:gap-10 py-10 bg-gradient-to-b from-white to-sky-100'>
        {
          portfolios.map((project: Project) => <ProjectCard project={project} key={project.name} />)
        }
      </div>

      {/* Floating Resume Button */}
      <div className="fixed bottom-10 right-10 z-50 flex items-center">
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="mr-4 bg-sky-600 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg relative whitespace-nowrap hidden md:block" // Hidden on small screens to avoid clutter? Or show? User didn't specify. I'll make it responsive if needed, but for now block.
            >
              <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-sky-600 rotate-45"></div>
              Check my printed portfolio here!
            </motion.div>
          )}
        </AnimatePresence>

        <a
          href="https://drive.google.com/file/d/1uHXgrtIN1T8qM_rhtzLQOjm2Slz_2x4_/view?usp=drive_link"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="w-14 h-14 bg-sky-600 text-white rounded-full flex justify-center items-center shadow-lg hover:bg-sky-700 hover:scale-110 transition-all duration-300"
        >
          <FaFileAlt size={24} />
        </a>
      </div>
    </div>
  )
}


export default PortfolioPage
