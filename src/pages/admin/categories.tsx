import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/useToast";
import { mockCategories, type Category } from "@/data/adminData";

const AdminCategories = () => {
  const [catList, setCatList] = useState<Category[]>(mockCategories);
  const [editCat, setEditCat] = useState<Partial<Category> | null>(null);
  const [isNew, setIsNew] = useState(false);

  const slugify = (s: string) => s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const handleSave = () => {
    if (!editCat?.name) {
      toast({ title: "Name is required" });
      return;
    }
    const slug = slugify(editCat.name);
    if (isNew) {
      setCatList((prev) => [...prev, { id: `cat_${Date.now()}`, name: editCat.name!, slug, productCount: 0, createdAt: new Date().toISOString().split("T")[0] }]);
      toast({ title: "Category added" });
    } else {
      setCatList((prev) => prev.map((c) => (c.id === editCat.id ? { ...c, name: editCat.name!, slug } : c)));
      toast({ title: "Category updated" });
    }
    setEditCat(null);
  };

  const handleDelete = (cat: Category) => {
    if (cat.productCount > 0) {
      toast({ title: "Cannot delete", description: `This category has ${cat.productCount} products linked.` });
      return;
    }
    setCatList((prev) => prev.filter((c) => c.id !== cat.id));
    toast({ title: "Category deleted" });
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold">Categories</h1>
            <p className="text-muted-foreground text-sm">{catList.length} categories</p>
          </div>
          <Button onClick={() => { setEditCat({ name: "" }); setIsNew(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Add Category
          </Button>
        </div>

        <div className="grid gap-3">
          {catList.map((cat) => (
            <Card key={cat.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{cat.name}</p>
                  <p className="text-xs text-muted-foreground">/{cat.slug} · {cat.productCount} products · Created {cat.createdAt}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditCat(cat); setIsNew(false); }}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(cat)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!editCat} onOpenChange={() => setEditCat(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display">{isNew ? "Add Category" : "Edit Category"}</DialogTitle>
          </DialogHeader>
          {editCat && (
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={editCat.name} onChange={(e) => setEditCat({ ...editCat, name: e.target.value })} />
              </div>
              <p className="text-xs text-muted-foreground">Slug: /{slugify(editCat.name || "")}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditCat(null)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminCategories;
