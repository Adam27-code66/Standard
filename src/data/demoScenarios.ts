import { DemoScenario } from '@/types';

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'scenario-tank',
    name: 'Hospital SS Water Tank',
    icon: '🏥',
    description: 'Government hospital procurement — stainless steel water storage tank',
    product: 'Stainless Steel Water Storage Tank',
    purpose: 'Potable water storage for government hospital complex (500-bed unit)',
    technicalRequirements:
      'Capacity: 10,000 Liters\nMaterial: Grade 304 / 316 Stainless Steel\nApplication: Potable water storage in hospital\nNon-toxic internal lining & passivated welds\nPressure test: Hydrostatic test at 1.5x working pressure\nCorrosion resistance: High durability for chlorinated water\nBIS ISI certification mandatory',
    environment: 'Hospital rooftop / Exposed to atmosphere / Continuous water supply',
    industry: 'Healthcare',
  },
  {
    id: 'scenario-led',
    name: 'Outdoor LED Street Light',
    icon: '💡',
    description: 'Highway infrastructure lighting — primary judge demo scenario',
    product: 'Outdoor LED Street Light',
    purpose: 'Highway street lighting for National Highway infrastructure project',
    technicalRequirements:
      'Power rating: 100W\nLuminous efficacy: minimum 120 lm/W\nColor temperature: 5000K-6500K\nIP rating: IP65 or higher\nOperating voltage: 220-240V AC\nDesign life: minimum 50,000 hours\nIK rating: IK08\nPower factor: >0.90\nTHD: <10%\nDimmable: 0-10V or DALI',
    environment: 'Outdoor / Coastal exposure / High ambient temperature / Monsoon conditions',
    industry: 'Infrastructure',
  },
  {
    id: 'scenario-pump',
    name: 'Industrial Water Pump',
    icon: '🔧',
    description: 'Municipal water supply project — centrifugal pump procurement',
    product: 'Industrial Water Pump',
    purpose: 'Municipal water supply project — pumping treated water to distribution network',
    technicalRequirements:
      'Flow rate: 1000 L/min\nHead: 60 meters\nPump type: Centrifugal horizontal\nFluid: Clean water (potable)\nAmbient: Outdoor pump house\nMaterial: Cast iron casing, stainless steel impeller\nEfficiency: minimum 75%\nMotor: 3-phase 415V',
    environment: 'Outdoor pump house / Continuous operation / Tropical climate',
    industry: 'Water Supply',
  },
  {
    id: 'scenario-cement',
    name: 'Cement (Construction)',
    icon: '🏗️',
    description: 'Government infrastructure project — OPC cement procurement',
    product: 'Ordinary Portland Cement (OPC)',
    purpose: 'Construction of government office building — civil works',
    technicalRequirements:
      'Grade: OPC 43 or OPC 53\nQuantity: 5000 MT\nFineness: >225 m²/kg\nInitial setting time: >30 minutes\nFinal setting time: <600 minutes\nCompressive strength: 28-day minimum 43 MPa\nSoundness: Le Chatelier expansion <10mm\nPackaging: 50 kg bags with BIS marking',
    environment: 'General construction / Normal climatic conditions',
    industry: 'Construction',
  },
  {
    id: 'scenario-mcb',
    name: 'Electrical Equipment (MCB)',
    icon: '⚡',
    description: 'Government building electrical installation — MCB procurement',
    product: 'Miniature Circuit Breaker (MCB)',
    purpose: 'Electrical protection for government office building wiring installation',
    technicalRequirements:
      'Rating: 32A single pole\nVoltage: 240V AC\nFrequency: 50 Hz\nBreaking capacity: 10 kA\nCharacteristic: Type C\nStandards: IEC 60898-1\nTerminal: 35mm² max cable\nOperating temperature: -5°C to +40°C\nBIS certification mandatory',
    environment: 'Indoor electrical panel / AC environment',
    industry: 'Electrical',
  },
  {
    id: 'scenario-ppe',
    name: 'Personal Protective Equipment',
    icon: '⛑️',
    description: 'Construction site PPE — safety helmet procurement',
    product: 'Industrial Safety Helmet',
    purpose: 'Worker safety at heavy civil construction site — head protection',
    technicalRequirements:
      'Type: Industrial safety helmet / hard hat\nShell material: HDPE or ABS\nSuspension: 6-point\nVentilation: Vented\nPeak/Brim: Full brim preferred\nAdjustable: Yes, ratchet mechanism\nColor: Yellow, White, Red options\nCertification: BIS ISI mark mandatory\nQuantity: 500 units',
    environment: 'Outdoor construction site / Sun exposure / Rain / Dust',
    industry: 'Construction',
  },
];
