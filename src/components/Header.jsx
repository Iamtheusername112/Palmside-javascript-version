'use client'

import { ChevronDown, Globe, Menu, X } from 'lucide-react'
import { Button } from './ui/button'
import { useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from './ui/dropdown-menu'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)
  const langCloseTimerRef = useRef(null)

  const openLang = () => {
    if (langCloseTimerRef.current) {
      clearTimeout(langCloseTimerRef.current)
      langCloseTimerRef.current = null
    }
    setIsLangOpen(true)
  }

  const scheduleLangClose = () => {
    if (langCloseTimerRef.current) {
      clearTimeout(langCloseTimerRef.current)
    }
    langCloseTimerRef.current = setTimeout(() => {
      setIsLangOpen(false)
      langCloseTimerRef.current = null
    }, 150)
  }

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container mx-auto px-2'>
        <div className='flex h-70 items-center justify-between'>
          {/* Logo */}
          <Link
            href='/'
            className='flex items-center space-x-2 hover:opacity-80 transition-opacity ml-[-8px] md:ml-0'
          >
            <Image
              src={'/logo/palmside-logo-transparent.png'}
              alt='PalmSide logo'
              width={150}
              height={28}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center space-x-8'>
            <Link
              href='/'
              className='text-sm font-medium transition-colors hover:text-[#D4AF37]'
            >
              Home
            </Link>
            <Link
              href='/about'
              className='text-sm font-medium transition-colors hover:text-[#D4AF37]'
            >
              About Us
            </Link>

            {/* Services Dropdown */}
            <div className='relative group'>
              <Link
                href='/services'
                className='flex items-center space-x-1 text-sm font-medium transition-colors hover:text-[#D4AF37]'
              >
                <span>Services</span>
                <ChevronDown className='h-4 w-4' />
              </Link>
              <div className='absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50'>
                <div className='py-2'>
                  <Link
                    href='/services#property-search'
                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#D4AF37]'
                  >
                    Property Search
                  </Link>
                  <Link
                    href='/services#property-management'
                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#D4AF37]'
                  >
                    Property Management
                  </Link>
                  <Link
                    href='/services#expert-agents'
                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#D4AF37]'
                  >
                    Expert Agents
                  </Link>
                  <Link
                    href='/services#secure-transactions'
                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#D4AF37]'
                  >
                    Secure Transactions
                  </Link>
                  <Link
                    href='/services#mortgage-calculator'
                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#D4AF37]'
                  >
                    Mortgage Calculator
                  </Link>
                  <Link
                    href='/services#market-analysis'
                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#D4AF37]'
                  >
                    Market Analysis
                  </Link>
                </div>
              </div>
            </div>

            <Link
              href='/properties'
              className='text-sm font-medium transition-colors hover:text-[#D4AF37]'
            >
              Properties
            </Link>
            <Link
              href='/contact'
              className='text-sm font-medium transition-colors hover:text-[#D4AF37]'
            >
              Contact Us
            </Link>
            <div>
              <DropdownMenu open={isLangOpen} onOpenChange={setIsLangOpen} modal={false}>
                <DropdownMenuTrigger asChild>
                  <button
                    type='button'
                    aria-label='Change language'
                    className='p-2 rounded transition-colors hover:text-[#D4AF37] data-[state=open]:text-[#D4AF37]'
                    title='Language'
                    onPointerDown={(e) => e.preventDefault()}
                    onClick={(e) => e.preventDefault()}
                    onMouseEnter={openLang}
                    onMouseLeave={scheduleLangClose}
                  >
                    <Globe className='h-5 w-5' />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align='end'
                  sideOffset={0}
                  onMouseEnter={openLang}
                  onMouseLeave={scheduleLangClose}
                >
                  <DropdownMenuItem className='hover:text-[#D4AF37] hover:bg-gray-50 data-[highlighted]:text-[#D4AF37] data-[highlighted]:bg-gray-50'>English</DropdownMenuItem>
                  <DropdownMenuItem className='hover:text-[#D4AF37] hover:bg-gray-50 data-[highlighted]:text-[#D4AF37] data-[highlighted]:bg-gray-50'>Español</DropdownMenuItem>
                  <DropdownMenuItem className='hover:text-[#D4AF37] hover:bg-gray-50 data-[highlighted]:text-[#D4AF37] data-[highlighted]:bg-gray-50'>Deutsch</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Link
              href='/admin'
              className='text-sm font-medium text-primary hover:text-primary/80'
            >
              Admin
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant='ghost'
            size='icon'
            className='md:hidden'
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className='h-4 w-4' />
            ) : (
              <Menu className='h-4 w-4' />
            )}
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className='md:hidden border-t border-gray-200 bg-white'>
            <nav className='py-4 space-y-4'>
              <Link
                href='/'
                className='block px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary'
              >
                Home
              </Link>
              <Link
                href='/about'
                className='block px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary'
              >
                About Us
              </Link>
              <div className='px-4'>
                <Link
                  href='/services'
                  className='block text-sm font-medium text-gray-700 mb-2 hover:text-primary'
                >
                  Services
                </Link>
                <div className='pl-4 space-y-2'>
                  <Link
                    href='/services#property-search'
                    className='block py-1 text-sm text-gray-600 hover:text-primary'
                  >
                    Property Search
                  </Link>
                  <Link
                    href='/services#property-management'
                    className='block py-1 text-sm text-gray-600 hover:text-primary'
                  >
                    Property Management
                  </Link>
                  <Link
                    href='/services#expert-agents'
                    className='block py-1 text-sm text-gray-600 hover:text-primary'
                  >
                    Expert Agents
                  </Link>
                  <Link
                    href='/services#secure-transactions'
                    className='block py-1 text-sm text-gray-600 hover:text-primary'
                  >
                    Secure Transactions
                  </Link>
                  <Link
                    href='/services#mortgage-calculator'
                    className='block py-1 text-sm text-gray-600 hover:text-primary'
                  >
                    Mortgage Calculator
                  </Link>
                  <Link
                    href='/services#market-analysis'
                    className='block py-1 text-sm text-gray-600 hover:text-primary'
                  >
                    Market Analysis
                  </Link>
                </div>
              </div>
              <Link
                href='/properties'
                className='block px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary'
              >
                Properties
              </Link>
              <Link
                href='/contact'
                className='block px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary'
              >
                Contact Us
              </Link>
              <Link
                href='/admin'
                className='block px-4 py-2 text-sm font-medium text-primary hover:text-primary/80'
              >
                Admin
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
