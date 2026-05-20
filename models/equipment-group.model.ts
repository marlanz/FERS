import mongoose, { Schema, model, models } from "mongoose";

const EquipmentGroupSchema = new Schema(
  {
    level1: { type: String, required: true, trim: true }, // Nhóm thiết bị
    level2: { type: String, required: true, trim: true }, // Loại thiết bị
    level3: { type: String, required: true, trim: true }, // Cấu hình
    level4: { type: String, required: true, trim: true }, // Công suất

    /**
     * Denormalised unique key: "${level1} > ${level2} > ${level3} > ${level4}"
     * Enforces no-duplicate at DB level — the service also checks this before
     * attempting a write to produce a friendlier 409 response.
     */
    fullPath: { type: String, required: true, unique: true, trim: true },
  },
  {
    timestamps: true, // createdAt + updatedAt
  },
);

// Compound unique index as an additional safety net
EquipmentGroupSchema.index(
  { level1: 1, level2: 1, level3: 1, level4: 1 },
  { unique: true },
);

export const EquipmentGroupModel =
  models.EquipmentGroup || model("EquipmentGroup", EquipmentGroupSchema);
