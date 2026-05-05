import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { email, password, username } = await req.json()

    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({ 
      where: { email } 
    })
    
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // 2. Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10)

    // 3. Create the user in MongoDB
    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      }
    })

    return NextResponse.json({ 
      message: "User created successfully",
      userId: newUser.id
    }, { status: 201 })
  } catch (error) {
    console.error("Signup Error:", error)
    return NextResponse.json({ error: "Signup failed" }, { status: 500 })
  }
}