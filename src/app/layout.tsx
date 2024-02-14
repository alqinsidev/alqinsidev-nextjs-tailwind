import React from 'react'
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/navbar/navbar'
import Footer from '@/components/footer/footer'

const montserrat = Montserrat({
  weight: '400',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Padlan Alqinsi',
  description: 'Everythings about padlan is here',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={montserrat.className}>
        <div className='h-screen w-screen'>
          <div className='absolute left-0 top-0 h-20 w-screen'>
            <Navbar />
          </div>
          {children}
          <div className='h-[30vh] w-screen'>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  )
}
