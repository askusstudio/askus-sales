"use client";

import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Image from "next/image";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-4 z-30 mx-4 md:mx-8 mb-8 mt-4">
      <div className="bg-white/70 backdrop-blur-xl border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3 font-heading font-extrabold text-[32px] tracking-tight text-[#111827]">
          <div className="relative h-10 w-10 overflow-hidden rounded-[12px] shadow-sm">
            <Image src="/site-logo.jpg" alt="Askus Logo" fill className="object-cover" />
          </div>
          <span>Askus Tracker</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#6D5EF5] to-[#C6FF3B] p-[2px]">
              <div className="h-full w-full rounded-full bg-white flex items-center justify-center">
                <span className="font-bold text-[13px] text-[#111827] uppercase">{user?.username?.[0] || "U"}</span>
              </div>
            </div>
            <div className="text-sm hidden sm:block">
              <p className="font-bold text-[15px] text-[#111827] capitalize leading-tight">{user?.username}</p>
              <p className="text-[13px] text-[#374151] capitalize font-medium">{user?.role}</p>
            </div>
          </div>
          <div className="h-6 w-px bg-slate-200"></div>
          <Button variant="ghost" size="sm" onClick={logout} className="text-[#374151] hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors font-semibold text-[15px] px-4 py-5">
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
