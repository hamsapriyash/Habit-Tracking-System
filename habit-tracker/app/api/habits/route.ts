import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId || userId === "undefined") {
      return NextResponse.json([])
    }

    const habits = await prisma.habit.findMany({
      where: { userId }
    })
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
    console.error("Error creating habit:", error)
    return NextResponse.json({ error: "Could not save habit", details: String(error) }, { status: 500 })
  }
}