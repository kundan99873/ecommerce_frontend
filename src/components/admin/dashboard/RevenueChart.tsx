import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/utils/utils";
import type { RevenueGroupBy } from "@/services/admin/dashboard.types";

interface RevenueSeries {
  key: string;
  revenue: number;
  label?: string;
}

interface RevenueChartProps {
  loading: boolean;
  data: RevenueSeries[];
  groupBy: RevenueGroupBy;
  onGroupByChange: (value: RevenueGroupBy) => void;
}

const tooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
};

const chartColors = {
  revenueStroke: "#e99b33",
  revenueFillTop: "rgba(233, 155, 51, 0.45)",
  revenueFillBottom: "rgba(233, 155, 51, 0.08)",
};

export const RevenueChart = ({
  loading,
  data,
  groupBy,
  onGroupByChange,
}: RevenueChartProps) => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle className="text-lg font-display">Revenue Timeline</CardTitle>
        <Select value={groupBy} onValueChange={onGroupByChange}>
          <SelectTrigger className="w-32.5 h-8">
            <SelectValue placeholder="Group by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Day</SelectItem>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="month">Month</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-64 w-full" />
        ) : data.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            No revenue data available for the selected range.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={chartColors.revenueFillTop}
                    stopOpacity={1}
                  />
                  <stop
                    offset="95%"
                    stopColor={chartColors.revenueFillBottom}
                    stopOpacity={1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="key"
                tick={{
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 12,
                }}
              />
              <YAxis
                tick={{
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 12,
                }}
                tickFormatter={(v) => formatCurrency(v)}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value) => [
                  formatCurrency(Number(value ?? 0)),
                  "Revenue",
                ]}
                labelFormatter={(_, payload) => {
                  const item = payload?.[0]?.payload as
                    | { label?: string }
                    | undefined;
                  return item?.label || "";
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke={chartColors.revenueStroke}
                fill="url(#revenueGrad)"
                strokeWidth={2.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
