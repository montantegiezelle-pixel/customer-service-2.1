export type UnitSystem = 'inches' | 'cm';

export type GarmentCategory = 'suit_jacket' | 'trousers' | 'dress' | 'shirt' | 'custom';

export interface MeasurementPoint {
  id: string;
  name: string;
  category: GarmentCategory;
  description: string;
  typicalRangeInches: [number, number];
  svgPoint?: { x: number; y: number; labelSide?: 'left' | 'right' | 'top' | 'bottom' };
}

export interface GarmentMeasurements {
  category: GarmentCategory;
  values: Record<string, number>; // key is measurement point id, value is numeric
  customNotes?: string;
  fitPreference?: 'ultra_slim' | 'slim' | 'regular' | 'relaxed';
}

export interface CustomerMeasurementProfile {
  id: string;
  customerId: string;
  profileName: string; // e.g. "Standard Bespoke Profile", "Black Tie Cut"
  unit: UnitSystem;
  updatedAt: string;
  postureNotes?: string; // e.g., "Right shoulder lower by 0.5 in, forward head posture"
  bodyShape?: string; // e.g., "Athletic V-Taper", "Stout", "Prominent Chest"
  garments: {
    suit_jacket?: GarmentMeasurements;
    trousers?: GarmentMeasurements;
    shirt?: GarmentMeasurements;
    dress?: GarmentMeasurements;
    custom?: GarmentMeasurements;
  };
  revisionHistory?: Array<{
    date: string;
    note: string;
    recordedBy: string;
  }>;
}

export type OrderStatus =
  | 'intake'
  | 'pattern_drafting'
  | 'fabric_prep'
  | 'first_fitting'
  | 'alterations'
  | 'final_fitting'
  | 'ready'
  | 'completed';

export interface FittingSchedule {
  firstFittingDate?: string;
  firstFittingCompleted?: boolean;
  secondFittingDate?: string;
  secondFittingCompleted?: boolean;
  finalFittingDate?: string;
  finalFittingCompleted?: boolean;
  fittingsNotes?: Array<{
    date: string;
    fittingStage: '1st Fitting' | '2nd Fitting' | 'Final Trial';
    notes: string;
    tailor: string;
  }>;
}

export interface OrderPricing {
  basePrice: number;
  fabricCost: number;
  customizationCost: number;
  rushSurcharge: number;
  discount: number;
  taxRate: number; // e.g. 0.08 for 8%
  depositPaid: number;
}

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  gender?: 'men' | 'women' | 'unisex';
  clientTier: 'standard' | 'vip' | 'couture_patron';
  createdAt: string;
  notes?: string;
  measurementProfileId?: string;
}

export interface OrderItem {
  id: string;
  orderNumber: string; // e.g. ORD-2026-1042
  customerId: string;
  garmentType: string; // e.g. "Bespoke 3-Piece Peak Lapel Suit"
  category: GarmentCategory;
  fabricCode: string; // e.g. "Loro Piana Tasmanian 150s - Charcoal Pinstripe"
  liningCode?: string; // e.g. "Bemberg Cupro Bronze"
  buttonStyle?: string; // e.g. "Real Horn - Dark Brown 4-hole"
  specialInstructions?: string;
  status: OrderStatus;
  priority: 'normal' | 'rush' | 'urgent';
  createdAt: string;
  targetDeliveryDate: string;
  fittings: FittingSchedule;
  pricing: OrderPricing;
  assignedTailor: string;
  appliedMeasurementProfileId?: string;
}
