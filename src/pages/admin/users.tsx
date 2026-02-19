import { useState, useMemo } from "react";
import { Search, Shield, ShieldOff, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/useToast";
import { mockUsers, type AdminUser } from "@/data/adminData";
import UserDetailModal from "@/components/admin/user/userDetailModal";

const PAGE_SIZE = 10;

const AdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>(mockUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [detailUserId, setDetailUserId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = users;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    if (roleFilter !== "all") list = list.filter((u) => u.role === roleFilter);
    return list;
  }, [users, search, roleFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleBlock = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: u.status === "active" ? "blocked" : "active" } as AdminUser : u))
    );
    toast({ title: "User status updated" });
  };

  const changeRole = (id: string, role: "admin" | "user") => {
    const adminCount = users.filter((u) => u.role === "admin").length;
    const target = users.find((u) => u.id === id);
    if (target?.role === "admin" && role === "user" && adminCount <= 1) {
      toast({ title: "Cannot remove last admin" });
      return;
    }
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    toast({ title: `Role changed to ${role}` });
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Users</h1>
          <p className="text-muted-foreground text-sm">{filtered.length} users</p>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search users..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9" />
              </div>
              <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setPage(1); }}>
                <SelectTrigger className="w-35"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left">User</th>
                    <th className="p-3 text-center">Role</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-right">Orders</th>
                    <th className="p-3 text-right">Spent</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((u) => (
                    <tr key={u.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{u.name}</p>
                            <p className="text-xs text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <Select value={u.role} onValueChange={(v) => changeRole(u.id, v as "admin" | "user")}>
                          <SelectTrigger className="h-7 w-24 mx-auto text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-3 text-center">
                        <Badge variant={u.status === "active" ? "default" : "destructive"} className="text-xs">
                          {u.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-right">{u.orders}</td>
                      <td className="p-3 text-right font-medium">${u.spent.toLocaleString()}</td>
                      <td className="p-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleBlock(u.id)}>
                            {u.status === "active" ? <ShieldOff className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setDetailUserId(u.id)}>
                            <Eye className="h-4 w-4 mr-1" /> View
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

      <UserDetailModal userId={detailUserId} onOpenChange={() => setDetailUserId(null)} />
    </>
  );
};

export default AdminUsers;
