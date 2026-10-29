import { OrderPricing, OrderItem, OrderStatus, UnitSystem } from '../types/tailor';

export const ORDER_STATUS_ORDER: OrderStatus[] = [
  'intake',
  'pattern_drafting',
  'fabric_prep',
  'first_fitting',
  'alterations',
  'final_fitting',
  'ready',
  'completed'
];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  intake: 'Intake & Measurement',
  pattern_drafting: 'Pattern Drafting',
  fabric_prep: 'Fabric & Canvas Prep',
  first_fitting: '1st Fitting / Baste',
  alterations: 'Alterations & Craft',
  final_fitting: 'Final Fitting / Press',
  ready: 'Ready for Pickup',
  completed: 'Delivered'
};

/**
 * Calculates financial figures: subtotal, taxes, grand total, balance due, and payment status.
 */
export function calculateOrderTotals(pricing: OrderPricing) {
  const subtotalBeforeDiscount =
    (pricing.basePrice || 0) +
    (pricing.fabricCost || 0) +
    (pricing.customizationCost || 0) +
    (pricing.rushSurcharge || 0);

  const subtotal = Math.max(0, subtotalBeforeDiscount - (pricing.discount || 0));
  const taxAmount = Number((subtotal * (pricing.taxRate || 0)).toFixed(2));
  const grandTotal = Number((subtotal + taxAmount).toFixed(2));
  const depositPaid = Number((pricing.depositPaid || 0).toFixed(2));
  const balanceDue = Number(Math.max(0, grandTotal - depositPaid).toFixed(2));
  const isPaidInFull = balanceDue <= 0.01;

  return {
    subtotalBeforeDiscount,
    subtotal,
    taxAmount,
    grandTotal,
    depositPaid,
    balanceDue,
    isPaidInFull,
    paymentStatus: isPaidInFull
      ? 'paid'
      : depositPaid > 0
      ? 'partial'
      : 'unpaid'
  };
}

/**
 * Converts inches to centimeters or vice versa.
 */
export function convertMeasurement(value: number, from: UnitSystem, to: UnitSystem): number {
  if (from === to) return Number(value.toFixed(2));
  if (from === 'inches' && to === 'cm') {
    return Number((value * 2.54).toFixed(1));
  }
  // cm to inches
  return Number((value / 2.54).toFixed(2));
}

/**
 * Formats a numeric currency into standard USD/GBP representation.
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Evaluates fitting urgency and next appointment schedule for an order.
 */
export function getFittingStatus(
  order: OrderItem,
  currentDateStr: string = '2026-10-28'
): { urgency: 'urgent' | 'upcoming' | 'completed' | 'none'; label: string; date?: string; daysRemaining?: number } {
  const { fittings, status } = order;

  if (status === 'completed') {
    return { urgency: 'completed', label: 'Order Completed' };
  }

  // Find next uncompleted fitting
  let targetDate: string | undefined;
  let stageName = '';

  if (fittings.firstFittingDate && !fittings.firstFittingCompleted) {
    targetDate = fittings.firstFittingDate;
    stageName = '1st Fitting';
  } else if (fittings.secondFittingDate && !fittings.secondFittingCompleted) {
    targetDate = fittings.secondFittingDate;
    stageName = '2nd Fitting';
  } else if (fittings.finalFittingDate && !fittings.finalFittingCompleted) {
    targetDate = fittings.finalFittingDate;
    stageName = 'Final Fitting';
  }

  if (!targetDate) {
    if (status === 'ready') {
      return { urgency: 'upcoming', label: 'Ready for Collection' };
    }
    return { urgency: 'none', label: 'No Fitting Scheduled' };
  }

  const current = new Date(currentDateStr);
  const target = new Date(targetDate);
  const diffTime = target.getTime() - current.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      urgency: 'urgent',
      label: `${stageName} Overdue (${Math.abs(diffDays)}d ago)`,
      date: targetDate,
      daysRemaining: diffDays
    };
  } else if (diffDays <= 2) {
    return {
      urgency: 'urgent',
      label: `${stageName} ${diffDays === 0 ? 'Today' : `in ${diffDays}d`}`,
      date: targetDate,
      daysRemaining: diffDays
    };
  } else if (diffDays <= 7) {
    return {
      urgency: 'upcoming',
      label: `${stageName} in ${diffDays}d`,
      date: targetDate,
      daysRemaining: diffDays
    };
  }

  return {
    urgency: 'none',
    label: `${stageName} on ${targetDate}`,
    date: targetDate,
    daysRemaining: diffDays
  };
}

/**
 * Calculates measurement differences between two profile recordings.
 */
export function compareMeasurementDeltas(
  original: Record<string, number>,
  current: Record<string, number>
): Record<string, { diff: number; direction: 'same' | 'increased' | 'decreased' }> {
  const results: Record<string, { diff: number; direction: 'same' | 'increased' | 'decreased' }> = {};
  const allKeys = Array.from(new Set([...Object.keys(original), ...Object.keys(current)]));

  for (const key of allKeys) {
    const valOrig = original[key] ?? 0;
    const valCurr = current[key] ?? 0;
    const diff = Number((valCurr - valOrig).toFixed(2));

    let direction: 'same' | 'increased' | 'decreased' = 'same';
    if (diff > 0.05) direction = 'increased';
    else if (diff < -0.05) direction = 'decreased';

    results[key] = { diff, direction };
  }

  return results;
}

/**
 * Pipeline status navigation
 */
export function getNextOrderStatus(current: OrderStatus): OrderStatus | null {
  const idx = ORDER_STATUS_ORDER.indexOf(current);
  if (idx === -1 || idx === ORDER_STATUS_ORDER.length - 1) return null;
  return ORDER_STATUS_ORDER[idx + 1];
}

export function getPreviousOrderStatus(current: OrderStatus): OrderStatus | null {
  const idx = ORDER_STATUS_ORDER.indexOf(current);
  if (idx <= 0) return null;
  return ORDER_STATUS_ORDER[idx - 1];
}
