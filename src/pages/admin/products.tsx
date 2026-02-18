import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Plus, Edit2, Trash2, Eye, EyeOff, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/useToast";
import { productService, type AdminProduct, categories } from "@/services/productService";
import ProductFormModal from "@/components/admin/product/productFormModal";
import DeleteConfirmDialog from "@/components/admin/common/deleteConfirmModal";
import { useAddProduct } from "@/services/product/product.query";
import type { ProductFormValues } from "@/components/admin/product/product.types";

const PAGE_SIZE = 8;

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<(AdminProduct & { id: number }) | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  // React Query
  const { data: productList = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: productService.getAll,
  });

  const addProductMutation = useAddProduct();

  const createMutation = useMutation({
    mutationFn: (data: ProductFormValues) => productService.create({ ...data, active: data.active, price: data.price }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Product added" });
      setModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductFormValues }) => productService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Product updated" });
      setModalOpen(false);
      setEditingProduct(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: productService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Product deleted" });
      setDeleteTarget(null);
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: productService.bulkDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: `${selected.size} products deleted` });
      setSelected(new Set());
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) => productService.update(id, { active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  const filtered = useMemo(() => {
    let list = [...productList];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }
    if (categoryFilter !== "All") list = list.filter((p) => p.category === categoryFilter);
    if (stockFilter === "inStock") list = list.filter((p) => p.inStock);
    if (stockFilter === "outOfStock") list = list.filter((p) => !p.inStock);
    list.sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "created") return b.id - a.id;
      return a.name.localeCompare(b.name);
    });
    return list;
  }, [productList, search, categoryFilter, stockFilter, sortBy]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openAdd = () => { setEditingProduct(null); setModalOpen(true); };
  const openEdit = (p: AdminProduct) => { setEditingProduct(p); setModalOpen(true); };

  const handleSubmit = async (values: FormData) => {
    if (editingProduct) {
      // updateMutation.mutate({ id: editingProduct.id, data: values });
    } else {
      console.log(values);
      const res = await addProductMutation.mutateAsync(values);
      console.log(res)
      // createMutation.mutate(values);
    }
  };

  const isMutating = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold">Products</h1>
            <p className="text-muted-foreground text-sm">{filtered.length} products</p>
          </div>
          <div className="flex gap-2">
            {selected.size > 0 && (
              <Button variant="destructive" size="sm" onClick={() => bulkDeleteMutation.mutate(Array.from(selected))}>
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
                <Input placeholder="Search products..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9" />
              </div>
              <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setPage(1); }}>
                <SelectTrigger className="w-37.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={stockFilter} onValueChange={(v) => { setStockFilter(v); setPage(1); }}>
                <SelectTrigger className="w-35"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stock</SelectItem>
                  <SelectItem value="inStock">In Stock</SelectItem>
                  <SelectItem value="outOfStock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-35"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="created">Newest</SelectItem>
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
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-3 text-left w-10">
                        <Checkbox
                          checked={paged.length > 0 && paged.every((p) => selected.has(p.id))}
                          onCheckedChange={(c) => {
                            const s = new Set(selected);
                            paged.forEach((p) => (c ? s.add(p.id) : s.delete(p.id)));
                            setSelected(s);
                          }}
                        />
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
                    {paged.map((p) => (
                      <tr key={p.id} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="p-3">
                          <Checkbox checked={selected.has(p.id)} onCheckedChange={(c) => {
                            const s = new Set(selected);
                            c ? s.add(p.id) : s.delete(p.id);
                            setSelected(s);
                          }} />
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                            <div>
                              <p className="font-medium">{p.name}</p>
                              <p className="text-xs text-muted-foreground">{p.brand}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">{p.category}</td>
                        <td className="p-3 text-right font-medium">${p.price}</td>
                        <td className="p-3 text-center">
                          <Badge variant={p.inStock ? "default" : "destructive"} className="text-xs">
                            {p.inStock ? "In Stock" : "Out"}
                          </Badge>
                        </td>
                        <td className="p-3 text-center">
                          <Badge variant={p.active ? "outline" : "secondary"} className="text-xs">
                            {p.active ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleActiveMutation.mutate({ id: p.id, active: !p.active })}>
                              {p.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(p)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteTarget(p.id)}>
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

      <ProductFormModal
        open={modalOpen}
        onOpenChange={(open) => { setModalOpen(open); if (!open) setEditingProduct(null); }}
        defaultValues={editingProduct ? {
          ...editingProduct,
          slug: editingProduct.name ? editingProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "",
          brand: editingProduct.brand || "",
          description: editingProduct.description || "",
          image: editingProduct.image || "",
          variants: [{ color: "", size: "", sku: `SKU-${editingProduct.id}`, originalPrice: editingProduct.price, discountedPrice: editingProduct.price, stock: editingProduct.inStock ? 10 : 0, isActive: true, images: editingProduct.image ? [{ id: "1", url: editingProduct.image, isPrimary: true }] : [] }],
        } : undefined}
        onSubmit={handleSubmit}
        isLoading={isMutating}
      />

      <DeleteConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget)}
        title="Delete Product"
        description="This will soft-delete the product. Are you sure?"
      />
    </>
  );
};

export default AdminProducts;
