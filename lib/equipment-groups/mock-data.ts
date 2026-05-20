/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  ⭐  MOCK DATA — FOR SHOWCASE / LOCAL DEVELOPMENT ONLY          ║
 * ║                                                                  ║
 * ║  HOW TO REPLACE WITH LIVE API DATA:                              ║
 * ║                                                                  ║
 * ║  In  components/equipment-groups/equipment-group-page-client.tsx ║
 * ║  find the "⭐ MOCK DATA" block and follow the two-step comment.  ║
 * ║  Then delete this file.                                          ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import type { EquipmentGroupRecord } from "@/types/equipment-group";

export const MOCK_EQUIPMENT_GROUPS: EquipmentGroupRecord[] = [
  // ── Thiết bị nâng hạ ────────────────────────────────────────────
  {
    _id: "mock-001",
    level1: "Thiết bị nâng hạ",
    level2: "Cầu trục",
    level3: "Dầm đơn",
    level4: "3T",
    fullPath: "Thiết bị nâng hạ > Cầu trục > Dầm đơn > 3T",
    createdAt: "2025-01-10T08:00:00.000Z",
    updatedAt: "2025-01-10T08:00:00.000Z",
  },
  {
    _id: "mock-002",
    level1: "Thiết bị nâng hạ",
    level2: "Cầu trục",
    level3: "Dầm đơn",
    level4: "5T",
    fullPath: "Thiết bị nâng hạ > Cầu trục > Dầm đơn > 5T",
    createdAt: "2025-01-10T08:05:00.000Z",
    updatedAt: "2025-01-10T08:05:00.000Z",
  },
  {
    _id: "mock-003",
    level1: "Thiết bị nâng hạ",
    level2: "Cầu trục",
    level3: "Dầm đôi",
    level4: "7.5T",
    fullPath: "Thiết bị nâng hạ > Cầu trục > Dầm đôi > 7.5T",
    createdAt: "2025-01-10T08:10:00.000Z",
    updatedAt: "2025-01-10T08:10:00.000Z",
  },
  {
    _id: "mock-004",
    level1: "Thiết bị nâng hạ",
    level2: "Cầu trục",
    level3: "Dầm đôi",
    level4: "10T",
    fullPath: "Thiết bị nâng hạ > Cầu trục > Dầm đôi > 10T",
    createdAt: "2025-01-10T08:15:00.000Z",
    updatedAt: "2025-01-10T08:15:00.000Z",
  },
  {
    _id: "mock-005",
    level1: "Thiết bị nâng hạ",
    level2: "Pa lăng điện",
    level3: "Pa lăng xích",
    level4: "1T",
    fullPath: "Thiết bị nâng hạ > Pa lăng điện > Pa lăng xích > 1T",
    createdAt: "2025-01-11T08:00:00.000Z",
    updatedAt: "2025-01-11T08:00:00.000Z",
  },
  {
    _id: "mock-006",
    level1: "Thiết bị nâng hạ",
    level2: "Pa lăng điện",
    level3: "Pa lăng xích",
    level4: "2T",
    fullPath: "Thiết bị nâng hạ > Pa lăng điện > Pa lăng xích > 2T",
    createdAt: "2025-01-11T08:10:00.000Z",
    updatedAt: "2025-01-11T08:10:00.000Z",
  },

  // ── Thiết bị cắt ─────────────────────────────────────────────────
  {
    _id: "mock-007",
    level1: "Thiết bị cắt",
    level2: "Máy cắt",
    level3: "Máy cắt CNC",
    level4: "40T",
    fullPath: "Thiết bị cắt > Máy cắt > Máy cắt CNC > 40T",
    createdAt: "2025-01-12T09:00:00.000Z",
    updatedAt: "2025-01-12T09:00:00.000Z",
  },
  {
    _id: "mock-008",
    level1: "Thiết bị cắt",
    level2: "Máy cắt",
    level3: "Máy cắt plasma",
    level4: "60A",
    fullPath: "Thiết bị cắt > Máy cắt > Máy cắt plasma > 60A",
    createdAt: "2025-01-12T09:10:00.000Z",
    updatedAt: "2025-01-12T09:10:00.000Z",
  },
  {
    _id: "mock-009",
    level1: "Thiết bị cắt",
    level2: "Máy cắt",
    level3: "Máy cắt plasma",
    level4: "120A",
    fullPath: "Thiết bị cắt > Máy cắt > Máy cắt plasma > 120A",
    createdAt: "2025-01-12T09:20:00.000Z",
    updatedAt: "2025-01-12T09:20:00.000Z",
  },

  // ── Thiết bị hàn ─────────────────────────────────────────────────
  {
    _id: "mock-010",
    level1: "Thiết bị hàn",
    level2: "Máy hàn MIG",
    level3: "Hàn bán tự động",
    level4: "250A",
    fullPath: "Thiết bị hàn > Máy hàn MIG > Hàn bán tự động > 250A",
    createdAt: "2025-01-13T07:30:00.000Z",
    updatedAt: "2025-01-13T07:30:00.000Z",
  },
  {
    _id: "mock-011",
    level1: "Thiết bị hàn",
    level2: "Máy hàn MIG",
    level3: "Hàn bán tự động",
    level4: "350A",
    fullPath: "Thiết bị hàn > Máy hàn MIG > Hàn bán tự động > 350A",
    createdAt: "2025-01-13T07:40:00.000Z",
    updatedAt: "2025-01-13T07:40:00.000Z",
  },
  {
    _id: "mock-012",
    level1: "Thiết bị hàn",
    level2: "Máy hàn TIG",
    level3: "Hàn inox",
    level4: "200A",
    fullPath: "Thiết bị hàn > Máy hàn TIG > Hàn inox > 200A",
    createdAt: "2025-01-13T08:00:00.000Z",
    updatedAt: "2025-01-13T08:00:00.000Z",
  },

  // ── Thiết bị nén khí ─────────────────────────────────────────────
  {
    _id: "mock-013",
    level1: "Thiết bị nén khí",
    level2: "Máy nén khí",
    level3: "Trục vít",
    level4: "7.5kW",
    fullPath: "Thiết bị nén khí > Máy nén khí > Trục vít > 7.5kW",
    createdAt: "2025-01-14T08:00:00.000Z",
    updatedAt: "2025-01-14T08:00:00.000Z",
  },
  {
    _id: "mock-014",
    level1: "Thiết bị nén khí",
    level2: "Máy nén khí",
    level3: "Trục vít",
    level4: "15kW",
    fullPath: "Thiết bị nén khí > Máy nén khí > Trục vít > 15kW",
    createdAt: "2025-01-14T08:10:00.000Z",
    updatedAt: "2025-01-14T08:10:00.000Z",
  },
  {
    _id: "mock-015",
    level1: "Thiết bị nén khí",
    level2: "Máy nén khí",
    level3: "Piston",
    level4: "3kW",
    fullPath: "Thiết bị nén khí > Máy nén khí > Piston > 3kW",
    createdAt: "2025-01-14T08:20:00.000Z",
    updatedAt: "2025-01-14T08:20:00.000Z",
  },
];
