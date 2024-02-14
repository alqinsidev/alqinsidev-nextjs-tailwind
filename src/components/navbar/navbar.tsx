'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import NavLink from './navLink'
import { motion } from 'framer-motion'

export interface UrlLink {
  url: string
  label: string
}

const url = [
  { url: '/', label: 'Home' },
  { url: '/about', label: 'About' },
  { url: '/portfolio', label: 'Portfolio' },
  { url: '/playground', label: 'Playground' },
]
const Navbar = () => {
  const [open, setOpen] = useState(false)
  const [logoHovered, setLogoHovered] = useState(false)
  
  const containerVariants = {
    start: {
      opacity:0,
      y:-5
    },
    end: {
      opacity:1,
      y:0,
      transition:{
        duration:.5
      }
    }
  }

  const topVariants = {
    closed: {
      rotate: 0,
    },
    opened: {
      rotate: 45,
      backgroundColor: 'rgb(255,255,255)',
    },
  }
  const centerVariants = {
    closed: {
      opacity: 1,
    },
    opened: {
      opacity: 0,
    },
  }

  const bottomVariants = {
    closed: {
      rotate: 0,
    },
    opened: {
      rotate: -45,
      backgroundColor: 'rgb(255,255,255)',
    },
  }

  const listVariants = {
    initial: {
      x: '-100vw',
      opacity: 0,
    },
    closed: {
      x: '-100vw',
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
    opened: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.275,
        when: 'beforeChildren',
        staggerChildren: 0.05,
      },
    },
  }

  const listItemVariants = {
    closed: {
      x: -10,
      opacity: 0,
    },
    opened: {
      x: 0,
      opacity: 1,
    },
  }

  const logoDark = `text-white bg-gray-700`
  const logoLight = `text-sky-400 bg-white`
  const logoActive = `text-white bg-sky-500`

  return (
    <motion.div variants={containerVariants} initial="start" animate="end" className='flex h-full items-center justify-between bg-sky-300 px-4 text-lg md:px-10 lg:bg-transparent'>
      <div
        className='flex w-1/4 items-center font-semibold'
      >
        <Link href='/'
          onMouseEnter={() => setLogoHovered(true)}
          onMouseLeave={() => setLogoHovered(false)}
        >
          <span
            className={`${logoHovered ? logoActive : logoDark} rounded-md rounded-r-none p-1 px-2`}
          >
            alqinsi
          </span>
          <span
            className={`${logoHovered ? logoActive : logoLight} rounded-md rounded-l-none p-1`}
          >
            dev
          </span>
        </Link>
      </div>
      <div className='hidden w-2/4 items-center justify-end gap-10 font-bold uppercase lg:flex'>
        {url.map((link: UrlLink) => (
          <NavLink key={link.url} link={link} />
        ))}
      </div>
      <div className='lg:hidden'>
        <button
          className='relative z-50 flex h-8 w-10 flex-col justify-between'
          onClick={() => setOpen(!open)}
        >
          <motion.div
            variants={topVariants}
            animate={open ? 'opened' : 'closed'}
            className='h-1 w-10 origin-left rounded bg-white'
          ></motion.div>
          <motion.div
            variants={centerVariants}
            animate={open ? 'opened' : 'closed'}
            className='h-1 w-10 rounded bg-white'
          ></motion.div>
          <motion.div
            variants={bottomVariants}
            initial='closed'
            animate={open ? 'opened' : 'closed'}
            className='h-1 w-10 origin-left rounded bg-white'
          ></motion.div>
        </button>
        {
          <motion.div
            variants={listVariants}
            initial='initial'
            animate={open ? `opened` : 'closed'}
            className={`absolute left-0 top-0 z-40 flex h-screen w-screen flex-col items-center justify-center gap-8 bg-sky-300 text-4xl text-white`}
          >
            {url.map((link: UrlLink) => (
              <motion.div
                variants={listItemVariants}
                className=''
                key={link.label}
                onClick={() => setOpen(false)}
              >
                <Link href={link.url}>{link.label}</Link>
              </motion.div>
            ))}
          </motion.div>
        }
      </div>
    </motion.div>
  )
}

export default Navbar
