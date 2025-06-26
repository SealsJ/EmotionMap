"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavLinkProps {
  href: string
  label: string
  animationClass?: string
}

export default function NavButton ({ href, label, animationClass = '' }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href 
  return (
    <Link
      href={href}
      className={`p-1
        lg:px-3 lg:py-2 text-xs lg:text-lg rounded-full transition-colors duration-300 border-2
        ${isActive
          ? "bg-white text-[#5d1283] border-white"
          : "text-white border-white hover:bg-white hover:text-[#5d1283]"}
        ${animationClass}
      `}
    >
      {label}
    </Link>
  )
};