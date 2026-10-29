import React, { useState } from 'react';
import { GarmentCategory, Customer, CustomerMeasurementProfile } from '../../types/tailor';
import { MEASUREMENT_POINTS } from '../../data/measurementPoints';
import { VisualGarmentDiagram } from './VisualGarmentDiagram';
import { Compass, BookOpen, User, CheckCircle2 } from 'lucide-react';

interface VisualMeasurementStudioProps {
  customers: Customer[];
  profiles: CustomerMeasurementProfile[];
  onOpenCustomerProfile: (customer: Customer, profile: CustomerMeasurementProfile) => void;
}

export const VisualMeasurementStudio: React.FC<VisualMeasurementStudioProps> = ({
  customers,
  profiles,
  onOpenCustomerProfile
}) => {
  const [selectedCategory, setSelectedCategory] = useState<GarmentCategory>('suit_jacket');
  const [selectedPointId, setSelectedPointId] = useState<string>('jacket_chest');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
  const selectedProfile = profiles.find(p => p.customerId === selectedCustomerId);

  const activePoints = MEASUREMENT_POINTS[selectedCategory] || [];
  const activePoint = activePoints.find(p => p.id === selectedPointId) || activePoints[0];

  const currentValues = selectedProfile?.garments[selectedCategory]?.values || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Anatomical Measurement Studio
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Interactive cutter reference, anatomical measuring protocols, and live patron comparison.
          </p>
        </div>

        {/* Client Selector for live overlay */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-600 whitespace-nowrap">
            Overlay Patron:
          </label>
          <select
            value={selectedCustomerId}
            onChange={e => setSelectedCustomerId(e.target.value)}
            className="py-1.5 px-3 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 shadow-xs focus:outline-none"
          >
            {customers.map(c => (
              <option key={c.id} value={c.id}>
                {c.fullName} ({c.clientTier.replace('_', ' ')})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Garment Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs font-semibold">
        {(['suit_jacket', 'trousers', 'shirt', 'dress'] as GarmentCategory[]).map(cat => {
          const labels: Record<GarmentCategory, string> = {
            suit_jacket: 'Suit Jacket & Overcoat',
            trousers: 'Bespoke Trousers',
            shirt: 'Dress Shirt',
            dress: 'Haute Couture Dress',
            custom: 'Custom Specs'
          };

          return (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setSelectedCategory(cat);
                const firstPt = MEASUREMENT_POINTS[cat]?.[0];
                if (firstPt) setSelectedPointId(firstPt.id);
              }}
              className={`px-4 py-2 rounded-t-lg transition-colors whitespace-nowrap cursor-pointer border-b-2 ${
                selectedCategory === cat
                  ? 'border-slate-900 text-slate-900 bg-white font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {labels[cat]}
            </button>
          );
        })}
      </div>

      {/* 3-Column Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Diagram (4 cols) */}
        <div className="lg:col-span-4">
          <VisualGarmentDiagram
            category={selectedCategory}
            selectedPointId={selectedPointId}
            onSelectPoint={pt => setSelectedPointId(pt.id)}
            currentValues={currentValues}
            unit={selectedProfile?.unit || 'inches'}
          />

          {selectedCustomer && selectedProfile && (
            <div className="mt-4 p-3 bg-white border border-slate-200 rounded-xl shadow-xs text-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span>Overlaying {selectedCustomer.fullName}</span>
                <span className="font-mono text-slate-700">{selectedProfile.unit.toUpperCase()}</span>
              </div>
              <button
                type="button"
                onClick={() => onOpenCustomerProfile(selectedCustomer, selectedProfile)}
                className="mt-2 w-full py-1.5 text-center text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Open Full Spec Sheet →
              </button>
            </div>
          )}
        </div>

        {/* Center Column: Detailed Measurement Procedure & Anatomical Guide (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {activePoint ? (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Cutter Master Guide
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    Range: {activePoint.typicalRangeInches[0]}" – {activePoint.typicalRangeInches[1]}"
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  {activePoint.name}
                </h2>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg text-xs text-slate-700 leading-relaxed border border-slate-100">
                <span className="font-semibold text-slate-900 block mb-1">Methodology & Tape Placement:</span>
                {activePoint.description}
              </div>

              {/* Patron value comparison */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-xs font-bold text-slate-900 block mb-2">
                  Patron Comparison: {selectedCustomer?.fullName}
                </span>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">Recorded In Spec:</span>
                  <span className="text-sm font-mono font-bold text-slate-900">
                    {currentValues[activePoint.id] ? (
                      `${currentValues[activePoint.id]} ${selectedProfile?.unit || 'inches'}`
                    ) : (
                      <span className="text-slate-400 font-normal italic">Not recorded yet</span>
                    )}
                  </span>
                </div>

                {currentValues[activePoint.id] && (
                  <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-600 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Within bespoke tolerance margin for posture type</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Bespoke Fitting Advice
                </h3>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                  <li>Hold the tape snug against the cloth or skin without pinching.</li>
                  <li>Always measure over the intended undergarment or dress shirt.</li>
                  <li>Check whether customer holds posture breath or relaxes during fitting.</li>
                  <li>Record any bilateral asymmetry between left and right sides.</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-xs text-slate-500">
              Select a measurement point from the mannequin or the list.
            </div>
          )}
        </div>

        {/* Right Column: Measurement Points Directory List (3 cols) */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-3">
            Points of Measure ({activePoints.length})
          </span>

          <div className="space-y-1 max-h-[500px] overflow-y-auto pr-1">
            {activePoints.map(pt => {
              const isSelected = selectedPointId === pt.id;
              const hasVal = currentValues[pt.id] !== undefined;

              return (
                <button
                  key={pt.id}
                  type="button"
                  onClick={() => setSelectedPointId(pt.id)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="truncate pr-2">{pt.name}</span>
                  {hasVal && (
                    <span
                      className={`text-[11px] font-mono shrink-0 ${
                        isSelected ? 'text-amber-300' : 'text-slate-500'
                      }`}
                    >
                      {currentValues[pt.id]}"
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
