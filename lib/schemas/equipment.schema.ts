import { z } from "zod";

/** Client form schema — only fields exposed in the create modal. */
/** Form + client validation schema (react-hook-form / zodResolver). */
export const EquipmentSchema = z.object({
  equipmentName: z
    .string()
    .trim()
    .min(1, "Equipment name is required")
    .max(200, "Equipment name is too long"),
  equipmentCode: z
    .string()
    .trim()
    .min(1, "Equipment code is required")
    .max(64, "Equipment code is too long"),
  equipmentGroup: z.object({
    level1: z.string().trim(),
    level2: z.string().trim(),
    level3: z.string().trim(),
    level4: z.string().trim(),
  }),
  organization: z.object({
    factory: z.string().trim(),
    workshop: z.string().trim(),
  }),
  manufacturer: z.object({
    brand: z.string().trim(),
    model: z.string().trim(),
  }),
  specification: z.string().trim(),
  installationLocation: z.string().trim(),
  note: z.string().trim(),
});

export const EquipmentFormSchema = EquipmentSchema;

export type EquipmentFormValues = z.infer<typeof EquipmentSchema>;

export const equipmentFormDefaultValues: EquipmentFormValues = {
  equipmentName: "",
  equipmentCode: "",
  equipmentGroup: { level1: "", level2: "", level3: "", level4: "" },
  organization: { factory: "", workshop: "" },
  manufacturer: { brand: "", model: "" },
  specification: "",
  installationLocation: "",
  note: "",
};

const equipmentStatusSchema = z.enum([
  "active",
  "maintenance",
  "inactive",
  "inspection",
]);

/**
 * Server schema — validates API input and normalizes to the MongoDB document shape.
 * Shared by the route handler so client and server never diverge on shape.
 */
export const EquipmentCreateSchema = EquipmentFormSchema.transform((data) => ({
  equipmentName: data.equipmentName,
  equipmentCode: data.equipmentCode,
  equipmentGroup: {
    level1: data.equipmentGroup.level1,
    level2: data.equipmentGroup.level2,
    level3: data.equipmentGroup.level3,
    level4: data.equipmentGroup.level4,
  },
  organization: {
    legalEntity: "",
    factory: data.organization.factory,
    workshop: data.organization.workshop,
    layout: "",
    workCenter: "",
    area: "",
  },
  manufacturer: {
    country: "",
    brand: data.manufacturer.brand,
    model: data.manufacturer.model,
    produceYear: null as number | null,
  },
  specification: data.specification,
  installationLocation: data.installationLocation,
  note: data.note,
  status: "active" as z.infer<typeof equipmentStatusSchema>,
}));

export type EquipmentCreateInput = z.input<typeof EquipmentCreateSchema>;
export type EquipmentCreatePayload = z.output<typeof EquipmentCreateSchema>;
