/**
 * Home Page Component
 * 
 * This is the main landing page for the AI Ethics Audit Platform. It consists of several sections:
 * - Hero section with main CTA
 * - Features overview
 * - Audit process explanation
 * - Framework visualization
 * - Trust indicators
 * - Final CTA
 * - Footer
 */

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, Shield, Scale, Heart, Brain, Users, FileCheck, Sparkles, Lightbulb, Target, Zap } from "lucide-react"
import { assets } from "@/config/assets"
import { images } from "@/config/images"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section - Main landing area with platform introduction */}
      <section className="relative py-32 lg:py-40 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="flex flex-col space-y-12">
              {/* Main Hero Content */}
              <div className="space-y-8">
                <div className="inline-flex items-center space-x-2 text-[#FF0055]">
                  <Sparkles className="h-6 w-6" />
                  <span className="text-lg font-medium">Progressive Brand Innovation</span>
                </div>
                <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl/none text-black">
                  AI Ethics Audit Platform
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 max-w-2xl">
                  Comprehensive AI ethics evaluation based on the Linux Foundation's Open Trustmark initiative.
                </p>
              </div>

              {/* Progressive Brand Message */}
              <div className="grid gap-8">
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-full bg-[#FF0055]/5 shrink-0">
                    <Lightbulb className="h-6 w-6 text-[#FF0055]" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-black">Progressive Brand Innovation</h3>
                    <p className="text-lg text-gray-600">
                      Today's progressive brands leverage technology to create exceptional customer experiences while maintaining the highest ethical standards.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-full bg-[#FF0055]/5 shrink-0">
                    <Shield className="h-6 w-6 text-[#FF0055]" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-black">Ethical AI Implementation</h3>
                    <p className="text-lg text-gray-600">
                      As AI accelerates digital transformation, ensuring ethical implementation becomes crucial for brand trust and customer confidence.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-full bg-[#FF0055]/5 shrink-0">
                    <Target className="h-6 w-6 text-[#FF0055]" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-black">Safe & Responsible Growth</h3>
                    <p className="text-lg text-gray-600">
                      We help brands harness AI's potential while ensuring responsible innovation that prioritizes user safety and ethical considerations.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative hidden lg:block">
              <div className="relative bg-black p-12 border border-gray-800">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF0055]/10 via-transparent to-transparent opacity-50" />
                <div className="relative space-y-8">
                  <div className="flex flex-col items-center mb-12">
                    <span className="text-white text-lg mb-4 uppercase">PART OF OUR</span>
                    <Image
                      src={images.aiMagicLogo.src}
                      alt={images.aiMagicLogo.alt}
                      width={images.aiMagicLogo.width}
                      height={images.aiMagicLogo.height}
                      priority
                    />
                    <span className="text-white text-lg mt-4 uppercase">PRODUCT</span>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4 p-6 bg-white/5 backdrop-blur-sm">
                      <Users className="h-8 w-8 text-[#FF0055]" />
                      <h4 className="text-lg font-bold text-white">Customer Trust</h4>
                      <p className="text-sm text-gray-300">Building lasting relationships through ethical AI practices</p>
                    </div>
                    <div className="space-y-4 p-6 bg-white/5 rounded-lg backdrop-blur-sm">
                      <Zap className="h-8 w-8 text-[#FF0055]" />
                      <h4 className="text-lg font-bold text-white">Innovation</h4>
                      <p className="text-sm text-gray-300">Accelerating growth with responsible technology</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4 p-6 bg-white/5 rounded-lg backdrop-blur-sm">
                      <Shield className="h-8 w-8 text-[#FF0055]" />
                      <h4 className="text-lg font-bold text-white">Safety First</h4>
                      <p className="text-sm text-gray-300">Protecting users through ethical guidelines</p>
                    </div>
                    <div className="space-y-4 p-6 bg-white/5 rounded-lg backdrop-blur-sm">
                      <Heart className="h-8 w-8 text-[#FF0055]" />
                      <h4 className="text-lg font-bold text-white">Brand Values</h4>
                      <p className="text-sm text-gray-300">Aligning technology with core principles</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-8">
                <Link href="https://www.house337.com/our-expertise#ai">
                  <Button size="lg" className="bg-[#FF0055] hover:bg-[#FF0055]/90 text-white text-lg px-8 py-6 rounded-none">
                    Schedule a Consultation
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Overview of key platform capabilities */}
      <section className="py-24 lg:py-32 bg-gray-50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16">
            <div className="space-y-4 max-w-3xl">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-black">
                Comprehensive AI Ethics Evaluation
              </h2>
              <p className="text-xl text-gray-600">
                Our audit framework combines structured stakeholder interviews, quantitative assessment metrics, and industry-standard governance models.
              </p>
            </div>
            {/* Feature cards in a grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
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
                <div key={index} className="relative flex flex-col space-y-4 bg-white p-8 border-t-2 border-[#FF0055]">
                  <div className="text-sm font-medium text-[#FF0055]">
                    Step {item.step}
                  </div>
                  <div className="p-3 rounded-full bg-[#FF0055]/5 w-fit">
                    <item.icon className="h-6 w-6 text-[#FF0055]" />
                  </div>
                  <h3 className="text-xl font-bold text-black">{item.title}</h3>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Framework and Trust Indicators Section */}
      <section className="relative py-32 lg:py-40 bg-white border-t border-gray-100">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-24 items-start">
            <div className="space-y-12">
              <div className="space-y-6">
                <h2 className="text-6xl font-bold tracking-tight text-black">
                  Our Ethical Framework
                </h2>
                <p className="text-xl text-gray-600 max-w-xl">
                  Based on industry-leading standards and comprehensive evaluation criteria
                </p>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-black">
                  Powered by Industry Standards
                </h3>
                <p className="text-xl text-gray-600 max-w-xl">
                  Our audit framework is aligned with the Linux Foundation's Open Trustmark Initiative, ensuring the highest standards of AI ethics evaluation.
                </p>
                <Link 
                  href="https://trustmarkinitiative.ai/trustworthy-ai-framework/guiding-principles/"
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="inline-flex items-center space-x-2 text-[#FF0055] hover:text-[#FF0055]/80 transition-colors group text-xl mt-4"
                >
                  <span className="border-b-2 border-[#FF0055] pb-1">Learn more about the Trustmark Initiative</span>
                  <ChevronRight className="h-6 w-6 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Trustmark logo with hover effect */}
              <div className="group relative cursor-pointer mt-12">
                <Link 
                  href="https://trustmarkinitiative.ai/trustworthy-ai-framework/guiding-principles/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="relative bg-black p-12 border border-gray-800 rounded-xl transition-all duration-200 hover:border-[#FF0055]">
                    <div className="space-y-4 mb-8">
                      <h4 className="text-2xl font-bold text-white">Open Voice Trustmark</h4>
                      <p className="text-gray-300 text-lg">
                        An industry standard for ethical AI development and implementation
                      </p>
                    </div>
                    <Image
                      src={assets.trustmark.src}
                      alt={assets.trustmark.alt}
                      width={assets.trustmark.width}
                      height={assets.trustmark.height}
                      className="w-[300px] transition-transform duration-200 group-hover:scale-105"
                      priority
                    />
                  </div>
                </Link>
              </div>
            </div>

            {/* Framework Visualization */}
            <div className="relative lg:mt-24">
              <div className="relative bg-black p-12 rounded-xl border border-gray-800">
                <div className="space-y-4 mb-8">
                  <h4 className="text-2xl font-bold text-white">The Linux Foundation Trustmark Initiative</h4>
                  <p className="text-gray-300 text-lg">
                    A comprehensive approach to evaluating AI ethics across multiple dimensions
                  </p>
                </div>
                <Image
                  src={assets.framework.src}
                  alt={assets.framework.alt}
                  width={600}
                  height={450}
                  className="rounded-lg transition-all duration-300"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Final call-to-action */}
      <section className="py-24 lg:py-32 bg-gray-50 border-t border-gray-100">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start space-y-8 max-w-3xl">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-black">
              Start Your AI Ethics Journey Today
            </h2>
            <p className="text-xl text-gray-600">
              Join organizations committed to ethical AI development through our comprehensive interview-based assessment and quantitative scoring framework.
            </p>
            <Link href="https://www.house337.com/our-expertise#ai">
              <Button size="lg" className="bg-[#FF0055] hover:bg-[#FF0055]/90 text-white text-lg px-8 py-6 rounded-none">
                Schedule a Consultation
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
