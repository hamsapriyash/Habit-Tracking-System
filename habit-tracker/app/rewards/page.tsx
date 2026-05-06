"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ArrowLeft, Gift, Award, TrendingUp, Quote } from "lucide-react"
import Link from "next/link"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from "recharts"

const MOTIVATIONAL_QUOTES = [
  "Success is the sum of small efforts, repeated day in and day out.",
  "Motivation is what gets you started. Habit is what keeps you going.",
  "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
  "The secret of your future is hidden in your daily routine.",
  "Small daily improvements over time lead to stunning results."
]

export default function RewardsPage() {
  const [weeklyData, setWeeklyData] = useState<{ day: string, ticks: number }[]>([])
  const [monthlyData, setMonthlyData] = useState<{ day: string, ticks: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [randomQuote, setRandomQuote] = useState("")

  useEffect(() => {
    setRandomQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)])

    async function fetchData() {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId || userId === "undefined") {
          setLoading(false);
          return;
        }

        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        // Check if we need previous month for the last 7 days
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 6); // 7 days inclusive
        const prevMonth = sevenDaysAgo.getMonth() + 1;
        const prevYear = sevenDaysAgo.getFullYear();

        // Fetch ticks
        let ticks: any[] = [];

        const resCurrent = await fetch(`/api/ticks?userId=${userId}&month=${currentMonth}&year=${currentYear}`);
        const dataCurrent = await resCurrent.json();
        if (Array.isArray(dataCurrent)) {
          ticks = [...ticks, ...dataCurrent];
        }

        if (prevMonth !== currentMonth) {
          const resPrev = await fetch(`/api/ticks?userId=${userId}&month=${prevMonth}&year=${prevYear}`);
          const dataPrev = await resPrev.json();
          if (Array.isArray(dataPrev)) {
            ticks = [...ticks, ...dataPrev];
          }
        }

        // Process Weekly Data (Last 7 days)
        const weekTicks = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date(now);
          d.setDate(now.getDate() - i);
          const day = d.getDate();
          const month = d.getMonth() + 1;
          const year = d.getFullYear();

          const dayTicks = ticks.filter(t => t.day === day && t.month === month && t.year === year).length;
          weekTicks.push({
            day: d.toLocaleDateString("en-US", { weekday: 'short' }),
            ticks: dayTicks
          });
        }
        setWeeklyData(weekTicks);

        // Process Monthly Data (1st to current day or end of month)
        const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
        const monthTicks = [];
        for (let i = 1; i <= daysInMonth; i++) {
          const dayTicks = ticks.filter(t => t.day === i && t.month === currentMonth && t.year === currentYear).length;
          monthTicks.push({
            day: i.toString(),
            ticks: dayTicks
          });
        }
        setMonthlyData(monthTicks);

      } catch (error) {
        console.error("Failed to fetch rewards data", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white pb-24 w-full overflow-x-hidden">
      {/* Header */}
      <div className="p-4 md:p-8 flex items-center gap-4 bg-slate-50 border-b">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard"><ArrowLeft className="h-6 w-6" /></Link>
        </Button>
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800">Reward</h1>
          <p className="text-xs font-bold text-purple-600 uppercase tracking-widest">Your Progress Analyzed</p>
        </div>
      </div>

      <div className="p-6 md:p-12 flex flex-col gap-12 max-w-4xl mx-auto w-full">
        {randomQuote && (
          <Card className="border-none shadow-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white overflow-hidden mt-[-1rem]">
            <CardContent className="p-6 md:p-8 flex items-center gap-6">
              <Quote className="h-10 w-10 md:h-12 md:w-12 text-white/20 shrink-0" />
              <div>
                <p className="text-lg md:text-xl font-medium italic mb-2">"{randomQuote}"</p>
                <p className="text-sm text-white/80 font-bold uppercase tracking-wider">Daily Motivation</p>
              </div>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="text-center text-slate-400 font-bold p-10 animate-pulse">Loading stats...</div>
        ) : (
          <>
            <Card className="border-none shadow-xl ring-1 ring-slate-100 overflow-hidden">
              <CardHeader className="bg-purple-50/50 border-b">
                <CardTitle className="text-lg md:text-xl font-bold text-slate-700 flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="text-purple-600" /> Weekly Activity
                  </div>
                  <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    {weeklyData.reduce((sum, item) => sum + item.ticks, 0)} Habits
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="w-full min-h-[250px]" style={{ minHeight: '250px', height: '250px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 'bold' }} />
                      <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 'bold' }} />
                      <Tooltip
                        cursor={{ fill: '#f8fafc' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="ticks" fill="#9333ea" radius={[4, 4, 0, 0]} name="Habits Completed" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl ring-1 ring-slate-100 overflow-hidden">
              <CardHeader className="bg-blue-50/50 border-b">
                <CardTitle className="text-lg md:text-xl font-bold text-slate-700 flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Award className="text-blue-600" /> Monthly Progress
                  </div>
                  <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    {monthlyData.reduce((sum, item) => sum + item.ticks, 0)} Habits
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="w-full min-h-[250px]" style={{ minHeight: '250px', height: '250px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} interval="preserveStartEnd" minTickGap={20} />
                      <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 'bold' }} />
                      <Tooltip
                        cursor={{ stroke: '#cbd5e1', strokeWidth: 2 }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Line type="monotone" dataKey="ticks" stroke="#3b82f6" strokeWidth={4} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#1d4ed8' }} name="Habits Completed" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
