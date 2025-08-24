import { Home, Building2, Users, Shield, Calculator, MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

const services = [
  {
    icon: Home,
    title: "Property Search",
    description: "Find your perfect home with our advanced search filters and personalized recommendations.",
    color: "text-blue-600"
  },
  {
    icon: Building2,
    title: "Property Management",
    description: "Professional management services for landlords and property investors.",
    color: "text-green-600"
  },
  {
    icon: Users,
    title: "Expert Agents",
    description: "Connect with experienced real estate professionals in your area.",
    color: "text-purple-600"
  },
  {
    icon: Shield,
    title: "Secure Transactions",
    description: "Safe and secure property transactions with legal protection.",
    color: "text-red-600"
  },
  {
    icon: Calculator,
    title: "Mortgage Calculator",
    description: "Calculate your mortgage payments and explore financing options.",
    color: "text-orange-600"
  },
  {
    icon: MapPin,
    title: "Market Analysis",
    description: "Get detailed market insights and property value estimates.",
    color: "text-indigo-600"
  }
]

export default function ServicesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We provide comprehensive real estate services to make your property journey seamless
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <service.icon className={`h-8 w-8 ${service.color}`} />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
