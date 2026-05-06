import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const monthStr = searchParams.get("month")
  const yearStr = searchParams.get("year")

  if (!userId || !monthStr || !yearStr) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
  }

  const month = parseInt(monthStr, 10)
  const year = parseInt(yearStr, 10)

  try {
    // Find all ticks for habits belonging to this user for the specified month and year
    const ticks = await prisma.tick.findMany({
      where: {
        month,
        year,
        habit: {
          userId
        }
      }
    })

    return NextResponse.json(ticks)
  } catch (error) {
    console.error("Failed to fetch ticks:", error)
    return NextResponse.json({ error: "Failed to fetch ticks" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { habitId, day, month, year, checked } = body

    if (!habitId || day === undefined || month === undefined || year === undefined || checked === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (checked) {
      // Create tick
      const tick = await prisma.tick.upsert({
        where: {
          habitId_day_month_year: {
            habitId,
            day,
            month,
            year
          }
        },
        update: {},
        create: {
          habitId,
          day,
          month,
          year
        }
      })
      return NextResponse.json(tick)
    } else {
      // Delete tick
      await prisma.tick.deleteMany({
        where: {
          habitId,
          day,
          month,
          year
        }
      })
      return NextResponse.json({ success: true })
    }
  } catch (error) {
    console.error("Failed to update tick:", error)
    return NextResponse.json({ error: "Failed to update tick" }, { status: 500 })
  }
}
