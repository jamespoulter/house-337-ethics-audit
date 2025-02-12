import "./globals.css"
import { Inter } from "next/font/google"
import Link from "next/link"
import Image from "next/image"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { UserProfileMenu } from "@/components/user-profile-menu"
import { NavigationMenu } from "@/components/navigation-menu"
import type React from "react"

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
          <div className="min-h-screen flex flex-col bg-white">
            <header className="bg-black border-b border-gray-800">
              <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="flex items-center space-x-2">
                  <Image 
                    src="/images/House_Word_logo.png"
                    alt="House 337"
                    width={120}
                    height={36}
                  />
                </Link>
                <div className="flex items-center space-x-6">
                  <NavigationMenu />
                  <UserProfileMenu />
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
                      <Link href="https://www.house337.com/contact" className="block text-gray-400 hover:text-[#FF0055] transition-colors">
                        Contact Us
                      </Link>
                      <Link href="https://www.house337.com/jobs" className="block text-gray-400 hover:text-[#FF0055] transition-colors">
                        Jobs
                      </Link>
                    </div>
                  </div>

                  {/* Legal Section */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">Legal</h4>
                    <div className="space-y-2">
                      <Link href="https://www.house337.com/sustainability" className="block text-gray-400 hover:text-[#FF0055] transition-colors">
                        Sustainability
                      </Link>
                      <Link href="https://www.house337.com/ai-ethics" className="block text-gray-400 hover:text-[#FF0055] transition-colors">
                        AI Ethical Guidelines
                      </Link>
                      <Link href="https://www.house337.com/cookie-policy" className="block text-gray-400 hover:text-[#FF0055] transition-colors">
                        Cookie policy
                      </Link>
                      <Link href="https://www.house337.com/privacy" className="block text-gray-400 hover:text-[#FF0055] transition-colors">
                        Privacy policy
                      </Link>
                      <Link href="https://www.house337.com/events-privacy" className="block text-gray-400 hover:text-[#FF0055] transition-colors">
                        Events Privacy Policy
                      </Link>
                      <Link href="https://www.house337.com/employees-privacy" className="block text-gray-400 hover:text-[#FF0055] transition-colors">
                        Employees & Applicants Privacy Policy
                      </Link>
                      <Link href="https://www.house337.com/modern-slavery" className="block text-gray-400 hover:text-[#FF0055] transition-colors">
                        Modern slavery statement
                      </Link>
                      <Link href="https://www.house337.com/terms" className="block text-gray-400 hover:text-[#FF0055] transition-colors">
                        Terms and conditions
                      </Link>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">Follow us</h4>
                    <div className="flex space-x-4">
                      <Link href="https://www.instagram.com/house337/" target="_blank" className="text-gray-400 hover:text-[#FF0055]">
                        <Image src="/images/instagram.svg" alt="Instagram" width={24} height={24} className="invert" />
                      </Link>
                      <Link href="https://uk.linkedin.com/company/house337" target="_blank" className="text-gray-400 hover:text-[#FF0055]">
                        <Image src="/images/linkedin.svg" alt="LinkedIn" width={24} height={24} className="invert" />
                      </Link>
                      <Link href="https://www.youtube.com/channel/UC1YXLKZ5U6ygNsM-aMjRUWg" target="_blank" className="text-gray-400 hover:text-[#FF0055]">
                        <Image src="/images/youtube.svg" alt="YouTube" width={24} height={24} className="invert" />
                      </Link>
                    </div>
                  </div>

                </div>

                <div className="border-t border-gray-800 pt-8">
                  <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <Image 
                      src="/images/House_Word_logo.png"
                      alt="House 337"
                      width={120}
                      height={36}                    />
                    <div className="flex flex-col items-center md:items-end space-y-2">
                      <p className="text-sm text-gray-400 text-center md:text-right">
                        House 337 Limited, a company registered in England & Wales with registered number 14105998. 
                        Registered Office: 60 Great Portland Street, London W1W 7RT
                      </p>
                      <p className="text-sm text-gray-400">
                        © HOUSE337 2025
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </footer>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}