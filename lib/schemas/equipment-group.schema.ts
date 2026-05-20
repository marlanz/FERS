import { z } from "zod";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const requiredStr = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} không được để trống`)
    .max(100, `${label} quá dài (tối đa 100 ký tự)`);

// ---------------------------------------------------------------------------
// Form schema — used by React Hook Form + zodResolver on the client
// ---------------------------------------------------------------------------

export const EquipmentGroupFormSchema = z.object({
  level1: requiredStr("Nhóm thiết bị"),
  level2: requiredStr("Loại thiết bị"),
  level3: requiredStr("Cấu hình"),
  level4: requiredStr("Công suất"),
});

export type EquipmentGroupFormValues = z.infer<typeof EquipmentGroupFormSchema>;

export const equipmentGroupFormDefaultValues: EquipmentGroupFormValues = {
  level1: "",
  level2: "",
  level3: "",
  level4: "",
};

// ---------------------------------------------------------------------------
// Server create schema — validates API input, adds fullPath
// ---------------------------------------------------------------------------

export const EquipmentGroupCreateSchema = EquipmentGroupFormSchema.transform(
  (data) => ({
    ...data,
    fullPath: `${data.level1} > ${data.level2} > ${data.level3} > ${data.level4}`,
  }),
);

export type EquipmentGroupCreatePayload = z.output<
  typeof EquipmentGroupCreateSchema
>;

// ---------------------------------------------------------------------------
// Server update schema — same shape, id passed separately by the route handler
// ---------------------------------------------------------------------------

export const EquipmentGroupUpdateSchema = EquipmentGroupFormSchema.transform(
  (data) => ({
    ...data,
    fullPath: `${data.level1} > ${data.level2} > ${data.level3} > ${data.level4}`,
  }),
);

export type EquipmentGroupUpdatePayload = z.output<
  typeof EquipmentGroupUpdateSchema
>;
