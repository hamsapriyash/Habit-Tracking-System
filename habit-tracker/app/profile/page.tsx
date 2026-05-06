"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, LogOut, User as UserIcon, Mail, Calendar, Flame, Lock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    async function fetchUser() {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId || userId === "undefined") {
          router.push("/login");
          return;
        }

        const response = await fetch(`/api/user?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    router.push("/login");
  };

  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, currentPassword, newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        setPasswordSuccess("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setShowPasswordModal(false), 2000);
      } else {
        setPasswordError(data.error || "Failed to update password");
      }
    } catch (error) {
      setPasswordError("Error connecting to server.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <span className="text-slate-400 font-bold">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white pb-10 w-full overflow-x-hidden">
      {/* Header Section */}
      <div className="p-4 md:p-8 flex items-center gap-4 bg-slate-50 border-b">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard"><ArrowLeft className="h-6 w-6" /></Link>
        </Button>
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800">Profile</h1>
        </div>
      </div>


      <div className="p-6 md:p-8 space-y-4 max-w-sm mx-auto w-full">
        {/* Profile Card */}
        <Card className="shadow-xl border-none ring-1 ring-slate-100 overflow-hidden bg-white rounded-2xl">
          <div className="h-24 bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md transform translate-y-8 border-4 border-white">
              <UserIcon className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <CardContent className="pt-12 pb-6 px-4 text-center">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              {user?.username || "Habit Tracker User"}
            </h2>
            <p className="text-xs font-bold text-slate-400 mt-1 flex items-center justify-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> {user?.email}
            </p>
          </CardContent>
        </Card>

        {/* Stats Section */}
        <div className="flex gap-4 w-full">
          <Card className="shadow-md border-none bg-white rounded-xl flex-1 flex flex-col items-center p-4 hover:shadow-lg transition-shadow">
            <Flame className="w-6 h-6 text-orange-500 mb-1" />
            <span className="text-2xl font-black text-slate-800">{user?._count?.habits || 0}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Active Habits</span>
          </Card>

          <Card className="shadow-md border-none bg-white rounded-xl flex-1 flex flex-col items-center p-4 hover:shadow-lg transition-shadow">
            <Calendar className="w-6 h-6 text-blue-500 mb-1" />
            <span className="text-xl font-black text-slate-800 mt-1">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "N/A"}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Joined</span>
          </Card>
        </div>


        <Button
          onClick={handleLogout}
          className="w-full h-12 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-base border border-red-100 shadow-sm transition-all"
          variant="outline"
        >
          <LogOut className="w-4 h-4 mr-2" /> Log Out
        </Button>
      </div>
    </div>

  )
}
