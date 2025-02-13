import "./globals.css"
import { Inter } from "next/font/google"
import Link from "next/link"
import Image from "next/image"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { UserProfileMenu } from "@/components/user-profile-menu"
import { NavigationMenu } from "@/components/navigation-menu"
import { type ReactNode } from "react"
import { assets } from "@/config/assets"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "AI Ethics Audit Platform | House 337 | Responsible AI Development",
  description: "Comprehensive AI ethics evaluation platform based on Linux Foundation's Open Trustmark initiative. Expert assessment of AI systems for transparency, accountability, and ethical compliance.",
  keywords: [
    "AI ethics",
    "artificial intelligence ethics",
    "AI governance",
    "ethical AI",
    "responsible AI",
    "AI compliance",
    "AI transparency",
    "AI accountability",
    "AI risk assessment",
    "AI audit",
    "AI ethics framework",
    "ethical technology",
    "AI ethics certification",
    "AI ethics consulting",
    "AI ethics assessment",
    "trustworthy AI",
    "AI ethics guidelines",
    "AI ethics standards",
    "AI ethics best practices",
    "AI ethics compliance"
  ],
  authors: [{ name: "House 337" }],
  creator: "House 337",
  publisher: "House 337",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://aiethics.house337.com",
    site_name: "House 337 AI Ethics Audit Platform",
    title: "AI Ethics Audit Platform | Expert AI Ethics Assessment & Certification",
    description: "Industry-leading AI ethics evaluation platform. Ensure your AI systems meet ethical standards, build trust, and demonstrate responsible innovation.",
    images: [
      {
        url: `${assets.logo.src}`,
        width: 1200,
        height: 630,
        alt: "House 337 AI Ethics Audit Platform"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    site: "@house337",
    creator: "@house337",
    title: "AI Ethics Audit Platform | Expert AI Ethics Assessment",
    description: "Comprehensive AI ethics evaluation platform. Build trust through ethical AI development and certification.",
    images: [`${assets.logo.src}`]
  },
  alternates: {
    canonical: "https://aiethics.house337.com"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "verification_token",
  }
}

// Add JSON-LD structured data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "House 337 AI Ethics Audit Platform",
  "description": "Comprehensive AI ethics evaluation and certification platform based on industry standards",
  "provider": {
    "@type": "Organization",
    "name": "House 337",
    "url": "https://www.house337.com"
  },
  "areaServed": "Worldwide",
  "serviceType": "AI Ethics Audit",
  "offers": {
    "@type": "Offer",
    "description": "AI Ethics Assessment and Certification"
  }
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href={assets.favicon} sizes="any" />
        <link rel="icon" href={assets.icon} type="image/svg+xml" />
        <link rel="apple-touch-icon" href={assets.appleTouchIcon} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <meta name="theme-color" content="#FF0055" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      </head>
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
                    src={assets.logo.src}
                    alt={assets.logo.alt}
                    width={assets.logo.width}
                    height={assets.logo.height}
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
                        <Image 
                          src={assets.social.instagram.src}
                          alt={assets.social.instagram.alt}
                          width={assets.social.instagram.width}
                          height={assets.social.instagram.height}
                          className="invert"
                        />
                      </Link>
                      <Link href="https://uk.linkedin.com/company/house337" target="_blank" className="text-gray-400 hover:text-[#FF0055]">
                        <Image 
                          src={assets.social.linkedin.src}
                          alt={assets.social.linkedin.alt}
                          width={assets.social.linkedin.width}
                          height={assets.social.linkedin.height}
                          className="invert"
                        />
                      </Link>
                      <Link href="https://www.youtube.com/channel/UC1YXLKZ5U6ygNsM-aMjRUWg" target="_blank" className="text-gray-400 hover:text-[#FF0055]">
                        <Image 
                          src={assets.social.youtube.src}
                          alt={assets.social.youtube.alt}
                          width={assets.social.youtube.width}
                          height={assets.social.youtube.height}
                          className="invert"
                        />
                      </Link>
                    </div>
                  </div>

                </div>

                <div className="border-t border-gray-800 pt-8">
                  <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <Image 
                      src={assets.logo.src}
                      alt={assets.logo.alt}
                      width={assets.logo.width}
                      height={assets.logo.height}
                      className="invert"
                    />
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