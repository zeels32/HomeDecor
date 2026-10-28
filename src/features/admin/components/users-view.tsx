'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserX,
  UserPlus,
  Key,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  ShoppingCart,
  X,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import { useAdmin } from '../admin-context';
import { AdminUser, UserCreateFormData } from '../types';
import { formatCurrency } from '@/lib/pricing';

export function AdminUsersView() {
  const { users, orders, createUser, updateUserRole, isSaving } = useAdmin();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'customer'>('all');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [roleConfirm, setRoleConfirm] = useState<{ user: AdminUser; newRole: boolean } | null>(null);

  // Add User / Admin Facility Modal State
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [addUserForm, setAddUserForm] = useState<UserCreateFormData>({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    is_admin: true, // Default to true when adding from the Admin Users panel
  });

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
    let pass = '';
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setAddUserForm((prev) => ({ ...prev, password: pass }));
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addUserForm.email || !addUserForm.password || !addUserForm.full_name) return;

    const ok = await createUser(addUserForm);
    if (ok) {
      setIsAddUserModalOpen(false);
      setAddUserForm({
        full_name: '',
        email: '',
        password: '',
        phone: '',
        is_admin: true,
      });
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    const matchesSearch =
      search === '' ||
      u.full_name?.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q);

    const matchesRole =
      roleFilter === 'all'
        ? true
        : roleFilter === 'admin'
        ? u.is_admin
        : !u.is_admin;

    return matchesSearch && matchesRole;
  });

  const handleRoleChange = async () => {
    if (!roleConfirm) return;
    const ok = await updateUserRole(roleConfirm.user.id, roleConfirm.newRole);
    if (ok) {
      setRoleConfirm(null);
      if (selectedUser?.id === roleConfirm.user.id) {
        setSelectedUser({ ...selectedUser, is_admin: roleConfirm.newRole });
      }
    }
  };

  const getUserOrders = (user: AdminUser) => {
    return orders.filter(
      (o) => o.user_id === user.id || o.email?.toLowerCase() === user.email.toLowerCase()
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-charcoal">
            Customers & Personnel Management
          </h1>
          <p className="text-xs text-muted-gray mt-0.5">
            Manage authorized staff, invite new administrators, inspect customer profiles and order histories.
          </p>
        </div>

        {/* Facility to Add User for Admin Panel Access */}
        <button
          onClick={() => {
            generatePassword();
            setIsAddUserModalOpen(true);
          }}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-forest hover:bg-forest-light text-white text-xs font-semibold rounded-xs transition-colors shadow-xs self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Admin User</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-sm border border-subtle-border shadow-soft flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-forest-50 text-forest flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-serif font-semibold text-charcoal">{users.length}</p>
            <p className="text-xs text-muted-gray">Total Registered Accounts</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-sm border border-subtle-border shadow-soft flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-serif font-semibold text-charcoal">
              {users.filter((u) => u.is_admin).length}
            </p>
            <p className="text-xs text-muted-gray">Authorized Administrators</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-sm border border-subtle-border shadow-soft flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-serif font-semibold text-charcoal">
              {users.filter((u) => u.orders_count > 0).length}
            </p>
            <p className="text-xs text-muted-gray">Purchasing Customers</p>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-sm border border-subtle-border shadow-soft flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or telephone..."
            className="w-full pl-8 pr-3 py-2 bg-ivory border border-subtle-border rounded-xs text-xs focus:outline-none focus:border-forest"
          />
          <Search className="w-3.5 h-3.5 text-muted-gray absolute left-2.5 top-2.5" />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-2.5 text-muted-gray hover:text-charcoal"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-muted-gray">Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="px-2.5 py-1.5 bg-white border border-subtle-border rounded-xs text-xs text-charcoal focus:outline-none focus:border-forest"
          >
            <option value="all">All Accounts ({users.length})</option>
            <option value="admin">Administrators Only ({users.filter((u) => u.is_admin).length})</option>
            <option value="customer">Customers Only ({users.filter((u) => !u.is_admin).length})</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-sm border border-subtle-border shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-sand-50/70 border-b border-subtle-border text-[11px] font-semibold text-charcoal uppercase tracking-wider">
              <tr>
                <th className="p-3.5">User / Personnel</th>
                <th className="p-3.5">Contact Details</th>
                <th className="p-3.5">Role & Access</th>
                <th className="p-3.5">Orders Placed</th>
                <th className="p-3.5">Lifetime Spend</th>
                <th className="p-3.5">Member Since</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-subtle-border">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => {
                  const initials = (u.full_name || u.email || 'CU')
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <tr key={u.id} className="hover:bg-ivory/50 transition-colors">
                      {/* Name & Avatar */}
                      <td className="p-3.5">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-8 h-8 rounded-full font-serif font-semibold text-xs flex items-center justify-center flex-shrink-0 ${
                              u.is_admin ? 'bg-forest text-white' : 'bg-sand-200 text-charcoal'
                            }`}
                          >
                            {initials}
                          </div>
                          <div>
                            <span className="font-semibold text-charcoal block">
                              {u.full_name || 'Customer Account'}
                            </span>
                            <span className="text-[10px] text-muted-gray">{u.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="p-3.5 text-muted-gray font-mono text-[11px]">
                        {u.phone || 'No phone recorded'}
                      </td>

                      {/* Role Badge */}
                      <td className="p-3.5">
                        {u.is_admin ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-forest-50 text-forest border border-forest-200">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Administrator (Full Backoffice Access)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-sand-100 text-charcoal border border-subtle-border">
                            <span>Standard Customer</span>
                          </span>
                        )}
                      </td>

                      {/* Orders */}
                      <td className="p-3.5 font-semibold text-charcoal">
                        {u.orders_count} orders
                      </td>

                      {/* Spend */}
                      <td className="p-3.5 font-semibold text-forest">
                        {formatCurrency(u.total_spend)}
                      </td>

                      {/* Date */}
                      <td className="p-3.5 text-muted-gray">
                        {new Date(u.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => setSelectedUser(u)}
                            className="px-2.5 py-1 bg-white border border-subtle-border hover:border-forest text-charcoal text-xs font-medium rounded-xs transition-colors"
                          >
                            Profile →
                          </button>
                          <button
                            onClick={() =>
                              setRoleConfirm({ user: u, newRole: !u.is_admin })
                            }
                            title={u.is_admin ? 'Revoke Admin Privileges' : 'Promote to Administrator'}
                            className={`px-2 py-1 rounded-xs border text-[11px] font-semibold transition-colors ${
                              u.is_admin
                                ? 'border-amber-200 text-amber-800 bg-amber-50 hover:bg-amber-100'
                                : 'border-forest/30 text-forest bg-forest-50 hover:bg-forest-100'
                            }`}
                          >
                            {u.is_admin ? 'Demote' : 'Promote to Admin'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-xs text-muted-gray">
                    No users found matching current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-sand-50/40 border-t border-subtle-border text-xs text-muted-gray">
          Showing {filteredUsers.length} of {users.length} accounts
        </div>
      </div>

      {/* FACILITY: Add New User / Administrator Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-sm border border-subtle-border shadow-elevated w-full max-w-lg my-8 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-subtle-border bg-sand-50/70 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-forest text-white flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-charcoal">
                    Add User for Backoffice / Store Access
                  </h3>
                  <p className="text-xs text-muted-gray">
                    Register a new administrator or customer account with instant authentication.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="p-1.5 text-muted-gray hover:text-charcoal rounded-xs"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-charcoal">Full Name *</label>
                <input
                  type="text"
                  required
                  value={addUserForm.full_name}
                  onChange={(e) =>
                    setAddUserForm({ ...addUserForm, full_name: e.target.value })
                  }
                  placeholder="e.g. Elena Rostova"
                  className="w-full p-2 bg-ivory border border-subtle-border rounded-xs focus:outline-none focus:border-forest"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-charcoal">Email Address *</label>
                <input
                  type="email"
                  required
                  value={addUserForm.email}
                  onChange={(e) =>
                    setAddUserForm({ ...addUserForm, email: e.target.value })
                  }
                  placeholder="e.g. staff@terraandform.com"
                  className="w-full p-2 bg-ivory border border-subtle-border rounded-xs focus:outline-none focus:border-forest"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="font-semibold text-charcoal">Password *</label>
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="text-[11px] text-forest hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Generate Strong Password</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    minLength={6}
                    value={addUserForm.password}
                    onChange={(e) =>
                      setAddUserForm({ ...addUserForm, password: e.target.value })
                    }
                    placeholder="Minimum 6 characters"
                    className="w-full pl-8 pr-3 py-2 bg-ivory border border-subtle-border rounded-xs font-mono focus:outline-none focus:border-forest"
                  />
                  <Key className="w-3.5 h-3.5 text-muted-gray absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-charcoal">Telephone (Optional)</label>
                <input
                  type="tel"
                  value={addUserForm.phone || ''}
                  onChange={(e) =>
                    setAddUserForm({ ...addUserForm, phone: e.target.value })
                  }
                  placeholder="+91 98765 43210"
                  className="w-full p-2 bg-ivory border border-subtle-border rounded-xs focus:outline-none focus:border-forest"
                />
              </div>

              {/* Role selection radio / toggle */}
              <div className="p-3.5 bg-sand-50/70 border border-subtle-border rounded-xs space-y-2">
                <label className="font-semibold text-charcoal block">
                  Select Account Role & Permissions
                </label>
                <div className="space-y-2">
                  <label className="flex items-start space-x-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      checked={addUserForm.is_admin}
                      onChange={() => setAddUserForm({ ...addUserForm, is_admin: true })}
                      className="mt-0.5 text-forest focus:ring-forest"
                    />
                    <div>
                      <span className="font-semibold text-charcoal block">
                        Administrator (Full Backoffice Portal Access)
                      </span>
                      <span className="text-[11px] text-muted-gray">
                        Allows managing products, fulfilling orders, editing pricing, and moderating content.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start space-x-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      checked={!addUserForm.is_admin}
                      onChange={() => setAddUserForm({ ...addUserForm, is_admin: false })}
                      className="mt-0.5 text-forest focus:ring-forest"
                    />
                    <div>
                      <span className="font-semibold text-charcoal block">
                        Standard Customer Account
                      </span>
                      <span className="text-[11px] text-muted-gray">
                        Limited to store browsing, shopping cart, and personal account dashboard.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-subtle-border flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 border border-subtle-border rounded-xs text-charcoal hover:bg-sand-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-forest hover:bg-forest-light text-white font-semibold rounded-xs transition-colors shadow-xs"
                >
                  {isSaving ? 'Creating User...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Role Switch Confirmation Modal */}
      {roleConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-xs">
          <div className="bg-white rounded-sm border border-subtle-border shadow-elevated p-6 max-w-sm w-full space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 text-forest">
              <ShieldAlert className="w-5 h-5 flex-shrink-0" />
              <h3 className="font-serif text-lg font-semibold text-charcoal">
                Change Permissions?
              </h3>
            </div>
            <p className="text-xs text-muted-gray">
              Are you sure you want to {roleConfirm.newRole ? 'grant' : 'revoke'} administrative privileges for{' '}
              <strong className="text-charcoal">{roleConfirm.user.full_name || roleConfirm.user.email}</strong>?
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setRoleConfirm(null)}
                className="px-3 py-1.5 text-xs text-charcoal hover:bg-sand-100 rounded-xs transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRoleChange}
                disabled={isSaving}
                className="px-3.5 py-1.5 bg-forest hover:bg-forest-light text-white text-xs font-semibold rounded-xs transition-colors"
              >
                {isSaving ? 'Updating...' : 'Confirm Change'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Detail Drawer / Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-sm border border-subtle-border shadow-elevated w-full max-w-2xl my-8 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-5 border-b border-subtle-border bg-sand-50/70 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-semibold text-charcoal">
                  Account Dossier: {selectedUser.full_name || selectedUser.email}
                </h3>
                <p className="text-xs text-muted-gray">{selectedUser.email}</p>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1.5 text-muted-gray hover:text-charcoal rounded-xs"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs">
              {/* Profile Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-sand-50/60 border border-subtle-border rounded-xs">
                  <p className="text-[10px] uppercase font-bold text-muted-gray">Role</p>
                  <p className="text-sm font-semibold text-charcoal mt-0.5">
                    {selectedUser.is_admin ? 'Staff Administrator' : 'Collector (Customer)'}
                  </p>
                </div>

                <div className="p-3.5 bg-sand-50/60 border border-subtle-border rounded-xs">
                  <p className="text-[10px] uppercase font-bold text-muted-gray">Lifetime Value</p>
                  <p className="text-sm font-semibold text-forest mt-0.5">
                    {formatCurrency(selectedUser.total_spend)}
                  </p>
                </div>

                <div className="p-3.5 bg-sand-50/60 border border-subtle-border rounded-xs">
                  <p className="text-[10px] uppercase font-bold text-muted-gray">Orders Count</p>
                  <p className="text-sm font-semibold text-charcoal mt-0.5">
                    {selectedUser.orders_count} orders
                  </p>
                </div>
              </div>

              {/* Contact info */}
              <div className="p-4 bg-white border border-subtle-border rounded-xs space-y-2">
                <p className="font-semibold text-charcoal uppercase tracking-wider text-[11px]">
                  Account Information
                </p>
                <div className="grid grid-cols-2 gap-4 text-muted-gray">
                  <div>
                    <span className="text-[10px] text-muted-gray block">Email:</span>
                    <span className="text-charcoal font-medium">{selectedUser.email}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-gray block">Phone:</span>
                    <span className="text-charcoal font-medium">{selectedUser.phone || 'None registered'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-gray block">Registered Date:</span>
                    <span className="text-charcoal font-medium">
                      {new Date(selectedUser.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-gray block">Account ID:</span>
                    <span className="font-mono text-[10px] text-charcoal truncate block">
                      {selectedUser.id}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order History */}
              <div className="space-y-3">
                <p className="font-semibold text-charcoal uppercase tracking-wider text-[11px]">
                  Order History ({getUserOrders(selectedUser).length})
                </p>
                {getUserOrders(selectedUser).length > 0 ? (
                  <div className="border border-subtle-border rounded-xs overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-sand-50 border-b border-subtle-border text-[10px] font-bold uppercase text-charcoal">
                        <tr>
                          <th className="p-2.5">Order</th>
                          <th className="p-2.5">Date</th>
                          <th className="p-2.5">Amount</th>
                          <th className="p-2.5">Status</th>
                          <th className="p-2.5 text-right">Inspect</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-subtle-border">
                        {getUserOrders(selectedUser).map((ord) => (
                          <tr key={ord.id}>
                            <td className="p-2.5 font-mono font-medium">{ord.order_number}</td>
                            <td className="p-2.5 text-muted-gray">
                              {new Date(ord.created_at).toLocaleDateString()}
                            </td>
                            <td className="p-2.5 font-semibold text-charcoal">
                              {formatCurrency(ord.total_amount)}
                            </td>
                            <td className="p-2.5 capitalize text-forest font-medium">
                              {ord.status}
                            </td>
                            <td className="p-2.5 text-right">
                              <Link
                                href={`/admin/orders?inspect=${ord.id}`}
                                className="text-forest hover:underline font-semibold"
                              >
                                View →
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted-gray p-4 bg-sand-50/30 rounded-xs text-center">
                    No orders have been placed by this account yet.
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-subtle-border bg-sand-50/50 flex justify-between items-center">
              <button
                onClick={() =>
                  setRoleConfirm({ user: selectedUser, newRole: !selectedUser.is_admin })
                }
                className={`px-3 py-1.5 text-xs font-semibold rounded-xs border transition-colors ${
                  selectedUser.is_admin
                    ? 'border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100'
                    : 'border-forest text-forest bg-forest-50 hover:bg-forest-100'
                }`}
              >
                {selectedUser.is_admin ? 'Revoke Administrator Access' : 'Promote to Administrator'}
              </button>

              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 bg-charcoal hover:bg-forest text-white text-xs font-semibold rounded-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
