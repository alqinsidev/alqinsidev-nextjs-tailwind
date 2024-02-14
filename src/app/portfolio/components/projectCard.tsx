"use client";
import Carousel from '@/components/carousel/carousel'
import { Asset, Project } from '@/domain/response'
import {motion} from 'framer-motion'
import React, { FC } from 'react'

interface ProjectCardProps {
    project: Project
}

interface BadgeProps {
    tag: string
}
const Badge: FC<BadgeProps> = ({ tag }) => {
    return (
        <div className='p-1 px-3 bg-gray-400 hover:bg-gray-500 text-white rounded-full hover:cursor-pointer'>
            <p>#{tag}</p>
        </div>
    )
}

const fadeIn = {
    initial: {
      opacity: 0,
      x:40
    },
    ready: {
      opacity:1,
      x:0,
      transition: {
        duration: 1.5
      }
    }
  }

const ProjectCard: FC<ProjectCardProps> = ({ project }) => {
    const projectAssetsUrls = project.assets.map((a: Asset) => a.uri)
    return (
        <motion.div variants={fadeIn} initial="initial" whileInView={"ready"} viewport={{once:true}} className='bg-white even:bg-gray-100 w-full min-h-[480px] md:border-4 border-gray-300 md:rounded-3xl flex flex-col md:flex-row justify-between md:justify-around items-center p-10 md:p-5 gap-5 md:gap-0'>
            <div className='min-h-[480px] w-full md:w-1/3 flex flex-col justify-start md:justify-center items-center gap-5'>
                <p className='font-bold font-sans text-gray-700 text-3xl md:hidden relative'>{project.name}</p>
                <Carousel assets={projectAssetsUrls} delay={5000}/>
            </div>
            <div className='h-full w-full md:w-2/3 md:px-7 flex flex-col justify-center items-center '>
                <div className='w-full hidden md:flex'>
                    <p className='font-bold font-sans text-gray-700 text-3xl pb-2'>{project.name}</p>
                </div>
                <div className='w-full flex justify-start items-start text-center md:text-justify mb-5'>
                    <p className='font-mono'>{project.summary}</p>
                </div>
                <div className='w-full flex justify-center md:justify-start items-center text-center uppercase'>
                    <p className='font-sans font-bold text-gray-700'>Contribution</p>
                </div>
                <div className='w-full flex justify-start items-start text-center md:text-justify mb-10'>
                    <p className='font-mono'>{project.contribution}</p>
                </div>
                <div className='w-full flex justify-center md:justify-start items-center text-center gap-2'>
                    {
                        project.tags.map((t: string) => <Badge key={t} tag={t}/>)
                    }
                </div>
            </div>
        </motion.div>
    )
}

export default ProjectCard