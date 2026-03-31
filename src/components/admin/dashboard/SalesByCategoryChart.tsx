import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface CategorySeries {
  category_id: string;
  name: string;
  percentage: number;
}

interface SalesByCategoryChartProps {
  loading: boolean;
  data: CategorySeries[];
}

const COLORS = ["#e99b33", "#9f1f24", "#32b765", "#ea9226", "#d5d1ca"];

const tooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
};

export const SalesByCategoryChart = ({
  loading,
  data,
}: SalesByCategoryChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-display">
          Sales by Category
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-56 w-full" />
        ) : data.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            No category sales data available for the selected range.
          </p>
        ) : (
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="percentage"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                >
                  {data.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {data.map((item) => (
                <div key={item.category_id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-muted-foreground">
                      {item.percentage}%
                    </span>
                  </div>
                  <Progress value={item.percentage} className="h-1.5" />
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
