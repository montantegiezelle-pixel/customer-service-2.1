import React from 'react';
import { Customer, OrderItem, CustomerMeasurementProfile } from '../../types/tailor';
import { calculateOrderTotals, formatCurrency, STATUS_LABELS } from '../../utils/tailorCalculations';
import { X, Printer, Scissors, CheckCircle, QrCode } from 'lucide-react';

interface WorkOrderPrintModalProps {
  order: OrderItem;
  customer?: Customer;
  profile?: CustomerMeasurementProfile;
  type: 'work_order' | 'invoice';
  onClose: () => void;
}

export const WorkOrderPrintModal: React.FC<WorkOrderPrintModalProps> = ({
  order,
  customer,
  profile,
  type,
  onClose
}) => {
  const totals = calculateOrderTotals(order.pricing);
  const garmentMeasurements = profile?.garments[order.category]?.values || {};

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl max-h-[95vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between no-print sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800">
              {type === 'work_order' ? 'Workshop Cutting Ticket Preview' : 'Client Bespoke Statement Preview'}
            </span>
            <span className="text-xs font-mono text-slate-500">({order.orderNumber})</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Document</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Paper Sheet */}
        <div className="p-8 sm:p-12 text-slate-900 bg-white font-sans print-card">
          {type === 'work_order' ? (
            /* WORKSHOP CUTTING TICKET */
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Scissors className="w-6 h-6 text-slate-900 transform -rotate-45" />
                    <span className="text-xl font-bold tracking-tight uppercase">
                      Atelier Bespoke Workshop
                    </span>
                  </div>
                  <div className="text-xs font-medium text-slate-600 mt-0.5">
                    MASTER CUTTER'S BENCH DOCKET · SAVILE ROW GUILD
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-mono font-bold tracking-tight">
                    {order.orderNumber}
                  </div>
                  <div className="text-xs font-mono text-slate-600">
                    Order Date: {order.createdAt}
                  </div>
                  <div className="text-xs font-bold text-rose-700 uppercase mt-1">
                    Priority: {order.priority}
                  </div>
                </div>
              </div>

              {/* Patron & Timeline Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Patron</span>
                  <strong className="text-slate-900 text-sm block">{customer?.fullName}</strong>
                  <span className="text-slate-500 font-mono">{customer?.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Assigned Cutter</span>
                  <strong className="text-slate-900 block">{order.assignedTailor}</strong>
                  <span className="text-slate-500">Bench Station 02</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">1st Baste Fitting</span>
                  <strong className="text-slate-900 font-mono block">
                    {order.fittings.firstFittingDate || 'TBD'}
                  </strong>
                  <span className="text-slate-500">{order.fittings.firstFittingCompleted ? 'Passed' : 'Pending'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Target Hand-off</span>
                  <strong className="text-slate-900 font-mono block">{order.targetDeliveryDate}</strong>
                  <span className="text-slate-500 font-semibold text-amber-700">Strict Deadline</span>
                </div>
              </div>

              {/* Garment & Cloth Details */}
              <div className="border border-slate-200 rounded-lg p-4 space-y-2 text-xs">
                <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-100 pb-1">
                  Garment & Cloth Specification
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-slate-500 block">Garment:</span>
                    <strong className="text-slate-900">{order.garmentType}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Fabric Cloth & Bolt:</span>
                    <strong className="text-slate-900">{order.fabricCode}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Lining Cloth:</span>
                    <span>{order.liningCode || 'Standard Full Bemberg Cupro'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Button Trim:</span>
                    <span>{order.buttonStyle || 'Standard Genuine Horn'}</span>
                  </div>
                </div>

                {order.specialInstructions && (
                  <div className="mt-2 pt-2 border-t border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Special Instructions:</span>
                    <p className="italic text-slate-800 mt-0.5 font-medium">"{order.specialInstructions}"</p>
                  </div>
                )}
              </div>

              {/* Cutting Measurements Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Cutting Measurements ({profile?.unit || 'inches'})
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    Fit Silhouette: {profile?.garments[order.category]?.fitPreference?.toUpperCase() || 'BESPOKE SLIM'}
                  </span>
                </div>

                <div className="border border-slate-300 rounded-lg overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-300 font-bold text-slate-800">
                        <th className="py-2 px-3">Anatomical Datum</th>
                        <th className="py-2 px-3 text-right">Net Value</th>
                        <th className="py-2 px-3 text-right">Inches / Unit</th>
                        <th className="py-2 px-3">Cutter Chalk Notes & Ease</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {Object.entries(garmentMeasurements).length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-6 text-center text-slate-500">
                            No measurements logged for this category.
                          </td>
                        </tr>
                      ) : (
                        Object.entries(garmentMeasurements).map(([key, val]) => (
                          <tr key={key}>
                            <td className="py-2 px-3 font-medium capitalize text-slate-800">
                              {key.replace(/^[a-z]+_/, '').replace('_', ' ')}
                            </td>
                            <td className="py-2 px-3 text-right font-mono font-bold text-slate-900 text-sm">
                              {val}
                            </td>
                            <td className="py-2 px-3 text-right font-mono text-slate-500">
                              {profile?.unit || 'in'}
                            </td>
                            <td className="py-2 px-3 text-slate-400 font-mono text-[11px]">
                              [  ] Chalked & Checked
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Posture & Body Notes */}
              {(profile?.postureNotes || customer?.notes) && (
                <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg text-xs text-slate-800">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-amber-900 block mb-1">
                    Cutter Posture Memo & Drop Corrections
                  </span>
                  <p className="leading-relaxed">
                    {profile?.postureNotes || customer?.notes}
                  </p>
                </div>
              )}

              {/* Signoff Blocks */}
              <div className="pt-6 border-t border-slate-300 grid grid-cols-3 gap-6 text-xs text-slate-600">
                <div>
                  <div className="h-10 border-b border-slate-400" />
                  <span className="block mt-1">Cutter Signature</span>
                </div>
                <div>
                  <div className="h-10 border-b border-slate-400" />
                  <span className="block mt-1">Tailor Basting Signoff</span>
                </div>
                <div>
                  <div className="h-10 border-b border-slate-400" />
                  <span className="block mt-1">Final QC Inspection</span>
                </div>
              </div>
            </div>
          ) : (
            /* CLIENT BESPOKE STATEMENT / INVOICE */
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Scissors className="w-6 h-6 text-slate-900 transform -rotate-45" />
                    <span className="text-xl font-bold tracking-tight uppercase">
                      Atelier Bespoke Tailors
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    14 Curzon Street, Mayfair, London W1J 5HN · +44 20 7946 0912
                  </div>
                  <div className="text-xs text-slate-500">
                    VAT Registration # GB 942 8812 04
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xl font-bold font-mono tracking-tight text-slate-900">
                    STATEMENT
                  </div>
                  <div className="text-xs font-mono text-slate-600">
                    Reference: {order.orderNumber}
                  </div>
                  <div className="text-xs font-mono text-slate-600">
                    Issue Date: {order.createdAt}
                  </div>
                </div>
              </div>

              {/* Bill To */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs flex justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Client Patron</span>
                  <strong className="text-slate-900 text-sm block">{customer?.fullName}</strong>
                  <div className="text-slate-600 mt-0.5">{customer?.address || 'Private Client Address'}</div>
                  <div className="text-slate-600 font-mono mt-0.5">{customer?.phone} · {customer?.email}</div>
                </div>
                <div className="text-right font-mono">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block font-sans">Hand-off Target</span>
                  <strong className="text-slate-900 block">{order.targetDeliveryDate}</strong>
                  <span className="text-slate-500 text-[11px]">Fitting Stage: {STATUS_LABELS[order.status]}</span>
                </div>
              </div>

              {/* Itemized Services & Materials */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 font-bold text-slate-800">
                      <th className="py-2.5 px-3">Description</th>
                      <th className="py-2.5 px-3">Cloth / Trim Specification</th>
                      <th className="py-2.5 px-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="py-3 px-3">
                        <strong className="text-slate-900 block">{order.garmentType}</strong>
                        <span className="text-slate-500 text-[11px]">Hand-cut bespoke tailoring with basted trial</span>
                      </td>
                      <td className="py-3 px-3 text-slate-600">Base Master Bench Workmanship</td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold">
                        {formatCurrency(order.pricing.basePrice)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3">
                        <strong className="text-slate-900 block">Cloth & Shell Materials</strong>
                        <span className="text-slate-500 text-[11px]">{order.fabricCode}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-600">English / Italian Luxury Mills</td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold">
                        {formatCurrency(order.pricing.fabricCost)}
                      </td>
                    </tr>
                    {order.pricing.customizationCost > 0 && (
                      <tr>
                        <td className="py-3 px-3">
                          <strong className="text-slate-900 block">Hand-stitched Trims & Finishes</strong>
                          <span className="text-slate-500 text-[11px]">{order.liningCode || 'Custom linings and horn buttons'}</span>
                        </td>
                        <td className="py-3 px-3 text-slate-600">Bespoke Trims</td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold">
                          {formatCurrency(order.pricing.customizationCost)}
                        </td>
                      </tr>
                    )}
                    {order.pricing.rushSurcharge > 0 && (
                      <tr>
                        <td className="py-3 px-3 text-rose-700 font-semibold">
                          Priority Rush Production Surcharge
                        </td>
                        <td className="py-3 px-3 text-slate-600">Expedited Bench Processing</td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold text-rose-700">
                          +{formatCurrency(order.pricing.rushSurcharge)}
                        </td>
                      </tr>
                    )}
                    {order.pricing.discount > 0 && (
                      <tr>
                        <td className="py-3 px-3 text-emerald-700 font-semibold">
                          Patron Loyalty Courtesy
                        </td>
                        <td className="py-3 px-3 text-slate-600">VIP Courtesy Adjustment</td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold text-emerald-700">
                          -{formatCurrency(order.pricing.discount)}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Total Settlement Calculation */}
              <div className="flex justify-end text-xs">
                <div className="w-72 space-y-2 border-t border-slate-200 pt-3">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-mono tabular-nums">{formatCurrency(totals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Sales Tax / VAT ({(order.pricing.taxRate * 100).toFixed(0)}%)</span>
                    <span className="font-mono tabular-nums">{formatCurrency(totals.taxAmount)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 text-sm border-t border-slate-300 pt-2">
                    <span>Grand Total</span>
                    <span className="font-mono tabular-nums">{formatCurrency(totals.grandTotal)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Deposit Recorded</span>
                    <span className="font-mono tabular-nums font-semibold">
                      {formatCurrency(totals.depositPaid)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-base bg-slate-100 p-2 rounded">
                    <span>Balance Outstanding</span>
                    <span className={`font-mono tabular-nums ${totals.balanceDue > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                      {totals.balanceDue > 0 ? formatCurrency(totals.balanceDue) : 'PAID IN FULL'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer Terms */}
              <div className="pt-6 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
                <p>
                  <strong>Terms & Guarantee:</strong> All bespoke garments include comprehensive in-house alterations up to 6 months post-delivery. Balances are due upon final trial hand-off.
                </p>
                <p>Thank you for your valued patronage of our bespoke craft.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
