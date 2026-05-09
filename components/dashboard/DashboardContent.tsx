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
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard Overview</h2>
        {user?.role === "admin" && (
          <Dialog open={openSettings} onOpenChange={setOpenSettings}>
            <DialogTrigger>
              <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 px-3">
                <Settings className="h-4 w-4 mr-2" />
                Edit Target
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Target Amount</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>New Target Amount (₹)</Label>
                  <Input 
                    type="number" 
                    value={targetInput} 
                    onChange={(e) => setTargetInput(e.target.value)} 
                  />
                </div>
                <Button onClick={handleSaveTarget} disabled={isSavingTarget} className="w-full">
                  {isSavingTarget ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
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
          <TabsList className="w-full max-w-md grid grid-cols-2 bg-white border border-slate-200">
            <TabsTrigger value="sales" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Sales History</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="sales" className="mt-4">
            <SalesTable />
          </TabsContent>
          <TabsContent value="analytics" className="mt-4">
            <AnalyticsCharts />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
