import React from 'react'
import PersonalBotSection from './components/personalBotSection'
import CustomFaqSection from './components/customFaqSection'

const PlaygroundPage = () => {
  return (
    <div className='flex min-h-screen w-full flex-col items-center justify-center bg-sky-50 pt-10'>
      <PersonalBotSection />
      <CustomFaqSection/>
    </div>
  )
}

export default PlaygroundPage
