"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  ShieldCheck,
  Briefcase,
  Store,
  User,
  Search,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  RefreshCw,
} from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "ADMIN" | "STAFF" | "SELLER" | "CUSTOMER";
  status: "ACTIVE" | "SUSPENDED";
  sellerShopName?: string;
  sellerCommission?: number;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "STAFF" | "SELLER" | "CUSTOMER">("SELLER");
  const [sellerShopName, setSellerShopName] = useState("");
  const [sellerCommission, setSellerCommission] = useState("10");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError("");
    setFormSuccess("");

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          password: password || "veloura123",
          role,
          sellerShopName: role === "SELLER" ? sellerShopName : undefined,
          sellerCommission: role === "SELLER" ? Number(sellerCommission) : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to create user");
      }

      setFormSuccess(`${role} account created successfully!`);
      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setSellerShopName("");
      setTimeout(() => {
        setIsModalOpen(false);
        setFormSuccess("");
        fetchUsers();
      }, 1200);
    } catch (err: any) {
      setFormError(err.message || "Failed to create user");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleToggleStatus = async (user: AdminUser) => {
    const newStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, status: newStatus }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
        );
      }
    } catch (err) {
      console.error("Status toggle error:", err);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to remove this user from Atelier?")) return;
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to delete user");
        return;
      }
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Filter users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.sellerShopName && u.sellerShopName.toLowerCase().includes(search.toLowerCase()));

    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const countAdmins = users.filter((u) => u.role === "ADMIN").length;
  const countStaff = users.filter((u) => u.role === "STAFF").length;
  const countSellers = users.filter((u) => u.role === "SELLER").length;
  const countCustomers = users.filter((u) => u.role === "CUSTOMER").length;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C2185B] font-bold">
            Daraz & Temu Style Multi-Vendor Management
          </span>
          <h1 className="font-serif text-3xl text-white mt-1">Users, Staff & Sellers</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Add team members, dispatch coordinators, and marketplace sellers to your Atelier.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-[#8E1B3B] to-[#C2185B] hover:brightness-110 text-white text-xs uppercase tracking-wider font-bold rounded-xl flex items-center gap-2 transition-all shadow-md self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          Add Member / Seller
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#1A1615] border border-white/10 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#8E1B3B]/20 text-[#C2185B] flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 block">Total People</span>
            <span className="text-xl font-bold text-white">{users.length}</span>
          </div>
        </div>

        <div className="bg-[#1A1615] border border-white/10 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 block">Sellers (Vendors)</span>
            <span className="text-xl font-bold text-white">{countSellers}</span>
          </div>
        </div>

        <div className="bg-[#1A1615] border border-white/10 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 block">Atelier Staff</span>
            <span className="text-xl font-bold text-white">{countStaff}</span>
          </div>
        </div>

        <div className="bg-[#1A1615] border border-white/10 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C2185B]/20 text-[#F4A6B8] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 block">Super Admins</span>
            <span className="text-xl font-bold text-white">{countAdmins}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-[#1A1615] border border-white/10 p-4 rounded-2xl">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {["ALL", "SELLER", "STAFF", "ADMIN", "CUSTOMER"].map((tab) => (
            <button
              key={tab}
              onClick={() => setRoleFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap ${
                roleFilter === tab
                  ? "bg-gradient-to-r from-[#8E1B3B] to-[#C2185B] text-white"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab === "ALL" ? "All People" : tab === "SELLER" ? "Sellers / Vendors" : tab === "STAFF" ? "Staff & Dispatch" : tab}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, shop..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C2185B]"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#1A1615] rounded-2xl border border-white/10 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-zinc-500">Loading members and sellers...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Users className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-zinc-400 text-xs">No members found matching your filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-zinc-400 uppercase tracking-wider text-[10px] bg-black/20">
                  <th className="p-4">Member Name</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Shop / Marketplace</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((u) => {
                  const roleBadge =
                    u.role === "ADMIN"
                      ? "bg-[#8E1B3B]/30 text-[#F4A6B8] border-[#8E1B3B]"
                      : u.role === "SELLER"
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      : u.role === "STAFF"
                      ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                      : "bg-zinc-700/30 text-zinc-300 border-zinc-600";

                  return (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8E1B3B] to-[#C2185B] text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                          {u.name.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{u.name}</div>
                          <div className="text-[10px] text-zinc-500">ID: {u.id}</div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="text-zinc-300">{u.email}</div>
                        {u.phone && <div className="text-[10px] text-zinc-500">{u.phone}</div>}
                      </td>

                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${roleBadge}`}>
                          {u.role === "ADMIN" && <ShieldCheck className="w-3 h-3" />}
                          {u.role === "SELLER" && <Store className="w-3 h-3" />}
                          {u.role === "STAFF" && <Briefcase className="w-3 h-3" />}
                          {u.role === "CUSTOMER" && <User className="w-3 h-3" />}
                          {u.role}
                        </span>
                      </td>

                      <td className="p-4">
                        {u.role === "SELLER" ? (
                          <div>
                            <div className="font-medium text-amber-300">{u.sellerShopName || "Marketplace Vendor"}</div>
                            <div className="text-[10px] text-zinc-400">Commission: {u.sellerCommission || 10}%</div>
                          </div>
                        ) : (
                          <span className="text-zinc-500 text-[11px]">—</span>
                        )}
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => handleToggleStatus(u)}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                            u.status === "ACTIVE"
                              ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                              : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                          }`}
                        >
                          {u.status}
                        </button>
                      </td>

                      <td className="p-4 text-right">
                        {u.email !== "admin@veloura.pk" && (
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User / Seller Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1A1615] border border-white/10 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C2185B] font-bold">
                Atelier Directory
              </span>
              <h2 className="font-serif text-2xl text-white mt-1">Add Member / Seller</h2>
              <p className="text-xs text-zinc-400 mt-1">
                Create a new staff member, marketplace seller, or administrator account.
              </p>
            </div>

            {formError && (
              <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-1.5">
                  Account Role *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole("SELLER")}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-colors ${
                      role === "SELLER"
                        ? "border-[#C2185B] bg-[#C2185B]/20 text-white"
                        : "border-white/10 bg-black/30 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Store className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="text-xs font-bold">Seller / Vendor</div>
                      <div className="text-[9px] text-zinc-500">Daraz/Temu style supplier</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("STAFF")}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-colors ${
                      role === "STAFF"
                        ? "border-[#C2185B] bg-[#C2185B]/20 text-white"
                        : "border-white/10 bg-black/30 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Briefcase className="w-4 h-4 text-blue-400" />
                    <div>
                      <div className="text-xs font-bold">Staff Member</div>
                      <div className="text-[9px] text-zinc-500">Order dispatch & support</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("ADMIN")}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-colors ${
                      role === "ADMIN"
                        ? "border-[#C2185B] bg-[#C2185B]/20 text-white"
                        : "border-white/10 bg-black/30 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-[#F4A6B8]" />
                    <div>
                      <div className="text-xs font-bold">Administrator</div>
                      <div className="text-[9px] text-zinc-500">Full Atelier control</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("CUSTOMER")}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-colors ${
                      role === "CUSTOMER"
                        ? "border-[#C2185B] bg-[#C2185B]/20 text-white"
                        : "border-white/10 bg-black/30 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <User className="w-4 h-4 text-zinc-400" />
                    <div>
                      <div className="text-xs font-bold">VIP Customer</div>
                      <div className="text-[9px] text-zinc-500">Registered shopper</div>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fatima Ali / Royal Jewels"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#C2185B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="email@veloura.pk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#C2185B]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+92 300 1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#C2185B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-1">
                  Account Password
                </label>
                <input
                  type="password"
                  placeholder="Leave blank for default (veloura123)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#C2185B]"
                />
              </div>

              {/* Specific Seller Fields */}
              {role === "SELLER" && (
                <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold">
                    <Store className="w-4 h-4" />
                    <span>Marketplace Seller Configuration (Daraz / Temu)</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-zinc-400 font-semibold mb-1">
                        Seller Shop Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Silk & Pearl Emporium"
                        value={sellerShopName}
                        onChange={(e) => setSellerShopName(e.target.value)}
                        className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-zinc-400 font-semibold mb-1">
                        Commission Rate (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        placeholder="10"
                        value={sellerCommission}
                        onChange={(e) => setSellerCommission(e.target.value)}
                        className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-xs text-zinc-400 hover:text-white hover:bg-white/5 font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#8E1B3B] to-[#C2185B] hover:brightness-110 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md disabled:opacity-50"
                >
                  {formSubmitting ? "Creating Account..." : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
