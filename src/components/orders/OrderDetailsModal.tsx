import React, { useState } from 'react';
import { Customer, OrderItem, CustomerMeasurementProfile, OrderStatus } from '../../types/tailor';
import {
  calculateOrderTotals,
  formatCurrency,
  STATUS_LABELS,
  ORDER_STATUS_ORDER
} from '../../utils/tailorCalculations';
import {
  X,
  Printer,
  CreditCard,
  Ruler,
  Calendar,
  CheckCircle,
  FileText,
  Clock,
  Trash2,
  ChevronRight
} from 'lucide-react';

interface OrderDetailsModalProps {
  order: OrderItem;
  customer?: Customer;
  profile?: CustomerMeasurementProfile;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onRecordPayment: (orderId: string, amount: number) => void;
  onUpdateOrder: (orderId: string, updates: Partial<OrderItem>) => void;
  onDeleteOrder: (orderId: string) => void;
  onOpenMeasurements: (customer: Customer, profile: CustomerMeasurementProfile) => void;
  onOpenPrintTicket: (order: OrderItem, type: 'work_order' | 'invoice') => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  customer,
  profile,
  onClose,
  onUpdateStatus,
  onRecordPayment,
  onUpdateOrder,
  onDeleteOrder,
  onOpenMeasurements,
  onOpenPrintTicket
}) => {
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [showPaymentInput, setShowPaymentInput] = useState(false);
  const [newFittingNote, setNewFittingNote] = useState('');
  const [fittingStage, setFittingStage] = useState<'1st Fitting' | '2nd Fitting' | 'Final Trial'>('1st Fitting');

  const totals = calculateOrderTotals(order.pricing);
  const currentGarmentMeasurements = profile?.garments[order.category]?.values || {};

  const handleAddPayment = () => {
    const num = parseFloat(paymentAmount);
    if (!isNaN(num) && num > 0) {
      onRecordPayment(order.id, num);
      setPaymentAmount('');
      setShowPaymentInput(false);
    }
  };

  const handleAddFittingNote = () => {
    if (!newFittingNote.trim()) return;
    const existingNotes = order.fittings.fittingsNotes || [];
    const updatedNotes = [
      ...existingNotes,
      {
        date: new Date().toISOString().split('T')[0],
        fittingStage,
        notes: newFittingNote.trim(),
        tailor: order.assignedTailor
      }
    ];

    onUpdateOrder(order.id, {
      fittings: {
        ...order.fittings,
        fittingsNotes: updatedNotes
      }
    });

    setNewFittingNote('');
  };

  const handleToggleFittingComplete = (stage: 'first' | 'second' | 'final') => {
    const keyMap = {
      first: 'firstFittingCompleted',
      second: 'secondFittingCompleted',
      final: 'finalFittingCompleted'
    } as const;

    const currentKey = keyMap[stage];
    onUpdateOrder(order.id, {
      fittings: {
        ...order.fittings,
        [currentKey]: !order.fittings[currentKey]
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold text-slate-900">
                  {order.orderNumber}
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-sm font-semibold text-slate-900">
                  {customer?.fullName || 'Client'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Target Hand-off: {order.targetDeliveryDate} · Assigned: {order.assignedTailor}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenPrintTicket(order, 'work_order')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Print Cutting Ticket"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cutting Ticket</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenPrintTicket(order, 'invoice')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Print Bespoke Receipt"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Receipt</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Status Pipeline Step Indicator */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Production Stage Control
              </span>
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-500">Current:</label>
                <select
                  value={order.status}
                  onChange={e => onUpdateStatus(order.id, e.target.value as OrderStatus)}
                  className="py-1 px-2.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 shadow-xs focus:outline-none"
                >
                  {ORDER_STATUS_ORDER.map(st => (
                    <option key={st} value={st}>
                      {STATUS_LABELS[st]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Stage Progress Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5 pt-2">
              {ORDER_STATUS_ORDER.map((st, idx) => {
                const currentIdx = ORDER_STATUS_ORDER.indexOf(order.status);
                const isPassed = idx < currentIdx;
                const isCurrent = idx === currentIdx;

                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => onUpdateStatus(order.id, st)}
                    className={`p-2 rounded-lg text-left transition-all cursor-pointer border ${
                      isCurrent
                        ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-xs'
                        : isPassed
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-medium'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-[10px] font-mono opacity-70">0{idx + 1}</div>
                    <div className="text-[11px] leading-tight truncate mt-0.5">
                      {STATUS_LABELS[st]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Garment Specification & Cloth Specs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block border-b border-slate-100 pb-2">
                Garment & Cloth Specifications
              </span>

              <div>
                <span className="text-xs text-slate-400 block">Garment Type</span>
                <span className="text-sm font-bold text-slate-900">{order.garmentType}</span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block">Fabric & Bolt Code</span>
                <span className="text-xs font-medium text-slate-800">{order.fabricCode}</span>
              </div>

              {order.liningCode && (
                <div>
                  <span className="text-xs text-slate-400 block">Lining Cloth</span>
                  <span className="text-xs font-medium text-slate-800">{order.liningCode}</span>
                </div>
              )}

              {order.buttonStyle && (
                <div>
                  <span className="text-xs text-slate-400 block">Button Styling</span>
                  <span className="text-xs font-medium text-slate-800">{order.buttonStyle}</span>
                </div>
              )}

              {order.specialInstructions && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Special Cutting Instructions
                  </span>
                  <p className="text-xs text-slate-700 mt-1 italic">
                    "{order.specialInstructions}"
                  </p>
                </div>
              )}
            </div>

            {/* Financial Ledger & Balance Due */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block border-b border-slate-100 pb-2">
                  Financial Ledger
                </span>

                <div className="divide-y divide-slate-100 text-xs py-1">
                  <div className="py-1.5 flex justify-between text-slate-600">
                    <span>Base Tailoring Fee</span>
                    <span className="font-mono tabular-nums">{formatCurrency(order.pricing.basePrice)}</span>
                  </div>
                  <div className="py-1.5 flex justify-between text-slate-600">
                    <span>Fabric Material Cost</span>
                    <span className="font-mono tabular-nums">{formatCurrency(order.pricing.fabricCost)}</span>
                  </div>
                  {order.pricing.customizationCost > 0 && (
                    <div className="py-1.5 flex justify-between text-slate-600">
                      <span>Custom Trims / Hand Stitching</span>
                      <span className="font-mono tabular-nums">{formatCurrency(order.pricing.customizationCost)}</span>
                    </div>
                  )}
                  {order.pricing.rushSurcharge > 0 && (
                    <div className="py-1.5 flex justify-between text-rose-600 font-medium">
                      <span>Rush Surcharge</span>
                      <span className="font-mono tabular-nums">+{formatCurrency(order.pricing.rushSurcharge)}</span>
                    </div>
                  )}
                  {order.pricing.discount > 0 && (
                    <div className="py-1.5 flex justify-between text-emerald-700 font-medium">
                      <span>Patron Loyalty Courtesy</span>
                      <span className="font-mono tabular-nums">-{formatCurrency(order.pricing.discount)}</span>
                    </div>
                  )}
                  <div className="py-1.5 flex justify-between text-slate-600">
                    <span>Tax ({(order.pricing.taxRate * 100).toFixed(0)}%)</span>
                    <span className="font-mono tabular-nums">{formatCurrency(totals.taxAmount)}</span>
                  </div>
                  <div className="py-2 flex justify-between font-bold text-slate-900 text-sm">
                    <span>Grand Total</span>
                    <span className="font-mono tabular-nums">{formatCurrency(totals.grandTotal)}</span>
                  </div>
                  <div className="py-2 flex justify-between text-slate-700">
                    <span>Deposit / Payments Recorded</span>
                    <span className="font-mono tabular-nums font-semibold text-emerald-700">
                      {formatCurrency(totals.depositPaid)}
                    </span>
                  </div>
                  <div className="py-2 flex justify-between font-bold text-base bg-slate-50 px-2 rounded mt-1">
                    <span>Balance Due</span>
                    <span className={`font-mono tabular-nums ${totals.balanceDue > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                      {totals.balanceDue > 0 ? formatCurrency(totals.balanceDue) : 'PAID IN FULL'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Record Payment Section */}
              <div className="pt-2 border-t border-slate-100">
                {showPaymentInput ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="50"
                      placeholder="Amount ($)"
                      value={paymentAmount}
                      onChange={e => setPaymentAmount(e.target.value)}
                      className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-300 rounded-lg w-32 font-mono tabular-nums"
                    />
                    <button
                      type="button"
                      onClick={handleAddPayment}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg cursor-pointer"
                    >
                      Save Payment
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPaymentInput(false)}
                      className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowPaymentInput(true)}
                    className="w-full py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>+ Record Cash / Card Deposit</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Linked Client Measurements Snapshot */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Ruler className="w-4 h-4 text-slate-600" />
                <span>Client Measurement Sheet Applied ({profile?.unit || 'inches'})</span>
              </span>
              {customer && profile && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenMeasurements(customer, profile);
                  }}
                  className="text-xs font-semibold text-slate-900 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Edit Full Spec Sheet</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {Object.keys(currentGarmentMeasurements).length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-400">
                No bespoke measurements recorded for this garment category yet.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {Object.entries(currentGarmentMeasurements).map(([key, val]) => (
                  <div key={key} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block truncate">
                      {key.replace(/^[a-z]+_/, '').replace('_', ' ')}
                    </span>
                    <span className="text-sm font-mono font-bold text-slate-900">
                      {val}"
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Fittings Schedule & Fitting Notes */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block border-b border-slate-100 pb-2">
              Fittings Schedule & Trial Feedback
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* 1st Fitting */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">1st Baste Fitting</span>
                  <input
                    type="checkbox"
                    checked={!!order.fittings.firstFittingCompleted}
                    onChange={() => handleToggleFittingComplete('first')}
                    className="w-4 h-4 rounded text-slate-900 cursor-pointer"
                  />
                </div>
                <div className="text-xs font-mono text-slate-600 mt-1">
                  {order.fittings.firstFittingDate || 'Unscheduled'}
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">
                  {order.fittings.firstFittingCompleted ? 'Completed' : 'Pending appointment'}
                </span>
              </div>

              {/* 2nd Fitting */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">2nd Forward Fitting</span>
                  <input
                    type="checkbox"
                    checked={!!order.fittings.secondFittingCompleted}
                    onChange={() => handleToggleFittingComplete('second')}
                    className="w-4 h-4 rounded text-slate-900 cursor-pointer"
                  />
                </div>
                <div className="text-xs font-mono text-slate-600 mt-1">
                  {order.fittings.secondFittingDate || 'Unscheduled'}
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">
                  {order.fittings.secondFittingCompleted ? 'Completed' : 'Pending appointment'}
                </span>
              </div>

              {/* Final Trial */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Final Trial & Press</span>
                  <input
                    type="checkbox"
                    checked={!!order.fittings.finalFittingCompleted}
                    onChange={() => handleToggleFittingComplete('final')}
                    className="w-4 h-4 rounded text-slate-900 cursor-pointer"
                  />
                </div>
                <div className="text-xs font-mono text-slate-600 mt-1">
                  {order.fittings.finalFittingDate || 'Unscheduled'}
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">
                  {order.fittings.finalFittingCompleted ? 'Completed' : 'Pending appointment'}
                </span>
              </div>
            </div>

            {/* Existing notes */}
            {order.fittings.fittingsNotes && order.fittings.fittingsNotes.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-slate-700 block">Logged Tailor Remarks:</span>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {order.fittings.fittingsNotes.map((note, i) => (
                    <div key={i} className="p-2.5 bg-slate-50 rounded border border-slate-100 text-xs">
                      <div className="flex justify-between text-[11px] text-slate-400 font-mono mb-1">
                        <span>{note.date} · {note.fittingStage}</span>
                        <span>Tailor: {note.tailor}</span>
                      </div>
                      <p className="text-slate-800">{note.notes}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add note input */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <select
                value={fittingStage}
                onChange={e => setFittingStage(e.target.value as any)}
                className="py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
              >
                <option value="1st Fitting">1st Fitting</option>
                <option value="2nd Fitting">2nd Fitting</option>
                <option value="Final Trial">Final Trial</option>
              </select>
              <input
                type="text"
                placeholder="Log cutter alteration instructions (e.g. nip waist 0.5 in, lower collar 0.25 in)..."
                value={newFittingNote}
                onChange={e => setNewFittingNote(e.target.value)}
                className="flex-1 py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
              <button
                type="button"
                onClick={handleAddFittingNote}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer"
              >
                + Add Note
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between sticky bottom-0">
          <button
            type="button"
            onClick={() => {
              if (confirm(`Are you sure you want to delete order ${order.orderNumber}?`)) {
                onDeleteOrder(order.id);
                onClose();
              }
            }}
            className="text-xs font-medium text-rose-600 hover:text-rose-800 flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Order</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
