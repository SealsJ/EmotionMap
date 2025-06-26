import Link from 'next/link'
import NavButton from './NavButton'
import DramaIcon from './icons/DramaIcon'

export default function Navbar() {
  return (
    <nav className="w-full bg-transparent py-6 relative" aria-label="Main Navigation">
      <div className="w-4/5 mx-auto flex items-center justify-between gap-4">
        {/* EmotionMap Logo and Branding Icon*/}
        <Link href="/" className="flex gap-x-2 text-lg lg:text-3xl font-bold text-white whitespace-nowrap shrink-0 fade-down-0">
            <DramaIcon />
            EmotionMap
        </Link>
        {/* Navigation Links */}
        <div className="flex gap-3 sm:gap-5 md:gap-6 shrink-0 whitespace-nowrap">
          <NavButton href="/about" label='About' animationClass='fade-left-0' />
          <NavButton href="/reveal" label='Reveal Emotions' animationClass='fade-left-1' />
        </div>
      </div>
      {/* Centered Navbar Bottom Border */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4/5 border-b border-white/40">
      </div>
    </nav>
  )
};