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
  title: 'Padlan Alqinsi - Software Engineer',
  description: "Padlan Alqinsi - Software Engineer | I'll Code Everything I need to Code 💻",
  metadataBase: new URL('https://alqinsidev.vercel.app'),
  openGraph: {
    title: 'Padlan Alqinsi - Software Engineer',
    description: "Padlan Alqinsi - Software Engineer | I'll Code Everything I need to Code 💻",
    url: 'https://alqinsidev.vercel.app',
    siteName: 'Padlan Alqinsi',
    images: [
      {
        url: 'https://firebasestorage.googleapis.com/v0/b/alqinsidev-project.appspot.com/o/alqinsidev-web%2Fassets%2Fstatic%2FOG%20Image.png?alt=media&token=13af7c42-4712-4fc2-a80e-2da6dba92ae8',
        width: 1200,
        height: 630,
        alt: 'Padlan Alqinsi OG Image',
      },
    ],
    type: 'website',
  },
};


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
