"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TrackingPage() {
  const habits = ["Sleep (7hrs+)", "Drink Water", "Exercise", "Coding Practice"]
  const days = Array.from({ length: 31 }, (_, i) => i + 1)

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" asChild>
          <Link href="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Link>
        </Button>
        <h1 className="text-3xl font-bold">Success Tracker - May 2026</h1>
      </div>

      <Card className="overflow-x-auto">
        <CardHeader>
          <CardTitle>Getting 1% Better Each Day</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="min-w-[800px]">
            {/* Header Row with Days */}
            <div className="grid grid-cols-[150px_repeat(31,1fr)] border-b pb-2 mb-2 font-bold text-center">
              <div>Habit/Rule</div>
              {days.map(day => <div key={day} className="text-xs">{day}</div>)}
            </div>

            {/* Habit Rows */}
            {habits.map((habit, index) => (
              <div key={index} className="grid grid-cols-[150px_repeat(31,1fr)] items-center border-b py-2 text-center hover:bg-muted/50">
                <div className="text-left font-medium text-sm">{habit}</div>
                {days.map(day => (
                  <div key={day} className="flex justify-center">
                    <Checkbox className="h-4 w-4" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}