"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TrackingPage() {
  const [habits, setHabits] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState("Loading...");

  useEffect(() => {
    const now = new Date();
    setCurrentMonth(now.toLocaleDateString("en-US", { month: "long", year: "numeric" }));

    async function fetchHabits() {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId || userId === "undefined") {
          setLoading(false);
          return;
        }
        
        const response = await fetch(`/api/habits?userId=${userId}`)
        const data = await response.json()
        if (Array.isArray(data)) {
          setHabits(data)
        } else {
          setHabits([])
        }
      } catch (error) {
        console.error("Failed to load habits:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchHabits()
  }, []);

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="flex flex-col min-h-screen bg-white pb-10 w-full overflow-x-hidden">
      {/* Header Section */}
      <div className="p-4 md:p-8 flex items-center gap-4 bg-slate-50 border-b">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard"><ArrowLeft className="h-6 w-6" /></Link>
        </Button>
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800">Success Tracker</h1>
          <p className="text-xs font-bold text-purple-600 uppercase tracking-widest">{currentMonth}</p>
        </div>
      </div>

      <div className="p-4 md:p-8">
        <Card className="shadow-xl border-none ring-1 ring-slate-200 overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b">
            <CardTitle className="text-sm md:text-base font-bold text-slate-500">
              Getting 1% Better Each Day
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-0">
            {/* The scrollable container for the 31-day matrix */}
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                
                {/* Header Row */}
                <div className="grid grid-cols-[120px_repeat(31,40px)] md:grid-cols-[200px_repeat(31,1fr)] border-b bg-slate-50/30">
                  <div className="sticky left-0 z-10 bg-slate-50 p-4 text-xs font-black text-slate-400 border-r">
                    HABITS
                  </div>
                  {days.map(day => (
                    <div key={day} className="p-4 text-center text-[10px] md:text-xs font-bold text-slate-400">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Habit Rows: These show the "Exact Habits" from your dashboard */}
                {loading ? (
                  <div className="p-8 text-center text-slate-400">Loading habits...</div>
                ) : habits.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">No habits found. Add some from the dashboard!</div>
                ) : (
                  habits.map((habit) => (
                    <div key={habit.id} className="grid grid-cols-[120px_repeat(31,40px)] md:grid-cols-[200px_repeat(31,1fr)] items-center border-b hover:bg-slate-50/50 transition-colors">
                      {/* Sticky Column: The Habit Name */}
                      <div className="sticky left-0 z-10 bg-white p-4 text-sm font-black text-slate-700 border-r shadow-[4px_0_8px_-4px_rgba(0,0,0,0.1)]">
                        {habit.name}
                      </div>
                      {/* Checkbox Grid */}
                      {days.map(day => (
                        <div key={day} className="flex justify-center p-2">
                          <Checkbox className="h-5 w-5 rounded-md border-slate-300 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600" />
                        </div>
                      ))}
                    </div>
                  ))
                )}

              </div>
            </div>
          </CardContent>
        </Card>
        
        <p className="mt-6 text-center text-xs text-slate-400 font-medium px-4">
          Tip: Swipe left on the table to see all 31 days[cite: 2].
        </p>
      </div>
    </div>
  )
}