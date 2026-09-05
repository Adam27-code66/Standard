import { StandardRelationship } from '@/types';

// Graph relationships between demo standards
// Each relationship connects two standards with a typed edge
export const DEMO_RELATIONSHIPS: StandardRelationship[] = [
  // LED Street Light relationships
  { id: 'r-001', sourceStandardId: 'std-001', targetStandardId: 'std-003', relationshipType: 'NORMATIVE_REFERENCE', description: 'General luminaire requirements apply to road lighting luminaires' },
  { id: 'r-002', sourceStandardId: 'std-001', targetStandardId: 'std-002', relationshipType: 'NORMATIVE_REFERENCE', description: 'Performance requirements for LED luminaires' },
  { id: 'r-003', sourceStandardId: 'std-001', targetStandardId: 'std-006', relationshipType: 'TEST_METHOD', description: 'IP rating test method for outdoor enclosures' },
  { id: 'r-004', sourceStandardId: 'std-001', targetStandardId: 'std-007', relationshipType: 'TEST_METHOD', description: 'Photometric measurement methods' },
  { id: 'r-005', sourceStandardId: 'std-001', targetStandardId: 'std-004', relationshipType: 'SAFETY', description: 'Electrical safety for outdoor installations' },
  { id: 'r-006', sourceStandardId: 'std-001', targetStandardId: 'std-005', relationshipType: 'INSTALLATION', description: 'Conduit installation requirements' },
  { id: 'r-007', sourceStandardId: 'std-001', targetStandardId: 'std-008', relationshipType: 'RELATED_PRODUCT', description: 'Code of practice for road lighting design' },
  { id: 'r-008', sourceStandardId: 'std-002', targetStandardId: 'std-003', relationshipType: 'NORMATIVE_REFERENCE', description: 'General test requirements also applicable' },
  { id: 'r-009', sourceStandardId: 'std-002', targetStandardId: 'std-007', relationshipType: 'TEST_METHOD', description: 'Photometric tests for LED performance validation' },
  // Water Pump relationships
  { id: 'r-010', sourceStandardId: 'std-010', targetStandardId: 'std-009', relationshipType: 'TEST_METHOD', description: 'Acceptance test methods for centrifugal pumps' },
  { id: 'r-011', sourceStandardId: 'std-010', targetStandardId: 'std-011', relationshipType: 'RELATED_PRODUCT', description: 'Special purpose pump requirements for higher capacity' },
  // Cement relationships
  { id: 'r-012', sourceStandardId: 'std-012', targetStandardId: 'std-013', relationshipType: 'TEST_METHOD', description: 'Physical test methods for hydraulic cement' },
  // MCB relationships
  { id: 'r-013', sourceStandardId: 'std-014', targetStandardId: 'std-004', relationshipType: 'SAFETY', description: 'Safety requirements for AC circuit breakers' },
  // PPE relationships
  { id: 'r-014', sourceStandardId: 'std-015', targetStandardId: 'std-016', relationshipType: 'NORMATIVE_REFERENCE', description: 'General PPE requirements normatively referenced' },
];
