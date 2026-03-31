import { formatCurrency } from "@/utils/utils";

interface TotalSpendStatCardProps {
  totalSpend: number;
}

const TotalSpendStatCard = ({ totalSpend }: TotalSpendStatCardProps) => (
  <div className="rounded-lg border bg-card p-3 text-center">
    <p className="text-xs text-muted-foreground">Total Spend</p>
    <p className="text-xl font-semibold">{formatCurrency(totalSpend)}</p>
  </div>
);

export default TotalSpendStatCard;
