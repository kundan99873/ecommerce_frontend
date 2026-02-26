import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  EyeOff,
  Eye,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/useToast";
import { productService } from "@/services/productService";
import ProductFormModal from "@/components/admin/product/productFormModal";
import {
  useAddProduct,
  useDeleteProduct,
  useProducts,
  useUpdateProduct,
} from "@/services/product/product.query";
import type { Product, SortOptions } from "@/services/product/product.types";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetCategory } from "@/services/category/category.query";
import { formatCurrency } from "@/utils/utils";
import type { StockType } from "@/components/admin/product/product.types";
import ConfirmDialog from "@/components/admin/common/confirmModal";

const PAGE_SIZE = 5;

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState<StockType>("all");
  const [sortBy, setSortBy] = useState<SortOptions | "all">("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [activeTarget, setActiveTarget] = useState<Product | null>(null);

  const debouncedSearch = useDebounce(search);

  const { data, isLoading } = useProducts({
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch,
    category: categoryFilter === "all" ? undefined : categoryFilter,
    sort: sortBy === "all" ? undefined : sortBy,
    filter: stockFilter === "all" ? undefined : stockFilter,
  });
  const { data: categoryData } = useGetCategory();

  const addProductMutation = useAddProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  const bulkDeleteMutation = useMutation({
    mutationFn: productService.bulkDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: `${selected.size} products deleted` });
      setSelected(new Set());
    },
  });

  const totalPages = Math.ceil((data?.totalCounts || 0) / PAGE_SIZE);
  // const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openAdd = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };
  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setModalOpen(true);
  };

  const handleSubmit = async (values: FormData) => {
    if (editingProduct) {
      console.log({ values });
      for (let [key, value] of values.entries()) {
        console.log(`${key}: ${value}`);
      }
      const res = await updateProductMutation.mutateAsync({
        slug: editingProduct.slug,
        data: values,
      });
      console.log({ res });
      if (res.success) {
        toast({ title: "Product updated" });
        setModalOpen(false);
      } else {
        toast({ title: "Error updating product", description: res.message });
      }
    } else {
      const res = await addProductMutation.mutateAsync(values);
      if (res.success) {
        toast({ title: "Product added" });
        setModalOpen(false);
      } else {
        toast({ title: "Error adding product", description: res.message });
      }
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteProductMutation.mutateAsync(deleteTarget);

      toast({ title: "Product deleted" });
      setDeleteTarget(null);
    } catch (error: any) {
      toast({
        title: "Error deleting product",
        description: error?.message ?? "Something went wrong",
      });
    }
  };

  const handleChangeStatus = async () => {
    if (!activeTarget) return;
    const updatedData = new FormData();
    updatedData.append("is_active", (!activeTarget.is_active).toString());
    const res = await updateProductMutation.mutateAsync({
      slug: activeTarget.slug,
      data: updatedData,
    });

    if (res.success) {
      toast({ title: "Product status updated" });
      setActiveTarget(null);
    } else {
      toast({ title: "Error updating status", description: res.message });
    }
  };

  const isMutating =
    addProductMutation.isPending || updateProductMutation.isPending;

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold">Products</h1>
            <p className="text-muted-foreground text-sm">
              {data?.totalCounts || 0} products
            </p>
          </div>
          <div className="flex gap-2">
            {selected.size > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => bulkDeleteMutation.mutate(Array.from(selected))}
              >
                Delete ({selected.size})
              </Button>
            )}
            <Button onClick={openAdd}>
              <Plus className="h-4 w-4 mr-2" /> Add Product
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="pl-9"
                />
              </div>
              <Select
                value={categoryFilter}
                onValueChange={(v) => {
                  setCategoryFilter(v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-37.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"all"}>All</SelectItem>
                  {categoryData?.data.map((c) => (
                    <SelectItem key={c.slug} value={c.slug}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={stockFilter}
                onValueChange={(v: StockType) => {
                  setStockFilter(v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-35">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stock</SelectItem>
                  <SelectItem value="in_stock">In Stock</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={sortBy}
                onValueChange={(val) => setSortBy(val as SortOptions | "all")}
              >
                <SelectTrigger className="w-42">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Recommended</SelectItem>
                  <SelectItem value="price_high">Price High to Low</SelectItem>
                  <SelectItem value="price_low">Price Low to High</SelectItem>
                  <SelectItem value="top_rated">Top Rated</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-3 text-left w-10">
                        {/* <Checkbox
                          checked={
                            paged.length > 0 &&
                            paged.every((p) => selected.has(p.id))
                          }
                          onCheckedChange={(c) => {
                            const s = new Set(selected);
                            paged.forEach((p) =>
                              c ? s.add(p.id) : s.delete(p.id),
                            );
                            setSelected(s);
                          }}
                        /> */}
                      </th>
                      <th className="p-3 text-left">Product</th>
                      <th className="p-3 text-left">Category</th>
                      <th className="p-3 text-right">Price</th>
                      <th className="p-3 text-center">Stock</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data?.data?.length ?? 0 > 0) ? (
                      data?.data?.map((p) => (
                        <tr
                          key={p.slug}
                          className="border-b hover:bg-muted/30 transition-colors"
                        >
                          <td className="p-3">
                            {/* <Checkbox
                            checked={selected.has(p.slug)}
                            onCheckedChange={(c) => {
                              const s = new Set(selected);
                              c ? s.add(p.slug) : s.delete(p.slug);
                              setSelected(s);
                            }}
                          /> */}
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={p?.variants?.[0]?.images?.[0]?.image_url}
                                alt={p.name}
                                className="h-10 w-10 rounded-lg object-cover"
                              />
                              <div>
                                <p className="font-medium">{p.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {p.brand}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">{p.category.name}</td>
                          <td className="p-3 text-right font-medium">
                            {formatCurrency(p.variants[0].original_price)}
                          </td>
                          <td className="p-3 text-center">
                            <Badge
                              variant={
                                p.variants[0].stock > 0
                                  ? "default"
                                  : "destructive"
                              }
                              className="text-xs"
                            >
                              {p.variants[0].stock > 0
                                ? "In Stock"
                                : "Out of Stock"}
                            </Badge>
                          </td>
                          <td className="p-3 text-center">
                            <Badge
                              variant={p.is_active ? "outline" : "secondary"}
                              className="text-xs"
                            >
                              {p.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setActiveTarget(p)}
                              >
                                {p.is_active ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => openEdit(p)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => setDeleteTarget(p.slug)}
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
                          className="p-10 text-center text-muted-foreground"
                        >
                          Product Not Found
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

      <ProductFormModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setEditingProduct(null);
        }}
        defaultValues={editingProduct || undefined}
        onSubmit={handleSubmit}
        isLoading={isMutating}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleteProductMutation.isPending}
        title="Delete Product"
        description="This will soft-delete the product. Are you sure?"
      />

      <ConfirmDialog
        open={activeTarget !== null}
        onOpenChange={() => setActiveTarget(null)}
        onConfirm={handleChangeStatus}
        title="Toggle Product Status"
        description="This will toggle the active status of this product."
        btnText="Change Status"
        loadingText="Changing..."
        loading={updateProductMutation.isPending}
      />
    </>
  );
};

export default AdminProducts;
