"use client"
import { useState, useEffect} from "react"
import { Button } from "@/components/ui/button"
import { LayoutGrid, User, Flame, Plus } from "lucide-react"
import Link from "next/link"
interface Habit {
  id: string;
  name: string;
  time: string;
}


export default function FullStackDashboard() {
const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true)
  
    useEffect(() => {
    async function fetchHabits() {
      try {
        const response = await fetch("/api/habits")
        const data = await response.json()
        setHabits(data)
      } catch (error) {
        console.error("Failed to load habits:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchHabits()
  }, [])

  // 2. Add Habit logic
  const handleAddHabit = async () => {
    const name = prompt("Enter habit name:")
    if (!name) return

    const time = prompt("Enter time (e.g., 07:00 PM):", "Anytime")
    
    try {
      const response = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, time }),
      })

      if (response.ok) {
        const newHabit = await response.json()
        setHabits((prev) => [...prev, newHabit])
      }
    } catch (error) {
      alert("Error saving to database.")
    }
  };

  return (
    // The 'pb-24' ensures content isn't hidden behind the bottom nav on mobile
    <div className="flex flex-col min-h-screen bg-white pb-24 w-full overflow-x-hidden">
      
      {/* 1. Main Content Area */}
      <main className="flex-1 flex flex-col w-full">
        
        {/* Header: Uses responsive padding (p-6 on mobile, p-10 on tablet+) */}
        <header className="p-6 md:p-10 border-b flex flex-col items-center justify-center bg-slate-50/50 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-slate-800 tracking-tighter">
            May 1
          </h1>
          <h2 className="text-2xl md:text-4xl font-bold text-purple-600 mt-1">
            Friday
          </h2>
          
          <div className="mt-4 flex items-center bg-white border px-4 py-1.5 rounded-full shadow-sm">
            <Flame className="w-4 h-4 text-orange-500 mr-2" />
            <span className="font-bold text-sm md:text-base">
              {habits.length} Habits Active
            </span>
          </div>
        </header>

        {/* Habit List: Uses responsive padding[cite: 2] */}
        <div className="p-6 md:p-12 space-y-6 max-w-2xl mx-auto w-full">
  {/* 1. Check if we are still loading */}
  {loading ? (
    <div className="flex justify-center p-10">
      <span className="text-slate-400">Loading your habits...</span>
    </div>
  ) : habits && habits.length > 0 ? (
    /* 2. Only map if habits exists and has items */
    habits.map((habit) => (
      <div key={habit.id} className="flex flex-col border-b border-slate-100 pb-4">
        <span className="text-xl md:text-3xl font-bold text-slate-900">
          {habit.name}
        </span>
        <span className="text-xs text-gray-400 uppercase tracking-widest mt-1">
          {habit.time}
        </span>
      </div>
    ))
  ) : (
    /* 3. Show this if the database is empty */
    <p className="text-center text-slate-400 italic">No habits found. Click ADD to start!</p>
  )}
</div>
      </main>

      {/* 2. Bottom Navigation: Fixed at bottom for thumb-reach */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-t flex justify-around items-center py-3 px-4 shadow-2xl">
        
        {/* Track Link */}
        <Link href="/track" className="flex flex-col items-center gap-1 flex-1">
          <LayoutGrid className="w-6 h-6 text-purple-600" />
          <span className="text-[10px] font-black text-purple-600">TRACK</span>
        </Link>

        {/* Profile Link */}
        <Link href="/profile" className="flex flex-col items-center gap-1 flex-1">
          <User className="w-6 h-6 text-slate-400" />
          <span className="text-[10px] font-black text-slate-400">PROFILE</span>
        </Link>

        {/* Add Habit Button: Highlighted for primary action */}
        <button 
          onClick={handleAddHabit}
          className="flex flex-col items-center gap-1 flex-1 relative"
        >
          <div className="bg-purple-600 p-3 rounded-2xl -mt-10 shadow-xl border-4 border-white active:bg-purple-700 transition-colors">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <span className="text-[10px] font-black text-purple-600 mt-1"></span>
        </button>
      </nav>
    </div>
  );
}
