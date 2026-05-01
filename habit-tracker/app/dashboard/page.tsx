"use client"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Flame, Quote } from "lucide-react"

export default function Dashboard() {
  // 1. State for the list of habits
  const [habits, setHabits] = useState([
    { id: 1, name: "Drink Water", streak: 5 }
  ])

  // 2. State for the input field text
  const [newHabitName, setNewHabitName] = useState("")

  // 3. Function to add a new habit
  const addHabit = () => {
    if (newHabitName.trim() === "") return // Don't add empty habits

    const newHabit = {
      id: Date.now(), // Unique ID based on time
      name: newHabitName,
      streak: 0
    }

    setHabits([...habits, newHabit]) // Add new habit to the list
    setNewHabitName("") // Clear the input box
  }
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* 1. Daily Affirmation Section (Motivational Engine) */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6 flex items-start gap-4">
          <Quote className="text-primary w-8 h-8 opacity-50" />
          <div>
            <p className="text-lg italic font-medium">"Your future is created by what you do today, not tomorrow."</p>
            <p className="text-sm text-muted-foreground mt-1">— Daily Motivation</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 2. Habit Tracking List */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">My Habits</h2>

            {/* 4. Connect Input and Button to State */}
            <div className="flex gap-2">
                <Button variant="outline" asChild>
      <Link href="/track">Track Success</Link>
    </Button>
            
              <Input 
                placeholder="New habit..." 
                className="w-40 md:w-64" 
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
              />
              <Button size="icon" onClick={addHabit}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* 5. Render the dynamic list */}
          {habits.map(habit => (
            <Card key={habit.id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-semibold text-lg">{habit.name}</p>
                <div className="flex items-center text-orange-500 text-sm font-bold">
                  <Flame className="w-4 h-4 mr-1" /> {habit.streak} Day Streak
                </div>
              </div>
              <Button variant="outline">Complete</Button>
            </Card>
          ))}
        </div>
          </div>

        {/* 3. Interactive Progress (Stats) */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Progress</CardTitle>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center border-2 border-dashed rounded-lg">
            {/* Charts resize automatically for mobile/tablet */}
            <p className="text-muted-foreground text-sm text-center">
              Interactive Chart Placeholder <br/> (Next.js Visualization)
            </p>
          </CardContent>
        </Card>
      </div>
  )
}