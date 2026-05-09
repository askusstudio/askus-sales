"use client";

import { useState, useMemo } from "react";
import { useSales, Sale } from "./SalesProvider";
import { useAuth } from "@/components/AuthProvider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Download, FileText, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";

export function SalesTable() {
  const { sales, deleteSale } = useSales();
  const { user } = useAuth();
  
  const [filterUser, setFilterUser] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

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

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredSales.map(s => ({
      Date: s.date,
      Salesperson: s.created_by,
      Client: s.client_name,
      Product: s.product,
      Amount: s.amount,
      Status: s.status,
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
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-lg shadow-sm">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select value={filterUser} onValueChange={setFilterUser}>
            <SelectTrigger><SelectValue placeholder="Salesperson" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Salespersons</SelectItem>
              {salespeople.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
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
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportExcel}><Download className="mr-2 h-4 w-4" /> Excel</Button>
          <Button variant="outline" onClick={exportPDF}><FileText className="mr-2 h-4 w-4" /> PDF</Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border" id="sales-table">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Salesperson</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSales.map(sale => (
              <TableRow key={sale.id}>
                <TableCell>{format(new Date(sale.date), "dd MMM yyyy")}</TableCell>
                <TableCell className="font-medium">{sale.client_name}</TableCell>
                <TableCell className="capitalize">{sale.created_by}</TableCell>
                <TableCell>{sale.product}</TableCell>
                <TableCell>{formatCurrency(Number(sale.amount))}</TableCell>
                <TableCell>
                  <Badge variant={sale.status === "completed" ? "default" : sale.status === "pending" ? "secondary" : "destructive"}>
                    {sale.status} {sale.status === "pending" && `(${sale.pending_percent}%)`}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {(user?.role === "admin" || user?.username === sale.created_by) && (
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(sale.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filteredSales.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-slate-500">No sales records found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
