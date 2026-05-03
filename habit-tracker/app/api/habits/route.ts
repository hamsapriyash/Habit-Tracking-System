import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Simplified to just get all habits
    const habits = await prisma.habit.findMany()
    return NextResponse.json(habits)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { name, time, userId } = await req.json() // Now we expect a userId
    
    const habit = await prisma.habit.create({
      data: { 
        name, 
        time, 
        userId // This connects it to the specific user
      }
    })
    return NextResponse.json(habit)
  } catch (error) {
    return NextResponse.json({ error: "Could not save habit" }, { status: 500 })
  }
}