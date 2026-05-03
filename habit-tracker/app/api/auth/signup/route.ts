import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { email, password, username } = await req.json()

    // This line will stop showing an error after 'prisma generate'
    const existingUser = await prisma.user.findUnique({ where: { email } })
    
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      }
    })

    return NextResponse.json({ message: "User created" }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Signup failed" }, { status: 500 })
  }
}