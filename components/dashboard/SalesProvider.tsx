"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import { Bell } from "lucide-react";

export type Sale = {
  id: string;
  created_by: string;
  client_name: string;
  client_phone: string;
  product: string;
  amount: number;
  date: string;
  payment_mode: string;
  status: "completed" | "pending" | "refunded";
  pending_percent: number;
  created_at: string;
};

interface SalesContextType {
  sales: Sale[];
  targetAmount: number;
  loading: boolean;
  setTargetAmount: (amount: number) => Promise<void>;
  addSale: (sale: Omit<Sale, "id" | "created_at">) => Promise<void>;
  updateSale: (id: string, sale: Partial<Sale>) => Promise<void>;
  deleteSale: (id: string) => Promise<void>;
}

const SalesContext = createContext<SalesContextType>({
  sales: [],
  targetAmount: 50000000,
  loading: true,
  setTargetAmount: async () => {},
  addSale: async () => {},
  updateSale: async () => {},
  deleteSale: async () => {},
});

export function SalesProvider({ children }: { children: React.ReactNode }) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [targetAmount, setTargetAmountState] = useState(50000000);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchData = useCallback(async () => {
    try {
      const [salesRes, settingsRes] = await Promise.all([
        supabase.from("sales").select("*").order("created_at", { ascending: false }),
        supabase.from("settings").select("*").eq("key", "target_amount").single()
      ]);

      if (salesRes.data) setSales(salesRes.data);
      if (settingsRes.data) setTargetAmountState(Number(settingsRes.data.value));
    } catch (err) {
      console.error("Error fetching data", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchData();

    // Subscribe to sales table
    const salesSub = supabase
      .channel("sales_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "sales" }, (payload) => {
        if (payload.eventType === "INSERT") {
          setSales((prev) => [payload.new as Sale, ...prev]);
          toast(`New sale added by ${payload.new.created_by}`, {
            icon: <Bell className="h-4 w-4" />
          });
        } else if (payload.eventType === "UPDATE") {
          setSales((prev) => prev.map((s) => (s.id === payload.new.id ? (payload.new as Sale) : s)));
          toast(`Sale updated by ${payload.new.created_by}`);
        } else if (payload.eventType === "DELETE") {
          setSales((prev) => prev.filter((s) => s.id !== payload.old.id));
          toast(`A sale was deleted`);
        }
      })
      .subscribe();

    // Subscribe to settings table
    const settingsSub = supabase
      .channel("settings_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "settings", filter: "key=eq.target_amount" }, (payload) => {
        if (payload.new && "value" in payload.new) {
          setTargetAmountState(Number(payload.new.value));
          toast("Target amount was updated");
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(salesSub);
      supabase.removeChannel(settingsSub);
    };
  }, [user, fetchData]);

  const setTargetAmount = async (amount: number) => {
    if (user?.role !== "admin") throw new Error("Unauthorized");
    const { error } = await supabase.from("settings").upsert({ key: "target_amount", value: amount.toString() });
    if (error) throw error;
  };

  const addSale = async (sale: Omit<Sale, "id" | "created_at">) => {
    const { error } = await supabase.from("sales").insert(sale);
    if (error) throw error;
  };

  const updateSale = async (id: string, updates: Partial<Sale>) => {
    const { error } = await supabase.from("sales").update(updates).eq("id", id);
    if (error) throw error;
  };

  const deleteSale = async (id: string) => {
    const { error } = await supabase.from("sales").delete().eq("id", id);
    if (error) throw error;
  };

  return (
    <SalesContext.Provider value={{ sales, targetAmount, loading, setTargetAmount, addSale, updateSale, deleteSale }}>
      {children}
    </SalesContext.Provider>
  );
}

export const useSales = () => useContext(SalesContext);
