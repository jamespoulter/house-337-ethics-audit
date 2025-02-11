import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, Shield, Scale, Heart, Brain, Users, FileCheck } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-black">
        <div className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-10">
          <div className="blur-[106px] h-56 bg-gradient-to-br from-[#FF0055] to-[#FF0055]/60" />
          <div className="blur-[106px] h-32 bg-gradient-to-r from-[#FF0055]/30 to-[#FF0055]/5" />
        </div>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center space-y-8 text-center">
            <Image 
              src="/images/logo.jpg"
              alt="House 337"
              width={200}
              height={60}
              className="mb-8 brightness-0 invert"
            />
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none text-white">
                AI Ethics Audit Platform
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
                Comprehensive AI ethics evaluation based on the Linux Foundation's Open Trustmark initiative. Combining stakeholder interviews, quantitative scoring, and detailed governance frameworks to ensure responsible AI development.
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
                <Button variant="outline" size="lg" className="border-[#FF0055] text-[#FF0055] hover:bg-[#FF0055]/10 bg-black">
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
                Our audit framework combines structured stakeholder interviews, quantitative assessment metrics, and industry-standard governance models to provide a thorough evaluation of your AI system's ethical implementation.
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
                A systematic approach to evaluating and improving your AI systems' ethical standards
              </p>
            </div>
            <div className="relative">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-[#FF0055]/20 via-[#FF0055]/40 to-[#FF0055]/20 hidden lg:block -translate-y-1/2" />
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 relative">
                {[
                  {
                    icon: Brain,
                    title: "Technical Assessment",
                    description: "Evaluate AI systems against the Linux Foundation's Open Trustmark criteria for ethical implementation and transparency",
                    step: "01"
                  },
                  {
                    icon: Users,
                    title: "Stakeholder Interviews",
                    description: "Conduct detailed interviews with key stakeholders, scoring responses across multiple ethical dimensions",
                    step: "02"
                  },
                  {
                    icon: Scale,
                    title: "Governance Framework",
                    description: "Implement RACI matrix and ethical policies to establish clear accountability and responsibility",
                    step: "03"
                  },
                  {
                    icon: FileCheck,
                    title: "Quantitative Scoring",
                    description: "Provide detailed scoring across transparency, privacy, inclusivity, accountability, and sustainability metrics",
                    step: "04"
                  },
                ].map((item, index) => (
                  <div key={index} className="relative flex flex-col items-center text-center space-y-4 bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FF0055] text-white text-sm font-bold px-3 py-1 rounded-full">
                      Step {item.step}
                    </div>
                    <div className="p-4 rounded-full bg-[#FF0055]/10 ring-8 ring-[#FF0055]/5">
                      <item.icon className="h-8 w-8 text-[#FF0055]" />
                    </div>
                    <h3 className="text-xl font-bold text-black">{item.title}</h3>
                    <div className="w-12 h-1 bg-[#FF0055]/20 rounded-full" />
                    <p className="text-gray-600">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Framework Visualization */}
      <section className="py-16 lg:py-24 bg-black border-t border-gray-800">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:gap-24">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                Our Ethical Framework
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-300 md:text-lg">
                Based on industry-leading standards and comprehensive evaluation criteria
              </p>
            </div>
            <div className="flex justify-center">
              <Image
                src="/images/ethical-ai-framework.png"
                alt="AI Ethics Framework"
                width={800}
                height={800}
                className="rounded-lg"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold tracking-tighter text-black">
                Powered by Industry Standards
              </h2>
              <p className="text-gray-600">
                Our audit framework is aligned with the Linux Foundation's Open Trustmark Initiative
              </p>
            </div>
            <Image
              src="/images/ov_trustmark-white.svg"
              alt="Linux Foundation Open Trustmark"
              width={300}
              height={80}
              className="mt-4 invert"
            />
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
                Join organizations committed to ethical AI development through our comprehensive interview-based assessment and quantitative scoring framework.
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

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <Image 
              src="/images/House_Word_logo.png"
              alt="House 337"
              width={150}
              height={45}
              className="opacity-80"
            />
          </div>
        </div>
      </footer>
    </div>
  )
}

