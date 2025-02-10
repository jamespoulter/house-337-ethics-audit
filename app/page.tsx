import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, Shield, Scale, Heart, Brain, Users, FileCheck } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-b from-primary/5 to-background">
        <div className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20">
          <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-400 dark:from-blue-700" />
          <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600" />
        </div>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center space-y-8 text-center">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                AI Ethics Audit for Christian Organizations
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl dark:text-gray-400">
                Ensure your AI systems align with Christian values and ethical principles. Comprehensive auditing for responsible AI development and deployment.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/audits/new">
                <Button size="lg" className="shadow-lg">
                  Start Your Audit
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-card">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:gap-24">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Comprehensive AI Ethics Evaluation
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                Our audit framework combines technical assessment with Christian ethical principles to ensure your AI systems serve with integrity and compassion.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card className="relative overflow-hidden border-none shadow-md hover:shadow-xl transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Biblical Framework</h3>
                  <p className="text-muted-foreground">
                    Evaluate AI systems against core Christian values and biblical principles of ethics and morality.
                  </p>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden border-none shadow-md hover:shadow-xl transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Scale className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Ethical Assessment</h3>
                  <p className="text-muted-foreground">
                    Comprehensive evaluation of fairness, transparency, accountability, and privacy in AI systems.
                  </p>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden border-none shadow-md hover:shadow-xl transition-shadow lg:col-span-1 md:col-span-2">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Human Dignity</h3>
                  <p className="text-muted-foreground">
                    Ensure AI systems respect and uphold human dignity, created in God's image.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:gap-24">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Our Audit Process
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
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
                  description: "Gather feedback from users, developers, and church leaders",
                },
                {
                  icon: Scale,
                  title: "Ethics Assessment",
                  description: "Evaluate against Christian ethical principles and industry standards",
                },
                {
                  icon: FileCheck,
                  title: "Recommendations",
                  description: "Detailed report with actionable improvements and biblical guidance",
                },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center text-center space-y-4 p-6">
                  <div className="p-3 rounded-full bg-primary/10">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center space-y-8 text-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Start Your AI Ethics Journey Today
              </h2>
              <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-lg">
                Join leading Christian organizations in ensuring ethical AI development and deployment.
              </p>
            </div>
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="shadow-lg">
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

