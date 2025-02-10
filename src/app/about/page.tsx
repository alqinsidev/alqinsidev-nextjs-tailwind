/* eslint-disable react/no-unescaped-entities */
"use client";
import Image from 'next/image'
import React from 'react'
import { motion } from 'framer-motion'

const AboutPage = () => {
  return (
    <div className='min-h-screen w-full bg-yellow-50 pt-20 flex justify-center items-center'>
      <motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0,transition:{duration:1}}} className='flex flex-col md:flex-row-reverse justify-center items-center py-10 lg:w-3/4'>
        <Image
          src={"https://firebasestorage.googleapis.com/v0/b/alqinsidev-project.appspot.com/o/alqinsidev-web%2Fassets%2Fstatic%2Fhandsome-man.png?alt=media&token=30415da5-aee7-4653-94b5-8e215bc7a4ff"}
          width={420}
          height={700}
          alt='handsome-man'
          className='w-auto h-[50vh] mb-5 md:mb-0'
        />
        <div className='flex flex-col text-center md:text-justify px-10 gap-3'>
          <p className='font-sans font-bold text-3xl text-gray-700 md:text-5xl'>PADLAN ALQINSI</p>
          <p className='font-extralight text-xl'>Software Engineer, IT Enthusiast, etc.</p>
          <p className='font-extralight text-xs'>A short story about me</p>
          <p className='font-extralight text-sm textgr700'>I was graduated as an Electrical Engineer and start my professional journey as an Internet of Things Developer.</p>
          <p className='font-extralight text-sm textgr700'>In my early carrer, I was focusing to made an end-to-end solution for IoT system, Developing a whole system from the device it self until the end users application.</p>
          <p className='font-extralight text-sm textgr700'>Building an end-to-end solution it's mean not only I have to push my self to do Back-end and Front-end development. But also I must developing the whole system from writing a code for the app until the system running well and deployed.</p>
          <p className='font-extralight text-sm textgr700'>I have experiencing various programming language. For Desktop Apps & IOT Device like C, C++, or C#. Data processing and Machine Learning with Python, Modern Application using PHP, Javascript, and now GO. </p>
        </div>
      </motion.div>
    </div>
  )
}

export default AboutPage
