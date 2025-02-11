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
              'https://firebasestorage.googleapis.com/v0/b/alqinsidev-project.appspot.com/o/alqinsidev-web%2Fassets%2Fstatic%2Fhandsome-man.png?alt=media&token=30415da5-aee7-4653-94b5-8e215bc7a4ff'
            }
            height={420}
            width={420}
            alt='si ganteng ilang'
          />
        </motion.div>
        <div className='flex w-full flex-col items-center justify-center lg:ml-10 lg:w-3/5 lg:items-start '>
          <motion.h1
            initial='begin'
            animate='end'
            variants={heroTitleVariants}
            className='h-16 font-sans text-4xl font-bold text-gray-700 lg:h-24 lg:text-7xl'
          >
            Halo, Saya Padlan !
          </motion.h1>
          <motion.h2
            initial='begin'
            animate='end'
            variants={heroSubTitleVariants}
            className='text-md text-center font-[400] text-gray-700 lg:text-lg'
          >
            Crafting Code & Solving Problems – Welcome to My Tech Journey!
          </motion.h2>
        </div>
      </div>
    </div>
  )
}
