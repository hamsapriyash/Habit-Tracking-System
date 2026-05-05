import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.habit.delete({
      where: { id }
    })
    return NextResponse.json({ message: "Habit deleted" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting habit:", error)
    return NextResponse.json({ error: "Could not delete habit" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { name, time } = await req.json()
    
    const habit = await prisma.habit.update({
      where: { id },
      data: { name, time }
    })
    return NextResponse.json(habit, { status: 200 })
  } catch (error) {
    console.error("Error updating habit:", error)
    return NextResponse.json({ error: "Could not update habit" }, { status: 500 })
  }
}
