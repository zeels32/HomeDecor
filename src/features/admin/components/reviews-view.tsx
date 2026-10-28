'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Star,
  CheckCircle2,
  EyeOff,
  Eye,
  Trash2,
  ExternalLink,
  Filter,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { useAdmin } from '../admin-context';
import { AdminReview } from '../types';

export function AdminReviewsView() {
  const { reviews, toggleReviewPublish, deleteReview } = useAdmin();

  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'hidden'>('all');
  const [ratingFilter, setRatingFilter] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredReviews = reviews.filter((r) => {
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'published'
        ? r.is_published
        : !r.is_published;

    const matchesRating =
      ratingFilter === 'all' ? true : r.rating === Number(ratingFilter);

    return matchesStatus && matchesRating;
  });

  const handleDelete = async (id: string) => {
    const ok = await deleteReview(id);
    if (ok) setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-charcoal">
            Customer Reviews & Testimonials
          </h1>
          <p className="text-xs text-muted-gray mt-0.5">
            Moderate customer feedback, approve ratings for public display, and remove inappropriate content.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-sm border border-subtle-border shadow-soft flex flex-wrap gap-3 items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-muted-gray">Publication Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-2.5 py-1.5 bg-white border border-subtle-border rounded-xs text-xs text-charcoal focus:outline-none focus:border-forest"
          >
            <option value="all">All Reviews ({reviews.length})</option>
            <option value="published">Published Only ({reviews.filter((r) => r.is_published).length})</option>
            <option value="hidden">Hidden / Moderated ({reviews.filter((r) => !r.is_published).length})</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-muted-gray">Rating:</span>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value as any)}
            className="px-2.5 py-1.5 bg-white border border-subtle-border rounded-xs text-xs text-charcoal focus:outline-none focus:border-forest"
          >
            <option value="all">All Ratings</option>
            <option value="5">★★★★★ (5 Stars)</option>
            <option value="4">★★★★☆ (4 Stars)</option>
            <option value="3">★★★☆☆ (3 Stars)</option>
            <option value="2">★★☆☆☆ (2 Stars)</option>
            <option value="1">★☆☆☆☆ (1 Star)</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((r) => (
            <div
              key={r.id}
              className={`bg-white p-5 rounded-sm border transition-colors shadow-soft ${
                r.is_published ? 'border-subtle-border' : 'border-amber-300 bg-amber-50/20'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                {/* Author & Rating info */}
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center text-amber-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-charcoal text-xs">{r.author_name}</span>
                    {r.is_verified_purchase && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] bg-emerald-50 text-emerald-800 px-1.5 py-0.2 rounded font-semibold border border-emerald-200">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>Verified Buyer</span>
                      </span>
                    )}
                  </div>

                  {r.title && (
                    <h4 className="font-serif font-semibold text-charcoal text-sm mt-1">
                      {r.title}
                    </h4>
                  )}

                  <p className="text-xs text-charcoal/80 leading-relaxed pt-1">
                    {r.body}
                  </p>

                  <div className="flex items-center space-x-3 text-[11px] text-muted-gray pt-2">
                    {r.product_slug ? (
                      <Link
                        href={`/product/${r.product_slug}`}
                        target="_blank"
                        className="text-forest hover:underline font-medium inline-flex items-center gap-1"
                      >
                        <span>Piece: {r.product_name}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </Link>
                    ) : (
                      <span>Piece: {r.product_name || 'Artisan Ceramic Piece'}</span>
                    )}
                    <span>•</span>
                    <span>
                      {new Date(r.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center space-x-2 self-start sm:self-auto flex-shrink-0">
                  <button
                    onClick={() => toggleReviewPublish(r.id, !r.is_published)}
                    className={`inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xs text-xs font-semibold border transition-colors ${
                      r.is_published
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                        : 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
                    }`}
                  >
                    {r.is_published ? (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Published</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Hidden</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(r.id)}
                    className="p-1.5 text-muted-gray hover:text-red-600 rounded-xs hover:bg-red-50 transition-colors"
                    title="Delete review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 bg-white rounded-sm border border-subtle-border p-6 text-center text-xs text-muted-gray">
            No reviews match the selected filter.
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-xs">
          <div className="bg-white rounded-sm border border-subtle-border shadow-elevated p-6 max-w-sm w-full space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 text-red-600">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <h3 className="font-serif text-lg font-semibold text-charcoal">
                Delete Review?
              </h3>
            </div>
            <p className="text-xs text-muted-gray">
              Are you sure you want to permanently remove this customer review?
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
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xs transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
