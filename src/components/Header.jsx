"use client"

import { Building2, ChevronDown, Menu, X } from 'lucide-react'
import { Button } from './ui/button'
import { useState } from 'react'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">PalmSide</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-sm font-medium transition-colors hover:text-primary">
              Home
            </a>
            <a href="#" className="text-sm font-medium transition-colors hover:text-primary">
              About Us
            </a>
            
            {/* Services Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary">
                <span>Services</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary">
                    Property Search
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary">
                    Property Management
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary">
                    Expert Agents
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary">
                    Secure Transactions
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary">
                    Mortgage Calculator
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary">
                    Market Analysis
                  </a>
                </div>
              </div>
            </div>
            
            <a href="#" className="text-sm font-medium transition-colors hover:text-primary">
              Properties
            </a>
            <a href="#" className="text-sm font-medium transition-colors hover:text-primary">
              Contact Us
            </a>
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
              <a href="#" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary">
                Home
              </a>
              <a href="#" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary">
                About Us
              </a>
              <div className="px-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Services</div>
                <div className="pl-4 space-y-2">
                  <a href="#" className="block py-1 text-sm text-gray-600 hover:text-primary">
                    Property Search
                  </a>
                  <a href="#" className="block py-1 text-sm text-gray-600 hover:text-primary">
                    Property Management
                  </a>
                  <a href="#" className="block py-1 text-sm text-gray-600 hover:text-primary">
                    Expert Agents
                  </a>
                  <a href="#" className="block py-1 text-sm text-gray-600 hover:text-primary">
                    Secure Transactions
                  </a>
                  <a href="#" className="block py-1 text-sm text-gray-600 hover:text-primary">
                    Mortgage Calculator
                  </a>
                  <a href="#" className="block py-1 text-sm text-gray-600 hover:text-primary">
                    Market Analysis
                  </a>
                </div>
              </div>
              <a href="#" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary">
                Properties
              </a>
              <a href="#" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary">
                Contact Us
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
