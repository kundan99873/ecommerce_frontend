import { Skeleton } from "@/components/ui/skeleton";

interface AdminTableSkeletonProps {
  columns: number;
  rows?: number;
  showHeader?: boolean;
}

const AdminTableSkeleton = ({
  columns,
  rows = 5,
  showHeader = true,
}: AdminTableSkeletonProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        {showHeader && (
          <thead>
            <tr className="border-b bg-muted/50">
              {Array.from({ length: columns }).map((_, columnIndex) => (
                <th key={`header-${columnIndex}`} className="p-3 text-left">
                  <Skeleton className="h-4 w-16" />
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={`row-${rowIndex}`} className="border-b">
              {Array.from({ length: columns }).map((_, columnIndex) => (
                <td key={`cell-${rowIndex}-${columnIndex}`} className="p-3">
                  <Skeleton className="h-4 w-full max-w-35" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTableSkeleton;
