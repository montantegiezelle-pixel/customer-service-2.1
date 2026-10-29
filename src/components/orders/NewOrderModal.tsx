import React, { useState } from 'react';
import { Customer, GarmentCategory, OrderItem, OrderPricing, OrderStatus } from '../../types/tailor';
import { calculateOrderTotals, formatCurrency } from '../../utils/tailorCalculations';
import { X, Plus, AlertCircle } from 'lucide-react';

interface NewOrderModalProps {
  customers: Customer[];
  initialCustomerId?: string;
  onClose: () => void;
  onCreateOrder: (order: Omit<OrderItem, 'id' | 'orderNumber' | 'createdAt'>) => void;
  onOpenNewCustomer: () => void;
}

export const NewOrderModal: React.FC<NewOrderModalProps> = ({
  customers,
  initialCustomerId,
  onClose,
  onCreateOrder,
  onOpenNewCustomer
}) => {
  const [customerId, setCustomerId] = useState<string>(
    initialCustomerId || (customers[0]?.id || '')
  );
  const [garmentType, setGarmentType] = useState('Bespoke Two-Piece Notch Lapel Suit');
  const [category, setCategory] = useState<GarmentCategory>('suit_jacket');
  const [fabricCode, setFabricCode] = useState('Holland & Sherry Super 140s Wool - Navy Herringbone');
  const [liningCode, setLiningCode] = useState('Bemberg Cupro Antique Gold #CU-12');
  const [buttonStyle, setButtonStyle] = useState('Dark Horn 4-Hole Matte Finish');
  const [specialInstructions, setSpecialInstructions] = useState('Hand-padded lapels, working surgeon cuffs with 4 horn buttons.');
  const [priority, setPriority] = useState<'normal' | 'rush' | 'urgent'>('normal');
  const [assignedTailor, setAssignedTailor] = useState('William Sterling');
  const [targetDeliveryDate, setTargetDeliveryDate] = useState('2026-11-30');
  const [firstFittingDate, setFirstFittingDate] = useState('2026-11-08');

  // Pricing fields
  const [basePrice, setBasePrice] = useState('2800');
  const [fabricCost, setFabricCost] = useState('800');
  const [customizationCost, setCustomizationCost] = useState('150');
  const [rushSurcharge, setRushSurcharge] = useState('0');
  const [discount, setDiscount] = useState('0');
  const [taxRate, setTaxRate] = useState('0.08');
  const [depositPaid, setDepositPaid] = useState('1500');

  const [formError, setFormError] = useState('');

  const pricingDraft: OrderPricing = {
    basePrice: parseFloat(basePrice) || 0,
    fabricCost: parseFloat(fabricCost) || 0,
    customizationCost: parseFloat(customizationCost) || 0,
    rushSurcharge: parseFloat(rushSurcharge) || 0,
    discount: parseFloat(discount) || 0,
    taxRate: parseFloat(taxRate) || 0.08,
    depositPaid: parseFloat(depositPaid) || 0
  };

  const calculatedTotals = calculateOrderTotals(pricingDraft);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId) {
      setFormError('Please select or register a customer for this order.');
      return;
    }
    if (!garmentType.trim()) {
      setFormError('Garment type is required.');
      return;
    }
    if (!fabricCode.trim()) {
      setFormError('Fabric specification or bolt code is required.');
      return;
    }

    onCreateOrder({
      customerId,
      garmentType: garmentType.trim(),
      category,
      fabricCode: fabricCode.trim(),
      liningCode: liningCode.trim() || undefined,
      buttonStyle: buttonStyle.trim() || undefined,
      specialInstructions: specialInstructions.trim() || undefined,
      status: 'intake',
      priority,
      targetDeliveryDate,
      fittings: {
        firstFittingDate: firstFittingDate || undefined,
        firstFittingCompleted: false,
        fittingsNotes: []
      },
      pricing: pricingDraft,
      assignedTailor
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Create Bespoke Work Order
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Initiate production docket, cloth specifications, and trial schedule.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Customer Selection */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Select Patron / Client *
              </label>
              <button
                type="button"
                onClick={onOpenNewCustomer}
                className="text-xs font-semibold text-slate-900 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Register New Patron</span>
              </button>
            </div>

            <select
              value={customerId}
              onChange={e => setCustomerId(e.target.value)}
              className="w-full py-2 px-3 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              {customers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.fullName} — {c.phone} ({c.clientTier.replace('_', ' ')})
                </option>
              ))}
            </select>
          </div>

          {/* Garment Classification & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Garment Category *
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as GarmentCategory)}
                className="w-full py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
              >
                <option value="suit_jacket">Suit Jacket / Blazer</option>
                <option value="trousers">Trousers / Slacks</option>
                <option value="shirt">Dress Shirt</option>
                <option value="dress">Evening Dress / Gown</option>
                <option value="custom">Custom Atelier Piece</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Garment Title / Model *
              </label>
              <input
                type="text"
                value={garmentType}
                onChange={e => setGarmentType(e.target.value)}
                placeholder="e.g. Bespoke Double-Breasted Dinner Suit"
                className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900"
              />
            </div>
          </div>

          {/* Fabric, Lining, and Buttons */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Fabric Material & Bolt Reference *
              </label>
              <input
                type="text"
                value={fabricCode}
                onChange={e => setFabricCode(e.target.value)}
                placeholder="e.g. Scabal 150s Wool - Midnight Navy (Bolt #SC-8821)"
                className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lining Cloth (Optional)
                </label>
                <input
                  type="text"
                  value={liningCode}
                  onChange={e => setLiningCode(e.target.value)}
                  placeholder="e.g. Silk Habotai Crimson #SK-08"
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Button Style (Optional)
                </label>
                <input
                  type="text"
                  value={buttonStyle}
                  onChange={e => setButtonStyle(e.target.value)}
                  placeholder="e.g. Mother of Pearl / Horn / Covered Silk"
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Special Cutting Instructions / Bespoke Details
              </label>
              <textarea
                rows={2}
                value={specialInstructions}
                onChange={e => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Milanese lapel hole, high armholes, coin pocket in right pocket..."
                className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
              />
            </div>
          </div>

          {/* Timeline & Tailor Assignment */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assigned Tailor
              </label>
              <select
                value={assignedTailor}
                onChange={e => setAssignedTailor(e.target.value)}
                className="w-full py-1.5 px-2 bg-white border border-slate-300 rounded-lg text-xs font-medium"
              >
                <option value="William Sterling">William Sterling</option>
                <option value="Claire Laurent">Claire Laurent</option>
                <option value="David Evans">David Evans</option>
                <option value="Arthur Pendelton">Arthur Pendelton</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as any)}
                className="w-full py-1.5 px-2 bg-white border border-slate-300 rounded-lg text-xs font-medium"
              >
                <option value="normal">Normal</option>
                <option value="rush">Rush (+20% pace)</option>
                <option value="urgent">Urgent / Gala Event</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                1st Fitting Date
              </label>
              <input
                type="date"
                value={firstFittingDate}
                onChange={e => setFirstFittingDate(e.target.value)}
                className="w-full py-1.5 px-2 bg-white border border-slate-300 rounded-lg text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Hand-off
              </label>
              <input
                type="date"
                value={targetDeliveryDate}
                onChange={e => setTargetDeliveryDate(e.target.value)}
                className="w-full py-1.5 px-2 bg-white border border-slate-300 rounded-lg text-xs font-mono"
              />
            </div>
          </div>

          {/* Pricing & Deposit */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-3">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Pricing Structure ($ USD)
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Base Tailoring ($)</label>
                <input
                  type="number"
                  value={basePrice}
                  onChange={e => setBasePrice(e.target.value)}
                  className="w-full py-1 px-2.5 bg-slate-50 border border-slate-200 rounded text-xs font-mono tabular-nums font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Fabric Cost ($)</label>
                <input
                  type="number"
                  value={fabricCost}
                  onChange={e => setFabricCost(e.target.value)}
                  className="w-full py-1 px-2.5 bg-slate-50 border border-slate-200 rounded text-xs font-mono tabular-nums font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Trims / Extras ($)</label>
                <input
                  type="number"
                  value={customizationCost}
                  onChange={e => setCustomizationCost(e.target.value)}
                  className="w-full py-1 px-2.5 bg-slate-50 border border-slate-200 rounded text-xs font-mono tabular-nums font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Deposit Paid ($)</label>
                <input
                  type="number"
                  value={depositPaid}
                  onChange={e => setDepositPaid(e.target.value)}
                  className="w-full py-1 px-2.5 bg-slate-50 border border-slate-200 rounded text-xs font-mono tabular-nums font-semibold text-emerald-700"
                />
              </div>
            </div>

            {/* Real-time Calculation Strip */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-600">
                Grand Total: <strong className="text-slate-900">{formatCurrency(calculatedTotals.grandTotal)}</strong>
              </span>
              <span className="text-slate-600">
                Deposit: <strong className="text-emerald-700">{formatCurrency(calculatedTotals.depositPaid)}</strong>
              </span>
              <span className="font-bold">
                Balance Due:{' '}
                <strong className={calculatedTotals.balanceDue > 0 ? 'text-amber-700' : 'text-emerald-700'}>
                  {formatCurrency(calculatedTotals.balanceDue)}
                </strong>
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              Generate Order & Work Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
