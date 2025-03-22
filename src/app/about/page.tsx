/* eslint-disable react/no-unescaped-entities */
"use client";
import Image from 'next/image'
import React from 'react'
import { motion } from 'framer-motion'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Me',
  description: 'Learn more about Padlan Alqinsi, his background, skills, and experience as a software engineer.',
};

const AboutPage = () => {
  return (
    <div className='min-h-screen w-full bg-yellow-50 pt-20 flex justify-center items-center'>
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0, transition: { duration: 1 } }} className='flex flex-col md:flex-row-reverse justify-center items-center py-10 lg:w-3/4'>
        <Image
          src={"https://firebasestorage.googleapis.com/v0/b/alqinsidev-project.appspot.com/o/alqinsidev-web%2Fassets%2Fstatic%2Fhandsome-man.png?alt=media&token=30415da5-aee7-4653-94b5-8e215bc7a4ff"}
          width={420}
          height={700}
          alt='handsome-man'
          className='w-auto h-[50vh] mb-5 md:mb-0'
        />
        <div className='flex flex-col text-center md:text-justify px-10 gap-3'>
          <h1 className='font-sans font-bold text-3xl text-gray-700 md:text-5xl'>PADLAN ALQINSI</h1>
          <h2 className='font-extralight text-xl'>Software Engineer, IT Enthusiast, etc.</h2>
          {/* <p className='font-extralight text-xs'>A short story about me</p> */}
          <p className='font-extralight text-sm textgr700'>
            I graduated as an Electrical Engineer and transitioned into software development, where I now focus on building scalable and efficient systems.
          </p>
          <p className='font-extralight text-sm textgr700'>
            Throughout my career, I have worked with various programming languages, each tailored to different aspects of software development. I use C, C++, and C# for systems programming and performance-critical applications. For data processing, automation, and machine learning, I leverage Python to extract insights and optimize workflows.
          </p>
          <p className='font-extralight text-sm textgr700'>
            On the web and backend side, I have experience with PHP and JavaScript for dynamic applications, while Go has become my go-to language for building high-performance, scalable services.
          </p>
          <p className='font-extralight text-sm textgr700'>
            Currently, I am exploring AI and automation, focusing on how these technologies can optimize development workflows and enhance system efficiency. I am particularly interested in leveraging AI for predictive analytics, automated decision-making, and streamlining software development processes. By integrating AI-driven automation, I aim to build smarter, more adaptive applications.
          </p>
        </div>

      </motion.div>
    </div>
  )
}

export default AboutPage
