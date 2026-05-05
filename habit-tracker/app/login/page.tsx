"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const router = useRouter()

  // 1. Add state to capture user input
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleAuth = async () => {
    setLoading(true)
    setErrorMsg("")

    // Choose the correct endpoint based on state
    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup"

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      })

      const data = await response.json()

      if (response.ok) {
        // If login or signup success, save user ID and go to dashboard
        localStorage.setItem("userId", data.userId)
        router.push('/dashboard')
      } else {
        setErrorMsg(data.error || "Something went wrong")
      }
    } catch (error) {
      setErrorMsg("Please enter your email and password.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-slate-50">
      <Card className="w-full max-w-sm shadow-xl border-none">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-black text-slate-800">
            {isLogin ? "Welcome Back" : "Join Us"}
          </CardTitle>
          <CardDescription>
            {isLogin
              ? "Sign in to your habit tracker"
              : "Create an account to start tracking"}
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-600 text-sm font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
              {errorMsg}
            </div>
          )}
          {!isLogin && (
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="ABCD"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            className="w-full h-12 text-lg font-bold"
            style={{ backgroundColor: '#333', color: 'white' }}
            onClick={handleAuth}
            disabled={loading}
          >
            {loading ? "Processing..." : (isLogin ? "Sign In" : "Sign Up")}
          </Button>

          <p className="text-sm text-muted-foreground text-center">
            {isLogin ? "New here? " : "Already tracking? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#333] font-bold underline hover:text-black"
            >
              {isLogin ? "Create Account" : "Login Instead"}
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}