import React, { useState } from 'react';
import { Customer, CustomerMeasurementProfile, GarmentCategory, MeasurementPoint, UnitSystem } from '../../types/tailor';
import { MEASUREMENT_POINTS } from '../../data/measurementPoints';
import { VisualGarmentDiagram } from './VisualGarmentDiagram';
import { convertMeasurement } from '../../utils/tailorCalculations';
import { ArrowLeft, Save, History, Ruler, Check, AlertCircle } from 'lucide-react';

interface MeasurementProfileEditorProps {
  customer: Customer;
  profile: CustomerMeasurementProfile;
  onSaveProfile: (
    profileId: string,
    updates: Partial<CustomerMeasurementProfile>,
    revisionNote?: string
  ) => void;
  onBack: () => void;
}

export const MeasurementProfileEditor: React.FC<MeasurementProfileEditorProps> = ({
  customer,
  profile,
  onSaveProfile,
  onBack
}) => {
  const [activeCategory, setActiveCategory] = useState<GarmentCategory>('suit_jacket');
  const [selectedPointId, setSelectedPointId] = useState<string>('jacket_chest');
  const [currentUnit, setCurrentUnit] = useState<UnitSystem>(profile.unit || 'inches');
  const [postureNotes, setPostureNotes] = useState(profile.postureNotes || '');
  const [bodyShape, setBodyShape] = useState(profile.bodyShape || '');
  const [fitPreference, setFitPreference] = useState<'ultra_slim' | 'slim' | 'regular' | 'relaxed'>(
    profile.garments[activeCategory]?.fitPreference || 'slim'
  );

  // Local draft values for each category
  const [measurementsState, setMeasurementsState] = useState<CustomerMeasurementProfile['garments']>(
    profile.garments || {}
  );

  const [revisionNote, setRevisionNote] = useState('');
  const [tailorName, setTailorName] = useState('Master Cutter Sterling');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Current category values
  const currentGarment = measurementsState[activeCategory] || {
    category: activeCategory,
    values: {},
    fitPreference: 'slim'
  };

  const currentValues = currentGarment.values || {};
  const currentPoints = MEASUREMENT_POINTS[activeCategory] || [];

  const handleValueChange = (pointId: string, rawVal: string) => {
    const num = parseFloat(rawVal);
    const updatedValues = {
      ...currentValues,
      [pointId]: isNaN(num) ? 0 : num
    };

    setMeasurementsState(prev => ({
      ...prev,
      [activeCategory]: {
        category: activeCategory,
        fitPreference,
        values: updatedValues
      }
    }));
  };

  const handleUnitToggle = (newUnit: UnitSystem) => {
    if (newUnit === currentUnit) return;

    // Convert existing values across all categories
    const updatedGarments: CustomerMeasurementProfile['garments'] = {};
    for (const [catKey, garment] of Object.entries(measurementsState)) {
      if (!garment) continue;
      const convertedVals: Record<string, number> = {};
      for (const [k, v] of Object.entries(garment.values || {})) {
        convertedVals[k] = convertMeasurement(v, currentUnit, newUnit);
      }
      updatedGarments[catKey as GarmentCategory] = {
        ...garment,
        values: convertedVals
      };
    }

    setCurrentUnit(newUnit);
    setMeasurementsState(updatedGarments);
  };

  const handleSave = () => {
    onSaveProfile(
      profile.id,
      {
        unit: currentUnit,
        postureNotes,
        bodyShape,
        garments: measurementsState
      },
      revisionNote.trim() ? `${revisionNote.trim()} (${tailorName})` : undefined
    );
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
    setRevisionNote('');
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation & Save Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Back to Clients"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                {customer.fullName}
              </h1>
              <span className="hidden sm:inline text-xs text-slate-400">·</span>
              <span className="text-xs font-mono text-slate-600">Bespoke Spec Sheet</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Client profile ID: {customer.id} · Last updated: {profile.updatedAt}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Unit Toggle */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => handleUnitToggle('inches')}
              className={`px-3 py-1 font-semibold rounded cursor-pointer transition-colors ${
                currentUnit === 'inches'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Inches (in)
            </button>
            <button
              type="button"
              onClick={() => handleUnitToggle('cm')}
              className={`px-3 py-1 font-semibold rounded cursor-pointer transition-colors ${
                currentUnit === 'cm'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Metric (cm)
            </button>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            {saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Saved Changes!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Measurements</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Garment Category Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs font-semibold">
        <button
          type="button"
          onClick={() => {
            setActiveCategory('suit_jacket');
            setSelectedPointId('jacket_chest');
          }}
          className={`px-4 py-2 rounded-t-lg transition-colors whitespace-nowrap cursor-pointer border-b-2 ${
            activeCategory === 'suit_jacket'
              ? 'border-slate-900 text-slate-900 bg-slate-50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Suit Jacket / Blazer
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveCategory('trousers');
            setSelectedPointId('trouser_waist');
          }}
          className={`px-4 py-2 rounded-t-lg transition-colors whitespace-nowrap cursor-pointer border-b-2 ${
            activeCategory === 'trousers'
              ? 'border-slate-900 text-slate-900 bg-slate-50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Trousers / Slacks
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveCategory('shirt');
            setSelectedPointId('shirt_collar');
          }}
          className={`px-4 py-2 rounded-t-lg transition-colors whitespace-nowrap cursor-pointer border-b-2 ${
            activeCategory === 'shirt'
              ? 'border-slate-900 text-slate-900 bg-slate-50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Dress Shirts
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveCategory('dress');
            setSelectedPointId('dress_bust');
          }}
          className={`px-4 py-2 rounded-t-lg transition-colors whitespace-nowrap cursor-pointer border-b-2 ${
            activeCategory === 'dress'
              ? 'border-slate-900 text-slate-900 bg-slate-50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Dress / Evening Gown
        </button>
      </div>

      {/* Main Grid: Left is Form Inputs + Posture, Right is Interactive Garment Mannequin */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form: 7 cols */}
        <div className="lg:col-span-7 space-y-5">
          {/* Fit Preference & Body Shape row */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Fit Silhouette
              </label>
              <select
                value={fitPreference}
                onChange={e => {
                  const val = e.target.value as any;
                  setFitPreference(val);
                  setMeasurementsState(prev => ({
                    ...prev,
                    [activeCategory]: {
                      ...(prev[activeCategory] || { category: activeCategory, values: {} }),
                      fitPreference: val
                    }
                  }));
                }}
                className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
              >
                <option value="ultra_slim">Ultra Slim / Skinny</option>
                <option value="slim">Slim Tailored (Recommended)</option>
                <option value="regular">Regular Classic Fit</option>
                <option value="relaxed">Relaxed / Traditional Drape</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Body Shape Classification
              </label>
              <input
                type="text"
                placeholder="e.g. Athletic V-Taper, Drop 7, Low Shoulders"
                value={bodyShape}
                onChange={e => setBodyShape(e.target.value)}
                className="w-full py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800"
              />
            </div>
          </div>

          {/* Measurements Numerical Input Grid */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Measurement Points ({currentUnit})
              </span>
              <span className="text-xs text-slate-500">
                Click any row to view diagram position
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {currentPoints.map(pt => {
                const isSelected = selectedPointId === pt.id;
                const val = currentValues[pt.id] ?? '';

                return (
                  <div
                    key={pt.id}
                    onClick={() => setSelectedPointId(pt.id)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/40 ring-1 ring-blue-500'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-800 cursor-pointer">
                        {pt.name}
                      </label>
                      <span className="text-[10px] font-mono text-slate-400">
                        {currentUnit === 'inches'
                          ? `${pt.typicalRangeInches[0]}-${pt.typicalRangeInches[1]}"`
                          : `${(pt.typicalRangeInches[0] * 2.54).toFixed(0)}-${(pt.typicalRangeInches[1] * 2.54).toFixed(0)}cm`}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="number"
                        step={currentUnit === 'inches' ? '0.125' : '0.5'}
                        value={val === 0 ? '' : val}
                        onChange={e => handleValueChange(pt.id, e.target.value)}
                        placeholder="0.0"
                        className="w-full py-1 px-2.5 bg-slate-50 border border-slate-300 rounded font-mono tabular-nums text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                      />
                      <span className="text-xs font-mono font-medium text-slate-500">
                        {currentUnit === 'inches' ? 'in' : 'cm'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Posture & Drop Alterations Notes */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Anatomical & Posture Nuances
            </label>
            <textarea
              rows={2}
              value={postureNotes}
              onChange={e => setPostureNotes(e.target.value)}
              placeholder="e.g. Right shoulder drops by 0.5 inches; erect posture; prominent chest..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {/* Revision Logger */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 mb-2">
              <History className="w-4 h-4 text-slate-600" />
              <span>Log Fitting Revision Note</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Tailor Name / Cutter"
                value={tailorName}
                onChange={e => setTailorName(e.target.value)}
                className="col-span-1 py-1.5 px-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
              />
              <input
                type="text"
                placeholder="Reason (e.g. Reduced waist after 1st fitting)"
                value={revisionNote}
                onChange={e => setRevisionNote(e.target.value)}
                className="col-span-2 py-1.5 px-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Visual Garment Diagram + Revision History (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <VisualGarmentDiagram
            category={activeCategory}
            selectedPointId={selectedPointId}
            onSelectPoint={pt => setSelectedPointId(pt.id)}
            currentValues={currentValues}
            unit={currentUnit}
          />

          {/* Revision History Log */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-slate-500" />
                <span>Measurement History Log</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {profile.revisionHistory?.length || 0} entries
              </span>
            </div>

            {(!profile.revisionHistory || profile.revisionHistory.length === 0) ? (
              <div className="py-4 text-center text-xs text-slate-400">
                No previous fitting adjustments logged yet.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {profile.revisionHistory.map((rev, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs">
                    <div className="flex items-center justify-between text-slate-500 text-[11px]">
                      <span className="font-mono">{rev.date}</span>
                      <span className="font-medium text-slate-700">{rev.recordedBy}</span>
                    </div>
                    <div className="mt-1 text-slate-800 font-medium leading-relaxed">
                      {rev.note}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
