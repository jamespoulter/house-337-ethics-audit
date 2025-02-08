import "@/styles/globals.css"
import { Inter } from "next/font/google"
import Link from "next/link"
import { Toaster } from "@/components/ui/toaster"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Ecclesiai AI Ethics Audit",
  description: "Conduct AI Ethics Audits aligned with Christian values and responsible AI principles",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-gray-100">
        <div className="min-h-screen flex flex-col">
          <header className="bg-white shadow-sm">
            <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold">
                Ecclesiai AI Ethics Audit
              </Link>
              <div className="flex space-x-4">
                <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
                  Dashboard
                </Link>
                <Link href="/audits" className="text-blue-600 hover:text-blue-800">
                  Audits
                </Link>
                <Link href="/reports" className="text-blue-600 hover:text-blue-800">
                  Reports
                </Link>
                <Link href="/settings" className="text-blue-600 hover:text-blue-800">
                  Settings
                </Link>
              </div>
            </nav>
          </header>
          <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
          <footer className="bg-white border-t">
            <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-600">
              &copy; 2023 Ecclesiai. All rights reserved.
            </div>
          </footer>
        </div>
        <Toaster />
      </body>
    </html>
  )
}



import './globals.css'