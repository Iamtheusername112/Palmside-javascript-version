import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import FeaturedProperties from '@/components/FeaturedProperties'
import ServicesSection from '@/components/ServicesSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import NewsletterSection from '@/components/NewsletterSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturedProperties />
      <ServicesSection />
      <TestimonialsSection />
      <NewsletterSection />
      <Footer />
    </main>
  )
}
