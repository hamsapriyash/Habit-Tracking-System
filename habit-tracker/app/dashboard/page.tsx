"use client"
import { useState, useEffect} from "react"
import { Button } from "@/components/ui/button"
import { LayoutGrid, User, Flame, Plus, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
interface Habit {
  id: string;
  name: string;
  time: string;
}


export default function FullStackDashboard() {
const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true)
  const [showAddCard, setShowAddCard] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitTime, setNewHabitTime] = useState("");
  const [newHabitAmPm, setNewHabitAmPm] = useState("AM");
  const [editHabitId, setEditHabitId] = useState<string | null>(null);
  
    useEffect(() => {
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
          console.error("Failed to fetch habits, got non-array:", data)
          setHabits([])
        }
      } catch (error) {
        console.error("Failed to load habits:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchHabits()
  }, [])

  const submitHabit = async () => {
    if (!newHabitName) return;
    
    let finalTime = "Anytime";
    if (newHabitTime) {
      // Just combine the user's typed time with the AM/PM dropdown
      finalTime = `${newHabitTime} ${newHabitAmPm}`;
    }
    
    try {
      const userId = localStorage.getItem("userId");
      if (!userId || userId === "undefined") {
        alert("Please log in to add a habit");
        return;
      }

      const method = editHabitId ? "PUT" : "POST";
      const url = editHabitId ? `/api/habits/${editHabitId}` : "/api/habits";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newHabitName, time: finalTime, userId }),
      })

      if (response.ok) {
        const savedHabit = await response.json()
        if (editHabitId) {
          setHabits((prev) => prev.map((h) => (h.id === editHabitId ? savedHabit : h)));
        } else {
          setHabits((prev) => Array.isArray(prev) ? [...prev, savedHabit] : [savedHabit])
        }
        setShowAddCard(false);
        setNewHabitName("");
        setNewHabitTime("");
        setEditHabitId(null);
      } else {
        const errData = await response.json().catch(() => null);
        console.error("API Error:", errData);
        alert(`Failed to create habit: ${errData?.error || response.statusText}`);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      alert("Error saving to database.")
    }
  };

  const deleteHabit = async (id: string) => {
    if (!confirm("Are you sure you want to delete this habit?")) return;
    try {
      const response = await fetch(`/api/habits/${id}`, { method: "DELETE" });
      if (response.ok) {
        setHabits((prev) => prev.filter((h) => h.id !== id));
      } else {
        alert("Failed to delete habit");
      }
    } catch (error) {
      alert("Error deleting habit");
    }
  };

  const openEditHabit = (habit: Habit) => {
    setEditHabitId(habit.id);
    setNewHabitName(habit.name);
    
    // Parse time (e.g. "07:00 AM")
    if (habit.time && habit.time !== "Anytime") {
      const parts = habit.time.split(" ");
      setNewHabitTime(parts[0] || "");
      setNewHabitAmPm(parts[1] || "AM");
    } else {
      setNewHabitTime("");
      setNewHabitAmPm("AM");
    }
    
    setShowAddCard(true);
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
      <div key={habit.id} className="flex flex-col border-b border-slate-100 pb-4 relative group">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <span className="text-xl md:text-3xl font-bold text-slate-900">
              {habit.name}
            </span>
            <span className="text-xs text-gray-400 uppercase tracking-widest mt-1">
              {habit.time}
            </span>
          </div>
          <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => openEditHabit(habit)} className="p-2 text-slate-400 hover:text-purple-600 bg-slate-50 hover:bg-purple-50 rounded-full transition-colors">
              <Pencil className="w-4 h-4" />
            </button>
            <button onClick={() => deleteHabit(habit.id)} className="p-2 text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 rounded-full transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    ))
  ) : (
    /* 3. Show this if the database is empty */
    <p className="text-center text-slate-400 italic">No habits found. Click ADD to start!</p>
  )}
</div>
      </main>

      {/* Add Habit Modal Card */}
      {showAddCard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] px-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-sm flex flex-col gap-4 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-slate-800">{editHabitId ? "Edit Habit" : "Add New Habit"}</h3>
            
            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-slate-500">Habit Name</label>
              <input 
                type="text" 
                placeholder="e.g., Drink Water"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                autoFocus
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-slate-500">Time (Optional)</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="e.g., 07:00"
                  value={newHabitTime}
                  onChange={(e) => setNewHabitTime(e.target.value)}
                  className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 flex-1"
                />
                <select 
                  value={newHabitAmPm}
                  onChange={(e) => setNewHabitAmPm(e.target.value)}
                  className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-2">
              <Button variant="ghost" onClick={() => { setShowAddCard(false); setEditHabitId(null); setNewHabitName(""); setNewHabitTime(""); }}>Cancel</Button>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={submitHabit}>
                {editHabitId ? "Save Changes" : "Add Habit"}
              </Button>
            </div>
          </div>
        </div>
      )}

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
          onClick={() => setShowAddCard(true)}
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
