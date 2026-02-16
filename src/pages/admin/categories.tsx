import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/useToast";
import CategoryFormModal, {
  type CategoryFormValues,
} from "@/components/admin/category/categoryFormModal";
import DeleteConfirmDialog from "@/components/admin/common/deleteConfirmModal";
import { categoryService } from "@/services/categoryService";
import type { Category } from "@/data/adminData";
import { useAddCategory, useGetCategory } from "@/services/category/category.query";

const AdminCategories = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const { data: catList = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getAll,
  });

  const { data, isFetching } = useGetCategory();

  const addCategoryMutation = useAddCategory();
  const createMutation = useMutation({
    mutationFn: (data: { name: string; image?: string }) =>
      categoryService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({ title: "Category added" });
      setModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { name: string; image?: string };
    }) => categoryService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({ title: "Category updated" });
      setModalOpen(false);
      setEditingCat(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: categoryService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({ title: "Category deleted" });
      setDeleteTarget(null);
    },
    onError: (err: Error) =>
      toast({ title: "Error", description: err.message }),
  });

  console.log({data})

  const filtered = useMemo(() => {
    if (!search) return catList;
    const q = search.toLowerCase();
    return catList.filter((c) => c.name.toLowerCase().includes(q));
  }, [catList, search]);

  const handleSubmit = async (values: CategoryFormValues) => {
    const formData = new FormData();
    formData.append("name", values.name);
    if (values.image) {
      formData.append("image", values?.image);
    }

    if (editingCat) {
      return;
    } else {
      const response = await addCategoryMutation.mutateAsync(formData);
      if (response.success) {
        toast({
          title: "Category added suceessfully",
          description: response.message,
        });
        setModalOpen(false);
      }
    }

    // const data = { name: values.name, image: values.image };
    // if (editingCat) {
    //   updateMutation.mutate({ id: editingCat.id, data });
    // } else {
    //   createMutation.mutate(data);
    // }
  };

  const isMutating = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold">Categories</h1>
            <p className="text-muted-foreground text-sm">
              {filtered.length} categories
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingCat(null);
              setModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Category
          </Button>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
                      <th className="p-3 text-left">Image</th>
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Slug</th>
                      <th className="p-3 text-center">Products</th>
                      <th className="p-3 text-left">Created</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.data.map((cat, idx: number) => (
                      <tr
                        key={idx}
                        className="border-b hover:bg-muted/30 transition-colors"
                      >
                        <td className="p-3">
                          {cat.image_url ? (
                            <img
                              src={cat.image_url}
                              alt={cat.name}
                              className="h-10 w-10 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground">
                              —
                            </div>
                          )}
                        </td>
                        <td className="p-3 font-medium">{cat.name}</td>
                        <td className="p-3 text-muted-foreground">
                          /{cat.slug}
                        </td>
                        <td className="p-3 text-center">{cat.productCount}</td>
                        <td className="p-3 text-muted-foreground">
                          {cat.createdAt}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                setEditingCat(cat);
                                setModalOpen(true);
                              }}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => setDeleteTarget(cat.id)}
                            >
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
          </CardContent>
        </Card>
      </div>

      <CategoryFormModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setEditingCat(null);
        }}
        defaultValues={editingCat}
        onSubmit={handleSubmit}
        isLoading={isMutating}
      />

      <DeleteConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget)}
        title="Delete Category"
        description="This will permanently remove this category. Categories with products cannot be deleted."
      />
    </>
  );
};

export default AdminCategories;
