"use client";

import { useState, useMemo } from "react";
import { useSales, Sale } from "./SalesProvider";
import { useAuth } from "@/components/AuthProvider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Download, FileText, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";

export function SalesTable() {
  const { sales, deleteSale, updateSale } = useSales();
  const { user } = useAuth();
  
  const [filterUser, setFilterUser] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [editSale, setEditSale] = useState<Sale | null>(null);
  const [editData, setEditData] = useState({ received_amount: "", status: "", remarks: "" });

  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      if (filterUser !== "all" && sale.created_by !== filterUser) return false;
      if (filterStatus !== "all" && sale.status !== filterStatus) return false;
      if (dateFrom && new Date(sale.date) < new Date(dateFrom)) return false;
      if (dateTo && new Date(sale.date) > new Date(dateTo)) return false;
      return true;
    });
  }, [sales, filterUser, filterStatus, dateFrom, dateTo]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sale?")) return;
    try {
      await deleteSale(id);
    } catch (err) {
      toast.error("Failed to delete sale");
    }
  };

  const openEdit = (sale: Sale) => {
    setEditSale(sale);
    setEditData({
      received_amount: sale.received_amount?.toString() || "0",
      status: sale.status,
      remarks: sale.remarks || "",
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editSale) return;
    try {
      const finalReceived = editData.status === "completed" ? Number(editSale.amount) : Number(editData.received_amount);
      await updateSale(editSale.id, {
        status: editData.status as any,
        received_amount: finalReceived,
        remarks: editData.remarks,
      });
      setEditSale(null);
      toast.success("Sale updated successfully");
    } catch (err) {
      toast.error("Failed to update sale");
    }
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredSales.map(s => ({
      Date: s.date,
      Salesperson: s.created_by,
      Client: s.client_name,
      Product: s.product,
      Amount: s.amount,
      Status: s.status,
      "Received Amount": s.received_amount || 0,
      Remarks: s.remarks || "",
      "Payment Mode": s.payment_mode
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales");
    XLSX.writeFile(wb, "sales-report.xlsx");
  };

  const exportPDF = async () => {
    const tableElement = document.getElementById("sales-table");
    if (!tableElement) return;
    
    try {
      const canvas = await html2canvas(tableElement, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save("sales-report.pdf");
    } catch (err) {
      toast.error("Failed to export PDF");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);
  };

  const salespeople = Array.from(new Set(sales.map(s => s.created_by)));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 p-8 rounded-[24px] border border-white/60 bg-white/70 shadow-[0_4px_24px_rgb(0,0,0,0.02)] backdrop-blur-xl">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select value={filterUser} onValueChange={(val) => val && setFilterUser(val)}>
            <SelectTrigger><SelectValue placeholder="Salesperson" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Salespersons</SelectItem>
              {salespeople.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={(val) => val && setFilterStatus(val)}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
          <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} placeholder="From Date" />
          <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} placeholder="To Date" />
        </div>
        {user?.role === "admin" && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportExcel} className="rounded-xl border-slate-200 hover:bg-slate-50 h-11 text-[15px] font-semibold text-[#111827]"><Download className="mr-2 h-5 w-5 text-[#6D5EF5]" /> Excel</Button>
            <Button variant="outline" onClick={exportPDF} className="rounded-xl border-slate-200 hover:bg-slate-50 h-11 text-[15px] font-semibold text-[#111827]"><FileText className="mr-2 h-5 w-5 text-[#6D5EF5]" /> PDF</Button>
          </div>
        )}
      </div>

      <div className="rounded-[24px] border border-white/60 bg-white/70 shadow-[0_4px_24px_rgb(0,0,0,0.02)] backdrop-blur-xl overflow-hidden" id="sales-table">
        <Table>
          <TableHeader className="bg-slate-100/50">
            <TableRow className="hover:bg-transparent h-14">
              <TableHead className="font-heading font-semibold text-[#374151] uppercase tracking-wider text-[15px]">Date</TableHead>
              <TableHead className="font-heading font-semibold text-[#374151] uppercase tracking-wider text-[15px]">Client</TableHead>
              <TableHead className="font-heading font-semibold text-[#374151] uppercase tracking-wider text-[15px]">Salesperson</TableHead>
              <TableHead className="font-heading font-semibold text-[#374151] uppercase tracking-wider text-[15px]">Product / Remarks</TableHead>
              <TableHead className="font-heading font-semibold text-[#374151] uppercase tracking-wider text-[15px]">Total Amount</TableHead>
              <TableHead className="font-heading font-semibold text-[#374151] uppercase tracking-wider text-[15px]">Received / Status</TableHead>
              <TableHead className="font-heading font-semibold text-[#374151] uppercase tracking-wider text-[15px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSales.map(sale => {
              const received = Number(sale.received_amount) || 0;
              const total = Number(sale.amount);
              const percent = total > 0 ? ((received / total) * 100).toFixed(0) : 0;
              
              const isFullyPaid = sale.status === "completed" || received >= total;
              const canEdit = user?.role === "admin" || (user?.username === sale.created_by && !isFullyPaid);

              return (
                <TableRow key={sale.id} className="h-14 even:bg-slate-50/50 hover:bg-slate-50/80 transition-colors">
                  <TableCell className="text-[15px] font-medium text-[#111827]">{format(new Date(sale.date), "dd MMM yyyy")}</TableCell>
                  <TableCell className="font-semibold text-[15px] text-[#111827]">{sale.client_name}</TableCell>
                  <TableCell className="capitalize text-[15px] font-medium text-[#111827]">{sale.created_by}</TableCell>
                  <TableCell>
                    <div className="text-[15px] font-medium text-[#111827]">{sale.product}</div>
                    {sale.remarks && <div className="text-[13px] text-[#374151] mt-1 max-w-[200px] truncate" title={sale.remarks}>"{sale.remarks}"</div>}
                  </TableCell>
                  <TableCell className="text-[15px] font-semibold text-[#111827]">{formatCurrency(total)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col items-start gap-1.5">
                      <Badge className={`text-[13px] px-3 py-0.5 ${sale.status === "completed" ? "bg-[#C6FF3B] text-[#17153B] hover:bg-[#b0f224]" : sale.status === "pending" ? "bg-amber-100 text-amber-700 hover:bg-amber-200" : "bg-red-100 text-red-700 hover:bg-red-200"}`}>
                        {sale.status} {sale.status === "pending" && `(${percent}%)`}
                      </Badge>
                      {sale.status === "pending" && (
                        <span className="text-[13px] text-[#374151] font-medium">{formatCurrency(received)} Recv.</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {canEdit && (
                        <Button variant="ghost" size="sm" onClick={() => openEdit(sale)} className="text-[#6D5EF5] hover:text-[#5848ed] hover:bg-[#6D5EF5]/10 p-2 h-9 w-9 rounded-xl">
                          <Edit className="h-5 w-5" />
                        </Button>
                      )}
                      {(user?.role === "admin" || user?.username === sale.created_by) && (
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(sale.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 h-9 w-9 rounded-xl">
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {filteredSales.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-slate-500">No sales records found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editSale} onOpenChange={(open) => !open && setEditSale(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[22px] font-heading font-extrabold text-[#111827]">Edit Sale ({editSale?.client_name})</DialogTitle>
          </DialogHeader>
          {editSale && (
            <form onSubmit={handleEditSubmit} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Total Amount</Label>
                  <Input value={formatCurrency(Number(editSale.amount))} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={editData.status} onValueChange={(v) => v && setEditData(p => ({...p, status: v}))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {editData.status === "pending" && (
                <div className="space-y-2">
                  <Label>Received Amount (₹)</Label>
                  <Input 
                    type="number" 
                    min="0" 
                    max={editSale.amount}
                    required 
                    value={editData.received_amount} 
                    onChange={e => setEditData(p => ({...p, received_amount: e.target.value}))} 
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label>Remarks / Comments</Label>
                <Input 
                  value={editData.remarks} 
                  onChange={e => setEditData(p => ({...p, remarks: e.target.value}))} 
                  placeholder="Update caption or comments..." 
                />
              </div>
              
              <Button type="submit" className="w-full h-12 text-base font-bold rounded-xl bg-[#6D5EF5] hover:bg-[#5848ed] text-white shadow-[0_4px_14px_0_rgba(109,94,245,0.39)] transition-all duration-200 mt-4">Save Changes</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
