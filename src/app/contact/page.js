'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/contexts/ToastContext'
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from 'lucide-react'

export default function ContactPage() {
  const { success, error } = useToast()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))

    // Clear error when user starts typing
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.subject) {
      newErrors.subject = 'Please select a subject'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        success(
          'Message Sent Successfully!',
          "Thank you for your message! We'll get back to you within 24 hours."
        )
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        })
        setErrors({})
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        error(
          'Submission Failed',
          result.error ||
            'There was an error sending your message. Please try again.'
        )
      }
    } catch (error) {
      error(
        'Network Error',
        'There was a problem connecting to our servers. Please check your internet connection and try again.'
      )
      console.error('Network error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'>
      <Header />

      {/* Contact Form and Info */}
      <section className='py-20 bg-white'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold text-gray-900 mb-4'>
              Get in Touch
            </h2>
            <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
              Fill out the form below and we'll get back to you within 24 hours.
              For urgent matters, feel free to call us directly.
            </p>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-16'>
            {/* Contact Form */}
            <div className='bg-gradient-to-br from-white to-blue-50/30 rounded-3xl p-8 shadow-xl border border-blue-100/50'>
              <h3 className='text-2xl font-bold text-gray-900 mb-8 flex items-center'>
                <MessageCircle className='h-6 w-6 mr-3 text-blue-600' />
                Send us a Message
              </h3>
              <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <label
                      htmlFor='firstName'
                      className='block text-sm font-semibold text-gray-700'
                    >
                      First Name *
                    </label>
                    <Input
                      id='firstName'
                      type='text'
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder='Your first name'
                      className={`h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl ${
                        errors.firstName
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : ''
                      }`}
                    />
                    {errors.firstName && (
                      <p className='text-sm text-red-600'>{errors.firstName}</p>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <label
                      htmlFor='lastName'
                      className='block text-sm font-semibold text-gray-700'
                    >
                      Last Name *
                    </label>
                    <Input
                      id='lastName'
                      type='text'
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder='Your last name'
                      className={`h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl ${
                        errors.lastName
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : ''
                      }`}
                    />
                    {errors.lastName && (
                      <p className='text-sm text-red-600'>{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className='space-y-2'>
                  <label
                    htmlFor='email'
                    className='block text-sm font-semibold text-gray-700'
                  >
                    Email Address *
                  </label>
                  <Input
                    id='email'
                    type='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder='your.email@example.com'
                    className={`h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl ${
                      errors.email
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : ''
                    }`}
                  />
                  {errors.email && (
                    <p className='text-sm text-red-600'>{errors.email}</p>
                  )}
                </div>

                <div className='space-y-2'>
                  <label
                    htmlFor='phone'
                    className='block text-sm font-semibold text-gray-700'
                  >
                    Phone Number
                  </label>
                  <Input
                    id='phone'
                    type='tel'
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder='+1 (555) 123-4567'
                    className='h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl'
                  />
                </div>

                <div className='space-y-2'>
                  <label
                    htmlFor='subject'
                    className='block text-sm font-semibold text-gray-700'
                  >
                    Subject *
                  </label>
                  <select
                    id='subject'
                    value={formData.subject}
                    onChange={handleInputChange}
                    className={`flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 transition-colors ${
                      errors.subject
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : ''
                    }`}
                  >
                    <option value=''>Select a subject</option>
                    <option value='property-inquiry'>Property Inquiry</option>
                    <option value='general-question'>General Question</option>
                    <option value='service-inquiry'>Service Inquiry</option>
                    <option value='partnership'>Partnership Opportunity</option>
                    <option value='feedback'>Feedback</option>
                    <option value='other'>Other</option>
                  </select>
                  {errors.subject && (
                    <p className='text-sm text-red-600'>{errors.subject}</p>
                  )}
                </div>

                <div className='space-y-2'>
                  <label
                    htmlFor='message'
                    className='block text-sm font-semibold text-gray-700'
                  >
                    Message *
                  </label>
                  <textarea
                    id='message'
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    className={`flex w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 transition-colors resize-none ${
                      errors.message
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : ''
                    }`}
                    placeholder='Tell us how we can help you...'
                  ></textarea>
                  {errors.message && (
                    <p className='text-sm text-red-600'>{errors.message}</p>
                  )}
                </div>

                <Button
                  type='submit'
                  size='lg'
                  disabled={isSubmitting}
                  className='w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
                >
                  {isSubmitting ? (
                    <>
                      <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className='h-5 w-5 mr-2' />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className='space-y-8'>
              <div className='bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-lg border border-gray-100'>
                <h3 className='text-2xl font-bold text-gray-900 mb-8 flex items-center'>
                  <MapPin className='h-6 w-6 mr-3 text-blue-600' />
                  Office Address
                </h3>
                <div className='space-y-4'>
                  <p className='text-lg text-gray-700 leading-relaxed'>
                    <strong>Palmside Real Estate</strong>
                    <br />
                    123 Real Estate Avenue
                    <br />
                    Downtown Business District
                    <br />
                    City, State 12345
                    <br />
                    United States
                  </p>
                  <div className='pt-4'>
                    <Button
                      variant='outline'
                      className='w-full border-blue-200 text-blue-700 hover:bg-blue-50 rounded-xl'
                    >
                      Get Directions
                    </Button>
                  </div>
                </div>
              </div>

              <div className='bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-lg border border-gray-100'>
                <h3 className='text-2xl font-bold text-gray-900 mb-6'>
                  Contact Details
                </h3>

                <div className='space-y-6'>
                  <div className='flex items-center space-x-4'>
                    <div className='w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0'>
                      <Phone className='h-6 w-6 text-blue-600' />
                    </div>
                    <div>
                      <h4 className='font-semibold text-gray-900'>
                        Phone Numbers
                      </h4>
                      <p className='text-gray-600'>
                        Main:{' '}
                        <a
                          href='tel:+15551234567'
                          className='text-blue-600 hover:underline'
                        >
                          (555) 123-4567
                        </a>
                        <br />
                        Sales:{' '}
                        <a
                          href='tel:+15551234568'
                          className='text-blue-600 hover:underline'
                        >
                          (555) 123-4568
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center space-x-4'>
                    <div className='w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0'>
                      <Mail className='h-6 w-6 text-purple-600' />
                    </div>
                    <div>
                      <h4 className='font-semibold text-gray-900'>
                        Email Addresses
                      </h4>
                      <p className='text-gray-600'>
                        <a
                          href='mailto:info@palmside.com'
                          className='text-blue-600 hover:underline'
                        >
                          info@palmside.com
                        </a>
                        <br />
                        <a
                          href='mailto:sales@palmside.com'
                          className='text-blue-600 hover:underline'
                        >
                          sales@palmside.com
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center space-x-4'>
                    <div className='w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0'>
                      <Clock className='h-6 w-6 text-green-600' />
                    </div>
                    <div>
                      <h4 className='font-semibold text-gray-900'>
                        Business Hours
                      </h4>
                      <p className='text-gray-600'>
                        Mon - Fri: 9:00 AM - 6:00 PM
                        <br />
                        Saturday: 10:00 AM - 4:00 PM
                        <br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className='bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-lg border border-gray-100'>
                <h3 className='text-xl font-bold text-gray-900 mb-6'>
                  Connect With Us
                </h3>
                <div className='flex space-x-4'>
                  <a
                    href='#'
                    className='w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl'
                  >
                    <span className='text-sm font-bold'>f</span>
                  </a>
                  <a
                    href='#'
                    className='w-12 h-12 bg-blue-700 rounded-xl flex items-center justify-center text-white hover:bg-blue-800 transition-colors shadow-lg hover:shadow-xl'
                  >
                    <span className='text-sm font-bold'>in</span>
                  </a>
                  <a
                    href='#'
                    className='w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center text-white hover:bg-pink-600 transition-colors shadow-lg hover:shadow-xl'
                  >
                    <span className='text-sm font-bold'>ig</span>
                  </a>
                  <a
                    href='#'
                    className='w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-lg hover:shadow-xl'
                  >
                    <span className='text-sm font-bold'>t</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className='py-20 bg-gradient-to-br from-gray-50 to-blue-50'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12'>
            <h2 className='text-4xl font-bold text-gray-900 mb-4'>
              Find Our Office
            </h2>
            <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
              Visit us in person or explore our neighborhood virtually
            </p>
          </div>
          <div className='bg-white rounded-3xl shadow-2xl overflow-hidden'>
            <div className='aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative'>
              <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iI0U1RTdFQiIgZmlsbC1vcGFjaXR5PSIwLjMiPjxwYXRoIGQ9Ik0xMSAxOGMzLjg2NiAwIDctMy4xMzQgNy03cy0zLjEzNC03LTctNy03IDMuMTM0LTcgNyAzLjEzNCA3IDcgN3ptNDggMjVjMy44NjYgMCA3LTMuMTM0IDctN3MtMy4xMzQtNy03LTctNyAzLjEzNC03IDcgMy4xMzQgNyA3IDd6bS00My03YzEuNjU3IDAgMy0xLjM0MyAzLTMtLjAwMS0xLjY1Ny0xLjM0My0zLTMtMy0xLjY1NyAwLTMgMS4zNDMtMyAzIDEuMzQzIDMgMyAzem02MyAzMWMxLjY1NyAwIDMtMS4zNDMgMy0zcy0xLjM0My0zLTMtMy0zIDEuMzQzLTMgMyAxLjM0MyAzIDMgM3pNMzQgOTBjMS42NTcgMCAzLTEuMzQzIDMtM3MtMS4zNDMtMy0zLTMtMyAxLjM0My0zIDMgMS4zNDMgMyAzIDN6bTU2LTc2YzEuNjU3IDAgMy0xLjM0MyAzLTMtLjAwMS0xLjY1Ny0xLjM0My0zLTMtMy0xLjY1NyAwLTMgMS4zNDMtMyAzIDEuMzQzIDMgMyAzem0tNi02MGMxLjY1NyAwIDMtMS4zNDMgMy0zcy0xLjM0My0zLTMtMy0zIDEuMzQzLTMgMyAxLjM0MyAzIDMgM3pNMTIgODhjMi4yMSAwIDQtMS43OSA0LTRzLTEuNzktNC00LTQtNCAxLjc5LTQgNCAxLjc5IDQgNCA0em0yOC02NWMyLjIxIDAgNC0xLjc5IDQtNHMtMS43OS00LTQtNC00IDEuNzktNCA0IDEuNzkgNCA0IDR6bTIzLTExYzIuNzYgMCA1LTIuMjQgNS01cy0yLjI0LTUtNS01LTUgMi4yNC01IDUgMi4yNCA1IDUgNXptLTYgNjBjMi4yMSAwIDQtMS43OSA0LTRzLTEuNzktNC00LTQtNCAxLjc5LTQgNCAxLjc5IDQgNCA0em0yOSAyMmMyLjc2IDAgNS0yLjI0IDUtNXMtMi4yNC01LTUtNS01IDIuMjQtNSA1IDIuMjQgNSA1IDV6TTMyIDYzYzIuNzYgMCA1LTIuMjQgNS01cy0yLjI0LTUtNS01LTUgMi4yNC01IDUgMi4yNCA1IDUgNXptNTctMTNjMi43NiAwIDUtMi4yNCA1LTVzLTIuMjQtNS01LTUtNSAyLjI0LTUgNSAyLjI0IDUgNSA1em0tOS0yMWMxLjEwNSAwIDItLjg5NSAyLTJzLS44OTUtMi0yLTItMiAuODk1LTIgMiAuODk1IDIgMiAyek02MCA5MWMxLjEwNSAwIDItLjg5NSAyLTJzLS44OTUtMi0yLTItMiAuODk1LTIgMiAuODk1IDIgMiAyek0zNSA0MWMxLjEwNSAwIDItLjg5NSAyLTJzLS44OTUtMi0yLTItMiAuODk1LTIgMiAuODk1IDIgMiAyek0xMiA2MGMxLjEwNSAwIDItLjg5NSAyLTJzLS44OTUtMi0yLTItMiAuODk1LTIgMiAuODk1IDIgMiAyIi8+PC9nPjwvc3ZnPg==')]"></div>
              <div className='text-center relative z-10'>
                <div className='w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl'>
                  <MapPin className='h-10 w-10 text-white' />
                </div>
                <h3 className='text-2xl font-bold text-gray-900 mb-2'>
                  Interactive Map Coming Soon
                </h3>
                <p className='text-gray-600 mb-4'>
                  We're working on integrating a map to show our exact location
                </p>
                <Button className='bg-blue-600 hover:bg-blue-700 rounded-xl px-6'>
                  Enable Location Services
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
