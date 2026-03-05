import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/useToast";
import "react-phone-input-2/lib/style.css";
import AddressForm from "../profile/addressForm";
import { useDeleteAddress, useGetAddresses } from "@/services/user/user.query";
import type { Address } from "@/services/user/user.types";
import ConfirmDialog from "@/components/admin/common/confirmModal";

interface AddressManagerProps {
  onSelect: (address: Address) => void;
  selectedId?: string;
}

const AddressManager = ({ onSelect, selectedId }: AddressManagerProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editAddress, setEditAddress] = useState<Address | undefined>(
    undefined,
  );
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const { data, isFetching } = useGetAddresses();
  const deleteAddressMutation = useDeleteAddress();
  console.log({ data, isFetching });

  const openAdd = () => {
    setEditAddress(undefined);
    setModalOpen(true);
  };

  const openEdit = (addr: Address) => {
    setEditAddress(addr);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await deleteAddressMutation.mutateAsync(deleteTarget);
    if (res.success) {
      toast({ title: "Address removed" });
      setDeleteTarget(null);
    } else {
      toast({
        title: "Failed to remove address",
        description: res.message || "Please try again",
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-lg">Delivery Address</h2>
        <Button variant="outline" size="sm" onClick={openAdd}>
          <Plus className="h-4 w-4 mr-1" /> Add New
        </Button>
      </div>

      {/* Address List */}
      <RadioGroup
        value={selectedId}
        onValueChange={(val) => {
          const addr = data?.data.find((a) => a.id === val);
          if (addr) onSelect(addr);
        }}
      >
        <div className="grid gap-3">
          <AnimatePresence>
            {data?.data?.map((addr) => (
              <motion.label
                key={addr.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                htmlFor={addr.id}
                className={`relative flex gap-3 border rounded-xl p-4 cursor-pointer ${
                  selectedId === addr.id ? "border-primary bg-primary/5" : ""
                }`}
              >
                <RadioGroupItem value={addr.id} id={addr.id} />
                <div className="flex-1">
                  {/* <p className="font-semibold">{addr.label}</p> */}
                  <p className="text-sm text-muted-foreground">
                    {addr.first_name} {addr.last_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {addr.line1}, {addr.line2}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {addr.city}, {addr.state}, {addr.pin_code}
                  </p>
                  <p className="text-xs text-muted-foreground">{`${addr.phone_code} ${addr.phone_number}`}</p>
                </div>

                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault();
                      openEdit(addr);
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault();
                      setDeleteTarget(addr.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>

                {selectedId === addr.id && (
                  <Check className="absolute top-3 right-3 h-4 w-4 text-primary" />
                )}
              </motion.label>
            ))}
          </AnimatePresence>
        </div>
      </RadioGroup>

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editAddress ? "Edit Address" : "Add Address"}
            </DialogTitle>
          </DialogHeader>

          <AddressForm modalControl={setModalOpen} data={editAddress} />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Address"
        description="This will permanently remove this address."
        loading={deleteAddressMutation.isPending}
        loadingText="Deleting..."
      />
    </div>
  );
};

export default AddressManager;
