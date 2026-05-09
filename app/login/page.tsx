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
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .eq("password", password)
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
    <div className="flex items-center justify-center min-h-[100dvh] bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-0 bg-white">
        <CardHeader className="text-center space-y-2 pb-6">
          <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">Live Sales Tracker</CardTitle>
          <CardDescription className="text-slate-500 text-base">Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-slate-700">Username</Label>
              <Input 
                id="username" 
                placeholder="e.g. kb, shivani" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="h-11"
              />
            </div>
            <Button type="submit" className="w-full h-11 text-base font-medium" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
