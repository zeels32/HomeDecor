'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Plus,
  Filter,
  FileDown,
  Edit,
  Trash2,
  ExternalLink,
  Check,
  X,
  AlertTriangle,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';
import { useAdmin } from '../admin-context';
import { AdminProduct, ProductFormData } from '../types';
import { formatCurrency } from '@/lib/pricing';

export function AdminProductsView() {
  const searchParams = useSearchParams();
  const {
    products,
    categories,
    createProduct,
    updateProduct,
    updateStock,
    deleteProduct,
    exportProductsCSV,
    isLoading,
    isSaving,
  } = useAdmin();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    slug: '',
    category_id: '',
    sku: '',
    base_price: 1999,
    compare_at_price: null,
    stock_quantity: 25,
    short_description: '',
    description: '',
    material: '',
    color: '',
    size_label: '',
    height: null,
    width: null,
    depth: null,
    diameter: null,
    weight: null,
    dimensions_unit: 'cm',
    weight_unit: 'kg',
    care_instructions: '',
    is_active: true,
    is_featured: false,
    is_new_arrival: true,
    is_best_seller: false,
    images: [{ image_url: '', alt_text: '', is_primary: true }],
  });

  const [activeFormSection, setActiveFormSection] = useState<'general' | 'pricing_stock' | 'attributes' | 'images'>('general');

  // Check if ?new=true was passed in URL
  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      openAddModal();
    }
  }, [searchParams]);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      category_id: categories[0]?.id || '',
      sku: 'TF-' + Math.floor(1000 + Math.random() * 9000),
      base_price: 2499,
      compare_at_price: 2999,
      stock_quantity: 20,
      short_description: '',
      description: '',
      material: 'Stoneware Ceramic',
      color: 'Sand / Terracotta',
      size_label: 'Standard',
      height: 25,
      width: 15,
      depth: 15,
      diameter: 12,
      weight: 1.5,
      dimensions_unit: 'cm',
      weight_unit: 'kg',
      care_instructions: 'Clean with damp lint-free cloth. Gentle hand washing recommended.',
      is_active: true,
      is_featured: false,
      is_new_arrival: true,
      is_best_seller: false,
      images: [
        {
          image_url:
            'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80',
          alt_text: 'Handcrafted ceramic decor piece',
          is_primary: true,
        },
      ],
    });
    setActiveFormSection('general');
    setIsModalOpen(true);
  };

  const openEditModal = (p: AdminProduct) => {
    setEditingProduct(p);
    setFormData({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category_id: p.category_id || '',
      sku: p.sku || '',
      base_price: p.base_price,
      compare_at_price: p.compare_at_price,
      stock_quantity: p.stock_quantity,
      short_description: p.short_description || '',
      description: p.description || '',
      material: p.material || '',
      color: p.color || '',
      size_label: p.size_label || '',
      height: p.height,
      width: p.width,
      depth: p.depth,
      diameter: p.diameter,
      weight: p.weight,
      dimensions_unit: p.dimensions_unit || 'cm',
      weight_unit: p.weight_unit || 'kg',
      care_instructions: p.care_instructions || '',
      is_active: p.is_active,
      is_featured: p.is_featured,
      is_new_arrival: p.is_new_arrival,
      is_best_seller: p.is_best_seller,
      images:
        p.images && p.images.length > 0
          ? p.images.map((img) => ({
              image_url: img.image_url,
              alt_text: img.alt_text || '',
              is_primary: img.is_primary,
            }))
          : [{ image_url: '', alt_text: '', is_primary: true }],
    });
    setActiveFormSection('general');
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
      slug: editingProduct ? prev.slug : slug,
    }));
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.base_price) return;

    if (editingProduct) {
      const ok = await updateProduct(editingProduct.id, formData);
      if (ok) setIsModalOpen(false);
    } else {
      const ok = await createProduct(formData);
      if (ok) setIsModalOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await deleteProduct(id);
    if (ok) setDeleteConfirmId(null);
  };

  // Add & remove image URLs in form
  const addImageField = () => {
    setFormData((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        {
          image_url: '',
          alt_text: '',
          is_primary: prev.images.length === 0,
        },
      ],
    }));
  };

  const removeImageField = (idx: number) => {
    setFormData((prev) => {
      const filtered = prev.images.filter((_, i) => i !== idx);
      if (filtered.length > 0 && !filtered.some((img) => img.is_primary)) {
        filtered[0].is_primary = true;
      }
      return { ...prev, images: filtered };
    });
  };

  const setPrimaryImage = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        is_primary: i === idx,
      })),
    }));
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase()) ||
      p.material?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || p.category_id === selectedCategory;

    const matchesStock =
      stockFilter === 'all'
        ? true
        : stockFilter === 'in_stock'
        ? p.stock_quantity > 10
        : stockFilter === 'low_stock'
        ? p.stock_quantity > 0 && p.stock_quantity <= 10
        : p.stock_quantity === 0;

    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'active'
        ? p.is_active
        : !p.is_active;

    return matchesSearch && matchesCategory && matchesStock && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-charcoal">
            Product Catalog & Inventory
          </h1>
          <p className="text-xs text-muted-gray mt-0.5">
            Manage artisanal pieces, variants, warehouse quantities, and storefront visibility.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportProductsCSV}
            className="inline-flex items-center space-x-1.5 px-3 py-2 bg-white border border-subtle-border hover:bg-ivory text-xs font-semibold text-charcoal rounded-xs transition-colors shadow-xs"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={openAddModal}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-forest hover:bg-forest-light text-white text-xs font-semibold rounded-xs transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-sm border border-subtle-border shadow-soft flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, SKU, or material..."
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

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-2 bg-white border border-subtle-border rounded-xs text-charcoal focus:outline-none focus:border-forest text-xs"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="px-2.5 py-2 bg-white border border-subtle-border rounded-xs text-charcoal focus:outline-none focus:border-forest text-xs"
          >
            <option value="all">All Inventory</option>
            <option value="in_stock">In Stock (&gt;10)</option>
            <option value="low_stock">Low Stock (≤10)</option>
            <option value="out_of_stock">Sold Out (0)</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-2.5 py-2 bg-white border border-subtle-border rounded-xs text-charcoal focus:outline-none focus:border-forest text-xs"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Online</option>
            <option value="draft">Drafts Only</option>
          </select>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-white rounded-sm border border-subtle-border shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-sand-50/70 border-b border-subtle-border text-[11px] font-semibold text-charcoal uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Product</th>
                <th className="p-3.5">SKU</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Base Price</th>
                <th className="p-3.5">Stock Level</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-subtle-border">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => {
                  const primaryImg =
                    p.images?.find((img) => img.is_primary)?.image_url ||
                    p.images?.[0]?.image_url;

                  return (
                    <tr key={p.id} className="hover:bg-ivory/50 transition-colors">
                      {/* Product Name & Thumbnail */}
                      <td className="p-3.5">
                        <div className="flex items-center space-x-3">
                          <div className="relative w-10 h-12 bg-sand/30 rounded-xs overflow-hidden flex-shrink-0 border border-subtle-border">
                            {primaryImg ? (
                              <Image
                                src={primaryImg}
                                alt={p.name}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-gray">
                                <ImageIcon className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-charcoal block leading-tight">
                              {p.name}
                            </span>
                            <div className="flex items-center space-x-1.5 mt-1">
                              {p.is_featured && (
                                <span className="text-[9px] bg-forest-50 text-forest px-1 py-0.2 rounded font-semibold border border-forest-100">
                                  Featured
                                </span>
                              )}
                              {p.is_new_arrival && (
                                <span className="text-[9px] bg-sand-100 text-charcoal px-1 py-0.2 rounded font-medium">
                                  New
                                </span>
                              )}
                              {p.material && (
                                <span className="text-[10px] text-muted-gray">
                                  • {p.material}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="p-3.5 font-mono text-muted-gray">
                        {p.sku || '—'}
                      </td>

                      {/* Category */}
                      <td className="p-3.5 text-muted-gray">
                        {p.category?.name || 'Handcrafted Decor'}
                      </td>

                      {/* Price */}
                      <td className="p-3.5">
                        <span className="font-semibold text-charcoal block">
                          {formatCurrency(p.base_price)}
                        </span>
                        {p.compare_at_price && (
                          <span className="text-[10px] text-muted-gray line-through">
                            {formatCurrency(p.compare_at_price)}
                          </span>
                        )}
                      </td>

                      {/* Stock Level (Inline editor) */}
                      <td className="p-3.5">
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="0"
                            value={p.stock_quantity}
                            onChange={(e) => updateStock(p.id, Number(e.target.value))}
                            className={`w-16 px-1.5 py-1 text-center font-semibold rounded-xs border text-xs focus:outline-none ${
                              p.stock_quantity === 0
                                ? 'bg-red-50 text-red-700 border-red-300'
                                : p.stock_quantity <= 10
                                ? 'bg-amber-50 text-amber-700 border-amber-300'
                                : 'bg-white text-charcoal border-subtle-border'
                            }`}
                          />
                          <span className="text-[10px] text-muted-gray">units</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-3.5">
                        {p.is_active ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>Active</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                            <span>Draft</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/product/${p.slug}`}
                            target="_blank"
                            title="Preview on storefront"
                            className="p-1.5 text-muted-gray hover:text-forest transition-colors rounded-xs hover:bg-sand/30"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => openEditModal(p)}
                            title="Edit product"
                            className="p-1.5 text-muted-gray hover:text-charcoal transition-colors rounded-xs hover:bg-sand/30"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(p.id)}
                            title="Delete product"
                            className="p-1.5 text-muted-gray hover:text-red-600 transition-colors rounded-xs hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-xs text-muted-gray">
                    No products found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Count */}
        <div className="p-3.5 bg-sand-50/40 border-t border-subtle-border flex justify-between items-center text-xs text-muted-gray">
          <span>
            Showing {filteredProducts.length} of {products.length} products
          </span>
          <span>Click any stock number above for instant real-time update</span>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-xs">
          <div className="bg-white rounded-sm border border-subtle-border shadow-elevated p-6 max-w-sm w-full space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 text-red-600">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <h3 className="font-serif text-lg font-semibold text-charcoal">
                Delete Product?
              </h3>
            </div>
            <p className="text-xs text-muted-gray">
              Are you sure you want to remove this piece from the catalog? This action will archive product records and remove it from the storefront.
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

      {/* Product Add / Edit Comprehensive Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-sm border border-subtle-border shadow-elevated w-full max-w-3xl my-8 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-subtle-border bg-sand-50/70 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-semibold text-charcoal">
                  {editingProduct ? `Edit Piece: ${editingProduct.name}` : 'Add New Artisan Piece'}
                </h3>
                <p className="text-xs text-muted-gray">
                  Configure catalog attributes, inventory levels, photography, and pricing.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-muted-gray hover:text-charcoal rounded-xs"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Nav Tabs */}
            <div className="flex border-b border-subtle-border px-5 bg-white text-xs font-semibold uppercase tracking-wider">
              <button
                type="button"
                onClick={() => setActiveFormSection('general')}
                className={`py-3 px-3 border-b-2 -mb-px transition-colors ${
                  activeFormSection === 'general'
                    ? 'border-forest text-forest'
                    : 'border-transparent text-muted-gray hover:text-charcoal'
                }`}
              >
                1. General Info
              </button>
              <button
                type="button"
                onClick={() => setActiveFormSection('pricing_stock')}
                className={`py-3 px-3 border-b-2 -mb-px transition-colors ${
                  activeFormSection === 'pricing_stock'
                    ? 'border-forest text-forest'
                    : 'border-transparent text-muted-gray hover:text-charcoal'
                }`}
              >
                2. Price & Inventory
              </button>
              <button
                type="button"
                onClick={() => setActiveFormSection('attributes')}
                className={`py-3 px-3 border-b-2 -mb-px transition-colors ${
                  activeFormSection === 'attributes'
                    ? 'border-forest text-forest'
                    : 'border-transparent text-muted-gray hover:text-charcoal'
                }`}
              >
                3. Materials & Dimensions
              </button>
              <button
                type="button"
                onClick={() => setActiveFormSection('images')}
                className={`py-3 px-3 border-b-2 -mb-px transition-colors ${
                  activeFormSection === 'images'
                    ? 'border-forest text-forest'
                    : 'border-transparent text-muted-gray hover:text-charcoal'
                }`}
              >
                4. Photography ({formData.images.length})
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {/* SECTION 1: GENERAL */}
              {activeFormSection === 'general' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-charcoal">Product Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder="e.g. Terracotta Pleated Urn"
                        className="w-full p-2 bg-ivory border border-subtle-border rounded-xs text-xs focus:outline-none focus:border-forest"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-charcoal">URL Slug *</label>
                      <input
                        type="text"
                        required
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full p-2 bg-ivory border border-subtle-border rounded-xs text-xs font-mono focus:outline-none focus:border-forest"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-charcoal">Category *</label>
                      <select
                        value={formData.category_id}
                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                        className="w-full p-2 bg-ivory border border-subtle-border rounded-xs text-xs focus:outline-none focus:border-forest"
                      >
                        <option value="">Select Category</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-charcoal">SKU (Stock Keeping Unit)</label>
                      <input
                        type="text"
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        placeholder="TF-1001"
                        className="w-full p-2 bg-ivory border border-subtle-border rounded-xs text-xs font-mono focus:outline-none focus:border-forest"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-charcoal">Short Description (Summary)</label>
                    <textarea
                      rows={2}
                      value={formData.short_description}
                      onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                      placeholder="Brief excerpt displayed on category cards and previews..."
                      className="w-full p-2 bg-ivory border border-subtle-border rounded-xs text-xs focus:outline-none focus:border-forest"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-charcoal">Full Description (Atelier Notes)</label>
                    <textarea
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Detailed craftsmanship narrative, glaze chemistry, origin..."
                      className="w-full p-2 bg-ivory border border-subtle-border rounded-xs text-xs focus:outline-none focus:border-forest"
                    />
                  </div>

                  {/* Badges / Visibility Toggles */}
                  <div className="p-3 bg-sand-50/60 border border-subtle-border rounded-xs space-y-2">
                    <p className="text-xs font-semibold text-charcoal">Merchandising Badges & Online Status</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.is_active}
                          onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                          className="rounded text-forest focus:ring-forest"
                        />
                        <span className="font-medium text-charcoal">Active Online</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.is_featured}
                          onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                          className="rounded text-forest focus:ring-forest"
                        />
                        <span className="font-medium text-charcoal">Featured Piece</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.is_new_arrival}
                          onChange={(e) => setFormData({ ...formData, is_new_arrival: e.target.checked })}
                          className="rounded text-forest focus:ring-forest"
                        />
                        <span className="font-medium text-charcoal">New Arrival</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.is_best_seller}
                          onChange={(e) => setFormData({ ...formData, is_best_seller: e.target.checked })}
                          className="rounded text-forest focus:ring-forest"
                        />
                        <span className="font-medium text-charcoal">Best Seller</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 2: PRICING & INVENTORY */}
              {activeFormSection === 'pricing_stock' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-charcoal">Selling Price (INR) *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="1"
                        value={formData.base_price}
                        onChange={(e) => setFormData({ ...formData, base_price: Number(e.target.value) })}
                        className="w-full p-2 bg-ivory border border-subtle-border rounded-xs text-xs font-semibold focus:outline-none focus:border-forest"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-charcoal">Compare At Price (MRP)</label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={formData.compare_at_price || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            compare_at_price: e.target.value ? Number(e.target.value) : null,
                          })
                        }
                        placeholder="Optional crossed-out price"
                        className="w-full p-2 bg-ivory border border-subtle-border rounded-xs text-xs focus:outline-none focus:border-forest"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-charcoal">Warehouse Stock Units *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.stock_quantity}
                        onChange={(e) => setFormData({ ...formData, stock_quantity: Number(e.target.value) })}
                        className="w-full p-2 bg-ivory border border-subtle-border rounded-xs text-xs font-semibold focus:outline-none focus:border-forest"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-sand-50/60 border border-subtle-border rounded-xs text-xs text-muted-gray space-y-1">
                    <p className="font-semibold text-charcoal">Stock Policy:</p>
                    <p>• Items with 0 stock units will display as "Sold Out" on the storefront and disable addition to cart.</p>
                    <p>• Items with ≤ 10 stock units trigger low-stock warning banners in admin telemetry.</p>
                  </div>
                </div>
              )}

              {/* SECTION 3: ATTRIBUTES & SPECS */}
              {activeFormSection === 'attributes' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-charcoal">Material Composition</label>
                      <input
                        type="text"
                        value={formData.material}
                        onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                        placeholder="e.g. Coarse Terracotta Stoneware"
                        className="w-full p-2 bg-ivory border border-subtle-border rounded-xs text-xs focus:outline-none focus:border-forest"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-charcoal">Color / Finish</label>
                      <input
                        type="text"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        placeholder="e.g. Matte Raw Sandstone"
                        className="w-full p-2 bg-ivory border border-subtle-border rounded-xs text-xs focus:outline-none focus:border-forest"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-charcoal">Size Label</label>
                      <input
                        type="text"
                        value={formData.size_label}
                        onChange={(e) => setFormData({ ...formData, size_label: e.target.value })}
                        placeholder="e.g. Medium (28 cm)"
                        className="w-full p-2 bg-ivory border border-subtle-border rounded-xs text-xs focus:outline-none focus:border-forest"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-sand-50/50 border border-subtle-border rounded-xs space-y-3">
                    <p className="text-xs font-semibold text-charcoal">Dimensions & Weight</p>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-muted-gray uppercase font-semibold">Height (cm)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.height || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, height: e.target.value ? Number(e.target.value) : null })
                          }
                          className="w-full p-1.5 bg-white border border-subtle-border rounded-xs text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-muted-gray uppercase font-semibold">Width (cm)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.width || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, width: e.target.value ? Number(e.target.value) : null })
                          }
                          className="w-full p-1.5 bg-white border border-subtle-border rounded-xs text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-muted-gray uppercase font-semibold">Depth (cm)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.depth || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, depth: e.target.value ? Number(e.target.value) : null })
                          }
                          className="w-full p-1.5 bg-white border border-subtle-border rounded-xs text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-muted-gray uppercase font-semibold">Diameter (cm)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.diameter || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, diameter: e.target.value ? Number(e.target.value) : null })
                          }
                          className="w-full p-1.5 bg-white border border-subtle-border rounded-xs text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-muted-gray uppercase font-semibold">Weight (kg)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.weight || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, weight: e.target.value ? Number(e.target.value) : null })
                          }
                          className="w-full p-1.5 bg-white border border-subtle-border rounded-xs text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-charcoal">Care Instructions</label>
                    <textarea
                      rows={2}
                      value={formData.care_instructions}
                      onChange={(e) => setFormData({ ...formData, care_instructions: e.target.value })}
                      placeholder="Maintenance tips: Dust with microfiber cloth, indoor only..."
                      className="w-full p-2 bg-ivory border border-subtle-border rounded-xs text-xs focus:outline-none focus:border-forest"
                    />
                  </div>
                </div>
              )}

              {/* SECTION 4: IMAGES GALLERY */}
              {activeFormSection === 'images' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs font-semibold text-charcoal">Product Imagery & Gallery</p>
                      <p className="text-[11px] text-muted-gray">
                        Specify high resolution image URLs. Set 1 image as the primary cover thumbnail.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addImageField}
                      className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-sand-100 hover:bg-sand-200 text-charcoal rounded-xs text-xs font-medium"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Image</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-sand-50/50 border border-subtle-border rounded-xs flex flex-col sm:flex-row items-center gap-3"
                      >
                        {/* Preview */}
                        <div className="relative w-14 h-16 bg-sand/30 rounded-xs overflow-hidden border border-subtle-border flex-shrink-0">
                          {img.image_url ? (
                            <Image
                              src={img.image_url}
                              alt={img.alt_text || 'Preview'}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-gray">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                          )}
                        </div>

                        {/* Input Fields */}
                        <div className="flex-1 space-y-1.5 w-full">
                          <input
                            type="url"
                            value={img.image_url}
                            onChange={(e) => {
                              const newImages = [...formData.images];
                              newImages[idx].image_url = e.target.value;
                              setFormData({ ...formData, images: newImages });
                            }}
                            placeholder="https://images.unsplash.com/photo-..."
                            className="w-full p-1.5 bg-white border border-subtle-border rounded-xs text-xs font-mono"
                          />
                          <input
                            type="text"
                            value={img.alt_text}
                            onChange={(e) => {
                              const newImages = [...formData.images];
                              newImages[idx].alt_text = e.target.value;
                              setFormData({ ...formData, images: newImages });
                            }}
                            placeholder="Accessible alt description..."
                            className="w-full p-1.5 bg-white border border-subtle-border rounded-xs text-[11px]"
                          />
                        </div>

                        {/* Controls */}
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => setPrimaryImage(idx)}
                            className={`px-2.5 py-1 text-[11px] font-semibold rounded-xs border transition-colors ${
                              img.is_primary
                                ? 'bg-forest text-white border-forest'
                                : 'bg-white text-muted-gray hover:text-charcoal border-subtle-border'
                            }`}
                          >
                            {img.is_primary ? 'Primary Cover' : 'Set as Primary'}
                          </button>
                          {formData.images.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeImageField(idx)}
                              className="p-1.5 text-muted-gray hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Footer Controls */}
              <div className="pt-4 border-t border-subtle-border flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-muted-gray">
                  <span>Section {activeFormSection === 'general' ? '1' : activeFormSection === 'pricing_stock' ? '2' : activeFormSection === 'attributes' ? '3' : '4'} of 4</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-subtle-border rounded-xs text-xs text-charcoal hover:bg-sand-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 bg-forest hover:bg-forest-light text-white text-xs font-semibold rounded-xs transition-colors shadow-xs"
                  >
                    {isSaving ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
