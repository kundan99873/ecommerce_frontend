import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  User,
  MapPin,
  Package,
  Lock,
  Camera,
  Plus,
  Pencil,
  Trash2,
  LogOut,
  Loader2,
  Heart,
  Ticket,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
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
import ImageUpload from "@/components/common/imageUpload";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/authContext";
import { toast } from "@/hooks/useToast";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import dayjs from "dayjs";
import {
  useAddAddress,
  useDeleteAddress,
  useGetUserProfile,
  useUpdateAddress,
  useUpdateUserProfile,
} from "@/services/user/user.query";
import { useChangePassword } from "@/services/auth/auth.query";
import type { AddAddressBody, Address } from "@/services/user/user.types";
import { formatCurrency } from "@/utils/utils";

const EMPTY_ADDRESS: AddAddressBody = {
  first_name: "",
  last_name: "",
  phone_number: "",
  phone_code: "+1",
  line1: "",
  line2: "",
  city: "",
  state: "",
  country: "US",
  pin_code: "",
  landmark: "",
};

const Profile = () => {
  const { logout, logoutLoading } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading, isFetching } = useGetUserProfile();
  const addAddressMutation = useAddAddress();
  const updateAddressMutation = useUpdateAddress();
  const deleteAddressMutation = useDeleteAddress();
  const changePasswordMutation = useChangePassword();
  const updateProfileMutation = useUpdateUserProfile();

  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(
    null,
  );
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [newAddr, setNewAddr] = useState<AddAddressBody>(EMPTY_ADDRESS);

  const profile = data?.data;
  const personalInfo = profile?.personal_info;
  const summary = profile?.summary;
  const addresses = profile?.address_details ?? [];
  const orders = profile?.order_details ?? [];
  const memberSince =
    (profile as { created_at?: string } | undefined)?.created_at ??
    new Date().toISOString();

  const resetAddressForm = () => {
    setNewAddr({ ...EMPTY_ADDRESS });
    setEditingAddressId(null);
  };

  const openAddAddressForm = () => {
    resetAddressForm();
    setAddressModalOpen(true);
  };

  const openEditAddressForm = (address: Address) => {
    setEditingAddressId(String(address.id));
    setNewAddr({
      first_name: address.first_name,
      last_name: address.last_name,
      phone_number: address.phone_number,
      phone_code: address.phone_code,
      line1: address.line1,
      line2: address.line2 ?? "",
      city: address.city,
      state: address.state,
      country: address.country,
      pin_code: address.pin_code,
      landmark: address.landmark ?? "",
    });
    setAddressModalOpen(true);
  };

  const handleSaveAddress = async () => {
    if (
      !newAddr.first_name ||
      !newAddr.last_name ||
      !newAddr.phone_number ||
      !newAddr.line1 ||
      !newAddr.city ||
      !newAddr.state ||
      !newAddr.pin_code
    ) {
      toast({
        title: "Missing fields",
        description: "Please fill all required address fields.",
      });
      return;
    }

    try {
      if (editingAddressId) {
        await updateAddressMutation.mutateAsync({
          id: editingAddressId,
          data: newAddr,
        });
        toast({ title: "Address updated" });
      } else {
        await addAddressMutation.mutateAsync(newAddr);
        toast({ title: "Address added" });
      }

      setAddressModalOpen(false);
      resetAddressForm();
    } catch {
      toast({
        title: editingAddressId
          ? "Failed to update address"
          : "Failed to add address",
      });
    }
  };

  const handleDeleteAddress = async () => {
    if (!addressToDelete) return;

    try {
      await deleteAddressMutation.mutateAsync(addressToDelete);
      toast({ title: "Address removed" });
      setAddressToDelete(null);
    } catch {
      toast({ title: "Failed to remove address" });
    }
  };

  const handleChangePassword = async () => {
    if (!currentPass.trim() || !newPass.trim() || !confirmPass.trim()) {
      toast({ title: "All password fields are required" });
      return;
    }

    if (newPass.length < 8) {
      toast({ title: "Password too short" });
      return;
    }
    if (newPass !== confirmPass) {
      toast({ title: "Passwords don't match" });
      return;
    }

    try {
      const response = await changePasswordMutation.mutateAsync({
        current_password: currentPass,
        new_password: newPass,
      });

      if (!response.success) {
        toast({
          title: "Password update failed",
          description:
            response.message || "Please verify your current password.",
        });
        return;
      }

      toast({
        title: "Password updated",
        description:
          response.message || "Your password has been changed successfully.",
      });

      setCurrentPass("");
      setNewPass("");
      setConfirmPass("");
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Unable to change password right now.";

      toast({ title: "Password update failed", description: message });
    }
  };

  const handleAvatarFileChange = (file: File | null) => {
    if (!file) return;

    const allowedMimeTypes = ["image/jpeg", "image/png"];
    const fileName = file.name.toLowerCase();
    const hasValidExtension =
      fileName.endsWith(".jpg") ||
      fileName.endsWith(".jpeg") ||
      fileName.endsWith(".png");

    if (!allowedMimeTypes.includes(file.type) || !hasValidExtension) {
      toast({ title: "Only JPG, JPEG, and PNG images are allowed" });
      return;
    }

    setSelectedAvatarFile(file);
  };

  const handleAvatarUpdate = async () => {
    if (!selectedAvatarFile) {
      toast({ title: "Please select an image" });
      return;
    }

    const formData = new FormData();
    formData.append("avatar", selectedAvatarFile);

    try {
      const response = await updateProfileMutation.mutateAsync(formData);

      if (!response.success) {
        toast({
          title: "Failed to update avatar",
          description: response.message || "Please try again.",
        });
        return;
      }

      toast({
        title: "Profile icon updated",
        description: response.message || "Your avatar has been updated.",
      });

      setAvatarModalOpen(false);
      setSelectedAvatarFile(null);
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Unable to update avatar right now.";

      toast({ title: "Failed to update avatar", description: message });
    }
  };

  const handleLogout = async () => {
    const response = await logout();

    if (response.success) {
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
      navigate("/", { replace: true });
      return;
    }

    toast({
      title: "Logout failed",
      description: response.message || "An error occurred while logging out.",
    });
  };

  if (isLoading || isFetching) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-10">
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-56" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="ml-auto h-9 w-28" />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>

          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile || !personalInfo) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-10">
        <p className="text-center text-muted-foreground">
          Unable to load profile.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="mb-8 flex items-center gap-4">
          <div className="relative h-20 w-20">
            <div className="h-20 w-20 overflow-hidden rounded-full bg-secondary">
              {personalInfo.avatar_url ? (
                <img
                  src={personalInfo.avatar_url}
                  alt={personalInfo.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-display font-bold text-muted-foreground">
                  {personalInfo.name?.charAt(0) || "U"}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setAvatarModalOpen(true)}
              className="absolute -bottom-1 -right-1 rounded-full bg-primary p-1.5 text-primary-foreground"
              aria-label="Update profile icon"
            >
              <Camera className="h-3 w-3" />
            </button>
          </div>

          <div>
            <h1 className="text-2xl font-display font-bold">
              {personalInfo.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              {personalInfo.email}
            </p>
            <p className="text-xs text-muted-foreground">
              Member since {dayjs(memberSince).format("Do MMM YYYY")}
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            onClick={handleLogout}
            disabled={logoutLoading}
          >
            {logoutLoading ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="mr-1 h-4 w-4" />
            )}
            Sign Out
          </Button>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-lg border bg-card p-3 text-center">
            <p className="text-xs text-muted-foreground">Orders</p>
            <p className="text-xl font-semibold">
              {summary?.total_orders ?? orders.length}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-3 text-center">
            <p className="text-xs text-muted-foreground">Total Spend</p>
            <p className="text-xl font-semibold">
              {formatCurrency(summary?.total_spend ?? 0)}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-3 text-center">
            <p className="text-xs text-muted-foreground">Wishlist</p>
            <p className="text-xl font-semibold">
              {summary?.total_wishlist_items ?? 0}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-3 text-center">
            <p className="text-xs text-muted-foreground">Addresses</p>
            <p className="text-xl font-semibold">
              {summary?.total_addresses ?? addresses.length}
            </p>
          </div>
        </div>

        <Tabs defaultValue="profile">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="profile">
              <User className="mr-1 h-4 w-4" /> Profile
            </TabsTrigger>
            <TabsTrigger value="addresses">
              <MapPin className="mr-1 h-4 w-4" /> Addresses
            </TabsTrigger>
            <TabsTrigger value="orders">
              <Package className="mr-1 h-4 w-4" /> Orders
            </TabsTrigger>
            <TabsTrigger value="security">
              <Lock className="mr-1 h-4 w-4" /> Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <div className="space-y-4 rounded-lg border bg-card p-6">
              <h2 className="text-lg font-display font-bold">
                Personal Information
              </h2>
              <div className="grid gap-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Name</span>
                  <span className="text-right">{personalInfo.name}</span>
                </div>
                <Separator />
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Email</span>
                  <span className="text-right">{personalInfo.email}</span>
                </div>
                <Separator />
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="text-right">
                    {personalInfo.phone_code || ""}{" "}
                    {personalInfo.phone_number || "Not set"}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Role</span>
                  <Badge variant="outline" className="capitalize">
                    {personalInfo.role}
                  </Badge>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="addresses" className="mt-6 space-y-4">
            <div className="flex justify-end">
              <Button variant="outline" onClick={openAddAddressForm}>
                <Plus className="mr-1 h-4 w-4" /> Add Address
              </Button>
            </div>

            {addresses.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">
                No addresses yet
              </p>
            ) : (
              addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="flex items-start justify-between rounded-lg border bg-card p-4"
                >
                  <div className="text-sm">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="font-semibold">
                        {addr.first_name} {addr.last_name}
                      </span>
                      {addr.is_default && (
                        <Badge variant="secondary" className="text-xs">
                          Default
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">
                      {addr.line1}
                      {addr.line2 ? `, ${addr.line2}` : ""}
                    </p>
                    <p className="text-muted-foreground">
                      {addr.city}, {addr.state} {addr.pin_code}, {addr.country}
                    </p>
                    <p className="text-muted-foreground">
                      {addr.phone_code} {addr.phone_number}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditAddressForm(addr)}
                      aria-label="Edit address"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setAddressToDelete(String(addr.id))}
                      aria-label="Delete address"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="orders" className="mt-6 space-y-3">
            {orders.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">
                No orders yet
              </p>
            ) : (
              orders.map((order) => (
                <Link
                  key={order.order_number}
                  to={`/order/${order.order_number}`}
                  className="block rounded-lg border bg-card p-4 transition-colors hover:border-primary/50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">
                        {order.order_number}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {dayjs(order.purchase_date).format("MMM D, YYYY")}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className="text-xs capitalize">
                        {order.status.replace(/_/g, " ").toLowerCase()}
                      </Badge>
                      <p className="mt-1 text-sm font-semibold">
                        {formatCurrency(
                          order.final_amount ?? order.total_amount,
                        )}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <div className="max-w-md space-y-4 rounded-lg border bg-card p-6">
              <h2 className="text-lg font-display font-bold">
                Change Password
              </h2>
              <div className="space-y-3">
                <div>
                  <Label>Current Password</Label>
                  <Input
                    type="password"
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                  />
                </div>
                <div>
                  <Label>New Password</Label>
                  <Input
                    type="password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Confirm New Password</Label>
                  <Input
                    type="password"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleChangePassword}
                  disabled={changePasswordMutation.isPending}
                >
                  {changePasswordMutation.isPending ? (
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                  ) : null}
                  Update Password
                </Button>
              </div>
              <Separator />
              <div className="text-xs text-muted-foreground">
                Profile stats: {summary?.total_wishlist_items ?? 0}{" "}
                <Heart className="inline h-3 w-3" /> wishlist,{" "}
                {summary?.total_addresses ?? 0}{" "}
                <MapPin className="inline h-3 w-3" /> addresses,{" "}
                {summary?.total_orders ?? 0}{" "}
                <ShoppingCart className="inline h-3 w-3" /> orders,{" "}
                {profile.coupons?.length ?? 0}{" "}
                <Ticket className="inline h-3 w-3" /> coupons.
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Dialog
          open={addressModalOpen}
          onOpenChange={(open) => {
            setAddressModalOpen(open);
            if (!open) {
              resetAddressForm();
            }
          }}
        >
          <DialogContent className="max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAddressId ? "Edit Address" : "Add Address"}
              </DialogTitle>
              <DialogDescription>
                Fill the address details and save.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>First Name</Label>
                  <Input
                    value={newAddr.first_name}
                    onChange={(e) =>
                      setNewAddr({ ...newAddr, first_name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input
                    value={newAddr.last_name}
                    onChange={(e) =>
                      setNewAddr({ ...newAddr, last_name: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Phone Code</Label>
                  <Input
                    value={newAddr.phone_code}
                    onChange={(e) =>
                      setNewAddr({ ...newAddr, phone_code: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input
                    value={newAddr.phone_number}
                    onChange={(e) =>
                      setNewAddr({ ...newAddr, phone_number: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <Label>Address Line 1</Label>
                <Input
                  value={newAddr.line1}
                  onChange={(e) =>
                    setNewAddr({ ...newAddr, line1: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Address Line 2</Label>
                <Input
                  value={newAddr.line2 ?? ""}
                  onChange={(e) =>
                    setNewAddr({ ...newAddr, line2: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <div>
                  <Label>City</Label>
                  <Input
                    value={newAddr.city}
                    onChange={(e) =>
                      setNewAddr({ ...newAddr, city: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>State</Label>
                  <Input
                    value={newAddr.state}
                    onChange={(e) =>
                      setNewAddr({ ...newAddr, state: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>PIN</Label>
                  <Input
                    value={newAddr.pin_code}
                    onChange={(e) =>
                      setNewAddr({ ...newAddr, pin_code: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Country</Label>
                  <Input
                    value={newAddr.country}
                    onChange={(e) =>
                      setNewAddr({ ...newAddr, country: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setAddressModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSaveAddress}
                disabled={
                  addAddressMutation.isPending ||
                  updateAddressMutation.isPending
                }
              >
                {(addAddressMutation.isPending ||
                  updateAddressMutation.isPending) && (
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                )}
                {editingAddressId ? "Save Changes" : "Save Address"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog
          open={Boolean(addressToDelete)}
          onOpenChange={(open) => {
            if (!open) {
              setAddressToDelete(null);
            }
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete address?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This address will be removed from
                your profile.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
              <AlertDialogAction
                type="button"
                onClick={handleDeleteAddress}
                disabled={deleteAddressMutation.isPending}
              >
                {deleteAddressMutation.isPending && (
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                )}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Dialog
          open={avatarModalOpen}
          onOpenChange={(open) => {
            setAvatarModalOpen(open);
            if (!open) {
              setSelectedAvatarFile(null);
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Profile Icon</DialogTitle>
              <DialogDescription>
                Upload JPG, JPEG, or PNG image only.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <Label>Profile Image</Label>
              <ImageUpload
                onUpload={handleAvatarFileChange}
                currentImage={personalInfo.avatar_url}
                acceptedTypes={["image/jpeg", "image/png"]}
                maxSize={2 * 1024 * 1024}
                helperText="JPG, JPEG, PNG · Max 2MB"
              />
              {selectedAvatarFile ? (
                <p className="text-xs text-muted-foreground">
                  Selected: {selectedAvatarFile.name}
                </p>
              ) : null}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setAvatarModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleAvatarUpdate}
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? (
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                ) : null}
                Update Icon
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
};

export default Profile;
