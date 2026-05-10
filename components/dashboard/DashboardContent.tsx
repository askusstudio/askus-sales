"use client";

import { OverallStats, TargetCharts, MemberStats, Leaderboard, AnalyticsCharts } from "./DashboardWidgets";
import { SalesForm } from "./SalesForm";
import { SalesTable } from "./SalesTable";
import { useSales } from "./SalesProvider";
import { useAuth } from "@/components/AuthProvider";
import { Loader2, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

export function DashboardContent() {
  const { loading, targetAmount, setTargetAmount } = useSales();
  const { user } = useAuth();
  
  const [targetInput, setTargetInput] = useState(targetAmount.toString());
  const [isSavingTarget, setIsSavingTarget] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  const handleSaveTarget = async () => {
    setIsSavingTarget(true);
    try {
      await setTargetAmount(Number(targetInput));
      toast.success("Target updated successfully");
      setOpenSettings(false);
    } catch (err) {
      toast.error("Failed to update target");
    } finally {
      setIsSavingTarget(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-2">
        <h2 className="text-[22px] sm:text-[28px] font-heading font-extrabold text-[#111827] tracking-tight">Dashboard Overview</h2>
        {user?.role === "admin" && (
          <Dialog open={openSettings} onOpenChange={setOpenSettings}>
            <DialogTrigger>
              <div className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-[15px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-slate-200 bg-white shadow-sm hover:bg-slate-50 h-10 px-4">
                <Settings className="h-5 w-5 mr-2 text-[#6D5EF5]" />
                Edit Target
              </div>
            </DialogTrigger>
            <DialogContent className="mx-4 sm:mx-auto rounded-[20px]">
              <DialogHeader>
                <DialogTitle className="text-[22px] font-heading font-extrabold text-[#111827]">Edit Target Amount</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label className="text-[#374151] font-semibold text-[15px]">New Target Amount (₹)</Label>
                  <Input 
                    type="number" 
                    value={targetInput} 
                    onChange={(e) => setTargetInput(e.target.value)} 
                    className="h-12 text-[15px]"
                  />
                </div>
                <Button onClick={handleSaveTarget} disabled={isSavingTarget} className="w-full h-12 text-[15px] font-bold rounded-xl bg-[#6D5EF5] hover:bg-[#5848ed] text-white shadow-[0_4px_14px_0_rgba(109,94,245,0.39)]">
                  {isSavingTarget ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                  Save Target
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <OverallStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TargetCharts />
          <MemberStats />
        </div>
        <div className="space-y-6">
          <SalesForm />
          <Leaderboard />
        </div>
      </div>

      <div className="pt-4">
        <Tabs defaultValue="sales" className="w-full">
          <TabsList className="w-full sm:w-auto sm:max-w-md grid grid-cols-2 bg-white border border-slate-200 rounded-xl h-12">
            <TabsTrigger value="sales" className="data-[state=active]:bg-[#6D5EF5]/10 data-[state=active]:text-[#6D5EF5] text-[15px] font-semibold rounded-xl">Sales History</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-[#6D5EF5]/10 data-[state=active]:text-[#6D5EF5] text-[15px] font-semibold rounded-xl">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="sales" className="mt-6">
            <SalesTable />
          </TabsContent>
          <TabsContent value="analytics" className="mt-6">
            <AnalyticsCharts />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
