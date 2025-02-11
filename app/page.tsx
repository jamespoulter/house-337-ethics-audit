import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, Shield, Scale, Heart, Brain, Users, FileCheck } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-white">
        <div className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-20">
          <div className="blur-[106px] h-56 bg-gradient-to-br from-[#FF0055] to-[#FF0055]/60" />
          <div className="blur-[106px] h-32 bg-gradient-to-r from-[#FF0055]/30 to-[#FF0055]/5" />
        </div>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center space-y-8 text-center">
            <Image 
              src="/images/House_Word_logo.png"
              alt="House 337"
              width={200}
              height={60}
              className="mb-8"
            />
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none text-black">
                AI Ethics Audit Platform
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
                Ensure your AI systems align with industry best practices and ethical principles. Comprehensive auditing for responsible AI development and deployment.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/audits/new">
                <Button size="lg" className="bg-[#FF0055] hover:bg-[#FF0055]/90 text-white shadow-lg">
                  Start Your Audit
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="border-[#FF0055] text-[#FF0055] hover:bg-[#FF0055]/10">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:gap-24">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-black">
                Comprehensive AI Ethics Evaluation
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-600 md:text-lg">
                Our audit framework combines technical assessment with industry standards to ensure your AI systems operate ethically and responsibly.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card className="relative overflow-hidden border-none shadow-md hover:shadow-xl transition-shadow bg-white">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="p-3 rounded-full bg-[#FF0055]/10">
                    <Shield className="h-6 w-6 text-[#FF0055]" />
                  </div>
                  <h3 className="text-xl font-bold text-black">Industry Standards</h3>
                  <p className="text-gray-600">
                    Evaluate AI systems against established industry standards and best practices for ethical AI development.
                  </p>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden border-none shadow-md hover:shadow-xl transition-shadow bg-white">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="p-3 rounded-full bg-[#FF0055]/10">
                    <Scale className="h-6 w-6 text-[#FF0055]" />
                  </div>
                  <h3 className="text-xl font-bold text-black">Risk Assessment</h3>
                  <p className="text-gray-600">
                    Comprehensive evaluation of fairness, transparency, accountability, and privacy in AI systems.
                  </p>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden border-none shadow-md hover:shadow-xl transition-shadow bg-white lg:col-span-1 md:col-span-2">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="p-3 rounded-full bg-[#FF0055]/10">
                    <Heart className="h-6 w-6 text-[#FF0055]" />
                  </div>
                  <h3 className="text-xl font-bold text-black">Social Impact</h3>
                  <p className="text-gray-600">
                    Ensure AI systems create positive impact while maintaining high ethical standards.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 lg:py-24 bg-white border-t border-gray-100">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:gap-24">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-black">
                Our Audit Process
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-600 md:text-lg">
                A thorough, step-by-step approach to evaluating and improving your AI systems
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Brain,
                  title: "Technical Review",
                  description: "Analyze AI algorithms and systems for ethical implementation",
                },
                {
                  icon: Users,
                  title: "Stakeholder Input",
                  description: "Gather feedback from users, developers, and business leaders",
                },
                {
                  icon: Scale,
                  title: "Ethics Assessment",
                  description: "Evaluate against industry standards and best practices",
                },
                {
                  icon: FileCheck,
                  title: "Recommendations",
                  description: "Detailed report with actionable improvements",
                },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center text-center space-y-4 p-6">
                  <div className="p-3 rounded-full bg-[#FF0055]/10">
                    <item.icon className="h-6 w-6 text-[#FF0055]" />
                  </div>
                  <h3 className="text-xl font-bold text-black">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center space-y-8 text-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-black">
                Start Your AI Ethics Journey Today
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-600 md:text-lg">
                Join leading organizations in ensuring ethical AI development and deployment.
              </p>
            </div>
            <Link href="/contact">
              <Button size="lg" className="bg-[#FF0055] hover:bg-[#FF0055]/90 text-white shadow-lg">
                Schedule a Consultation
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

