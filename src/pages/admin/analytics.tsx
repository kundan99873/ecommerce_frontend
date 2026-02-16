// import { useState } from "react";
// import { Download } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import { monthlyRevenue, salesByCategory, mockUsers } from "@/data/adminData";
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
//   PieChart, Pie, Cell, LineChart, Line, Legend,
// } from "recharts";
// import { toast } from "@/hooks/useToast";
// import { useEffect } from "react";

// const COLORS = [
//   "hsl(var(--primary))",
//   "hsl(var(--destructive))",
//   "hsl(var(--success))",
//   "hsl(var(--accent))",
//   "hsl(var(--secondary-foreground))",
// ];

// const topCustomers = [...mockUsers].sort((a, b) => b.spent - a.spent).slice(0, 5);

// const orderTrends = monthlyRevenue.map((m) => ({
//   month: m.month,
//   orders: Math.round(m.revenue / 150) + Math.floor(Math.random() * 20),
//   revenue: m.revenue,
// }));

// const AdminAnalytics = () => {
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const t = setTimeout(() => setLoading(false), 500);
//     return () => clearTimeout(t);
//   }, []);

//   const exportCSV = () => {
//     const rows = [
//       ["Month", "Revenue", "Orders"],
//       ...orderTrends.map((d) => [d.month, d.revenue.toString(), d.orders.toString()]),
//     ];
//     const csv = rows.map((r) => r.join(",")).join("\n");
//     const blob = new Blob([csv], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "analytics-export.csv";
//     a.click();
//     URL.revokeObjectURL(url);
//     toast({ title: "CSV exported" });
//   };

//   const tooltipStyle = {
//     backgroundColor: "hsl(var(--card))",
//     border: "1px solid hsl(var(--border))",
//     borderRadius: "8px",
//   };

//   return (
//     <>
//       <div className="space-y-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-display font-bold">Analytics</h1>
//             <p className="text-muted-foreground text-sm">Sales and performance metrics</p>
//           </div>
//           <Button variant="outline" onClick={exportCSV}>
//             <Download className="h-4 w-4 mr-2" /> Export CSV
//           </Button>
//         </div>

//         {/* Revenue & Order Trends */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="text-lg font-display">Revenue & Order Trends</CardTitle>
//           </CardHeader>
//           <CardContent>
//             {loading ? (
//               <Skeleton className="h-72 w-full" />
//             ) : (
//               <ResponsiveContainer width="100%" height={300}>
//                 <LineChart data={orderTrends}>
//                   <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
//                   <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
//                   <YAxis yAxisId="left" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} tickFormatter={(v) => `$${v / 1000}k`} />
//                   <YAxis yAxisId="right" orientation="right" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
//                   <Tooltip contentStyle={tooltipStyle} />
//                   <Legend />
//                   <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} name="Revenue ($)" />
//                   <Line yAxisId="right" type="monotone" dataKey="orders" stroke="hsl(var(--success))" strokeWidth={2} name="Orders" />
//                 </LineChart>
//               </ResponsiveContainer>
//             )}
//           </CardContent>
//         </Card>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Sales by Category */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-lg font-display">Sales by Category</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {loading ? (
//                 <Skeleton className="h-64 w-full" />
//               ) : (
//                 <ResponsiveContainer width="100%" height={280}>
//                   <PieChart>
//                     <Pie data={salesByCategory} dataKey="sales" nameKey="category" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent || 0 * 100).toFixed(0)}%`}>
//                       {salesByCategory.map((_, i) => (
//                         <Cell key={i} fill={COLORS[i % COLORS.length]} />
//                       ))}
//                     </Pie>
//                     <Tooltip contentStyle={tooltipStyle} />
//                   </PieChart>
//                 </ResponsiveContainer>
//               )}
//             </CardContent>
//           </Card>

//           {/* Top Customers */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-lg font-display">Top Customers</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {loading ? (
//                 Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full mb-2" />)
//               ) : (
//                 <div className="space-y-4">
//                   {topCustomers.map((c, i) => (
//                     <div key={c.id} className="flex items-center gap-3">
//                       <span className="text-xs font-bold text-muted-foreground w-5">#{i + 1}</span>
//                       <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
//                         {c.name.charAt(0)}
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <p className="text-sm font-medium truncate">{c.name}</p>
//                         <p className="text-xs text-muted-foreground">{c.orders} orders</p>
//                       </div>
//                       <p className="text-sm font-bold">${c.spent.toLocaleString()}</p>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </div>

//         {/* Monthly Revenue Bar */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="text-lg font-display">Monthly Revenue Breakdown</CardTitle>
//           </CardHeader>
//           <CardContent>
//             {loading ? (
//               <Skeleton className="h-64 w-full" />
//             ) : (
//               <ResponsiveContainer width="100%" height={280}>
//                 <BarChart data={monthlyRevenue}>
//                   <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
//                   <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
//                   <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} tickFormatter={(v) => `$${v / 1000}k`} />
//                   <Tooltip contentStyle={tooltipStyle} formatter={(value: number | undefined) => value !== undefined ? [`$${value.toLocaleString()}`, "Revenue"] : null} />
//                   <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </>
//   );
// };

// export default AdminAnalytics;

import { useState, useEffect, useMemo } from "react";
import { Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { monthlyRevenue, salesByCategory, mockUsers } from "@/data/adminData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { toast } from "@/hooks/useToast";

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [colors, setColors] = useState({
    primary: "",
    success: "",
    destructive: "",
    accent: "",
    secondary: "",
  });

  /* ---------------- GET OKLCH COLORS SAFELY ---------------- */
  useEffect(() => {
    const root = getComputedStyle(document.documentElement);

    setColors({
      primary: root.getPropertyValue("--primary").trim(),
      success: root.getPropertyValue("--success").trim(),
      destructive: root.getPropertyValue("--destructive").trim(),
      accent: root.getPropertyValue("--accent").trim(),
      secondary: root.getPropertyValue("--secondary-foreground").trim(),
    });

    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  /* ---------------- DERIVED DATA ---------------- */
  const topCustomers = useMemo(
    () => [...mockUsers].sort((a, b) => b.spent - a.spent).slice(0, 5),
    [],
  );

  const orderTrends = useMemo(
    () =>
      monthlyRevenue.map((m) => ({
        month: m.month,
        orders: Math.round(m.revenue / 150) + Math.floor(Math.random() * 20),
        revenue: m.revenue,
      })),
    [],
  );

  const COLORS = [
    colors.primary,
    colors.destructive,
    colors.success,
    colors.accent,
    colors.secondary,
  ];

  /* ---------------- CSV EXPORT ---------------- */
  const exportCSV = () => {
    const rows = [
      ["Month", "Revenue", "Orders"],
      ...orderTrends.map((d) => [
        d.month,
        d.revenue.toString(),
        d.orders.toString(),
      ]),
    ];

    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "analytics-export.csv";
    a.click();

    URL.revokeObjectURL(url);

    toast({ title: "CSV exported successfully" });
  };

  const tooltipStyle = {
    backgroundColor: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Analytics</h1>
          <p className="text-muted-foreground text-sm">
            Sales and performance metrics
          </p>
        </div>
        <Button variant="outline" onClick={exportCSV}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* ---------------- LINE CHART ---------------- */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-display">
            Revenue & Order Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-72 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={orderTrends}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border"
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  tickFormatter={(v) => `$${v / 1000}k`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke={colors.primary}
                  strokeWidth={2}
                  name="Revenue ($)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  stroke={colors.success}
                  strokeWidth={2}
                  name="Orders"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* ---------------- PIE + TOP CUSTOMERS ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PIE CHART */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-display">
              Sales by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={salesByCategory}
                    dataKey="sales"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) =>
                      `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                  >
                    {salesByCategory.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* TOP CUSTOMERS */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-display">
              Top Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full mb-2" />
                ))
              : topCustomers.map((c, i) => (
                  <div key={c.id} className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-bold text-muted-foreground w-5">
                      #{i + 1}
                    </span>
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {c.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{c.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {c.orders} orders
                      </p>
                    </div>
                    <p className="text-sm font-bold">
                      ${c.spent.toLocaleString()}
                    </p>
                  </div>
                ))}
          </CardContent>
        </Card>
      </div>

      {/* ---------------- BAR CHART ---------------- */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-display">
            Monthly Revenue Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border"
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                />
                <YAxis
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  tickFormatter={(v) => `$${v / 1000}k`}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value: number | undefined) =>
                    value !== undefined
                      ? [`$${value.toLocaleString()}`, "Revenue"]
                      : null
                  }
                />
                <Bar
                  dataKey="revenue"
                  fill={colors.primary}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
