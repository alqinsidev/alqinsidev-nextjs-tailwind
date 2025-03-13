import React from 'react'
import type { Metadata } from 'next'
import Script from 'next/script'
import { Montserrat } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/navbar/navbar'
import Footer from '@/components/footer/footer'
import GTMTracker from '@/components/gtm/gtm-tracker'

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
      <head>
        {/* Google Analytics - Load in the Background */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body className={montserrat.className}>
        {/* Google Tag Manager NoScript (for users with JS disabled) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <div className='h-screen w-screen'>
          <GTMTracker/>
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
