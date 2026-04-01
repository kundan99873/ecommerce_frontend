import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  Copy,
  RotateCw,
} from "lucide-react";
import { toast } from "@/hooks/useToast";
import {
  useGetProductUnserviceablePincodes,
  useAddProductUnserviceablePincodes,
  useRemoveProductUnserviceablePincode,
  useRemoveMultipleProductUnserviceablePincodes,
  useReplaceProductUnserviceablePincodes,
} from "@/services/product/product-pincode.query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProductPincodesModalProps {
  productSlug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProductPincodesModal = ({
  productSlug,
  open,
  onOpenChange,
}: ProductPincodesModalProps) => {
  const [newPincodeInput, setNewPincodeInput] = useState("");
  const [bulkPincodeInput, setBulkPincodeInput] = useState("");
  const [selectedPincodes, setSelectedPincodes] = useState<Set<string>>(
    new Set(),
  );
  const [mode, setMode] = useState<"view" | "add" | "bulk">("view");
  const [replaceDialogOpen, setReplaceDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: pincodesData, isLoading } =
    useGetProductUnserviceablePincodes(productSlug);
  const addPincodesMutation = useAddProductUnserviceablePincodes();
  const removePincodeMutation = useRemoveProductUnserviceablePincode();
  const removeMultiplePincodesMutation =
    useRemoveMultipleProductUnserviceablePincodes();
  const replacePincodesMutation = useReplaceProductUnserviceablePincodes();

  const pincodes = pincodesData?.data?.unserviceable_pincodes ?? [];

  const handleAddPincode = async () => {
    if (!newPincodeInput.trim()) {
      toast({ title: "Please enter a pincode" });
      return;
    }

    const pincode = newPincodeInput.trim();

    if (!/^\d{6}$/.test(pincode)) {
      toast({ title: "Invalid pincode format. Use 6 digits." });
      return;
    }

    if (pincodes.includes(pincode)) {
      toast({ title: "This pincode is already listed" });
      return;
    }

    try {
      await addPincodesMutation.mutateAsync({
        slug: productSlug,
        pincodes: [pincode],
      });
      toast({ title: "Pincode added successfully" });
      setNewPincodeInput("");
    } catch (error) {
      toast({
        title: "Failed to add pincode",
        description: (error as any)?.message || "Please try again.",
      });
    }
  };

  const handleBulkAdd = async () => {
    if (!bulkPincodeInput.trim()) {
      toast({ title: "Please enter pincodes" });
      return;
    }

    const inputPincodes = bulkPincodeInput
      .split(/[\s,\n]+/)
      .map((p) => p.trim())
      .filter((p) => p);

    if (inputPincodes.length === 0) {
      toast({ title: "No valid pincodes found" });
      return;
    }

    const validPincodes = inputPincodes.filter((p) => /^\d{6}$/.test(p));
    const invalidPincodes = inputPincodes.filter((p) => !/^\d{6}$/.test(p));

    if (invalidPincodes.length > 0) {
      toast({
        title: `${invalidPincodes.length} invalid pincodes found`,
        description: `Only 6-digit codes are allowed. Invalid: ${invalidPincodes.join(", ")}`,
      });
    }

    if (validPincodes.length === 0) return;

    try {
      await addPincodesMutation.mutateAsync({
        slug: productSlug,
        pincodes: validPincodes,
      });
      toast({
        title: `${validPincodes.length} pincodes added successfully`,
      });
      setBulkPincodeInput("");
      setMode("view");
    } catch (error) {
      toast({
        title: "Failed to add pincodes",
        description: (error as any)?.message || "Please try again.",
      });
    }
  };

  const handleReplacePincodes = async () => {
    if (!bulkPincodeInput.trim()) {
      toast({ title: "Please enter pincodes" });
      return;
    }

    const inputPincodes = bulkPincodeInput
      .split(/[\s,\n]+/)
      .map((p) => p.trim())
      .filter((p) => p);

    if (inputPincodes.length === 0) {
      toast({ title: "No valid pincodes found" });
      return;
    }

    const validPincodes = inputPincodes.filter((p) => /^\d{6}$/.test(p));
    const invalidPincodes = inputPincodes.filter((p) => !/^\d{6}$/.test(p));

    if (invalidPincodes.length > 0) {
      toast({
        title: `${invalidPincodes.length} invalid pincodes found`,
        description: `Only 6-digit codes are allowed. Invalid: ${invalidPincodes.join(", ")}`,
      });
    }

    if (validPincodes.length === 0) return;

    try {
      await replacePincodesMutation.mutateAsync({
        slug: productSlug,
        pincodes: validPincodes,
      });
      toast({
        title: "Pincodes replaced successfully",
      });
      setBulkPincodeInput("");
      setReplaceDialogOpen(false);
      setMode("view");
    } catch (error) {
      toast({
        title: "Failed to replace pincodes",
        description: (error as any)?.message || "Please try again.",
      });
    }
  };

  const handleDeletePincode = async (pincode: string) => {
    try {
      await removePincodeMutation.mutateAsync({
        slug: productSlug,
        pincode,
      });
      toast({ title: "Pincode deleted successfully" });
    } catch (error) {
      toast({
        title: "Failed to delete pincode",
        description: (error as any)?.message || "Please try again.",
      });
    }
  };

  const handleDeleteSelectedPincodes = async () => {
    if (selectedPincodes.size === 0) {
      toast({ title: "No pincodes selected" });
      return;
    }

    try {
      await removeMultiplePincodesMutation.mutateAsync({
        slug: productSlug,
        pincodes: Array.from(selectedPincodes),
      });
      toast({
        title: `${selectedPincodes.size} pincodes deleted successfully`,
      });
      setSelectedPincodes(new Set());
      setDeleteDialogOpen(false);
    } catch (error) {
      toast({
        title: "Failed to delete pincodes",
        description: (error as any)?.message || "Please try again.",
      });
    }
  };

  const togglePincode = (pincode: string) => {
    const newSelected = new Set(selectedPincodes);
    if (newSelected.has(pincode)) {
      newSelected.delete(pincode);
    } else {
      newSelected.add(pincode);
    }
    setSelectedPincodes(newSelected);
  };

  const allSelected =
    pincodes.length > 0 && selectedPincodes.size === pincodes.length;
  const someSelected =
    selectedPincodes.size > 0 && selectedPincodes.size < pincodes.length;

  const toggleAllPincodes = () => {
    if (allSelected) {
      setSelectedPincodes(new Set());
    } else {
      setSelectedPincodes(new Set(pincodes));
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">
              Manage Unserviceable Pincodes
            </DialogTitle>
            <DialogDescription>
              Add, modify, or delete unserviceable pincodes for this product
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Current Pincodes */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">
                    Current Unserviceable Pincodes{" "}
                    <Badge variant="secondary" className="ml-2">
                      {pincodes.length}
                    </Badge>
                  </h3>
                </div>

                {pincodes.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-muted-foreground/25 p-6 text-center">
                    <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No unserviceable pincodes configured yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                      <Checkbox
                        checked={allSelected}
                        indeterminate={someSelected}
                        onCheckedChange={toggleAllPincodes}
                        id="select-all"
                      />
                      <Label
                        htmlFor="select-all"
                        className="cursor-pointer flex-1"
                      >
                        Select All
                      </Label>
                      {selectedPincodes.size > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {selectedPincodes.size} selected
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-56 overflow-y-auto p-2 border rounded-lg bg-muted/10">
                      {pincodes.map((pincode) => (
                        <div
                          key={pincode}
                          className="flex items-center gap-2 p-2 rounded border hover:bg-muted/50 transition-colors"
                        >
                          <Checkbox
                            checked={selectedPincodes.has(pincode)}
                            onCheckedChange={() => togglePincode(pincode)}
                            id={`pincode-${pincode}`}
                          />
                          <Label
                            htmlFor={`pincode-${pincode}`}
                            className="cursor-pointer text-sm font-mono flex-1"
                          >
                            {pincode}
                          </Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => handleDeletePincode(pincode)}
                            disabled={removePincodeMutation.isPending}
                          >
                            {removePincodeMutation.isPending ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Mode Selection */}
              {mode === "view" &&
                pincodes.length > 0 &&
                selectedPincodes.size > 0 && (
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeleteDialogOpen(true)}
                      disabled={removeMultiplePincodesMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Selected ({selectedPincodes.size})
                    </Button>
                  </div>
                )}

              {/* Add Mode */}
              {mode === "add" && (
                <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
                  <h4 className="font-semibold text-sm">Add Single Pincode</h4>
                  <div className="space-y-2">
                    <Label>Pincode</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter 6-digit pincode (e.g., 110001)"
                        value={newPincodeInput}
                        onChange={(e) => setNewPincodeInput(e.target.value)}
                        maxLength={6}
                        pattern="\d{6}"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") handleAddPincode();
                        }}
                      />
                      <Button
                        onClick={handleAddPincode}
                        disabled={addPincodesMutation.isPending}
                      >
                        {addPincodesMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMode("view")}
                  >
                    Cancel
                  </Button>
                </div>
              )}

              {/* Bulk Mode */}
              {mode === "bulk" && (
                <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
                  <h4 className="font-semibold text-sm">
                    Add Multiple Pincodes
                  </h4>
                  <div className="space-y-2">
                    <Label>Enter pincodes</Label>
                    <Textarea
                      placeholder="Enter pincodes separated by spaces, commas, or new lines&#10;Example: 110001 110002, 110003&#10;110004"
                      value={bulkPincodeInput}
                      onChange={(e) => setBulkPincodeInput(e.target.value)}
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground">
                      Accepts 6-digit pincodes separated by spaces, commas, or
                      new lines
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleBulkAdd}
                      disabled={addPincodesMutation.isPending}
                    >
                      {addPincodesMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Plus className="h-4 w-4 mr-2" />
                      )}
                      Add Pincodes
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setMode("view")}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {mode === "view" && (
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => setMode("add")} variant="outline">
                    <Plus className="h-4 w-4 mr-2" /> Add Pincode
                  </Button>
                  <Button onClick={() => setMode("bulk")} variant="outline">
                    <Copy className="h-4 w-4 mr-2" /> Add Multiple
                  </Button>
                  {pincodes.length > 0 && (
                    <Button
                      onClick={() => setReplaceDialogOpen(true)}
                      variant="outline"
                    >
                      <RotateCw className="h-4 w-4 mr-2" /> Replace All
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Multiple Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Pincodes</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedPincodes.size}{" "}
              pincode(s)? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteSelectedPincodes}
              disabled={removeMultiplePincodesMutation.isPending}
            >
              {removeMultiplePincodesMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Replace Dialog */}
      <AlertDialog open={replaceDialogOpen} onOpenChange={setReplaceDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Replace All Pincodes</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete all existing pincodes and replace them with new
              ones.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label>Enter new pincodes</Label>
            <Textarea
              placeholder="Enter pincodes separated by spaces, commas, or new lines"
              value={bulkPincodeInput}
              onChange={(e) => setBulkPincodeInput(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Accepts 6-digit pincodes
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleReplacePincodes}
              disabled={replacePincodesMutation.isPending}
            >
              {replacePincodesMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Replace All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProductPincodesModal;
