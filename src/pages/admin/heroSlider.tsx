import { useState } from "react";
import { Plus, Edit2, Trash2, Search, EyeOff, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/useToast";
import {
  useAddHeroSlide,
  useDeleteHeroSlide,
  useGetHeroSlides,
  useUpdateHeroSlide,
} from "@/services/slides/heroSlides.query";
import type { HeroSlide } from "@/services/slides/heroSlides.types";
import type { heroSliderFormValues } from "@/components/admin/form/heroSliderFormModal";
import HeroSliderFormModal from "@/components/admin/form/heroSliderFormModal";
import ConfirmDialog from "@/components/admin/common/confirmModal";
import { convertToNewline } from "@/utils/utils";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const HeroSliders = () => {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlider, setEditingSlider] = useState<HeroSlide | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [activeTarget, setActiveTarget] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useGetHeroSlides({
    search: debouncedSearch,
    is_active: activeFilter === "active" ? true : activeFilter === "inactive" ? false : undefined,
  });

  const addHeroSliderMutation = useAddHeroSlide();
  const updateHeroSliderMutation = useUpdateHeroSlide();
  const deleteHeroSliderMutation = useDeleteHeroSlide();

  const handleSubmit = async (values: heroSliderFormValues) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("cta", values.cta);
    formData.append("link", values.link);
    console.log({ values });
    if (values.image) {
      formData.append("image", values?.image);
    }

    if (editingSlider) {
      const response = await updateHeroSliderMutation.mutateAsync({
        id: editingSlider.id,
        body: formData,
      });
      if (response.success) {
        toast({
          title: "Hero Slider updated successfully",
          description: response.message,
        });
        setModalOpen(false);
        setEditingSlider(null);
      }
    } else {
      const response = await addHeroSliderMutation.mutateAsync(formData);
      if (response.success) {
        toast({
          title: "HeroSlider added successfully",
          description: response.message,
        });
        setModalOpen(false);
      }
    }
  };

  const handleChangeStatus = async () => {
    if (!activeTarget) return;
    const slider = data?.data.find((s) => s.id === activeTarget);
    if (!slider) return;

    const formData = new FormData();
    formData.append("is_active", (!slider.is_active).toString());

    const response = await updateHeroSliderMutation.mutateAsync({
      id: slider.id,
      body: formData,
    });
    if (response.success) {
      toast({
        title: `Hero Slider ${slider.is_active ? "deactivated" : "activated"}`,
        description: response.message,
      });
      setActiveTarget(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const response = await deleteHeroSliderMutation.mutateAsync(deleteTarget);
    if (response.success) {
      toast({
        title: "HeroSlider deleted successfully",
        description: response.message,
      });
      setDeleteTarget(null);
    }
  };

  const isMutating =
    addHeroSliderMutation.isPending || updateHeroSliderMutation.isPending;

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold">Hero Sliders</h1>
            <p className="text-muted-foreground text-sm">
              {data?.data.length} hero sliders
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingSlider(null);
              setModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Hero Slider
          </Button>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search categories..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={activeFilter} onValueChange={setActiveFilter}>
                <SelectTrigger className="w-37.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"all"}>All</SelectItem>
                  <SelectItem value={"active"}>Active</SelectItem>
                  <SelectItem value={"inactive"}>Inactive</SelectItem>
                </SelectContent>
              </Select>
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
                      <th className="p-3 text-left">Tile</th>
                      <th className="p-3 text-left">Description</th>
                      <th className="p-3 text-center">CTA</th>
                      <th className="p-3 text-left">Link</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.data.map((slider, idx: number) => (
                      <tr
                        key={idx}
                        className="border-b hover:bg-muted/30 transition-colors"
                      >
                        <td className="p-3">
                          {slider.image_url ? (
                            <img
                              src={slider.image_url}
                              alt={slider.title}
                              className="h-10 w-10 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground">
                              —
                            </div>
                          )}
                        </td>
                        <td className="p-3 font-medium whitespace-pre-line leading-tight">
                          {convertToNewline(slider.title)}
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {slider.description}
                        </td>
                        <td className="p-3 text-center">{slider.cta}</td>
                        <td className="p-3 text-muted-foreground">
                          {slider.link}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setActiveTarget(slider.id)}
                            >
                              {slider.is_active ? (
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
                                setEditingSlider(slider);
                                setModalOpen(true);
                              }}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => setDeleteTarget(slider.id)}
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

      <HeroSliderFormModal
        open={modalOpen}
        onOpenChange={(open: any) => {
          setModalOpen(open);
          if (!open) setEditingSlider(null);
        }}
        defaultValues={editingSlider}
        onSubmit={handleSubmit}
        isLoading={isMutating}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Hero Slider"
        description="This will permanently remove this sliders. Categories with products cannot be deleted."
        loading={deleteHeroSliderMutation.isPending}
      />
      <ConfirmDialog
        open={activeTarget !== null}
        onOpenChange={() => setActiveTarget(null)}
        onConfirm={handleChangeStatus}
        title="Toggle Hero Slider Status"
        description="This will toggle the active status of this slider."
        btnText="Change Status"
        loadingText="Changing..."
        loading={updateHeroSliderMutation.isPending}
      />
    </>
  );
};

export default HeroSliders;
