'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Truck,
  CreditCard,
  Building2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useCart } from '@/features/cart/cart-context';
import { useAuth } from '@/features/auth/auth-context';
import { useOrders } from '@/features/orders/orders-context';
import { formatCurrency } from '@/lib/pricing';
import { Address, Order } from '@/types';
import { razorpayPaymentService } from '@/lib/payments';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shippingAmount, totalAmount, isFreeShipping, clearCart } = useCart();
  const { user, profile } = useAuth();
  const { addresses, addAddress, createOrder } = useOrders();

  // Step 1: Customer Contact
  const [email, setEmail] = useState(user?.email || profile?.email || '');
  const [phone, setPhone] = useState(profile?.phone || '');

  // Step 2: Shipping Address
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [addressLine1, setAddressLine1] = useState(addresses[0]?.address_line_1 || '');
  const [addressLine2, setAddressLine2] = useState(addresses[0]?.address_line_2 || '');
  const [city, setCity] = useState(addresses[0]?.city || '');
  const [state, setState] = useState(addresses[0]?.state || 'Maharashtra');
  const [postalCode, setPostalCode] = useState(addresses[0]?.postal_code || '');
  const [saveAddress, setSaveAddress] = useState(true);

  // Step 3: Payment
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'dev_mode'>(
    razorpayPaymentService.isConfigured ? 'razorpay' : 'dev_mode'
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (items.length === 0 && !completedOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <h1 className="font-serif text-2xl text-charcoal">Your Shopping Bag is Empty</h1>
        <p className="text-xs text-muted-gray">Please add pieces to your bag before checking out.</p>
        <Link
          href="/shop"
          className="inline-block px-6 py-2.5 bg-forest text-white text-xs font-semibold uppercase tracking-wider rounded-xs"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  // Handle Order Placement
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !phone || !fullName || !addressLine1 || !city || !postalCode) {
      setErrorMessage('Please fill in all required contact and delivery address fields.');
      return;
    }

    if (postalCode.length < 6) {
      setErrorMessage('Please provide a valid 6-digit postal PIN code.');
      return;
    }

    setIsProcessing(true);

    try {
      const shippingAddress: Address = {
        id: 'addr_' + Date.now(),
        full_name: fullName,
        phone,
        address_line_1: addressLine1,
        address_line_2: addressLine2 || null,
        city,
        state,
        postal_code: postalCode,
        country: 'India',
      };

      if (saveAddress && user) {
        addAddress(shippingAddress);
      }

      // Payment processing abstraction
      const paymentOrder = await razorpayPaymentService.createPaymentOrder({
        orderNumber: `ORD-${Date.now()}`,
        amount: totalAmount,
        currency: 'INR',
        customer: { name: fullName, email, phone },
      });

      const verification = await razorpayPaymentService.verifyPayment({
        isSimulated: paymentOrder.isDevelopmentMode,
        razorpayPaymentId: `PAY_${Date.now()}`,
      });

      if (!verification.verified) {
        setErrorMessage('Payment verification could not be completed. Please try again.');
        setIsProcessing(false);
        return;
      }

      // Create snapshot order
      const order = await createOrder({
        email,
        phone,
        status: 'processing',
        payment_status: 'paid',
        currency: 'INR',
        subtotal,
        shipping_amount: shippingAmount,
        discount_amount: 0,
        tax_amount: 0,
        total_amount: totalAmount,
        shipping_address_snapshot: shippingAddress,
        billing_address_snapshot: shippingAddress,
        payment_provider: paymentOrder.isDevelopmentMode ? 'Development Simulation' : 'Razorpay',
        payment_reference: verification.reference,
        items: items.map((i) => ({
          id: 'item_' + Math.random().toString(36).substring(2, 7),
          order_id: '',
          product_id: i.product_id,
          variant_id: i.variant_id || null,
          product_name_snapshot: i.product.name,
          sku_snapshot: i.variant?.id || 'BASE',
          variant_snapshot: i.variant?.options || null,
          unit_price: i.unit_price,
          quantity: i.quantity,
          line_total: i.line_total,
          created_at: new Date().toISOString(),
        })),
      });

      clearCart();
      setCompletedOrder(order);
    } catch (err: any) {
      console.error('Checkout error:', err);
      setErrorMessage(err.message || 'An error occurred during checkout.');
    } finally {
      setIsProcessing(false);
    }
  };

  // SUCCESS CONFIRMATION VIEW
  if (completedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-8 animate-in fade-in duration-300">
        <div className="bg-white p-8 rounded-sm border border-subtle-border shadow-soft text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-forest-50 text-forest mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <p className="text-xs uppercase tracking-widest text-forest font-semibold">
              Payment & Order Confirmed
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">
              Thank You for Your Order
            </h1>
            <p className="text-xs sm:text-sm text-muted-gray">
              We have received your order and our studio team is preparing your pieces with white-glove packaging.
            </p>
          </div>

          <div className="p-4 bg-ivory rounded-sm border border-subtle-border inline-block text-left text-xs space-y-1">
            <p>
              <strong className="text-charcoal">Order Number:</strong>{' '}
              <span className="font-mono text-forest font-semibold">{completedOrder.order_number}</span>
            </p>
            <p>
              <strong className="text-charcoal">Confirmation Sent To:</strong> {completedOrder.email}
            </p>
            <p>
              <strong className="text-charcoal">Payment Reference:</strong>{' '}
              <span className="font-mono">{completedOrder.payment_reference}</span>
            </p>
          </div>
        </div>

        {/* Order Details & Summary */}
        <div className="bg-white p-6 rounded-sm border border-subtle-border space-y-6">
          <h2 className="font-serif text-lg font-medium text-charcoal border-b border-subtle-border pb-3">
            Order Summary
          </h2>

          <div className="divide-y divide-subtle-border text-xs">
            {completedOrder.items?.map((item) => (
              <div key={item.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-charcoal">{item.product_name_snapshot}</p>
                  <p className="text-muted-gray">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium text-charcoal">{formatCurrency(item.line_total)}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-subtle-border pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-muted-gray">
              <span>Subtotal</span>
              <span className="text-charcoal">{formatCurrency(completedOrder.subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-gray">
              <span>Shipping</span>
              <span className="text-charcoal">
                {completedOrder.shipping_amount === 0 ? 'Complimentary' : formatCurrency(completedOrder.shipping_amount)}
              </span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-charcoal pt-2 border-t border-subtle-border">
              <span>Total Paid</span>
              <span className="font-serif text-base">{formatCurrency(completedOrder.total_amount)}</span>
            </div>
          </div>

          <div className="border-t border-subtle-border pt-4 text-xs space-y-1">
            <p className="font-semibold text-charcoal">Shipping Address:</p>
            <p className="text-muted-gray">
              {completedOrder.shipping_address_snapshot.full_name}<br />
              {completedOrder.shipping_address_snapshot.address_line_1}, {completedOrder.shipping_address_snapshot.city}, {completedOrder.shipping_address_snapshot.state} - {completedOrder.shipping_address_snapshot.postal_code}
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <Link
              href="/shop"
              className="flex-1 text-center py-3 px-4 bg-forest text-white text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-forest-600 transition-colors"
            >
              Continue Shopping
            </Link>
            <Link
              href="/account/orders"
              className="flex-1 text-center py-3 px-4 bg-white border border-subtle-border text-charcoal text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-sand/30 transition-colors"
            >
              View Order in Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-subtle-border pb-4 flex justify-between items-center">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">Checkout</h1>
          <p className="text-xs text-muted-gray mt-0.5">Secure, encrypted order placement</p>
        </div>
        <div className="flex items-center space-x-1.5 text-xs text-forest font-medium">
          <Lock className="w-3.5 h-3.5" />
          <span>256-bit SSL Secure Checkout</span>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Form: Steps 1, 2, 3 */}
        <div className="lg:col-span-7 space-y-8">
          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-sm text-xs text-red-700 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Contact Details */}
          <div className="bg-white p-6 rounded-sm border border-subtle-border space-y-4 shadow-soft">
            <div className="flex justify-between items-center border-b border-subtle-border pb-3">
              <h2 className="font-serif text-base font-semibold text-charcoal">
                1. Contact Information
              </h2>
              {!user && (
                <Link href="/login" className="text-xs text-forest hover:underline">
                  Sign in for faster checkout
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-charcoal">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full p-2.5 bg-ivory border border-subtle-border rounded-xs focus:outline-none focus:border-forest"
                />
                <p className="text-[10px] text-muted-gray">For order tracking & receipt</p>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-charcoal">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full p-2.5 bg-ivory border border-subtle-border rounded-xs focus:outline-none focus:border-forest"
                />
                <p className="text-[10px] text-muted-gray">For courier dispatch coordination</p>
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Address */}
          <div className="bg-white p-6 rounded-sm border border-subtle-border space-y-4 shadow-soft">
            <h2 className="font-serif text-base font-semibold text-charcoal border-b border-subtle-border pb-3">
              2. Shipping Address (India)
            </h2>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-charcoal">Recipient Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Zeel Solanki"
                  className="w-full p-2.5 bg-ivory border border-subtle-border rounded-xs focus:outline-none focus:border-forest"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-charcoal">Address Line 1 (Flat, House no., Building) *</label>
                <input
                  type="text"
                  required
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="402, Lotus Grandeur, 14th Road"
                  className="w-full p-2.5 bg-ivory border border-subtle-border rounded-xs focus:outline-none focus:border-forest"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-charcoal">Address Line 2 (Street, Area, Landmark)</label>
                <input
                  type="text"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  placeholder="Near Khar Gymkhana, Khar West"
                  className="w-full p-2.5 bg-ivory border border-subtle-border rounded-xs focus:outline-none focus:border-forest"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-charcoal">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Mumbai"
                    className="w-full p-2.5 bg-ivory border border-subtle-border rounded-xs focus:outline-none focus:border-forest"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-charcoal">State *</label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full p-2.5 bg-ivory border border-subtle-border rounded-xs focus:outline-none focus:border-forest"
                  >
                    {[
                      'Maharashtra',
                      'Delhi NCR',
                      'Karnataka',
                      'Tamil Nadu',
                      'Gujarat',
                      'Telangana',
                      'Rajasthan',
                      'West Bengal',
                      'Goa',
                      'Kerala',
                      'Other States',
                    ].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-charcoal">PIN Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="400052"
                    className="w-full p-2.5 bg-ivory border border-subtle-border rounded-xs focus:outline-none focus:border-forest font-mono"
                  />
                </div>
              </div>

              {user && (
                <label className="flex items-center space-x-2 pt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveAddress}
                    onChange={(e) => setSaveAddress(e.target.checked)}
                    className="rounded-xs accent-forest"
                  />
                  <span className="text-muted-gray">Save this address to my profile for future orders</span>
                </label>
              )}
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="bg-white p-6 rounded-sm border border-subtle-border space-y-4 shadow-soft">
            <div className="flex justify-between items-center border-b border-subtle-border pb-3">
              <h2 className="font-serif text-base font-semibold text-charcoal">
                3. Payment Method
              </h2>
              <span className="text-[11px] text-muted-gray font-mono">INR Currency</span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Option 1: Development Sandbox Mode */}
              <label
                className={`flex items-start p-3.5 rounded-sm border cursor-pointer transition-all ${
                  paymentMethod === 'dev_mode'
                    ? 'border-forest bg-forest/5 ring-1 ring-forest'
                    : 'border-subtle-border bg-white hover:bg-sand/20'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'dev_mode'}
                  onChange={() => setPaymentMethod('dev_mode')}
                  className="mt-0.5 accent-forest"
                />
                <div className="ml-3 flex-1">
                  <div className="flex justify-between">
                    <span className="font-semibold text-charcoal">
                      Sandbox Simulation Mode (Instant Verification)
                    </span>
                    <span className="text-[10px] bg-sand px-1.5 py-0.5 rounded text-charcoal font-semibold">
                      Dev Testing
                    </span>
                  </div>
                  <p className="text-muted-gray text-[11px] mt-1">
                    Safe development verification mode without live payment gateway credentials. Creates authenticated order snapshots with real database schema foundations.
                  </p>
                </div>
              </label>

              {/* Option 2: Live Razorpay Gateway */}
              <label
                className={`flex items-start p-3.5 rounded-sm border cursor-pointer transition-all ${
                  paymentMethod === 'razorpay'
                    ? 'border-forest bg-forest/5 ring-1 ring-forest'
                    : 'border-subtle-border bg-white hover:bg-sand/20'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'razorpay'}
                  onChange={() => setPaymentMethod('razorpay')}
                  className="mt-0.5 accent-forest"
                />
                <div className="ml-3 flex-1">
                  <div className="flex justify-between">
                    <span className="font-semibold text-charcoal">
                      Razorpay Gateway (UPI, Cards, NetBanking, RuPay)
                    </span>
                    <CreditCard className="w-4 h-4 text-forest" />
                  </div>
                  <p className="text-muted-gray text-[11px] mt-1">
                    Direct integration interface for Razorpay API. (Requires RAZORPAY_KEY_ID in production).
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Review & Submit */}
        <div className="lg:col-span-5 bg-white p-6 rounded-sm border border-subtle-border shadow-soft space-y-6 sticky top-28">
          <h2 className="font-serif text-xl font-medium text-charcoal border-b border-subtle-border pb-3">
            Review Bag ({items.length} {items.length === 1 ? 'piece' : 'pieces'})
          </h2>

          <div className="max-h-72 overflow-y-auto divide-y divide-subtle-border pr-2 text-xs">
            {items.map((item) => (
              <div key={item.id} className="py-3 flex space-x-3">
                <div className="relative w-14 h-16 bg-sand/30 rounded-xs overflow-hidden flex-shrink-0 border border-subtle-border">
                  {item.product.image_url && (
                    <Image
                      src={item.product.image_url}
                      alt={item.product.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-charcoal truncate">{item.product.name}</p>
                  {item.variant && <p className="text-muted-gray text-[11px]">{item.variant.name}</p>}
                  <p className="text-muted-gray text-[11px]">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold text-charcoal">{formatCurrency(item.line_total)}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2 border-t border-subtle-border pt-4 text-xs">
            <div className="flex justify-between text-muted-gray">
              <span>Subtotal</span>
              <span className="font-medium text-charcoal">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-gray">
              <span>White-Glove Shipping</span>
              <span className="font-medium text-charcoal">
                {isFreeShipping ? 'Complimentary' : formatCurrency(shippingAmount)}
              </span>
            </div>
            <div className="flex justify-between text-muted-gray">
              <span>Transit Insurance</span>
              <span className="font-medium text-forest">Included</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-charcoal pt-3 border-t border-subtle-border">
              <span>Final Payable</span>
              <span className="font-serif text-xl text-forest">{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-4 px-6 bg-forest text-white text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-forest-600 transition-colors shadow-sm flex items-center justify-center space-x-2 disabled:bg-muted-gray"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authorizing & Reserving Pieces...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Place Order • {formatCurrency(totalAmount)}</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-muted-gray text-center leading-relaxed">
            By placing your order, you agree to Terra & Form's Terms of Sale and 7-day return policy.
          </p>
        </div>
      </form>
    </div>
  );
}
