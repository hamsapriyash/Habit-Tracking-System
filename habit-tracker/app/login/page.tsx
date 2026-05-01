"use client" // This is required to use 'useState' in Next.js
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  // 1. Define a state to track which form to show
  const [isLogin, setIsLogin] = useState(true)
  const router = useRouter()
  const handleAuth = () => {
    // In a real app, you'd verify credentials here.
    // For now, we redirect directly to the dashboard.
    router.push('/dashboard') 
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-sm">
        <CardHeader>
          {/* 2. Dynamically change text based on state */}
          <CardTitle className="text-2xl">
            {isLogin ? "Login" : "Create an Account"}
          </CardTitle>
          <CardDescription>
            {isLogin 
              ? "Enter your email to access your habit tracker." 
              : "Enter your details to start tracking your habits."}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {/* 3. Show 'Name' field only for Signup */}
          {!isLogin && (
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" type="text" placeholder="Hamsa Hiremath" required />
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          {/* 3. ADD the onClick handler to the Button */}
          <Button className="w-full" onClick={handleAuth}>
            {isLogin ? "Sign In" : "Sign Up"}
          </Button>
          
          {/* 4. Toggle the state when clicked */}
          <p className="text-sm text-muted-foreground text-center">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-primary underline hover:text-primary/80"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}