import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboardStats, monthlyRevenue } from "@/data/adminData";
import { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

/* ---------------- STAT CARD ---------------- */
const StatCard = ({
  title,
  value,
  icon: Icon,
  loading,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  loading: boolean;
}) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          {loading ? (
            <Skeleton className="h-8 w-24 mt-1" />
          ) : (
            <p className="text-2xl font-bold font-display mt-1">{value}</p>
          )}
        </div>
        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </CardContent>
  </Card>
);

/* ---------------- MAIN COMPONENT ---------------- */
const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] =
    useState<ReturnType<typeof getDashboardStats> | null>(null);

  const [colors, setColors] = useState({
    primary: "",
    muted: "",
    card: "",
    border: "",
  });

  /* ---------------- GET OKLCH COLORS ---------------- */
  useEffect(() => {
    const root = getComputedStyle(document.documentElement);

    setColors({
      primary: root.getPropertyValue("--primary").trim(),
      muted: root.getPropertyValue("--muted-foreground").trim(),
      card: root.getPropertyValue("--card").trim(),
      border: root.getPropertyValue("--border").trim(),
    });

    const timer = setTimeout(() => {
      setStats(getDashboardStats());
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  /* ---------------- STATUS COLORS ---------------- */
  const statusColor: Record<string, string> = {
    delivered: "bg-success text-success-foreground",
    shipped: "bg-primary text-primary-foreground",
    processing: "bg-secondary text-secondary-foreground",
    cancelled: "bg-destructive text-destructive-foreground",
  };

  /* ---------------- TOOLTIP STYLE ---------------- */
  const tooltipStyle = useMemo(
    () => ({
      backgroundColor: colors.card,
      border: `1px solid ${colors.border}`,
      borderRadius: "8px",
    }),
    [colors]
  );

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-display font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Overview of your store performance
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={`$${stats?.totalRevenue?.toLocaleString() || 0}`}
          icon={DollarSign}
          loading={loading}
        />
        <StatCard
          title="Total Orders"
          value={`${stats?.totalOrders || 0}`}
          icon={ShoppingCart}
          loading={loading}
        />
        <StatCard
          title="Total Users"
          value={`${stats?.totalUsers || 0}`}
          icon={Users}
          loading={loading}
        />
        <StatCard
          title="Total Products"
          value={`${stats?.totalProducts || 0}`}
          icon={Package}
          loading={loading}
        />
      </div>

      {/* REVENUE CHART + TOP PRODUCTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* REVENUE CHART */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-display">
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: colors.muted, fontSize: 12 }}
                  />
                  <YAxis
                    tick={{ fill: colors.muted, fontSize: 12 }}
                    tickFormatter={(v) => `$${v / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    // formatter={(value: number) => [
                    //   `$${value.toLocaleString()}`,
                    //   "Revenue",
                    // ]}
                  />
                  <Bar
                    dataKey="revenue"
                    fill={colors.primary}
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* TOP PRODUCTS */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-display">
              Top Products
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))
              : stats?.topProducts.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-muted-foreground w-5">
                      #{i + 1}
                    </span>
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {p.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {p.reviews} reviews
                      </p>
                    </div>
                    <p className="text-sm font-bold">${p.price}</p>
                  </div>
                ))}
          </CardContent>
        </Card>
      </div>

      {/* RECENT ORDERS + LOW STOCK */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RECENT ORDERS */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-display">
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full mb-2" />
              ))
            ) : (
              <div className="space-y-3">
                {stats?.recentOrders.map((o) => (
                  <div
                    key={o.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium">{o.id}</p>
                      <p className="text-xs text-muted-foreground">
                        {o.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        className={
                          statusColor[o.status] ||
                          "bg-secondary text-secondary-foreground"
                        }
                      >
                        {o.status}
                      </Badge>
                      <p className="text-sm font-bold">${o.total}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* LOW STOCK */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-20 w-full" />
            ) : stats?.lowStockProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">
                All products are in stock!
              </p>
            ) : (
              <div className="space-y-3">
                {stats?.lowStockProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 py-2 border-b last:border-0"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-destructive font-medium">
                        Out of Stock
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
