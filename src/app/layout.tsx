import React from 'react'
import type { Metadata } from 'next'
import { GoogleTagManager } from '@next/third-parties/google'
import { Montserrat } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/navbar/navbar'
import Footer from '@/components/footer/footer'

const montserrat = Montserrat({
  weight: '400',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://alqinsidev.net'),
  title: {
    template: '%s | Padlan Alqinsi (alqinsidev)',
    default: 'Padlan Alqinsi (alqinsidev) - Software Engineer',
  },
  description: "Padlan Alqinsi (alqinsidev) - Software Engineer specializing in scalable solutions, AI integration, and modern web applications. Let's turn your ideas into reality.",
  openGraph: {
    title: 'Padlan Alqinsi - Software Engineer',
    description: "Padlan Alqinsi (alqinsidev) - Software Engineer specializing in scalable solutions, AI integration, and modern web applications. Let's turn your ideas into reality.",
    url: 'https://alqinsidev.net',
    siteName: 'Padlan Alqinsi',
    images: [
      {
        url: 'https://firebasestorage.googleapis.com/v0/b/alqinsidev-project.appspot.com/o/static-assets%2FOG%20Image.png?alt=media&token=e7011339-58ed-48ef-82cc-8a4fc850ddb4',
        width: 1200,
        height: 630,
        alt: 'Padlan Alqinsi OG Image',
      },
    ],
    type: 'website',
  },
};

const cfBeaconToken = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GA_ID || ""}/>
      <head>
        <meta name="google-site-verification" content="xj216UYIB7vh92OXrvro-OBv-R6X13ju5xw87JhdTiM" />
        <link rel="canonical" href="https://alqinsidev.net/" />
        {cfBeaconToken && (
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={`{"token": "${cfBeaconToken}"}`}
          ></script>
        )}
      </head>
      <body className={montserrat.className}>
        {/* Google Tag Manager NoScript (for users with JS disabled) */}
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
