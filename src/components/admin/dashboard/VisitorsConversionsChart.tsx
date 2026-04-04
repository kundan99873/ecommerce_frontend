import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ConversionData {
  day: string;
  visitors: number;
  conversions: number;
}

interface VisitorsConversionsChartProps {
  loading: boolean;
  data: ConversionData[];
}

const tooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
};

const chartColors = {
  visitors: "#7f7b76",
  conversions: "#e99b33",
};

export const VisitorsConversionsChart = ({
  loading,
  data,
}: VisitorsConversionsChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-display">
          Weekly Visitors & Conversions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-56 w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="day"
                tick={{
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 12,
                }}
                interval={0}
              />
              <YAxis
                tick={{
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 12,
                }}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar
                dataKey="visitors"
                fill={chartColors.visitors}
                radius={[4, 4, 0, 0]}
                name="Visitors"
                opacity={0.9}
              />
              <Bar
                dataKey="conversions"
                fill={chartColors.conversions}
                radius={[4, 4, 0, 0]}
                name="Conversions"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
