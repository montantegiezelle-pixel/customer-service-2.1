import { Customer, CustomerMeasurementProfile, OrderItem } from '../types/tailor';

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    fullName: 'Lord Julian Thorne',
    email: 'j.thorne@mayfair-estates.co.uk',
    phone: '+44 20 7946 0912',
    address: '14 Curzon Street, Mayfair, London W1J 5HN',
    gender: 'men',
    clientTier: 'couture_patron',
    createdAt: '2025-04-12',
    notes: 'Right shoulder lower by 0.5". Prefers slight break on trousers, horn buttons only.',
    measurementProfileId: 'prof-1'
  },
  {
    id: 'cust-2',
    fullName: 'Elena Rostova',
    email: 'elena.rostova@gallery-opus.com',
    phone: '+1 (212) 555-0198',
    address: '740 Park Avenue, Apt 11B, New York, NY 10021',
    gender: 'women',
    clientTier: 'vip',
    createdAt: '2025-08-20',
    notes: 'Prefers silk lining dyed to match shell fabric. Natural waist sitting slightly high.',
    measurementProfileId: 'prof-2'
  },
  {
    id: 'cust-3',
    fullName: 'Marcus Vance',
    email: 'm.vance@vance-holdings.com',
    phone: '+1 (415) 555-8371',
    address: '3200 Pacific Avenue, San Francisco, CA 94115',
    gender: 'men',
    clientTier: 'vip',
    createdAt: '2026-01-14',
    notes: 'Athletic shoulder posture, high armhole preference for unrestricted arm movement.',
    measurementProfileId: 'prof-3'
  },
  {
    id: 'cust-4',
    fullName: 'Dr. Aisha Patel',
    email: 'aisha.patel@oxford-research.org',
    phone: '+44 1865 496022',
    address: '9 Woodstock Road, Oxford OX2 6HT',
    gender: 'women',
    clientTier: 'standard',
    createdAt: '2026-02-03',
    notes: 'Sharp structured shoulders, preferences for interior hidden passport pocket.',
    measurementProfileId: 'prof-4'
  },
  {
    id: 'cust-5',
    fullName: 'Gregory Hayes',
    email: 'ghayes@beaconhill-partners.com',
    phone: '+1 (617) 555-4420',
    address: '88 Mount Vernon St, Boston, MA 02108',
    gender: 'men',
    clientTier: 'standard',
    createdAt: '2026-03-10',
    notes: 'Prefers classic English drape cut with double side vents and forward pleats.',
    measurementProfileId: 'prof-5'
  }
];

export const INITIAL_PROFILES: CustomerMeasurementProfile[] = [
  {
    id: 'prof-1',
    customerId: 'cust-1',
    profileName: 'Savile Row Double-Breasted Spec',
    unit: 'inches',
    updatedAt: '2026-10-15',
    postureNotes: 'Right shoulder drop 0.5 in; slight prominent chest; head forward 0.25 in.',
    bodyShape: 'Tall Slender with Drop 7',
    garments: {
      suit_jacket: {
        category: 'suit_jacket',
        fitPreference: 'slim',
        values: {
          jacket_neck: 16.0,
          jacket_chest: 41.5,
          jacket_stomach: 34.0,
          jacket_hip: 40.5,
          jacket_shoulder: 18.5,
          jacket_sleeve: 26.25,
          jacket_back_length: 31.0,
          jacket_bicep: 14.5,
          jacket_wrist: 7.75
        },
        customNotes: 'Roped sleevehead with 0.5in shoulder padding to level uneven shoulders.'
      },
      trousers: {
        category: 'trousers',
        fitPreference: 'slim',
        values: {
          trouser_waist: 33.5,
          trouser_seat: 40.5,
          trouser_outseam: 42.5,
          trouser_inseam: 32.5,
          trouser_thigh: 24.0,
          trouser_knee: 18.5,
          trouser_cuff: 15.5,
          trouser_front_rise: 11.25
        },
        customNotes: 'High-waisted with 2-inch Hollywood waistband and button side adjusters.'
      },
      shirt: {
        category: 'shirt',
        fitPreference: 'slim',
        values: {
          shirt_collar: 16.0,
          shirt_chest: 42.0,
          shirt_waist: 34.5,
          shirt_sleeve: 35.5,
          shirt_cuff: 9.0,
          shirt_yoke: 18.5,
          shirt_length: 33.0
        }
      }
    },
    revisionHistory: [
      {
        date: '2026-10-15',
        note: 'Reduced waist by 0.5" after fitting session',
        recordedBy: 'Master Cutter William Sterling'
      },
      {
        date: '2025-04-12',
        note: 'Initial full anatomical measurement scan',
        recordedBy: 'Tailor Apprentice Thomas'
      }
    ]
  },
  {
    id: 'prof-2',
    customerId: 'cust-2',
    profileName: 'Haute Couture Evening Spec',
    unit: 'inches',
    updatedAt: '2026-09-28',
    postureNotes: 'Erect posture, balanced shoulders, hourglass distribution.',
    bodyShape: 'Classic Hourglass',
    garments: {
      dress: {
        category: 'dress',
        fitPreference: 'slim',
        values: {
          dress_bust: 36.5,
          dress_underbust: 29.5,
          dress_waist: 26.0,
          dress_high_hip: 34.0,
          dress_full_hip: 37.5,
          dress_shoulder_apex: 10.25,
          dress_nape_waist: 15.5,
          dress_skirt_length: 44.0
        },
        customNotes: 'Internal boned corset structure with French hook & eye closures.'
      }
    },
    revisionHistory: [
      {
        date: '2026-09-28',
        note: 'Confirmed hemline measurement wearing 4-inch Manolo heels',
        recordedBy: 'Head Dressmaker Claire Laurent'
      }
    ]
  },
  {
    id: 'prof-3',
    customerId: 'cust-3',
    profileName: 'Athletic Cut Business Suit',
    unit: 'inches',
    updatedAt: '2026-10-20',
    postureNotes: 'Broad latissimus, square shoulders, forward chest.',
    bodyShape: 'Athletic V-Taper (Drop 9)',
    garments: {
      suit_jacket: {
        category: 'suit_jacket',
        fitPreference: 'regular',
        values: {
          jacket_neck: 17.5,
          jacket_chest: 45.0,
          jacket_stomach: 35.0,
          jacket_hip: 42.0,
          jacket_shoulder: 20.0,
          jacket_sleeve: 26.75,
          jacket_back_length: 31.5,
          jacket_bicep: 16.5,
          jacket_wrist: 8.25
        }
      },
      trousers: {
        category: 'trousers',
        fitPreference: 'regular',
        values: {
          trouser_waist: 34.5,
          trouser_seat: 42.5,
          trouser_outseam: 42.0,
          trouser_inseam: 32.0,
          trouser_thigh: 26.5,
          trouser_knee: 19.5,
          trouser_cuff: 16.0,
          trouser_front_rise: 11.5
        }
      }
    }
  },
  {
    id: 'prof-4',
    customerId: 'cust-4',
    profileName: 'Bespoke Executive Suit Spec',
    unit: 'inches',
    updatedAt: '2026-08-14',
    postureNotes: 'Slight left shoulder tilt, upright standing balance.',
    bodyShape: 'Petite Structured',
    garments: {
      suit_jacket: {
        category: 'suit_jacket',
        fitPreference: 'slim',
        values: {
          jacket_neck: 14.5,
          jacket_chest: 35.5,
          jacket_stomach: 29.0,
          jacket_hip: 37.0,
          jacket_shoulder: 16.5,
          jacket_sleeve: 23.5,
          jacket_back_length: 27.5,
          jacket_bicep: 12.0,
          jacket_wrist: 6.5
        }
      },
      trousers: {
        category: 'trousers',
        fitPreference: 'slim',
        values: {
          trouser_waist: 28.5,
          trouser_seat: 37.5,
          trouser_outseam: 38.5,
          trouser_inseam: 29.5,
          trouser_thigh: 22.0,
          trouser_knee: 17.0,
          trouser_cuff: 14.5,
          trouser_front_rise: 10.0
        }
      }
    }
  },
  {
    id: 'prof-5',
    customerId: 'cust-5',
    profileName: 'Traditional Flannel Suit Spec',
    unit: 'inches',
    updatedAt: '2026-09-02',
    postureNotes: 'Relaxed posture, slightly rounded upper back.',
    bodyShape: 'Standard Classic Drape',
    garments: {
      suit_jacket: {
        category: 'suit_jacket',
        fitPreference: 'relaxed',
        values: {
          jacket_neck: 16.5,
          jacket_chest: 43.0,
          jacket_stomach: 38.0,
          jacket_hip: 43.5,
          jacket_shoulder: 19.0,
          jacket_sleeve: 25.5,
          jacket_back_length: 30.5,
          jacket_bicep: 15.0,
          jacket_wrist: 8.0
        }
      },
      trousers: {
        category: 'trousers',
        fitPreference: 'regular',
        values: {
          trouser_waist: 37.0,
          trouser_seat: 43.0,
          trouser_outseam: 41.0,
          trouser_inseam: 30.5,
          trouser_thigh: 25.0,
          trouser_knee: 19.0,
          trouser_cuff: 16.5,
          trouser_front_rise: 12.0
        }
      }
    }
  }
];

export const INITIAL_ORDERS: OrderItem[] = [
  {
    id: 'ord-1042',
    orderNumber: 'ORD-2026-1042',
    customerId: 'cust-1',
    garmentType: 'Bespoke 3-Piece Peak Lapel Suit',
    category: 'suit_jacket',
    fabricCode: 'Scabal Diamond Chip 150s - Midnight Navy (Bolt #SC-8821)',
    liningCode: 'Bemberg Cupro Antique Amber #BB-04',
    buttonStyle: 'Genuine Water Buffalo Horn - Mottled Smoke',
    specialInstructions: 'Hand-sewn Milanese boutonnière on left lapel. Ticket pocket with flap.',
    status: 'first_fitting',
    priority: 'urgent',
    createdAt: '2026-10-10',
    targetDeliveryDate: '2026-11-20',
    fittings: {
      firstFittingDate: '2026-10-29', // Tomorrow relative to 2026-10-28!
      firstFittingCompleted: false,
      secondFittingDate: '2026-11-08',
      secondFittingCompleted: false,
      fittingsNotes: [
        {
          date: '2026-10-18',
          fittingStage: '1st Fitting',
          notes: 'Canvas basted with white contrast stitching ready for customer fitting.',
          tailor: 'William Sterling'
        }
      ]
    },
    pricing: {
      basePrice: 3800,
      fabricCost: 1200,
      customizationCost: 350,
      rushSurcharge: 250,
      discount: 0,
      taxRate: 0.08,
      depositPaid: 3000
    },
    assignedTailor: 'William Sterling',
    appliedMeasurementProfileId: 'prof-1'
  },
  {
    id: 'ord-1043',
    orderNumber: 'ORD-2026-1043',
    customerId: 'cust-2',
    garmentType: 'Hand-Pleated Silk Chiffon Evening Gown',
    category: 'dress',
    fabricCode: 'Sophie Hallette Dentelle de Lyon & Como Double Silk Crepe - Emerald',
    liningCode: 'Silk Habotai Emerald Tone-on-tone',
    buttonStyle: 'Hand-covered Silk Rouge Loops',
    specialInstructions: 'Integrated boning structure. Detachable sheer train for gala reception.',
    status: 'alterations',
    priority: 'rush',
    createdAt: '2026-09-22',
    targetDeliveryDate: '2026-11-05',
    fittings: {
      firstFittingDate: '2026-10-12',
      firstFittingCompleted: true,
      secondFittingDate: '2026-10-31',
      secondFittingCompleted: false,
      finalFittingDate: '2026-11-03',
      finalFittingCompleted: false,
      fittingsNotes: [
        {
          date: '2026-10-12',
          fittingStage: '1st Fitting',
          notes: 'Waist seam raised by 0.5 in. Bodice contouring adjusted around apex.',
          tailor: 'Claire Laurent'
        }
      ]
    },
    pricing: {
      basePrice: 4200,
      fabricCost: 1800,
      customizationCost: 600,
      rushSurcharge: 400,
      discount: 200,
      taxRate: 0.08,
      depositPaid: 3500
    },
    assignedTailor: 'Claire Laurent',
    appliedMeasurementProfileId: 'prof-2'
  },
  {
    id: 'ord-1044',
    orderNumber: 'ORD-2026-1044',
    customerId: 'cust-3',
    garmentType: 'Double-Breasted Flannel Overcoat',
    category: 'suit_jacket',
    fabricCode: 'Fox Brothers 560g Heavy Wool Melange - Charcoal Herringbone',
    liningCode: 'Heavy Satin Twill Black',
    buttonStyle: 'Matte Gunmetal Domed Metal Buttons',
    specialInstructions: 'Martingale back belt with dual box pleats. Deep storm welt pockets.',
    status: 'pattern_drafting',
    priority: 'normal',
    createdAt: '2026-10-22',
    targetDeliveryDate: '2026-12-10',
    fittings: {
      firstFittingDate: '2026-11-04',
      firstFittingCompleted: false
    },
    pricing: {
      basePrice: 2900,
      fabricCost: 850,
      customizationCost: 200,
      rushSurcharge: 0,
      discount: 0,
      taxRate: 0.08,
      depositPaid: 1950
    },
    assignedTailor: 'Marcus Vance Cutter Desk',
    appliedMeasurementProfileId: 'prof-3'
  },
  {
    id: 'ord-1045',
    orderNumber: 'ORD-2026-1045',
    customerId: 'cust-4',
    garmentType: 'Bespoke Executive Tuxedo Jacket & Trousers',
    category: 'suit_jacket',
    fabricCode: 'Holland & Sherry Cape Horn 99% Wool 1% Cashmere - Jet Black',
    liningCode: 'Jacquard Floral Damask Black-on-Black',
    buttonStyle: 'Satin Silk Covered Buttons',
    specialInstructions: 'Silk grosgrain shawl collar and 1.5-inch trouser side braids.',
    status: 'final_fitting',
    priority: 'normal',
    createdAt: '2026-09-15',
    targetDeliveryDate: '2026-11-02',
    fittings: {
      firstFittingDate: '2026-10-02',
      firstFittingCompleted: true,
      secondFittingDate: '2026-10-18',
      secondFittingCompleted: true,
      finalFittingDate: '2026-10-30',
      finalFittingCompleted: false,
      fittingsNotes: [
        {
          date: '2026-10-18',
          fittingStage: '2nd Fitting',
          notes: 'Trouser hem length confirmed with patent leather oxfords. Ready for pressing.',
          tailor: 'David Evans'
        }
      ]
    },
    pricing: {
      basePrice: 3400,
      fabricCost: 950,
      customizationCost: 300,
      rushSurcharge: 0,
      discount: 150,
      taxRate: 0.08,
      depositPaid: 2500
    },
    assignedTailor: 'David Evans',
    appliedMeasurementProfileId: 'prof-4'
  },
  {
    id: 'ord-1046',
    orderNumber: 'ORD-2026-1046',
    customerId: 'cust-5',
    garmentType: 'Handmade Sea Island Cotton Dress Shirts (Trio Set)',
    category: 'shirt',
    fabricCode: 'Albini 140/2 Sea Island Poplin - Sky Blue & Crisp White',
    liningCode: 'Soft Brushed Interfacing',
    buttonStyle: 'Australian Mother-of-Pearl 4mm Thick',
    specialInstructions: 'Semi-spread Italian collar, french cuffs, hand-embroidered monogram GH on ribs.',
    status: 'ready',
    priority: 'normal',
    createdAt: '2026-10-05',
    targetDeliveryDate: '2026-10-28',
    fittings: {
      firstFittingDate: '2026-10-20',
      firstFittingCompleted: true,
      finalFittingCompleted: true
    },
    pricing: {
      basePrice: 1100,
      fabricCost: 350,
      customizationCost: 150,
      rushSurcharge: 0,
      discount: 0,
      taxRate: 0.08,
      depositPaid: 1728 // Paid in full
    },
    assignedTailor: 'Arthur Pendelton',
    appliedMeasurementProfileId: 'prof-5'
  },
  {
    id: 'ord-1047',
    orderNumber: 'ORD-2026-1047',
    customerId: 'cust-1',
    garmentType: 'High-Waisted Flannel Trousers with Gurkha Fastening',
    category: 'trousers',
    fabricCode: 'Vitale Barberis Canonico 340g Flannel - Oatmeal Melange',
    buttonStyle: 'Horn Buckle Gurkha Tabs',
    specialInstructions: 'Double reverse pleats, 2-inch turn-up cuffs, slant pockets.',
    status: 'intake',
    priority: 'normal',
    createdAt: '2026-10-27',
    targetDeliveryDate: '2026-11-28',
    fittings: {
      firstFittingDate: '2026-11-10',
      firstFittingCompleted: false
    },
    pricing: {
      basePrice: 750,
      fabricCost: 240,
      customizationCost: 80,
      rushSurcharge: 0,
      discount: 50,
      taxRate: 0.08,
      depositPaid: 500
    },
    assignedTailor: 'William Sterling',
    appliedMeasurementProfileId: 'prof-1'
  }
];
