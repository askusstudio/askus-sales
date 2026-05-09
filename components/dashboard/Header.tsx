"use client";

import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard } from "lucide-react";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-white/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-900">
          <LayoutDashboard className="h-6 w-6 text-indigo-600" />
          <span>Live Sales Tracker</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="text-slate-500">Logged in as </span>
            <span className="font-medium text-slate-900">{user?.name}</span>
            <span className="ml-2 inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-800 capitalize">
              {user?.role}
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={logout} className="text-slate-600 hover:text-slate-900">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
