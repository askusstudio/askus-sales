"use client";

import { useSales } from "./SalesProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Legend } from "recharts";
import { format } from "date-fns";
import { Trophy, TrendingUp, IndianRupee, Target } from "lucide-react";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const cardStyles = "rounded-[24px] border border-white/60 bg-white/70 shadow-[0_4px_24px_rgb(0,0,0,0.02)] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgb(0,0,0,0.05)] transition-all duration-300 backdrop-blur-xl relative overflow-hidden";

export function OverallStats() {
  const { sales, targetAmount } = useSales();
  
  const completedSales = sales.filter(s => s.status === "completed" || s.status === "pending");
  const refundedSales = sales.filter(s => s.status === "refunded");

  const totalRevenue = completedSales.reduce((acc, s) => acc + Number(s.amount), 0);
  const refundedTotal = refundedSales.reduce((acc, s) => acc + Number(s.amount), 0);
  const adjustedRevenue = totalRevenue - refundedTotal;
  const averageSale = completedSales.length > 0 ? totalRevenue / completedSales.length : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
      <Card className={cardStyles}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C6FF3B]/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
        <CardContent className="p-5 sm:p-8 relative z-10">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-5">
            <div className="bg-[#17153B] text-[#C6FF3B] p-2 sm:p-2.5 rounded-xl sm:rounded-2xl shadow-sm shrink-0">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <h3 className="text-[12px] sm:text-[15px] font-semibold tracking-wide text-[#374151] uppercase">Total Revenue</h3>
          </div>
          <div className="text-[18px] sm:text-[28px] font-heading font-extrabold text-[#111827] tracking-tight">{formatCurrency(totalRevenue)}</div>
          <p className="text-[12px] sm:text-[15px] font-medium text-[#374151] mt-1 sm:mt-2">{completedSales.length} total sales</p>
        </CardContent>
      </Card>
      
      <Card className={cardStyles}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#6D5EF5]/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
        <CardContent className="p-5 sm:p-8 relative z-10">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-5">
            <div className="bg-[#6D5EF5]/10 text-[#6D5EF5] p-2 sm:p-2.5 rounded-xl sm:rounded-2xl shadow-sm shrink-0">
              <Target className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <h3 className="text-[12px] sm:text-[15px] font-semibold tracking-wide text-[#374151] uppercase">Adjusted Revenue</h3>
          </div>
          <div className="text-[18px] sm:text-[28px] font-heading font-extrabold text-[#111827] tracking-tight">{formatCurrency(adjustedRevenue)}</div>
          <p className="text-[12px] sm:text-[15px] font-medium text-[#374151] mt-1 sm:mt-2">Minus refunds</p>
        </CardContent>
      </Card>

      <Card className={cardStyles}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
        <CardContent className="p-5 sm:p-8 relative z-10">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-5">
            <div className="bg-amber-100 text-amber-600 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl shadow-sm shrink-0">
              <IndianRupee className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <h3 className="text-[12px] sm:text-[15px] font-semibold tracking-wide text-[#374151] uppercase">Avg. Per Sale</h3>
          </div>
          <div className="text-[18px] sm:text-[28px] font-heading font-extrabold text-[#111827] tracking-tight">{formatCurrency(averageSale)}</div>
          <p className="text-[12px] sm:text-[15px] font-medium text-[#374151] mt-1 sm:mt-2">Completed sales</p>
        </CardContent>
      </Card>

      <Card className={`${cardStyles} bg-gradient-to-br from-[#17153B] to-[#25225a] border-none text-white shadow-xl hover:shadow-[#6D5EF5]/20`}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>
        <CardContent className="p-5 sm:p-8 relative z-10">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-5">
            <div className="bg-[#C6FF3B] text-[#17153B] p-2 sm:p-2.5 rounded-xl sm:rounded-2xl shadow-lg shrink-0">
              <Target className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <h3 className="text-[12px] sm:text-[15px] font-semibold tracking-wide text-slate-300 uppercase">Target</h3>
          </div>
          <div className="text-[18px] sm:text-[28px] font-heading font-extrabold text-white tracking-tight">
            {((adjustedRevenue / targetAmount) * 100).toFixed(1)}%
          </div>
          <p className="text-[12px] sm:text-[15px] font-medium text-[#C6FF3B] mt-1 sm:mt-2">Of {formatCurrency(targetAmount)}</p>
          <p className="text-[10px] sm:text-[13px] text-slate-400 mt-1 sm:mt-2 font-bold uppercase tracking-widest">Due 31 Dec 2026</p>
        </CardContent>
      </Card>
    </div>
  );
}

export function TargetCharts() {
  const { sales, targetAmount } = useSales();
  
  const totalRevenue = sales
    .filter(s => s.status !== "refunded")
    .reduce((acc, s) => acc + Number(s.amount), 0);
  
  const remaining = Math.max(targetAmount - totalRevenue, 0);
  
  const data = [
    { name: "Achieved", value: totalRevenue, color: "#6D5EF5" },
    { name: "Remaining", value: remaining, color: "#F1F5F9" }
  ];

  return (
    <Card className={cardStyles}>
      <CardHeader className="pb-4 pt-8 px-8">
        <CardTitle className="text-[22px] font-heading font-extrabold text-[#111827]">Target Overview</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center items-center h-[280px]">
        <div className="w-full h-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius="70%"
                outerRadius="95%"
                paddingAngle={4}
                dataKey="value"
                stroke="none"
                cornerRadius={12}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip formatter={(value: any) => formatCurrency(Number(value))} cursor={false} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[28px] font-heading font-extrabold text-[#111827] tracking-tight">
              {((totalRevenue / targetAmount) * 100).toFixed(1)}%
            </span>
            <span className="text-[15px] font-semibold tracking-wide text-[#374151] uppercase mt-2">Achieved</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function MemberStats() {
  const { sales } = useSales();
  
  const validSales = sales.filter(s => s.status !== "refunded");
  const totalRevenue = validSales.reduce((acc, s) => acc + Number(s.amount), 0);
  
  const members = Array.from(new Set(sales.map(s => s.created_by)));
  
  const memberData = members.map(member => {
    const memberSales = validSales.filter(s => s.created_by === member);
    const revenue = memberSales.reduce((acc, s) => acc + Number(s.amount), 0);
    const percentage = totalRevenue > 0 ? (revenue / totalRevenue) * 100 : 0;
    return { member, revenue, percentage, count: memberSales.length };
  });

  const colors = ["#C6FF3B", "#6D5EF5", "#00D2FF", "#FF3B8A", "#17153B"];

  return (
    <Card className={cardStyles}>
      <CardHeader className="pb-4 pt-8 px-8">
        <CardTitle className="text-[22px] font-heading font-extrabold text-[#111827]">Member Contributions</CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-8 pb-6 sm:pb-8 pt-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-8">
          {memberData.map((data, index) => (
            <div key={data.member} className="flex flex-col items-center group">
              <div className="w-20 h-20 sm:w-28 sm:h-28 relative mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-105">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[{ value: data.revenue }, { value: totalRevenue - data.revenue }]}
                      innerRadius="75%"
                      outerRadius="100%"
                      dataKey="value"
                      stroke="none"
                      cornerRadius={12}
                    >
                      <Cell fill={colors[index % colors.length]} />
                      <Cell fill="#f1f5f9" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-[13px] sm:text-[15px] font-bold text-[#111827]">{data.percentage.toFixed(0)}%</span>
                </div>
              </div>
              <div className="text-center">
                <h4 className="font-heading font-extrabold text-[16px] sm:text-[20px] text-[#111827] capitalize">{data.member}</h4>
                <p className="text-[11px] sm:text-[13px] font-semibold text-[#374151] mb-1 sm:mb-2 tracking-wide uppercase">{data.count} sales</p>
                <p className="text-[12px] sm:text-[15px] font-bold text-[#6D5EF5] bg-[#6D5EF5]/10 px-2 sm:px-4 py-1 sm:py-1.5 rounded-full">{formatCurrency(data.revenue)}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function Leaderboard() {
  const { sales } = useSales();
  
  const validSales = sales.filter(s => s.status !== "refunded");
  const members = Array.from(new Set(sales.map(s => s.created_by)));
  
  const memberData = members.map(member => {
    const memberSales = validSales.filter(s => s.created_by === member);
    const revenue = memberSales.reduce((acc, s) => acc + Number(s.amount), 0);
    return { member, revenue, count: memberSales.length };
  }).sort((a, b) => b.revenue - a.revenue);

  return (
    <Card className={cardStyles}>
      <CardHeader className="flex flex-row items-center space-x-4 pt-8 px-8 pb-4">
        <div className="bg-amber-100 p-2.5 rounded-xl text-amber-500">
          <Trophy className="h-6 w-6" />
        </div>
        <CardTitle className="text-[22px] font-heading font-extrabold text-[#111827]">Leaderboard</CardTitle>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <div className="space-y-4">
          {memberData.slice(0, 3).map((data, index) => (
            <div key={data.member} className="group flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-base shadow-sm
                  ${index === 0 ? "bg-[#C6FF3B] text-[#17153B]" : 
                    index === 1 ? "bg-slate-200 text-slate-700" : 
                    index === 2 ? "bg-orange-100 text-orange-700" : "bg-blue-50 text-blue-700"}
                `}>
                  #{index + 1}
                </div>
                <div>
                  <p className="font-heading font-extrabold text-[#111827] capitalize text-[20px] leading-tight">{data.member}</p>
                  <p className="text-[13px] font-semibold text-[#374151] uppercase tracking-wide mt-1.5">{data.count} deals closed</p>
                </div>
              </div>
              <div className="font-bold text-[20px] text-[#6D5EF5]">{formatCurrency(data.revenue)}</div>
            </div>
          ))}
          {memberData.length === 0 && (
            <div className="text-center text-slate-500 py-6 font-medium">No sales data yet. Time to close!</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function AnalyticsCharts() {
  const { sales } = useSales();
  const validSales = sales.filter(s => s.status !== "refunded");

  // Monthly Data
  const monthlyDataMap = validSales.reduce((acc, sale) => {
    const month = format(new Date(sale.date), "MMM yyyy");
    acc[month] = (acc[month] || 0) + Number(sale.amount);
    return acc;
  }, {} as Record<string, number>);

  const monthlyData = Object.entries(monthlyDataMap)
    .map(([month, revenue]) => ({ month, revenue }))
    .reverse();

  // Product Data
  const productDataMap = validSales.reduce((acc, sale) => {
    acc[sale.product] = (acc[sale.product] || 0) + Number(sale.amount);
    return acc;
  }, {} as Record<string, number>);

  const productData = Object.entries(productDataMap)
    .map(([product, revenue]) => ({ product, revenue }))
    .sort((a, b) => b.revenue - a.revenue);

  return (
    <div className="grid grid-cols-1 gap-6 sm:gap-8">
      <Card className={cardStyles}>
        <CardHeader className="pt-8 px-8 pb-4">
          <CardTitle className="text-[22px] font-heading font-extrabold text-[#111827]">Monthly Revenue</CardTitle>
        </CardHeader>
        <CardContent className="h-80 px-8 pb-8">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} tickLine={false} axisLine={false} dy={10} />
              <YAxis tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} tickLine={false} axisLine={false} />
              <RechartsTooltip formatter={(value: any) => formatCurrency(Number(value))} cursor={{fill: 'rgba(0,0,0,0.02)'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="revenue" fill="#6D5EF5" radius={[6, 6, 6, 6]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card className={cardStyles}>
        <CardHeader className="pt-8 px-8 pb-4">
          <CardTitle className="text-[22px] font-heading font-extrabold text-[#111827]">Revenue by Product</CardTitle>
        </CardHeader>
        <CardContent className="h-80 px-8 pb-8">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={productData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <XAxis type="number" tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} tickLine={false} axisLine={false} />
              <YAxis dataKey="product" type="category" tick={{ fontSize: 13, fill: '#17153B', fontWeight: 600 }} width={120} tickLine={false} axisLine={false} />
              <RechartsTooltip formatter={(value: any) => formatCurrency(Number(value))} cursor={{fill: 'rgba(0,0,0,0.02)'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="revenue" fill="#C6FF3B" radius={[6, 6, 6, 6]} barSize={24}>
                {productData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#C6FF3B" : "#17153B"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
