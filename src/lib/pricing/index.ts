export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateCartTotals(
  items: Array<{ unit_price: number; quantity: number }>,
  freeShippingThreshold = Number(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD || 2999),
  standardShippingFee = 199
) {
  const subtotal = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  const isFreeShipping = subtotal >= freeShippingThreshold || subtotal === 0;
  const shippingAmount = isFreeShipping ? 0 : standardShippingFee;
  const discountAmount = 0;
  const taxAmount = 0; // Prices are tax-inclusive by default in India retail
  const totalAmount = subtotal + shippingAmount - discountAmount + taxAmount;

  return {
    subtotal,
    shippingAmount,
    discountAmount,
    taxAmount,
    totalAmount,
    isFreeShipping,
    amountNeededForFreeShipping: Math.max(0, freeShippingThreshold - subtotal),
  };
}
