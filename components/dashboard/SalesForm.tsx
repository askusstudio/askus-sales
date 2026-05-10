"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useSales } from "./SalesProvider";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, PlusCircle } from "lucide-react";
import { format } from "date-fns";

export function SalesForm() {
  const { user } = useAuth();
  const { addSales, loading: contextLoading } = useSales() as any; // Ignore type here temporarily to use real method name
  const { addSale } = useSales(); // actual method
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    created_by: user?.username || "",
    client_name: "",
    client_phone: "",
    product: "",
    amount: "",
    date: format(new Date(), "yyyy-MM-dd"),
    payment_mode: "",
    status: "",
    received_amount: "",
    remarks: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.payment_mode || !formData.status) {
      toast.error("Please select a payment mode and status");
      return;
    }
    setLoading(true);
    
    try {
      await addSale({
        created_by: formData.created_by,
        client_name: formData.client_name,
        client_phone: formData.client_phone,
        product: formData.product,
        amount: Number(formData.amount),
        date: formData.date,
        payment_mode: formData.payment_mode,
        status: formData.status as any,
        pending_percent: formData.status === "completed" ? 0 : formData.status === "pending" ? Math.round((1 - Number(formData.received_amount || 0) / Number(formData.amount || 1)) * 100) : 0,
        received_amount: formData.status === "completed" ? Number(formData.amount) : Number(formData.received_amount || 0),
        remarks: formData.remarks,
      });
      
      setFormData(prev => ({
        ...prev,
        client_name: "",
        client_phone: "",
        product: "",
        amount: "",
        payment_mode: "",
        status: "",
        received_amount: "",
        remarks: "",
      }));
      toast.success("Sale added successfully!");
    } catch (err) {
      toast.error("Failed to add sale");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (field: string) => (value: string | null) => {
    if (value) {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <Card className="rounded-[24px] border border-white/60 bg-white/70 shadow-[0_4px_24px_rgb(0,0,0,0.02)] backdrop-blur-xl overflow-hidden">
      <CardHeader className="pt-6 sm:pt-8 px-4 sm:px-8 pb-4 bg-gradient-to-b from-white/50 to-transparent">
        <CardTitle className="text-[18px] sm:text-[22px] font-heading font-extrabold text-[#111827] flex items-center">
          <div className="bg-[#C6FF3B] p-2 sm:p-2.5 rounded-xl mr-2 sm:mr-3 shadow-sm shrink-0">
            <PlusCircle className="h-5 w-5 sm:h-6 sm:w-6 text-[#111827]" />
          </div>
          Add New Sale
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-8 pb-6 sm:pb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {user?.role === "admin" && (
            <div className="space-y-2">
              <Label className="text-[#374151] font-semibold text-[15px]">Salesperson</Label>
              <Select value={formData.created_by} onValueChange={handleSelectChange("created_by")}>
                <SelectTrigger className="h-12 text-[15px]">
                  <SelectValue placeholder="Select salesperson" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kb">kb</SelectItem>
                  <SelectItem value="shivani">shivani</SelectItem>
                  <SelectItem value="anamika">anamika</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-[#374151] font-semibold text-[15px]">Client Name</Label>
              <Input required value={formData.client_name} onChange={e => setFormData(p => ({...p, client_name: e.target.value}))} className="h-12 text-[15px]" />
            </div>
            <div className="space-y-2">
              <Label className="text-[#374151] font-semibold text-[15px]">Client Phone</Label>
              <Input value={formData.client_phone} onChange={e => setFormData(p => ({...p, client_phone: e.target.value}))} className="h-12 text-[15px]" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-[#374151] font-semibold text-[15px]">Product / Service</Label>
              <Input required value={formData.product} onChange={e => setFormData(p => ({...p, product: e.target.value}))} className="h-12 text-[15px]" />
            </div>
            <div className="space-y-2">
              <Label className="text-[#374151] font-semibold text-[15px]">Amount (₹)</Label>
              <Input type="number" required min="0" value={formData.amount} onChange={e => setFormData(p => ({...p, amount: e.target.value}))} className="h-12 text-[15px]" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-[#374151] font-semibold text-[15px]">Date</Label>
              <Input type="date" required value={formData.date} onChange={e => setFormData(p => ({...p, date: e.target.value}))} className="h-12 text-[15px]" />
            </div>
            <div className="space-y-2">
              <Label className="text-[#374151] font-semibold text-[15px]">Payment Mode</Label>
              <Select value={formData.payment_mode} onValueChange={handleSelectChange("payment_mode")}>
                <SelectTrigger className="h-12 text-[15px]">
                  <SelectValue placeholder="Select Payment Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-[#374151] font-semibold text-[15px]">Status</Label>
              <Select value={formData.status} onValueChange={handleSelectChange("status")}>
                <SelectTrigger className="h-12 text-[15px]">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.status === "pending" && (
              <div className="space-y-2">
                <Label className="text-[#374151] font-semibold text-[15px]">Received Amount (₹)</Label>
                <Input type="number" min="0" max={formData.amount || "1000000000"} required value={formData.received_amount} onChange={e => setFormData(p => ({...p, received_amount: e.target.value}))} className="h-12 text-[15px]" />
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label className="text-[#374151] font-semibold text-[15px]">Remarks / Comments (Optional)</Label>
            <Input value={formData.remarks} onChange={e => setFormData(p => ({...p, remarks: e.target.value}))} placeholder="Any caption or comments..." className="h-12 text-[15px]" />
          </div>
          
          <Button type="submit" className="w-full h-12 text-base font-bold rounded-xl bg-[#6D5EF5] hover:bg-[#5848ed] text-white shadow-[0_4px_14px_0_rgba(109,94,245,0.39)] transition-all duration-200 hover:-translate-y-0.5 mt-6" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Add Sale Entry"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
