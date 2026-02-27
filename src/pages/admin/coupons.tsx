import { useState } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/useToast";
import CouponFormModal from "@/components/admin/coupon/couponFormModal";
import { format } from "date-fns";
import type { CouponFormValues } from "@/components/admin/coupon/coupon.schema";
import {
  useAddCoupon,
  useDeleteCoupon,
  useGetCoupons,
  useUpdateCoupon,
} from "@/services/coupon/coupon.query";
import type { Coupon } from "@/services/coupon/coupon.types";
import { useDebounce } from "@/hooks/useDebounce";
import ConfirmDialog from "@/components/admin/common/confirmModal";

const PAGE_SIZE = 10;

const AdminCoupons = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [activeTarget, setActiveTarget] = useState<Coupon | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useGetCoupons({
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch || undefined,
  });
  const addCouponMutation = useAddCoupon();
  const updateCouponMutation = useUpdateCoupon();
  const deleteCouponMutation = useDeleteCoupon();

  const totalPages = Math.ceil(data?.totalCounts || 0 / PAGE_SIZE);

  const handleSubmit = async (values: CouponFormValues) => {
    if (editingCoupon) {
      const res = await updateCouponMutation.mutateAsync({
        id: editingCoupon.id,
        data: {
          code: values.code,
          description: values.description || "",
          discount_type: values.discount_type,
          discount_value: values.discount_value,
          is_active: values.is_active,
          is_global: values.is_global,
          start_date: values.start_date.toISOString(),
          end_date: values.end_date.toISOString(),
          max_uses: values.max_uses ?? null,
          min_purchase: values.min_purchase ?? null,
        },
      });

      if (res.success) {
        toast({ title: "Coupon updated" });
        setModalOpen(false);
        setEditingCoupon(null);
      } else {
        toast({
          title: "Error",
          description: res.message || "Failed to update coupon",
        });
      }
    } else {
      const res = await addCouponMutation.mutateAsync({
        code: values.code,
        description: values.description || "",
        discount_type: values.discount_type,
        discount_value: values.discount_value,
        is_active: values.is_active,
        is_global: values.is_global,
        start_date: values.start_date.toISOString(),
        end_date: values.end_date.toISOString(),
        max_uses: values.max_uses ?? null,
        min_purchase: values.min_purchase ?? null,
        product_ids: values.product_ids || [],
      });
      if (res.success) {
        toast({ title: "Coupon created" });
        setModalOpen(false);
      } else {
        toast({
          title: "Error",
          description: res.message || "Failed to create coupon",
        });
      }
    }
  };

  const handleDeleteCoupon = async () => {
    if (deleteTarget === null) return;
    const res = await deleteCouponMutation.mutateAsync(deleteTarget);
    if (res.success) {
      toast({ title: "Coupon deleted" });
      setDeleteTarget(null);
    }
  };

  const isMutating =
    addCouponMutation.isPending || updateCouponMutation.isPending;

  const handleChangeStatus = async () => {
    if (activeTarget === null) return;
    const res = await updateCouponMutation.mutateAsync({
      id: activeTarget.id,
      data: { is_active: !activeTarget.is_active },
    });
    if (res.success) {
      toast({ title: "Coupon status updated" });
      setActiveTarget(null);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold">Coupons</h1>
            <p className="text-muted-foreground text-sm">
              {data?.totalCounts || 0} coupons
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingCoupon(null);
              setModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Coupon
          </Button>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search coupons..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
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
                    {(data?.data?.length ?? 0 > 0) ? (
                      data?.data.map((c) => (
                        <tr
                          key={c.id}
                          className="border-b hover:bg-muted/30 transition-colors"
                        >
                          <td className="p-3">
                            <span className="font-mono font-bold">
                              {c.code}
                            </span>
                            {c.description && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {c.description}
                              </p>
                            )}
                          </td>
                          <td className="p-3">
                            <Badge variant="outline" className="text-xs">
                              {c.discount_type}
                            </Badge>
                          </td>
                          <td className="p-3 text-right font-medium">
                            {c.discount_type === "PERCENTAGE"
                              ? `${c.discount_value}%`
                              : `$${c.discount_value}`}
                          </td>
                          <td className="p-3 text-xs">
                            <p>
                              {format(new Date(c.start_date), "MMM d, yyyy")}
                            </p>
                            <p className="text-muted-foreground">
                              → {format(new Date(c.end_date), "MMM d, yyyy")}
                            </p>
                          </td>
                          <td className="p-3 text-center">
                            <Badge
                              variant={c.is_active ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {c.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td className="p-3 text-center">
                            {c.is_global ? (
                              <Badge variant="outline" className="text-xs">
                                Global
                              </Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                —
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setActiveTarget(c)}
                              >
                                {c.is_active ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                  setEditingCoupon(c);
                                  setModalOpen(true);
                                }}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => setDeleteTarget(c.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={8}
                          className="p-6 text-center text-muted-foreground"
                        >
                          No coupons found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
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

      <CouponFormModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setEditingCoupon(null);
        }}
        defaultValues={editingCoupon}
        onSubmit={handleSubmit}
        isLoading={isMutating}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={() => setDeleteTarget(null)}
        onConfirm={handleDeleteCoupon}
        title="Delete Coupon"
        description="This will permanently remove this coupon. Are you sure?"
        loading={deleteCouponMutation.isPending}
      />
      <ConfirmDialog
        open={activeTarget !== null}
        onOpenChange={() => setActiveTarget(null)}
        onConfirm={handleChangeStatus}
        title="Toggle Coupon Status"
        description="This will toggle the active status of this coupon."
        btnText="Change Status"
        loadingText="Changing..."
        loading={updateCouponMutation.isPending}
      />
    </>
  );
};

export default AdminCoupons;
