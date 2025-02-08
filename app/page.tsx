import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Ecclesiai AI Ethics Audit</h1>
      <p className="text-xl mb-8">
        Conduct AI Ethics Audits aligned with Christian values and responsible AI principles
      </p>
      <Button asChild size="lg">
        <Link href="/dashboard">Go to Dashboard</Link>
      </Button>
    </div>
  )
}

