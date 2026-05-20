/**
 * Plain TypeScript type for an Equipment Group document returned from the API.
 * Dates are serialised to ISO strings so this is safe to use in Client Components.
 */
export interface EquipmentGroupRecord {
  _id: string;
  level1: string; // Nhóm thiết bị
  level2: string; // Loại thiết bị
  level3: string; // Cấu hình
  level4: string; // Công suất
  fullPath: string; // "${level1} > ${level2} > ${level3} > ${level4}"
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

/** Values selected from the cascading select in the Equipment form. */
export interface EquipmentGroupSelection {
  level1: string;
  level2: string;
  level3: string;
  level4: string;
}
