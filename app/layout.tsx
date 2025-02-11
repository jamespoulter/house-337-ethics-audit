import "./globals.css"
import { Inter } from "next/font/google"
import Link from "next/link"
import Image from "next/image"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import type React from "react"
import { SupabaseAuthProvider } from '@/components/providers/supabase-auth-provider'

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "House 337 AI Ethics Audit",
  description: "Conduct comprehensive AI Ethics Audits aligned with industry standards and responsible AI principles",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SupabaseAuthProvider>
            <div className="min-h-screen flex flex-col bg-white">
              <header className="bg-white border-b border-gray-100">
                <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
                  <Link href="/" className="flex items-center space-x-2">
                    <Image 
                      src="/images/logo.jpg"
                      alt="House 337"
                      width={40}
                      height={40}
                    />
                    <span className="text-xl font-bold text-black">AI Ethics Audit</span>
                  </Link>
                  <div className="flex space-x-6">
                    <Link href="/dashboard" className="text-gray-600 hover:text-[#FF0055] transition-colors">
                      Dashboard
                    </Link>
                    <Link href="/audits" className="text-gray-600 hover:text-[#FF0055] transition-colors">
                      Audits
                    </Link>
                    <Link href="/reports" className="text-gray-600 hover:text-[#FF0055] transition-colors">
                      Reports
                    </Link>
                    <Link href="/settings" className="text-gray-600 hover:text-[#FF0055] transition-colors">
                      Settings
                    </Link>
                  </div>
                </nav>
              </header>
              <main className="flex-grow">{children}</main>
              <footer className="bg-black text-white py-12">
                <div className="container mx-auto px-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Contact Section */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold">Get in touch</h4>
                      <div className="space-y-2">
                        <Link href="/contact" className="block text-gray-400 hover:text-[#FF0055] transition-colors">
                          Contact Us
                        </Link>
                        <Link href="/careers" className="block text-gray-400 hover:text-[#FF0055] transition-colors">
                          Jobs
                        </Link>
                      </div>
                    </div>

                    {/* Legal Section */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold">Legal</h4>
                      <div className="space-y-2">
                        <Link href="/sustainability" className="block text-gray-400 hover:text-[#FF0055] transition-colors">
                          Sustainability
                        </Link>
                        <Link href="/ai-guidelines" className="block text-gray-400 hover:text-[#FF0055] transition-colors">
                          AI Ethical Guidelines
                        </Link>
                        <Link href="/cookie-policy" className="block text-gray-400 hover:text-[#FF0055] transition-colors">
                          Cookie policy
                        </Link>
                        <Link href="/privacy" className="block text-gray-400 hover:text-[#FF0055] transition-colors">
                          Privacy policy
                        </Link>
                        <Link href="/events-privacy" className="block text-gray-400 hover:text-[#FF0055] transition-colors">
                          Events Privacy Policy
                        </Link>
                        <Link href="/employees-privacy" className="block text-gray-400 hover:text-[#FF0055] transition-colors">
                          Employees & Applicants Privacy Policy
                        </Link>
                        <Link href="/modern-slavery" className="block text-gray-400 hover:text-[#FF0055] transition-colors">
                          Modern slavery statement
                        </Link>
                        <Link href="/terms" className="block text-gray-400 hover:text-[#FF0055] transition-colors">
                          Terms and conditions
                        </Link>
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold">Follow us</h4>
                      <div className="flex space-x-4">
                        <Link href="https://www.instagram.com/house337/" target="_blank" className="text-gray-400 hover:text-[#FF0055]">
                          <Image src="/images/instagram.svg" alt="Instagram" width={24} height={24} />
                        </Link>
                        <Link href="https://uk.linkedin.com/company/house337" target="_blank" className="text-gray-400 hover:text-[#FF0055]">
                          <Image src="/images/linkedin.svg" alt="LinkedIn" width={24} height={24} />
                        </Link>
                        <Link href="https://www.youtube.com/channel/UC1YXLKZ5U6ygNsM-aMjRUWg" target="_blank" className="text-gray-400 hover:text-[#FF0055]">
                          <Image src="/images/youtube.svg" alt="YouTube" width={24} height={24} />
                        </Link>
                      </div>
                    </div>

                    {/* Awards */}
                    <div className="space-y-4">
                      <div className="flex space-x-4">
                        <Image src="/images/cannes-lions.svg" alt="Cannes Lions Award" width={150} height={60} />
                        <Image src="/images/creative-circle.svg" alt="Creative Circle Award" width={100} height={100} />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-800 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                      <Image 
                        src="/images/House_Word_logo.png"
                        alt="House 337"
                        width={120}
                        height={36}
                        className="invert"
                      />
                      <p className="text-sm text-gray-400">
                        House 337 Limited, a company registered in England & Wales with registered number 14105998. 
                        Registered Office: 60 Great Portland Street, London W1W 7RT
                      </p>
                      <p className="text-sm text-gray-400">
                        © HOUSE337 2024
                      </p>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
            <Toaster />
          </SupabaseAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}