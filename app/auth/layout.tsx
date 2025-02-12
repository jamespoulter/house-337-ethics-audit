import { Metadata } from "next"

interface AuthLayoutProps {
  children: React.ReactNode
  params: { slug: string }
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return children
}

export async function generateMetadata({ params }: AuthLayoutProps): Promise<Metadata> {
  const slug = params.slug || ''
  
  const titles: Record<string, string> = {
    login: "Sign In",
    register: "Create an Account",
  }

  const descriptions: Record<string, string> = {
    login: "Sign in to your House 337 AI Ethics Audit account",
    register: "Create a new account to get started with House 337 AI Ethics Audit",
  }

  return {
    title: {
      default: titles[slug] || "Authentication",
      template: "%s | House 337 AI Ethics Audit"
    },
    description: descriptions[slug] || "Authentication for House 337 AI Ethics Audit platform",
  }
} 