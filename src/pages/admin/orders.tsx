import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Download, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "@/hooks/useToast";
import { orders as initialOrders, type Order } from "@/data/products";

const statuses = ["all", "processing", "packed", "shipped", "out_for_delivery", "delivered", "cancelled"] as const;
const statusColors: Record<string, string> = {
  delivered: "bg-success text-success-foreground",
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

  const filtered = useMemo(() => {
    if (statusFilter === "all") return orderList;
    return orderList.filter((o) => o.status === statusFilter);
  }, [orderList, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const updateStatus = (id: string, status: Order["status"]) => {
    setOrderList((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    if (detail?.id === id) setDetail((prev) => prev ? { ...prev, status } : prev);
    toast({ title: `Order ${id} updated to ${status}` });
  };

  const downloadInvoice = (id: string) => {
    toast({ title: "Invoice Downloaded", description: `Invoice for ${id} has been downloaded.` });
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold">Orders</h1>
            <p className="text-muted-foreground text-sm">{filtered.length} orders</p>
          </div>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="w-45"><SelectValue /></SelectTrigger>
            <SelectContent>
              {statuses.map((s) => (
                <SelectItem key={s} value={s}>{s === "all" ? "All Statuses" : s.replace(/_/g, " ")}</SelectItem>
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
                  {paged.map((o) => (
                    <tr key={o.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-medium">{o.id}</td>
                      <td className="p-3 text-muted-foreground">{o.date}</td>
                      <td className="p-3 text-center">{o.items.reduce((s, i) => s + i.quantity, 0)}</td>
                      <td className="p-3 text-right font-medium">${o.total}</td>
                      <td className="p-3 text-center">
                        <Badge className={statusColors[o.status] || "bg-secondary"}>{o.status.replace(/_/g, " ")}</Badge>
                      </td>
                      <td className="p-3 text-center">
                        <Badge variant="outline" className="text-xs">{o.status === "cancelled" ? "Refunded" : "Paid"}</Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDetail(o)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => downloadInvoice(o.id)}>
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
                <p className="text-sm text-muted-foreground">Page {page} of {totalPages}</p>
                <div className="flex gap-1">
                  <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === 1} onClick={() => setPage(page - 1)}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Detail Drawer */}
      <Sheet open={!!detail} onOpenChange={() => setDetail(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="font-display">{detail?.id}</SheetTitle>
          </SheetHeader>
          {detail && (
            <div className="space-y-6 mt-6">
              <div className="flex items-center justify-between">
                <Badge className={statusColors[detail.status]}>{detail.status.replace(/_/g, " ")}</Badge>
                <p className="text-sm text-muted-foreground">{detail.date}</p>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Update Status</p>
                <Select value={detail.status} onValueChange={(v) => updateStatus(detail.id, v as Order["status"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["processing", "packed", "shipped", "out_for_delivery", "delivered", "cancelled"].map((s) => (
                      <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <p className="text-sm font-medium mb-3">Items</p>
                <div className="space-y-3">
                  {detail.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <img src={item.product.image} alt={item.product.name} className="h-12 w-12 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold">${item.product.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 flex justify-between">
                <p className="font-medium">Total</p>
                <p className="font-bold text-lg">${detail.total}</p>
              </div>

              <Button className="w-full" variant="outline" onClick={() => downloadInvoice(detail.id)}>
                <Download className="h-4 w-4 mr-2" /> Download Invoice
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default AdminOrders;
