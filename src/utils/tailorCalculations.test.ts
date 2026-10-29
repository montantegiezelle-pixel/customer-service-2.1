import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateOrderTotals,
  convertMeasurement,
  compareMeasurementDeltas,
  getNextOrderStatus,
  getPreviousOrderStatus,
  getFittingStatus
} from './tailorCalculations';
import { OrderItem } from '../types/tailor';

test('calculateOrderTotals computes correct subtotal, taxes, grand total and balance', () => {
  const pricing = {
    basePrice: 1500,
    fabricCost: 400,
    customizationCost: 150,
    rushSurcharge: 100,
    discount: 150,
    taxRate: 0.08, // 8%
    depositPaid: 1000
  };

  const result = calculateOrderTotals(pricing);
  // subtotalBefore = 1500 + 400 + 150 + 100 = 2150
  // subtotalAfterDiscount = 2150 - 150 = 2000
  // tax = 2000 * 0.08 = 160
  // grandTotal = 2160
  // balanceDue = 2160 - 1000 = 1160
  assert.equal(result.subtotalBeforeDiscount, 2150);
  assert.equal(result.subtotal, 2000);
  assert.equal(result.taxAmount, 160);
  assert.equal(result.grandTotal, 2160);
  assert.equal(result.balanceDue, 1160);
  assert.equal(result.isPaidInFull, false);
  assert.equal(result.paymentStatus, 'partial');
});

test('calculateOrderTotals marks paid in full when balance is zero', () => {
  const pricing = {
    basePrice: 800,
    fabricCost: 200,
    customizationCost: 0,
    rushSurcharge: 0,
    discount: 0,
    taxRate: 0.1,
    depositPaid: 1100
  };

  const result = calculateOrderTotals(pricing);
  assert.equal(result.grandTotal, 1100);
  assert.equal(result.balanceDue, 0);
  assert.equal(result.isPaidInFull, true);
  assert.equal(result.paymentStatus, 'paid');
});

test('convertMeasurement accurately converts between inches and centimeters', () => {
  assert.equal(convertMeasurement(10, 'inches', 'cm'), 25.4);
  assert.equal(convertMeasurement(25.4, 'cm', 'inches'), 10);
  assert.equal(convertMeasurement(42, 'inches', 'inches'), 42);
});

test('compareMeasurementDeltas accurately detects changes', () => {
  const original = { chest: 40, waist: 34, hips: 41 };
  const current = { chest: 41.5, waist: 33, hips: 41 };

  const deltas = compareMeasurementDeltas(original, current);
  assert.equal(deltas.chest.diff, 1.5);
  assert.equal(deltas.chest.direction, 'increased');
  assert.equal(deltas.waist.diff, -1.0);
  assert.equal(deltas.waist.direction, 'decreased');
  assert.equal(deltas.hips.diff, 0);
  assert.equal(deltas.hips.direction, 'same');
});

test('pipeline transitions traverse forward and backward correctly', () => {
  assert.equal(getNextOrderStatus('intake'), 'pattern_drafting');
  assert.equal(getNextOrderStatus('completed'), null);
  assert.equal(getPreviousOrderStatus('pattern_drafting'), 'intake');
  assert.equal(getPreviousOrderStatus('intake'), null);
});

test('getFittingStatus detects upcoming and overdue fitting appointments', () => {
  const baseOrder: OrderItem = {
    id: 'ord-1',
    orderNumber: 'ORD-2026-01',
    customerId: 'cust-1',
    garmentType: 'Dinner Jacket',
    category: 'suit_jacket',
    fabricCode: 'Velvet Midnight Blue',
    status: 'first_fitting',
    priority: 'normal',
    createdAt: '2026-10-01',
    targetDeliveryDate: '2026-11-15',
    fittings: {
      firstFittingDate: '2026-10-29', // 1 day after 2026-10-28
      firstFittingCompleted: false
    },
    pricing: {
      basePrice: 1200,
      fabricCost: 300,
      customizationCost: 50,
      rushSurcharge: 0,
      discount: 0,
      taxRate: 0.05,
      depositPaid: 500
    },
    assignedTailor: 'Master Tailor Harris'
  };

  const status = getFittingStatus(baseOrder, '2026-10-28');
  assert.equal(status.urgency, 'urgent');
  assert.match(status.label, /1st Fitting in 1d/);
});
