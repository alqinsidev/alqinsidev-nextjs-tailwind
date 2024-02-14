'use client'

import Link from 'next/link'
import React from 'react'
import { UrlLink } from './navbar'
import { usePathname } from 'next/navigation'

const NavLink = ({ link }: { link: UrlLink }) => {
  const activeUrl = usePathname()
  return (
    <Link
      className={`rounded p-2 hover:bg-sky-300 hover:text-white ${activeUrl === link.url ? 'bg-gray-700 text-white' : 'text-gray-700'} font-sans text-[1.6rem] font-bold`}
      href={link.url}
    >
      {link.label}
    </Link>
  )
}

export default NavLink
