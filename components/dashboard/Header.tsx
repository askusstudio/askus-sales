"use client";

import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Image from "next/image";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-2 sm:top-4 z-30 mx-2 sm:mx-4 md:mx-8 mb-4 sm:mb-8 mt-2 sm:mt-4">
      <div className="bg-white/70 backdrop-blur-xl border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl sm:rounded-3xl flex h-14 sm:h-16 items-center justify-between px-3 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-3 font-heading font-extrabold text-[20px] sm:text-[28px] md:text-[32px] tracking-tight text-[#111827]">
          <div className="relative h-8 w-8 sm:h-10 sm:w-10 overflow-hidden rounded-full shadow-sm border-2 border-[#C6FF3B] shrink-0">
            <Image src="/site-logo.jpg" alt="Askus Logo" fill className="object-cover" />
          </div>
          <span className="truncate">Askus Tracker</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-tr from-[#6D5EF5] to-[#C6FF3B] p-[2px] shrink-0">
              <div className="h-full w-full rounded-full bg-white flex items-center justify-center">
                <span className="font-bold text-[11px] sm:text-[13px] text-[#111827] uppercase">{user?.username?.[0] || "U"}</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <p className="font-bold text-[15px] text-[#111827] capitalize leading-tight">{user?.username}</p>
              <p className="text-[13px] text-[#374151] capitalize font-medium">{user?.role}</p>
            </div>
          </div>
          <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
          <Button variant="ghost" size="sm" onClick={logout} className="text-[#374151] hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors font-semibold text-[13px] sm:text-[15px] px-2 sm:px-4 py-4 sm:py-5">
            <LogOut className="h-4 w-4 sm:h-5 sm:w-5 sm:mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
