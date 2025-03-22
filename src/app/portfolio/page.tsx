/* eslint-disable react/no-unescaped-entities */
"use client";
import { Project } from '@/domain/response'
import React, { useState, useEffect } from 'react'
import ProjectCard from './components/projectCard'
import Image from 'next/image';
import {motion} from 'framer-motion'

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

  useEffect(() => {
    getData()
  }, [])


  async function getData() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_REALTIME_DB_URL}/portfolio.json`)
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
            width={480}
            height={420}
            alt='img'
          />
        </motion.div>
        <motion.div variants={rightVariants} initial="start" animate="end" className='h-1/2 md:h-full w-screen md:w-2/3 flex flex-col justify-start md:justify-center items-center py-10 md:pr-10 lg:mb-32'>
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
    </div>
  )
}

export default PortfolioPage
