import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router";
import { Search, Plus, Edit2, Trash2, Eye, EyeOff, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/useToast";
import { products as initialProducts, type Product, categories } from "@/data/products";

const PAGE_SIZE = 8;

// const emptyProduct = (): Partial<Product> & { active: boolean } => ({
//   name: "", price: 0, category: "", brand: "", description: "", rating: 0, reviews: 0, inStock: true, active: true,
//   image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=750&fit=crop",
// });

const AdminProducts = () => {
  const navigate = useNavigate();
  const [productList, setProductList] = useState(() =>
    initialProducts.map((p) => ({ ...p, active: true, deleted: false }))
  );
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [page, setPage] = useState(1);
  const [editProduct, setEditProduct] = useState<(Partial<Product> & { active: boolean }) | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const filtered = useMemo(() => {
    let list = productList.filter((p) => !p.deleted);
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

  const handleSave = useCallback(() => {
    if (!editProduct?.name || !editProduct?.category) {
      toast({ title: "Validation Error", description: "Name and category are required." });
      return;
    }
    if (isNew) {
      const newP = { ...editProduct, id: Date.now(), rating: 0, reviews: 0, deleted: false } as any;
      setProductList((prev) => [newP, ...prev]);
      toast({ title: "Product added" });
    } else {
      setProductList((prev) => prev.map((p) => (p.id === editProduct.id ? { ...p, ...editProduct } : p)));
      toast({ title: "Product updated" });
    }
    setEditProduct(null);
  }, [editProduct, isNew]);

  const handleDelete = (id: number) => {
    setProductList((prev) => prev.map((p) => (p.id === id ? { ...p, deleted: true } : p)));
    toast({ title: "Product deleted" });
  };

  const toggleActive = (id: number) => {
    setProductList((prev) => prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));
  };

  const handleBulkDelete = () => {
    setProductList((prev) => prev.map((p) => (selected.has(p.id) ? { ...p, deleted: true } : p)));
    setSelected(new Set());
    toast({ title: `${selected.size} products deleted` });
  };

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
              <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                Delete ({selected.size})
              </Button>
            )}
            <Button onClick={() => navigate("/admin/products/add")}>
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
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleActive(p.id)}>
                            {p.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditProduct(p); setIsNew(false); }}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(p.id)}>
                            <Trash2 className="h-4 w-4" />
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

      {/* Edit / Add Modal */}
      <Dialog open={!!editProduct} onOpenChange={() => setEditProduct(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">{isNew ? "Add Product" : "Edit Product"}</DialogTitle>
          </DialogHeader>
          {editProduct && (
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={editProduct.name} onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Price</Label>
                  <Input type="number" value={editProduct.price} onChange={(e) => setEditProduct({ ...editProduct, price: +e.target.value })} />
                </div>
                <div>
                  <Label>Brand</Label>
                  <Input value={editProduct.brand} onChange={(e) => setEditProduct({ ...editProduct, brand: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>Category</Label>
                <Select value={editProduct.category} onValueChange={(v) => setEditProduct({ ...editProduct, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.filter((c) => c !== "All").map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={editProduct.description} onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })} />
              </div>
              <div>
                <Label>Image URL</Label>
                <Input value={editProduct.image} onChange={(e) => setEditProduct({ ...editProduct, image: e.target.value })} />
                {editProduct.image && <img src={editProduct.image} alt="preview" className="h-20 w-20 rounded-lg object-cover mt-2" />}
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={editProduct.inStock} onCheckedChange={(c) => setEditProduct({ ...editProduct, inStock: !!c })} />
                  In Stock
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={editProduct.active} onCheckedChange={(c) => setEditProduct({ ...editProduct, active: !!c })} />
                  Active
                </label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditProduct(null)}>Cancel</Button>
            <Button onClick={handleSave}>{isNew ? "Add Product" : "Save Changes"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminProducts;
