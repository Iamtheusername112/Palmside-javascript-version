"use client"

import { Building2, ChevronDown, Menu, X } from 'lucide-react'
import { Button } from './ui/button'
import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">PalmSide</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
              Home
            </Link>
            <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
              About Us
            </Link>
            
            {/* Services Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary">
                <span>Services</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <Link href="/services#property-search" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary">
                    Property Search
                  </Link>
                  <Link href="/services#property-management" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary">
                    Property Management
                  </Link>
                  <Link href="/services#expert-agents" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary">
                    Expert Agents
                  </Link>
                  <Link href="/services#secure-transactions" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary">
                    Secure Transactions
                  </Link>
                  <Link href="/services#mortgage-calculator" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary">
                    Mortgage Calculator
                  </Link>
                  <Link href="/services#market-analysis" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary">
                    Market Analysis
                  </Link>
                </div>
              </div>
            </div>
            
            <Link href="/properties" className="text-sm font-medium transition-colors hover:text-primary">
              Properties
            </Link>
            <Link href="/contact" className="text-sm font-medium transition-colors hover:text-primary">
              Contact Us
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <nav className="py-4 space-y-4">
              <Link href="/" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary">
                Home
              </Link>
              <Link href="/about" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary">
                About Us
              </Link>
              <div className="px-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Services</div>
                <div className="pl-4 space-y-2">
                  <Link href="/services#property-search" className="block py-1 text-sm text-gray-600 hover:text-primary">
                    Property Search
                  </Link>
                  <Link href="/services#property-management" className="block py-1 text-sm text-gray-600 hover:text-primary">
                    Property Management
                  </Link>
                  <Link href="/services#expert-agents" className="block py-1 text-sm text-gray-600 hover:text-primary">
                    Expert Agents
                  </Link>
                  <Link href="/services#secure-transactions" className="block py-1 text-sm text-gray-600 hover:text-primary">
                    Secure Transactions
                  </Link>
                  <Link href="/services#mortgage-calculator" className="block py-1 text-sm text-gray-600 hover:text-primary">
                    Mortgage Calculator
                  </Link>
                  <Link href="/services#market-analysis" className="block py-1 text-sm text-gray-600 hover:text-primary">
                    Market Analysis
                  </Link>
                </div>
              </div>
              <Link href="/properties" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary">
                Properties
              </Link>
              <Link href="/contact" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary">
                Contact Us
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
