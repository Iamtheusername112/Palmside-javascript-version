'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PropertyCard from '@/components/PropertyCard'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export default function PropertiesPage() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)

  // Fetch properties from the API
  const fetchProperties = async (pageNum = 1, append = false) => {
    try {
      setLoadingMore(pageNum > 1)
      const response = await fetch(`/api/properties?page=${pageNum}&limit=12`)

      if (!response.ok) {
        throw new Error('Failed to fetch properties')
      }

      const data = await response.json()

      if (append) {
        setProperties((prev) => [...prev, ...data.properties])
      } else {
        setProperties(data.properties)
      }

      setHasMore(data.pagination.page < data.pagination.pages)
      setPage(pageNum)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  // Load more properties
  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchProperties(page + 1, true)
    }
  }

  // Initial load
  useEffect(() => {
    fetchProperties()
  }, [])

  // Show loading state
  if (loading) {
    return (
      <main className='min-h-screen'>
        <Header />
        <section className='bg-gradient-to-br from-blue-50 to-purple-50 py-20'>
          <div className='container mx-auto px-4 text-center'>
            <h1 className='text-4xl md:text-6xl font-bold text-gray-900 mb-6'>
              Find Your Perfect <span className='text-primary'>Property</span>
            </h1>
            <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
              Browse through our extensive collection of properties for sale and
              rent. From cozy apartments to luxury homes, we have something for
              everyone.
            </p>
          </div>
        </section>

        <section className='py-16 bg-gray-50'>
          <div className='container mx-auto px-4 text-center'>
            <div className='flex justify-center items-center py-20'>
              <Loader2 className='w-8 h-8 animate-spin text-primary' />
              <span className='ml-2 text-lg text-gray-600'>
                Loading properties...
              </span>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  // Show error state
  if (error) {
    return (
      <main className='min-h-screen'>
        <Header />
        <section className='bg-gradient-to-br from-blue-50 to-purple-50 py-20'>
          <div className='container mx-auto px-4 text-center'>
            <h1 className='text-4xl md:text-6xl font-bold text-gray-900 mb-6'>
              Find Your Perfect <span className='text-primary'>Property</span>
            </h1>
            <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
              Browse through our extensive collection of properties for sale and
              rent. From cozy apartments to luxury homes, we have something for
              everyone.
            </p>
          </div>
        </section>

        <section className='py-16 bg-gray-50'>
          <div className='container mx-auto px-4 text-center'>
            <div className='py-20'>
              <h2 className='text-2xl font-bold text-red-600 mb-4'>
                Error Loading Properties
              </h2>
              <p className='text-gray-600 mb-6'>{error}</p>
              <Button onClick={() => fetchProperties()} variant='outline'>
                Try Again
              </Button>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  return (
    <main className='min-h-screen'>
      <Header />

      {/* Hero Section */}
      <section className='bg-gradient-to-br from-blue-50 to-purple-50 py-20'>
        <div className='container mx-auto px-4 text-center'>
          <h1 className='text-4xl md:text-6xl font-bold text-gray-900 mb-6'>
            Find Your Perfect <span className='text-primary'>Property</span>
          </h1>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Browse through our extensive collection of properties for sale and
            rent. From cozy apartments to luxury homes, we have something for
            everyone.
          </p>
        </div>
      </section>

      {/* Properties Grid */}
      <section className='py-16 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <div className='flex justify-between items-center mb-8'>
            <h2 className='text-2xl font-bold text-gray-900'>
              Available Properties ({properties.length})
            </h2>
          </div>

          {properties.length > 0 ? (
            <>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className='text-center mt-12'>
                  <Button
                    size='lg'
                    variant='outline'
                    onClick={loadMore}
                    disabled={loadingMore}
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                        Loading...
                      </>
                    ) : (
                      'Load More Properties'
                    )}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className='text-center py-20'>
              <h3 className='text-xl font-semibold text-gray-600 mb-2'>
                No Properties Available
              </h3>
              <p className='text-gray-500'>
                Check back later for new listings!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-16 bg-primary'>
        <div className='container mx-auto px-4 text-center'>
          <h2 className='text-3xl font-bold text-white mb-6'>
            Can't Find What You're Looking For?
          </h2>
          <p className='text-xl text-white/90 mb-8 max-w-2xl mx-auto'>
            Let us know your requirements and we'll help you find the perfect
            property or notify you when something becomes available.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <a
              href='/contact'
              className='bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block'
            >
              Contact Us
            </a>
            <a
              href='/services'
              className='border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors inline-block'
            >
              Our Services
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
