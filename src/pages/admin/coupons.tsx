import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Plus, Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/useToast";
import CouponFormModal from "@/components/admin/coupon/couponFormModal";
import DeleteConfirmDialog from "@/components/admin/common/confirmModal";
import { couponService, type AdminCoupon } from "@/services/couponService";
import { format } from "date-fns";
import type { CouponFormValues } from "@/components/admin/coupon/coupon.schema";
import { useAddCoupon } from "@/services/coupon/coupon.query";

const PAGE_SIZE = 10;

const AdminCoupons = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<AdminCoupon | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ["coupons"],
    queryFn: couponService.getAll,
  });

  const addCouponMutation = useAddCoupon();

  const createMutation = useMutation({
    mutationFn: (data: CouponFormValues) =>
      couponService.create({
        code: data.code,
        description: data.description || "",
        discount_type: data.discount_type,
        discount_value: data.discount_value,
        is_active: data.is_active,
        is_global: data.is_global,
        start_date: data.start_date.toISOString(),
        end_date: data.end_date.toISOString(),
        max_uses: data.max_uses ?? null,
        min_purchase: data.min_purchase ?? null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      toast({ title: "Coupon created" });
      setModalOpen(false);
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CouponFormValues }) =>
      couponService.update(id, {
        ...data,
        start_date: data.start_date.toISOString(),
        end_date: data.end_date.toISOString(),
        max_uses: data.max_uses ?? null,
        min_purchase: data.min_purchase ?? null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      toast({ title: "Coupon updated" });
      setModalOpen(false);
      setEditingCoupon(null);
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message }),
  });

  const deleteMutation = useMutation({
    mutationFn: couponService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      toast({ title: "Coupon deleted" });
      setDeleteTarget(null);
    },
  });

  const filtered = useMemo(() => {
    if (!search) return coupons;
    const q = search.toLowerCase();
    return coupons.filter((c) => c.code.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q));
  }, [coupons, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSubmit = async (values: CouponFormValues) => {
    if (editingCoupon) {
      updateMutation.mutate({ id: editingCoupon.id, data: values });
    } else {
      // createMutation.mutate(values);
     const res = await addCouponMutation.mutateAsync(values);
    }
  };

  const isMutating = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold">Coupons</h1>
            <p className="text-muted-foreground text-sm">{filtered.length} coupons</p>
          </div>
          <Button onClick={() => { setEditingCoupon(null); setModalOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Add Coupon
          </Button>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search coupons..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-3 text-left">Code</th>
                      <th className="p-3 text-left">Type</th>
                      <th className="p-3 text-right">Value</th>
                      <th className="p-3 text-left">Dates</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3 text-center">Global</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paged.map((c) => (
                      <tr key={c.id} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="p-3">
                          <span className="font-mono font-bold">{c.code}</span>
                          {c.description && <p className="text-xs text-muted-foreground mt-0.5">{c.description}</p>}
                        </td>
                        <td className="p-3">
                          <Badge variant="outline" className="text-xs">{c.discount_type}</Badge>
                        </td>
                        <td className="p-3 text-right font-medium">
                          {c.discount_type === "PERCENTAGE" ? `${c.discount_value}%` : `$${c.discount_value}`}
                        </td>
                        <td className="p-3 text-xs">
                          <p>{format(new Date(c.start_date), "MMM d, yyyy")}</p>
                          <p className="text-muted-foreground">→ {format(new Date(c.end_date), "MMM d, yyyy")}</p>
                        </td>
                        <td className="p-3 text-center">
                          <Badge variant={c.is_active ? "default" : "secondary"} className="text-xs">
                            {c.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="p-3 text-center">
                          {c.is_global ? <Badge variant="outline" className="text-xs">Global</Badge> : <span className="text-xs text-muted-foreground">—</span>}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingCoupon(c); setModalOpen(true); }}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteTarget(c.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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

      <CouponFormModal
        open={modalOpen}
        onOpenChange={(open) => { setModalOpen(open); if (!open) setEditingCoupon(null); }}
        defaultValues={editingCoupon}
        onSubmit={handleSubmit}
        isLoading={isMutating}
      />

      <DeleteConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget)}
        title="Delete Coupon"
        description="This will permanently remove this coupon. Are you sure?"
      />
    </>
  );
};

export default AdminCoupons;
