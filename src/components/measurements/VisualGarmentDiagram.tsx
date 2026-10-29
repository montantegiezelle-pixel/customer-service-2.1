import React from 'react';
import { GarmentCategory, MeasurementPoint } from '../../types/tailor';
import { MEASUREMENT_POINTS } from '../../data/measurementPoints';

interface VisualGarmentDiagramProps {
  category: GarmentCategory;
  selectedPointId?: string;
  onSelectPoint?: (point: MeasurementPoint) => void;
  currentValues?: Record<string, number>;
  unit?: 'inches' | 'cm';
}

export const VisualGarmentDiagram: React.FC<VisualGarmentDiagramProps> = ({
  category,
  selectedPointId,
  onSelectPoint,
  currentValues = {},
  unit = 'inches'
}) => {
  const points = MEASUREMENT_POINTS[category] || MEASUREMENT_POINTS.suit_jacket;

  return (
    <div className="relative bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center select-none shadow-xs">
      <div className="w-full flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Anatomical Spec Guide
        </span>
        <span className="text-xs text-slate-500">
          Click point to view guide
        </span>
      </div>

      <div className="relative w-full max-w-[340px] aspect-[3/4] flex items-center justify-center bg-slate-50/70 rounded-lg p-2 overflow-hidden border border-slate-100">
        <svg
          viewBox="0 0 300 360"
          className="w-full h-full text-slate-400 drop-shadow-xs"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {category === 'suit_jacket' && (
            <g id="jacket-silhouette" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              {/* Collar & Neck */}
              <path d="M125 55 Q150 45 175 55" className="stroke-slate-400" />
              {/* Shoulders */}
              <path d="M125 55 L80 85 L65 170 L55 245" className="stroke-slate-500" />
              <path d="M175 55 L220 85 L235 170 L245 245" className="stroke-slate-500" />
              {/* Inner arm sleeves */}
              <path d="M85 125 L75 245" className="stroke-slate-400" />
              <path d="M215 125 L225 245" className="stroke-slate-400" />
              {/* Lapels */}
              <path d="M125 55 L140 115 L118 125 L150 180" className="stroke-slate-700" />
              <path d="M175 55 L160 115 L182 125 L150 180" className="stroke-slate-700" />
              {/* Body Torso */}
              <path d="M85 125 Q95 180 90 270 L150 275 L210 270 Q205 180 215 125" className="stroke-slate-600" />
              {/* Center Placket / Buttons */}
              <line x1="150" y1="180" x2="150" y2="275" strokeDasharray="3 3" className="stroke-slate-400" />
              <circle cx="150" cy="195" r="2.5" className="fill-slate-600" />
              <circle cx="150" cy="225" r="2.5" className="fill-slate-600" />
              {/* Pocket flaps */}
              <rect x="95" y="225" width="28" height="6" rx="1" className="stroke-slate-400" />
              <rect x="177" y="225" width="28" height="6" rx="1" className="stroke-slate-400" />
              <line x1="102" y1="135" x2="128" y2="131" className="stroke-slate-400" />
            </g>
          )}

          {category === 'trousers' && (
            <g id="trousers-silhouette" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              {/* Waistband */}
              <rect x="90" y="60" width="120" height="16" rx="2" className="stroke-slate-600 fill-slate-100/50" />
              {/* Center Fly */}
              <line x1="150" y1="76" x2="150" y2="125" className="stroke-slate-500" />
              {/* Outer Left Leg */}
              <path d="M90 76 Q85 130 80 215 L85 305" className="stroke-slate-600" />
              {/* Outer Right Leg */}
              <path d="M210 76 Q215 130 220 215 L215 305" className="stroke-slate-600" />
              {/* Crotch & Inseams */}
              <path d="M150 125 Q145 150 135 215 L125 305" className="stroke-slate-600" />
              <path d="M150 125 Q155 150 165 215 L175 305" className="stroke-slate-600" />
              {/* Bottom Cuffs */}
              <line x1="85" y1="305" x2="125" y2="305" className="stroke-slate-700" strokeWidth="2.5" />
              <line x1="175" y1="305" x2="215" y2="305" className="stroke-slate-700" strokeWidth="2.5" />
              {/* Creases */}
              <line x1="105" y1="90" x2="105" y2="300" strokeDasharray="3 3" className="stroke-slate-300" />
              <line x1="195" y1="90" x2="195" y2="300" strokeDasharray="3 3" className="stroke-slate-300" />
            </g>
          )}

          {category === 'shirt' && (
            <g id="shirt-silhouette" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              {/* Collar */}
              <path d="M120 60 L150 78 L180 60 L165 50 L150 54 L135 50 Z" className="stroke-slate-700 fill-slate-100" />
              {/* Shoulders */}
              <path d="M120 60 L75 85 L60 160 L50 235" className="stroke-slate-500" />
              <path d="M180 60 L225 85 L240 160 L250 235" className="stroke-slate-500" />
              {/* Cuffs */}
              <rect x="42" y="235" width="18" height="12" rx="1" className="stroke-slate-600 fill-white" />
              <rect x="240" y="235" width="18" height="12" rx="1" className="stroke-slate-600 fill-white" />
              {/* Placket */}
              <line x1="150" y1="78" x2="150" y2="280" className="stroke-slate-600" />
              <circle cx="150" cy="105" r="2" className="fill-slate-600" />
              <circle cx="150" cy="135" r="2" className="fill-slate-600" />
              <circle cx="150" cy="165" r="2" className="fill-slate-600" />
              <circle cx="150" cy="195" r="2" className="fill-slate-600" />
              <circle cx="150" cy="225" r="2" className="fill-slate-600" />
              {/* Body */}
              <path d="M85 115 Q95 180 90 270 Q120 285 150 280 Q180 285 210 270 Q205 180 215 115" className="stroke-slate-600" />
            </g>
          )}

          {category === 'dress' && (
            <g id="dress-silhouette" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              {/* Neckline */}
              <path d="M125 60 Q150 85 175 60" className="stroke-slate-600" />
              {/* Shoulders */}
              <line x1="125" y1="60" x2="100" y2="70" className="stroke-slate-500" />
              <line x1="175" y1="60" x2="200" y2="70" className="stroke-slate-500" />
              {/* Bodice curves */}
              <path d="M100 70 Q95 110 110 135 L120 165" className="stroke-slate-600" />
              <path d="M200 70 Q205 110 190 135 L180 165" className="stroke-slate-600" />
              {/* Empire/Waist band */}
              <line x1="120" y1="165" x2="180" y2="165" className="stroke-slate-700" strokeWidth="2" />
              {/* Skirt flared to floor */}
              <path d="M120 165 Q110 215 80 310 L220 310 Q190 215 180 165" className="stroke-slate-600" />
              <path d="M80 310 Q150 325 220 310" className="stroke-slate-600" />
            </g>
          )}

          {/* Interactive Clickable Nodes */}
          {points.map((pt) => {
            if (!pt.svgPoint) return null;
            const isSelected = selectedPointId === pt.id;
            const hasVal = currentValues[pt.id] !== undefined && currentValues[pt.id] > 0;
            const val = currentValues[pt.id];

            return (
              <g
                key={pt.id}
                className="cursor-pointer transition-all duration-150"
                onClick={() => onSelectPoint?.(pt)}
                aria-label={`Select measurement: ${pt.name}`}
              >
                {/* Visual pulse ring when selected */}
                {isSelected && (
                  <circle
                    cx={pt.svgPoint.x}
                    cy={pt.svgPoint.y}
                    r="12"
                    className="fill-blue-500/20 stroke-blue-500 animate-pulse"
                    strokeWidth="1.5"
                  />
                )}

                {/* Primary anchor node */}
                <circle
                  cx={pt.svgPoint.x}
                  cy={pt.svgPoint.y}
                  r="5"
                  className={
                    isSelected
                      ? 'fill-blue-600 stroke-white'
                      : hasVal
                      ? 'fill-emerald-600 stroke-white'
                      : 'fill-slate-700 stroke-white'
                  }
                  strokeWidth="1.5"
                />

                {/* Small measurement indicator tag if value exists */}
                {hasVal && (
                  <text
                    x={pt.svgPoint.x + (pt.svgPoint.labelSide === 'left' ? -8 : 8)}
                    y={pt.svgPoint.y + 3}
                    textAnchor={pt.svgPoint.labelSide === 'left' ? 'end' : 'start'}
                    className="text-[9px] font-mono font-medium fill-slate-700"
                  >
                    {val}{unit === 'inches' ? '"' : 'cm'}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected point inspection pill */}
      {selectedPointId ? (
        <div className="w-full mt-3 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-left">
          {(() => {
            const activePt = points.find(p => p.id === selectedPointId);
            if (!activePt) return null;
            const val = currentValues[activePt.id];
            return (
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-900">{activePt.name}</span>
                  <span className="text-xs font-mono font-semibold text-blue-600">
                    {val ? `${val} ${unit}` : 'Unrecorded'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">{activePt.description}</p>
                <div className="text-[10px] text-slate-500 mt-1 font-mono">
                  Typical Range: {activePt.typicalRangeInches[0]}" – {activePt.typicalRangeInches[1]}"
                </div>
              </div>
            );
          })()}
        </div>
      ) : (
        <div className="w-full mt-3 p-2 text-center text-xs text-slate-500 italic">
          Click any point on the mannequin to view tailor guidance & reference range.
        </div>
      )}
    </div>
  );
};
