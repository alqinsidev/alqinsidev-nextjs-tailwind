'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function Home() {
  const [imageReady, setImageReady] = useState(false)
  const heroImageVariants = {
    begin: {
      opacity: 0,
      x: -30,
    },
    end: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1.2,
      },
    },
  }
  const heroTitleVariants = {
    begin: {
      opacity: 0,
      x: 30,
    },
    end: {
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.5,
        duration: 1.2,
      },
    },
  }

  const heroSubTitleVariants = {
    begin: {
      opacity: 0,
    },
    end: {
      opacity: 1,
      transition: {
        delay: 1.2,
        duration: 1.5,
      },
    },
  }
  return (
    <div className='h-[100vh] w-full bg-gradient-to-b from-sky-200 to-sky-100 pt-20'>
      <div className='flex h-[80vh] w-full flex-col items-center justify-center lg:h-full lg:flex-row lg:justify-around'>
        <motion.div
          variants={heroImageVariants}
          initial='begin'
          animate='end'
          className='flex w-2/5 pb-10 lg:justify-end'
          onAnimationComplete={() => setImageReady(true)}
        >
          <Image
            className={
              imageReady
                ? `hover:opacity-50 hover:duration-200 hover:ease-linear`
                : ``
            }
            src={
              'https://alqinsidev.netlify.app/static/media/handsome-man.688f02a9.png'
            }
            height={420}
            width={420}
            alt='si ganteng ilang'
          />
        </motion.div>
        <div className='flex w-full flex-col items-center justify-center lg:ml-10 lg:w-2/5 lg:items-start lg:gap-20'>
          <motion.p
            initial='begin'
            animate='end'
            variants={heroTitleVariants}
            className='h-16 font-sans text-4xl font-bold text-gray-700 lg:h-24 lg:text-7xl'
          >
            Welcome to my page !
          </motion.p>
          <motion.p
            initial='begin'
            animate='end'
            variants={heroSubTitleVariants}
            className='text-md font-[400] text-gray-700 lg:text-lg'
          >
            Software Engineer, IT Enthussiast, etc
          </motion.p>
        </div>
      </div>
    </div>
  )
}
