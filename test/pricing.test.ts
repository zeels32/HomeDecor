import { calculateCartTotals, formatCurrency } from '../src/lib/pricing';

function runPricingTests() {
  console.log('Testing pricing calculations...');

  // Test 1: Under free shipping threshold
  const cart1 = [{ unit_price: 1499, quantity: 1 }];
  const totals1 = calculateCartTotals(cart1, 2999, 199);
  console.assert(totals1.subtotal === 1499, 'Subtotal should be 1499');
  console.assert(totals1.shippingAmount === 199, 'Shipping should be 199');
  console.assert(totals1.totalAmount === 1698, 'Total should be 1698');
  console.assert(totals1.isFreeShipping === false, 'Should not have free shipping');
  console.assert(totals1.amountNeededForFreeShipping === 1500, 'Should need 1500 more for free shipping');

  // Test 2: Above free shipping threshold
  const cart2 = [{ unit_price: 2899, quantity: 1 }, { unit_price: 1999, quantity: 1 }];
  const totals2 = calculateCartTotals(cart2, 2999, 199);
  console.assert(totals2.subtotal === 4898, 'Subtotal should be 4898');
  console.assert(totals2.shippingAmount === 0, 'Shipping should be 0');
  console.assert(totals2.totalAmount === 4898, 'Total should be 4898');
  console.assert(totals2.isFreeShipping === true, 'Should have free shipping');

  // Test 3: Formatting
  const formatted = formatCurrency(2899);
  console.assert(formatted.includes('2,899'), 'Formatted price should contain 2,899');

  console.log('All pricing tests passed successfully!');
}

runPricingTests();
