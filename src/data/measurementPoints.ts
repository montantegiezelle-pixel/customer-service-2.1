import { MeasurementPoint, GarmentCategory } from '../types/tailor';

export const MEASUREMENT_POINTS: Record<GarmentCategory, MeasurementPoint[]> = {
  suit_jacket: [
    {
      id: 'jacket_neck',
      name: 'Neck Circumference',
      category: 'suit_jacket',
      description: 'Measured around the base of the neck where the collar rests.',
      typicalRangeInches: [14.0, 19.5],
      svgPoint: { x: 150, y: 70, labelSide: 'top' }
    },
    {
      id: 'jacket_chest',
      name: 'Chest / Bust Circumference',
      category: 'suit_jacket',
      description: 'Fullest part of the chest, under the armpits across shoulder blades with arms relaxed.',
      typicalRangeInches: [34.0, 52.0],
      svgPoint: { x: 150, y: 120, labelSide: 'right' }
    },
    {
      id: 'jacket_stomach',
      name: 'Stomach / Waist',
      category: 'suit_jacket',
      description: 'At the natural waist level / navel where the top button of the jacket fastens.',
      typicalRangeInches: [28.0, 48.0],
      svgPoint: { x: 150, y: 175, labelSide: 'right' }
    },
    {
      id: 'jacket_hip',
      name: 'Hips / Seat',
      category: 'suit_jacket',
      description: 'Around the widest circumference of the hips and seat over jacket skirts.',
      typicalRangeInches: [34.0, 54.0],
      svgPoint: { x: 150, y: 235, labelSide: 'right' }
    },
    {
      id: 'jacket_shoulder',
      name: 'Across Shoulder',
      category: 'suit_jacket',
      description: 'From the tip of one shoulder acromion bone across the back curve to the other.',
      typicalRangeInches: [16.0, 22.5],
      svgPoint: { x: 150, y: 88, labelSide: 'left' }
    },
    {
      id: 'jacket_sleeve',
      name: 'Sleeve Length',
      category: 'suit_jacket',
      description: 'From shoulder bone tip down outer elbow bend to wrist bone (or cuff line).',
      typicalRangeInches: [22.0, 28.0],
      svgPoint: { x: 75, y: 170, labelSide: 'left' }
    },
    {
      id: 'jacket_back_length',
      name: 'Jacket Back Length',
      category: 'suit_jacket',
      description: 'From the nape of the neck (base of collar) straight down to the base of the jacket hem.',
      typicalRangeInches: [27.0, 34.0],
      svgPoint: { x: 150, y: 200, labelSide: 'left' }
    },
    {
      id: 'jacket_bicep',
      name: 'Bicep Circumference',
      category: 'suit_jacket',
      description: 'Around the fullest point of the upper arm with arm hanging relaxed.',
      typicalRangeInches: [11.0, 18.0],
      svgPoint: { x: 90, y: 130, labelSide: 'left' }
    },
    {
      id: 'jacket_wrist',
      name: 'Wrist / Cuff',
      category: 'suit_jacket',
      description: 'Circumference at the wrist bone plus ease for watch.',
      typicalRangeInches: [6.5, 9.5],
      svgPoint: { x: 65, y: 245, labelSide: 'left' }
    }
  ],

  trousers: [
    {
      id: 'trouser_waist',
      name: 'Trouser Waistband',
      category: 'trousers',
      description: 'At the exact height where customer prefers wearing trouser waistband.',
      typicalRangeInches: [28.0, 46.0],
      svgPoint: { x: 150, y: 70, labelSide: 'right' }
    },
    {
      id: 'trouser_seat',
      name: 'Seat / Hips',
      category: 'trousers',
      description: 'Fullest point around the buttocks with feet together.',
      typicalRangeInches: [34.0, 52.0],
      svgPoint: { x: 150, y: 110, labelSide: 'right' }
    },
    {
      id: 'trouser_outseam',
      name: 'Outseam Length',
      category: 'trousers',
      description: 'From top edge of waistband down the outer side of the leg to shoe heel top.',
      typicalRangeInches: [36.0, 46.0],
      svgPoint: { x: 80, y: 200, labelSide: 'left' }
    },
    {
      id: 'trouser_inseam',
      name: 'Inseam Length',
      category: 'trousers',
      description: 'From the crotch seam straight down the inside of the leg to hemline break.',
      typicalRangeInches: [28.0, 36.0],
      svgPoint: { x: 140, y: 210, labelSide: 'right' }
    },
    {
      id: 'trouser_thigh',
      name: 'Thigh Circumference',
      category: 'trousers',
      description: 'Around the fullest part of the upper thigh, 1 inch below crotch seam.',
      typicalRangeInches: [20.0, 30.0],
      svgPoint: { x: 110, y: 145, labelSide: 'left' }
    },
    {
      id: 'trouser_knee',
      name: 'Knee Width',
      category: 'trousers',
      description: 'Around midpoint of knee while standing straight.',
      typicalRangeInches: [16.0, 23.0],
      svgPoint: { x: 110, y: 215, labelSide: 'left' }
    },
    {
      id: 'trouser_cuff',
      name: 'Leg Opening / Bottom Hem',
      category: 'trousers',
      description: 'Circumference of trouser bottom opening over dress shoes.',
      typicalRangeInches: [14.0, 20.0],
      svgPoint: { x: 110, y: 285, labelSide: 'left' }
    },
    {
      id: 'trouser_front_rise',
      name: 'Front Rise',
      category: 'trousers',
      description: 'From crotch seam intersection upwards to top of front waistband.',
      typicalRangeInches: [9.0, 13.5],
      svgPoint: { x: 150, y: 90, labelSide: 'left' }
    }
  ],

  shirt: [
    {
      id: 'shirt_collar',
      name: 'Collar Band',
      category: 'shirt',
      description: 'Around the neck at Adam’s apple level plus one index finger comfort ease.',
      typicalRangeInches: [14.0, 19.5],
      svgPoint: { x: 150, y: 65, labelSide: 'top' }
    },
    {
      id: 'shirt_chest',
      name: 'Chest Width',
      category: 'shirt',
      description: 'Fullest part of chest with normal relaxed breathing.',
      typicalRangeInches: [34.0, 52.0],
      svgPoint: { x: 150, y: 115, labelSide: 'right' }
    },
    {
      id: 'shirt_waist',
      name: 'Waist / Midsection',
      category: 'shirt',
      description: 'Narrowest section of torso or around the navel level.',
      typicalRangeInches: [28.0, 48.0],
      svgPoint: { x: 150, y: 165, labelSide: 'right' }
    },
    {
      id: 'shirt_sleeve',
      name: 'Sleeve Length',
      category: 'shirt',
      description: 'From center back of neck across shoulder tip down to base of thumb.',
      typicalRangeInches: [31.0, 38.0],
      svgPoint: { x: 75, y: 160, labelSide: 'left' }
    },
    {
      id: 'shirt_cuff',
      name: 'Wrist Cuff Size',
      category: 'shirt',
      description: 'Around wrist bone plus 1.5–2 inches for dress watch clearance.',
      typicalRangeInches: [8.0, 10.5],
      svgPoint: { x: 65, y: 235, labelSide: 'left' }
    },
    {
      id: 'shirt_yoke',
      name: 'Yoke / Shoulder Width',
      category: 'shirt',
      description: 'Horizontal line connecting outer seam tips across upper back.',
      typicalRangeInches: [16.0, 22.0],
      svgPoint: { x: 150, y: 85, labelSide: 'left' }
    },
    {
      id: 'shirt_length',
      name: 'Shirt Total Length',
      category: 'shirt',
      description: 'From collar base down front or back to mid-buttock for tucking security.',
      typicalRangeInches: [29.0, 36.0],
      svgPoint: { x: 150, y: 220, labelSide: 'right' }
    }
  ],

  dress: [
    {
      id: 'dress_bust',
      name: 'Full Bust',
      category: 'dress',
      description: 'Across the fullest projection of the bustline with bra intended for the gown.',
      typicalRangeInches: [31.0, 48.0],
      svgPoint: { x: 150, y: 110, labelSide: 'right' }
    },
    {
      id: 'dress_underbust',
      name: 'Underbust Ribcage',
      category: 'dress',
      description: 'Snug directly under the bust line for empire line or corseted structure.',
      typicalRangeInches: [26.0, 42.0],
      svgPoint: { x: 150, y: 135, labelSide: 'right' }
    },
    {
      id: 'dress_waist',
      name: 'Natural Waist',
      category: 'dress',
      description: 'Narrowest point of the torso above the hips.',
      typicalRangeInches: [24.0, 42.0],
      svgPoint: { x: 150, y: 165, labelSide: 'right' }
    },
    {
      id: 'dress_high_hip',
      name: 'High Hip (3" below waist)',
      category: 'dress',
      description: 'Over the iliac crest top edge of pelvic bone.',
      typicalRangeInches: [30.0, 46.0],
      svgPoint: { x: 150, y: 195, labelSide: 'right' }
    },
    {
      id: 'dress_full_hip',
      name: 'Full Hip & Seat',
      category: 'dress',
      description: 'Around the maximum curve of buttocks and hips (usually 7-9" below waist).',
      typicalRangeInches: [34.0, 52.0],
      svgPoint: { x: 150, y: 225, labelSide: 'right' }
    },
    {
      id: 'dress_shoulder_apex',
      name: 'Shoulder to Bust Apex',
      category: 'dress',
      description: 'From base of neck along shoulder slant down to the bust point.',
      typicalRangeInches: [9.0, 14.0],
      svgPoint: { x: 120, y: 95, labelSide: 'left' }
    },
    {
      id: 'dress_nape_waist',
      name: 'Nape to Back Waist',
      category: 'dress',
      description: 'From prominent C7 neck vertebra down spine to natural waist tape line.',
      typicalRangeInches: [14.0, 19.0],
      svgPoint: { x: 150, y: 140, labelSide: 'left' }
    },
    {
      id: 'dress_skirt_length',
      name: 'Waist to Floor / Hem',
      category: 'dress',
      description: 'From natural waist tape down to desired hemline or floor including heels.',
      typicalRangeInches: [38.0, 48.0],
      svgPoint: { x: 150, y: 280, labelSide: 'left' }
    }
  ],

  custom: [
    {
      id: 'custom_notes_length',
      name: 'Total Garment Length',
      category: 'custom',
      description: 'Vertical drop from shoulder high point to bottom hem.',
      typicalRangeInches: [25.0, 60.0]
    },
    {
      id: 'custom_chest_width',
      name: 'Primary Chest / Body Width',
      category: 'custom',
      description: 'Main body circumference.',
      typicalRangeInches: [30.0, 56.0]
    }
  ]
};
