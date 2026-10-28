'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  FolderTree,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  X,
  AlertTriangle,
  Image as ImageIcon,
} from 'lucide-react';
import { useAdmin } from '../admin-context';
import { AdminCategory, CategoryFormData } from '../types';

export function AdminCategoriesView() {
  const { categories, createCategory, updateCategory, deleteCategory, isSaving } = useAdmin();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    sort_order: 0,
    is_active: true,
  });

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      image_url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80',
      sort_order: categories.length + 1,
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (c: AdminCategory) => {
    setEditingCategory(c);
    setFormData({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description || '',
      image_url: c.image_url || '',
      sort_order: c.sort_order,
      is_active: c.is_active,
    });
    setIsModalOpen(true);
  };

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormData((prev) => ({
      ...prev,
      name,
      slug: editingCategory ? prev.slug : slug,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingCategory) {
      const ok = await updateCategory(editingCategory.id, formData);
      if (ok) setIsModalOpen(false);
    } else {
      const ok = await createCategory(formData);
      if (ok) setIsModalOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await deleteCategory(id);
    if (ok) setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-charcoal">
            Taxonomies & Collections
          </h1>
          <p className="text-xs text-muted-gray mt-0.5">
            Organize catalog groupings, category cover images, sort orders, and storefront navigations.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-forest hover:bg-forest-light text-white text-xs font-semibold rounded-xs transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-sm border border-subtle-border shadow-soft overflow-hidden flex flex-col justify-between hover:border-forest/50 transition-colors"
          >
            <div>
              {/* Banner Image */}
              <div className="relative h-36 bg-sand/30 overflow-hidden border-b border-subtle-border">
                {c.image_url ? (
                  <Image
                    src={c.image_url}
                    alt={c.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-gray">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex items-center space-x-1.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/90 text-charcoal shadow-xs">
                    {c.product_count || 0} products
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      c.is_active
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-600 text-white'
                    }`}
                  >
                    {c.is_active ? 'Active' : 'Hidden'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-2">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-serif text-lg font-semibold text-charcoal">
                    {c.name}
                  </h3>
                  <span className="text-[10px] font-mono text-muted-gray">
                    Sort: {c.sort_order}
                  </span>
                </div>
                <p className="font-mono text-[11px] text-forest">/collections/{c.slug}</p>
                <p className="text-xs text-muted-gray line-clamp-2">
                  {c.description || 'Curated artisanal collection.'}
                </p>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-3 bg-sand-50/50 border-t border-subtle-border flex items-center justify-between text-xs">
              <Link
                href={`/collections/${c.slug}`}
                target="_blank"
                className="inline-flex items-center space-x-1 text-forest hover:underline font-medium text-[11px]"
              >
                <span>Live View</span>
                <ExternalLink className="w-3 h-3" />
              </Link>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => openEditModal(c)}
                  className="p-1.5 text-muted-gray hover:text-charcoal rounded-xs hover:bg-white"
                  title="Edit category"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(c.id)}
                  className="p-1.5 text-muted-gray hover:text-red-600 rounded-xs hover:bg-white"
                  title="Delete category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-xs">
          <div className="bg-white rounded-sm border border-subtle-border shadow-elevated p-6 max-w-sm w-full space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 text-red-600">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <h3 className="font-serif text-lg font-semibold text-charcoal">
                Delete Category?
              </h3>
            </div>
            <p className="text-xs text-muted-gray">
              Are you sure? Categories containing active products cannot be deleted until all assigned items are reassigned.
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 text-xs text-charcoal hover:bg-sand-100 rounded-xs transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={isSaving}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xs transition-colors"
              >
                {isSaving ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-sm border border-subtle-border shadow-elevated w-full max-w-lg my-8 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-4 sm:p-5 border-b border-subtle-border bg-sand-50/70 flex items-center justify-between">
              <h3 className="font-serif text-lg font-semibold text-charcoal">
                {editingCategory ? `Edit: ${editingCategory.name}` : 'Create Collection Category'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-muted-gray hover:text-charcoal rounded-xs"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-charcoal">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Sculptural Vessels"
                  className="w-full p-2 bg-ivory border border-subtle-border rounded-xs focus:outline-none focus:border-forest"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-charcoal">Slug *</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full p-2 bg-ivory border border-subtle-border rounded-xs font-mono focus:outline-none focus:border-forest"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-charcoal">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Editorial overview of this collection category..."
                  className="w-full p-2 bg-ivory border border-subtle-border rounded-xs focus:outline-none focus:border-forest"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-charcoal">Cover Image URL</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2 bg-ivory border border-subtle-border rounded-xs font-mono focus:outline-none focus:border-forest"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-charcoal">Display Sort Order</label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) =>
                      setFormData({ ...formData, sort_order: Number(e.target.value) })
                    }
                    className="w-full p-2 bg-ivory border border-subtle-border rounded-xs focus:outline-none focus:border-forest"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) =>
                        setFormData({ ...formData, is_active: e.target.checked })
                      }
                      className="rounded text-forest focus:ring-forest"
                    />
                    <span className="font-semibold text-charcoal">Active Online</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-subtle-border flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-subtle-border rounded-xs text-charcoal hover:bg-sand-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-forest hover:bg-forest-light text-white font-semibold rounded-xs shadow-xs"
                >
                  {isSaving ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
