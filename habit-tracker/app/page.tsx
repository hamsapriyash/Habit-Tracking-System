import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      {/* Hero Section */}
      <div className="max-w-3xl space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Master Your Habits, Build Your Future
        </h1>
        <p className="text-xl text-muted-foreground">
        Tracking system designed for long-term improvement and consistency.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/login">Get Started</Link>
          </Button>
          <Button variant="outline" size="lg">Learn More</Button>
        </div>
      </div>
    </main>
  )
}