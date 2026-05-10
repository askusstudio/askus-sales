"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cleanUsername = username.replace(/\s+/g, '').toLowerCase();
      const cleanPassword = password.replace(/\s+/g, '').toLowerCase();

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("username", cleanUsername)
        .eq("password", cleanPassword)
        .single();

      if (error || !data) {
        toast.error("Invalid username or password");
        return;
      }

      login(data);
      toast.success(`Welcome back, ${data.name}!`);
    } catch (err) {
      toast.error("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[100dvh] bg-[#F5F7FB] p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#C6FF3B]/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#6D5EF5]/20 rounded-full blur-[120px] pointer-events-none" />
      
      <Card className="w-full max-w-md rounded-[24px] border border-white/60 bg-white/70 shadow-[0_4px_24px_rgb(0,0,0,0.02)] backdrop-blur-xl overflow-hidden relative z-10">
        <CardHeader className="text-center space-y-3 pb-8 pt-10">
          <CardTitle className="text-4xl font-heading font-extrabold tracking-tight text-[#17153B]">Askus Tracker</CardTitle>
          <CardDescription className="text-slate-500 font-medium text-base tracking-wide uppercase">Sign in to your dashboard</CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-10">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="username" className="text-[#17153B] font-semibold text-[15px] tracking-wide">Username</Label>
              <Input 
                id="username" 
                placeholder="e.g. kb, shivani" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                className="h-14 text-[15px] rounded-xl border-slate-200 bg-white/50 focus:bg-white transition-all duration-200"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="password" className="text-[#17153B] font-semibold text-[15px] tracking-wide">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="h-14 text-[15px] rounded-xl border-slate-200 bg-white/50 focus:bg-white transition-all duration-200"
              />
            </div>
            <Button type="submit" className="w-full h-14 text-[15px] font-bold rounded-xl bg-[#6D5EF5] hover:bg-[#5848ed] text-white shadow-[0_4px_14px_0_rgba(109,94,245,0.39)] transition-all duration-200 hover:-translate-y-0.5 mt-4" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Access Dashboard"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
