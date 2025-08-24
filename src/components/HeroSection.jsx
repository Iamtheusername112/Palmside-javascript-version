import { Play, ArrowRight } from 'lucide-react'
import { Button } from './ui/button'

export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&h=1080&fit=crop"
        >
          <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Video Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Find Your Dream
          <span className="block text-primary">Home Today</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
          Discover thousands of properties for sale and rent. From cozy apartments to luxury homes, 
          we have the perfect place for you.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-4">
            <Play className="h-5 w-5 mr-2" />
            Explore Properties
          </Button>
          
          <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-gray-900 text-lg px-8 py-4">
            Learn More
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
            <div className="text-gray-300">Properties Available</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">500+</div>
            <div className="text-gray-300">Happy Clients</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">50+</div>
            <div className="text-gray-300">Cities Covered</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}
