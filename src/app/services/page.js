import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Search, Building2, Users, Shield, Calculator, MapPin, Home, Key, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const services = [
  {
    icon: Search,
    title: "Property Search",
    description: "Find your perfect home with our advanced search filters and personalized recommendations.",
    features: ["Advanced filters", "Saved searches", "Email alerts", "Virtual tours"],
    color: "text-blue-600"
  },
  {
    icon: Building2,
    title: "Property Management",
    description: "Professional management services for landlords and property investors.",
    features: ["Tenant screening", "Rent collection", "Maintenance coordination", "Financial reporting"],
    color: "text-green-600"
  },
  {
    icon: Users,
    title: "Expert Agents",
    description: "Connect with experienced real estate professionals in your area.",
    features: ["Local expertise", "Negotiation skills", "Market knowledge", "Personal guidance"],
    color: "text-purple-600"
  },
  {
    icon: Shield,
    title: "Secure Transactions",
    description: "Safe and secure property transactions with legal protection.",
    features: ["Legal compliance", "Secure payments", "Document management", "Risk mitigation"],
    color: "text-red-600"
  },
  {
    icon: Calculator,
    title: "Mortgage Calculator",
    description: "Calculate your mortgage payments and explore financing options.",
    features: ["Payment calculator", "Rate comparison", "Affordability analysis", "Refinancing options"],
    color: "text-orange-600"
  },
  {
    icon: MapPin,
    title: "Market Analysis",
    description: "Get detailed market insights and property value estimates.",
    features: ["Price trends", "Market reports", "Investment analysis", "Neighborhood insights"],
    color: "text-indigo-600"
  },
  {
    icon: Home,
    title: "Home Staging",
    description: "Professional staging services to maximize your property's appeal.",
    features: ["Interior design", "Furniture rental", "Photography", "Virtual staging"],
    color: "text-pink-600"
  },
  {
    icon: Key,
    title: "Property Insurance",
    description: "Comprehensive insurance solutions for property owners.",
    features: ["Home insurance", "Landlord insurance", "Rental property coverage", "Claims assistance"],
    color: "text-teal-600"
  },
  {
    icon: TrendingUp,
    title: "Investment Advisory",
    description: "Expert advice for real estate investment decisions.",
    features: ["Portfolio analysis", "Market timing", "Risk assessment", "ROI optimization"],
    color: "text-yellow-600"
  }
]

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Our <span className="text-primary">Services</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We provide comprehensive real estate services to make your property journey seamless, 
            from finding your dream home to managing your investments.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <service.icon className={`h-8 w-8 ${service.color}`} />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 mb-3">What's Included:</h4>
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose PalmSide?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We combine years of experience with cutting-edge technology to deliver exceptional results.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">15+</div>
              <div className="text-lg text-gray-600">Years of Experience</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-lg text-gray-600">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">98%</div>
              <div className="text-lg text-gray-600">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Contact us today to learn more about our services and how we can help you achieve your real estate goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
            >
              Contact Us
            </a>
            <a 
              href="/properties" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors inline-block"
            >
              View Properties
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
