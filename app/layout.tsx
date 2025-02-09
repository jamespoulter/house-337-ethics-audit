import "./globals.css"
import { Inter } from "next/font/google"
import Link from "next/link"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <header className="bg-card border-b">
              <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold">
                  Ecclesiai AI Ethics Audit
                </Link>
                <div className="flex space-x-6">
                  <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                    Dashboard
                  </Link>
                  <Link href="/audits" className="text-muted-foreground hover:text-primary transition-colors">
                    Audits
                  </Link>
                  <Link href="/reports" className="text-muted-foreground hover:text-primary transition-colors">
                    Reports
                  </Link>
                  <Link href="/settings" className="text-muted-foreground hover:text-primary transition-colors">
                    Settings
                  </Link>
                </div>
              </nav>
            </header>
            <main className="flex-grow">{children}</main>
            <footer className="bg-card border-t">
              <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
                &copy; 2024 Ecclesiai. All rights reserved.
              </div>
            </footer>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}