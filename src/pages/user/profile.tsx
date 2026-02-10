import { useState } from "react";
import { Link } from "react-router";
import { User, MapPin, Package, Lock, Camera, Plus, Trash2, Edit2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useAuth, type Address } from "@/context/authContext";
import { toast } from "@/hooks/useToast";
import { orders } from "@/data/products";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";

const Profile = () => {
  const { user, updateProfile, addAddress, removeAddress, changePassword, logout } = useAuth();
  const [editingProfile, setEditingProfile] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [addingAddress, setAddingAddress] = useState(false);
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [newAddr, setNewAddr] = useState<Omit<Address, "id">>({
    label: "Home", name: "", street: "", city: "", state: "", zip: "", country: "US", isDefault: false,
  });

  if (!user) return null;

  const handleProfileSave = () => {
    updateProfile({ name, phone });
    setEditingProfile(false);
  };

  const handleAddAddress = () => {
    if (!newAddr.name || !newAddr.street || !newAddr.city || !newAddr.zip) {
      toast({ title: "Missing fields", description: "Please fill in all required address fields." });
      return;
    }
    addAddress(newAddr);
    setAddingAddress(false);
    setNewAddr({ label: "Home", name: "", street: "", city: "", state: "", zip: "", country: "US", isDefault: false });
    toast({ title: "Address added" });
  };

  const handleChangePassword = async () => {
    if (newPass.length < 8) { toast({ title: "Password too short" }); return; }
    if (newPass !== confirmPass) { toast({ title: "Passwords don't match" }); return; }
    await changePassword(currentPass, newPass);
    setCurrentPass(""); setNewPass(""); setConfirmPass("");
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Profile header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-secondary overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-display font-bold text-muted-foreground">
                    {user.name.charAt(0)}
                  </div>
                )}
              </div>
              <button className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-1.5">
                <Camera className="h-3 w-3" />
              </button>
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold">{user.name}</h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground">Member since {user.createdAt}</p>
            </div>
            <Button variant="outline" size="sm" className="ml-auto" onClick={logout}>
              <LogOut className="h-4 w-4 mr-1" /> Sign Out
            </Button>
          </div>

          <Tabs defaultValue="profile">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="profile"><User className="h-4 w-4 mr-1" /> Profile</TabsTrigger>
              <TabsTrigger value="addresses"><MapPin className="h-4 w-4 mr-1" /> Addresses</TabsTrigger>
              <TabsTrigger value="orders"><Package className="h-4 w-4 mr-1" /> Orders</TabsTrigger>
              <TabsTrigger value="security"><Lock className="h-4 w-4 mr-1" /> Security</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="mt-6">
              <div className="bg-card border rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="font-display font-bold text-lg">Personal Information</h2>
                  <Button variant="ghost" size="sm" onClick={() => setEditingProfile(!editingProfile)}>
                    <Edit2 className="h-4 w-4 mr-1" /> {editingProfile ? "Cancel" : "Edit"}
                  </Button>
                </div>
                {editingProfile ? (
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
                      <div><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555-0123" /></div>
                    </div>
                    <div><Label>Email</Label><Input value={user.email} disabled className="opacity-60" /></div>
                    <Button onClick={handleProfileSave} className="w-fit">Save Changes</Button>
                  </div>
                ) : (
                  <div className="grid gap-3 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span>{user.name}</span></div>
                    <Separator />
                    <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span>{user.email}</span></div>
                    <Separator />
                    <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span>{user.phone || "Not set"}</span></div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses" className="mt-6 space-y-4">
              {user.addresses.map((addr) => (
                <div key={addr.id} className="bg-card border rounded-lg p-4 flex justify-between items-start">
                  <div className="text-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{addr.label}</span>
                      {addr.isDefault && <Badge variant="secondary" className="text-xs">Default</Badge>}
                    </div>
                    <p>{addr.name}</p>
                    <p className="text-muted-foreground">{addr.street}, {addr.city}, {addr.state} {addr.zip}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeAddress(addr.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}

              {addingAddress ? (
                <div className="bg-card border rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold text-sm">New Address</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>Label</Label><Input value={newAddr.label} onChange={(e) => setNewAddr({ ...newAddr, label: e.target.value })} /></div>
                    <div><Label>Full Name</Label><Input value={newAddr.name} onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })} /></div>
                  </div>
                  <div><Label>Street</Label><Input value={newAddr.street} onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })} /></div>
                  <div className="grid grid-cols-3 gap-3">
                    <div><Label>City</Label><Input value={newAddr.city} onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })} /></div>
                    <div><Label>State</Label><Input value={newAddr.state} onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })} /></div>
                    <div><Label>ZIP</Label><Input value={newAddr.zip} onChange={(e) => setNewAddr({ ...newAddr, zip: e.target.value })} /></div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddAddress} size="sm">Save Address</Button>
                    <Button variant="outline" size="sm" onClick={() => setAddingAddress(false)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <Button variant="outline" onClick={() => setAddingAddress(true)}><Plus className="h-4 w-4 mr-1" /> Add Address</Button>
              )}
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="mt-6 space-y-3">
              {orders.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No orders yet</p>
              ) : (
                orders.map((order) => (
                  <Link key={order.id} to={`/order/${order.id}`} className="block bg-card border rounded-lg p-4 hover:border-primary/50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-sm">{order.id}</p>
                        <p className="text-xs text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <Badge className="capitalize text-xs">{order.status.replace("_", " ")}</Badge>
                        <p className="text-sm font-semibold mt-1">${order.total}</p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="mt-6">
              <div className="bg-card border rounded-lg p-6 space-y-4 max-w-md">
                <h2 className="font-display font-bold text-lg">Change Password</h2>
                <div className="space-y-3">
                  <div><Label>Current Password</Label><Input type="password" value={currentPass} onChange={(e) => setCurrentPass(e.target.value)} /></div>
                  <div><Label>New Password</Label><Input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} /></div>
                  <div><Label>Confirm New Password</Label><Input type="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} /></div>
                  <Button onClick={handleChangePassword}>Update Password</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </>
  );
};

export default Profile;
