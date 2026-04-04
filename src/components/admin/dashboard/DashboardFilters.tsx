import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DashboardFiltersProps {
  fromDate: string;
  toDate: string;
  onFromDateChange: (date: string) => void;
  onToDateChange: (date: string) => void;
  onReset: () => void;
}

export const DashboardFilters = ({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  onReset,
}: DashboardFiltersProps) => {
  return (
    <div className="w-full lg:w-auto rounded-xl border bg-card p-3 sm:p-4">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
        <CalendarDays className="h-4 w-4" /> Date range filter
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Input
          type="date"
          value={fromDate}
          onChange={(e) => onFromDateChange(e.target.value)}
          className="h-9 w-full"
          max={toDate || undefined}
        />
        <Input
          type="date"
          value={toDate}
          onChange={(e) => onToDateChange(e.target.value)}
          className="h-9 w-full"
          min={fromDate || undefined}
        />
        <Button
          type="button"
          variant="outline"
          className="h-9 w-full sm:w-auto"
          onClick={onReset}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};
