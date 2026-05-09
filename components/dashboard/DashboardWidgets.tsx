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

export function OverallStats() {
  const { sales, targetAmount } = useSales();
  
  const completedSales = sales.filter(s => s.status === "completed" || s.status === "pending");
  const refundedSales = sales.filter(s => s.status === "refunded");

  const totalRevenue = completedSales.reduce((acc, s) => acc + Number(s.amount), 0);
  const refundedTotal = refundedSales.reduce((acc, s) => acc + Number(s.amount), 0);
  const adjustedRevenue = totalRevenue - refundedTotal;
  const averageSale = completedSales.length > 0 ? totalRevenue / completedSales.length : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-white border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <h3 className="text-sm font-medium text-slate-500">Total Revenue</h3>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">{formatCurrency(totalRevenue)}</div>
          <p className="text-xs text-slate-500 mt-1">{completedSales.length} total sales</p>
        </CardContent>
      </Card>
      <Card className="bg-white border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-indigo-500" />
            <h3 className="text-sm font-medium text-slate-500">Adjusted Revenue</h3>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">{formatCurrency(adjustedRevenue)}</div>
          <p className="text-xs text-slate-500 mt-1">Minus refunds</p>
        </CardContent>
      </Card>
      <Card className="bg-white border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <IndianRupee className="h-4 w-4 text-amber-500" />
            <h3 className="text-sm font-medium text-slate-500">Avg. Per Sale</h3>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">{formatCurrency(averageSale)}</div>
        </CardContent>
      </Card>
      <Card className="bg-white border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-blue-500" />
            <h3 className="text-sm font-medium text-slate-500">Target Achievement</h3>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">
            {((adjustedRevenue / targetAmount) * 100).toFixed(1)}%
          </div>
          <p className="text-xs text-slate-500 mt-1">Of {formatCurrency(targetAmount)} target</p>
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
    { name: "Achieved", value: totalRevenue, color: "#4f46e5" }, // Indigo 600
    { name: "Remaining", value: remaining, color: "#e2e8f0" } // Slate 200
  ];

  return (
    <Card className="bg-white border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-800">Target Overview</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center items-center h-64">
        <div className="w-full h-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius="70%"
                outerRadius="90%"
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip formatter={(value: any) => formatCurrency(Number(value))} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-slate-900">
              {((totalRevenue / targetAmount) * 100).toFixed(1)}%
            </span>
            <span className="text-sm text-slate-500">Achieved</span>
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

  const colors = ["#8b5cf6", "#ec4899", "#14b8a6", "#f59e0b", "#3b82f6"];

  return (
    <Card className="bg-white border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-800">Member Contributions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {memberData.map((data, index) => (
            <div key={data.member} className="flex flex-col items-center">
              <div className="w-24 h-24 relative mb-3">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[{ value: data.revenue }, { value: totalRevenue - data.revenue }]}
                      innerRadius="70%"
                      outerRadius="100%"
                      dataKey="value"
                      stroke="none"
                    >
                      <Cell fill={colors[index % colors.length]} />
                      <Cell fill="#f1f5f9" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-sm font-bold text-slate-700">{data.percentage.toFixed(0)}%</span>
                </div>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-slate-900 capitalize">{data.member}</h4>
                <p className="text-xs text-slate-500 mb-1">{data.count} sales</p>
                <p className="text-sm font-medium text-slate-700">{formatCurrency(data.revenue)}</p>
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
    <Card className="bg-white border-0 shadow-sm h-full">
      <CardHeader className="flex flex-row items-center space-x-2">
        <Trophy className="h-5 w-5 text-amber-500" />
        <CardTitle className="text-lg font-semibold text-slate-800">Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {memberData.map((data, index) => (
            <div key={data.member} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                  ${index === 0 ? "bg-amber-100 text-amber-700" : 
                    index === 1 ? "bg-slate-200 text-slate-700" : 
                    index === 2 ? "bg-orange-100 text-orange-700" : "bg-blue-50 text-blue-700"}
                `}>
                  #{index + 1}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 capitalize">{data.member}</p>
                  <p className="text-xs text-slate-500">{data.count} sales</p>
                </div>
              </div>
              <div className="font-bold text-slate-900">{formatCurrency(data.revenue)}</div>
            </div>
          ))}
          {memberData.length === 0 && (
            <div className="text-center text-slate-500 py-4">No sales data yet</div>
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
    .reverse(); // Assuming descending sort from DB

  // Product Data
  const productDataMap = validSales.reduce((acc, sale) => {
    acc[sale.product] = (acc[sale.product] || 0) + Number(sale.amount);
    return acc;
  }, {} as Record<string, number>);

  const productData = Object.entries(productDataMap)
    .map(([product, revenue]) => ({ product, revenue }))
    .sort((a, b) => b.revenue - a.revenue);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-800">Monthly Revenue</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`} tick={{ fontSize: 12 }} />
              <RechartsTooltip formatter={(value: any) => formatCurrency(Number(value))} />
              <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-800">Revenue by Product</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={productData} layout="vertical" margin={{ left: 20 }}>
              <XAxis type="number" tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`} tick={{ fontSize: 12 }} />
              <YAxis dataKey="product" type="category" tick={{ fontSize: 12 }} width={100} />
              <RechartsTooltip formatter={(value: any) => formatCurrency(Number(value))} />
              <Bar dataKey="revenue" fill="#14b8a6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
