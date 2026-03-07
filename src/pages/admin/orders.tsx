import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Download, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/useToast";
import { orders as initialOrders, type Order } from "@/data/products";
import OrderDetailModal from "@/components/admin/order/orderDetailModal";
import { useGetAllOrders } from "@/services/order/order.query";
import dayjs from "dayjs";
import { formatCurrency } from "@/utils/utils";

const statuses = [
  "all",
  "processing",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
] as const;
const statusColors: Record<string, string> = {
  delivered: "bg-success text-success-foreground",
  PENDING: "bg-success text-success-foreground",
  shipped: "bg-primary text-primary-foreground",
  processing: "bg-secondary text-secondary-foreground",
  packed: "bg-secondary text-secondary-foreground",
  out_for_delivery: "bg-primary/80 text-primary-foreground",
  cancelled: "bg-destructive text-destructive-foreground",
};

const PAGE_SIZE = 10;

const AdminOrders = () => {
  const [orderList, setOrderList] = useState(initialOrders);
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState<Order | null>(null);

  const { data } = useGetAllOrders();

  const filtered = useMemo(() => {
    if (statusFilter === "all") return orderList;
    return orderList.filter((o) => o.status === statusFilter);
  }, [orderList, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const updateStatus = (id: string, status: Order["status"]) => {
    setOrderList((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o)),
    );
    if (detail?.id === id)
      setDetail((prev) => (prev ? { ...prev, status } : prev));
    toast({ title: `Order ${id} updated to ${status}` });
  };

  const downloadInvoice = (id: string) => {
    toast({
      title: "Invoice Downloaded",
      description: `Invoice for ${id} has been downloaded.`,
    });
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold">Orders</h1>
            <p className="text-muted-foreground text-sm">
              {filtered.length} orders
            </p>
          </div>
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((s) => (
                <SelectItem key={s} value={s}>
                  {s === "all" ? "All Statuses" : s.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left">Order ID</th>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-center">Items</th>
                    <th className="p-3 text-right">Total</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center">Payment</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data.map((o) => (
                    <tr
                      key={o.order_number}
                      className="border-b hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-3 font-medium">{o.order_number}</td>
                      <td className="p-3 text-muted-foreground">
                        {dayjs(o.purchase_date).format("YYYY-MM-DD")}
                      </td>
                      <td className="p-3 text-center">
                        {/* {o.items.reduce((s, i) => s + i.quantity, 0)} */}
                        {o.items.map((i) => (
                          <>
                            <div className="grid grid-cols-4">
                              <img
                                src={i.images[0].image_url}
                                className="h-14 rounded-xl"
                              />
                              <div className="ml-2 text-left col-span-3">
                                <p className="text-sm font-medium">
                                  {i.name.length > 20
                                    ? i.name.slice(0, 20) + "..."
                                    : i.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Qty: {i.quantity}
                                </p>
                                <p>{formatCurrency(i.price * i.quantity)}</p>
                              </div>
                            </div>
                            <SelectSeparator />
                          </>
                        ))}
                      </td>
                      <td className="p-3 text-right font-medium">
                        {formatCurrency(o.total_amount)}
                      </td>
                      <td className="p-3 text-center">
                        <Badge
                          className={statusColors[o.status] || "bg-secondary"}
                        >
                          {o.status.replace(/_/g, " ")}
                        </Badge>
                      </td>
                      <td className="p-3 text-center">
                        <Badge variant="outline" className="text-xs">
                          {o.status === "CANCELLED" ? "Refunded" : "Paid"}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setDetail(o)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => downloadInvoice(o.order_number)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <OrderDetailModal
        order={detail}
        open={!!detail}
        onOpenChange={(open) => {
          if (!open) setDetail(null);
        }}
        onUpdateStatus={updateStatus}
        onDownloadInvoice={downloadInvoice}
      />
    </>
  );
};

export default AdminOrders;
