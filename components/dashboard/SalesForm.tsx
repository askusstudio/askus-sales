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
    payment_mode: "bank_transfer",
    status: "completed",
    pending_percent: "0",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        pending_percent: formData.status === "pending" ? Number(formData.pending_percent) : 0,
      });
      
      setFormData(prev => ({
        ...prev,
        client_name: "",
        client_phone: "",
        product: "",
        amount: "",
      }));
      toast.success("Sale added successfully!");
    } catch (err) {
      toast.error("Failed to add sale");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (field: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="bg-white border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
          <PlusCircle className="mr-2 h-5 w-5 text-indigo-500" />
          Add New Sale
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {user?.role === "admin" && (
            <div className="space-y-2">
              <Label>Salesperson</Label>
              <Select value={formData.created_by} onValueChange={handleSelectChange("created_by")}>
                <SelectTrigger>
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
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Client Name</Label>
              <Input required value={formData.client_name} onChange={e => setFormData(p => ({...p, client_name: e.target.value}))} />
            </div>
            <div className="space-y-2">
              <Label>Client Phone</Label>
              <Input value={formData.client_phone} onChange={e => setFormData(p => ({...p, client_phone: e.target.value}))} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Product / Service</Label>
              <Input required value={formData.product} onChange={e => setFormData(p => ({...p, product: e.target.value}))} />
            </div>
            <div className="space-y-2">
              <Label>Amount (₹)</Label>
              <Input type="number" required min="0" value={formData.amount} onChange={e => setFormData(p => ({...p, amount: e.target.value}))} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" required value={formData.date} onChange={e => setFormData(p => ({...p, date: e.target.value}))} />
            </div>
            <div className="space-y-2">
              <Label>Payment Mode</Label>
              <Select value={formData.payment_mode} onValueChange={handleSelectChange("payment_mode")}>
                <SelectTrigger>
                  <SelectValue />
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
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={handleSelectChange("status")}>
                <SelectTrigger>
                  <SelectValue />
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
                <Label>Pending Percent (%)</Label>
                <Input type="number" min="1" max="100" required value={formData.pending_percent} onChange={e => setFormData(p => ({...p, pending_percent: e.target.value}))} />
              </div>
            )}
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Add Sale Entry"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
