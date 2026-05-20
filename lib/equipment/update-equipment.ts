import mongoose from "mongoose";
import { EquipmentFormSchema } from "@/lib/schemas/equipment.schema";
import connectDB from "@/lib/mongodb";
import { EquipmentModel } from "@/models/equipment.model";
import type { Equipment } from "@/types/equipment";

export type UpdateEquipmentResult =
  | { ok: true; data: Equipment }
  | {
      ok: false;
      status: 400 | 404 | 409 | 500;
      error: string;
      fieldErrors?: Record<string, string[] | undefined>;
    };

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Server-only update by MongoDB `_id`. */
export async function updateEquipment(
  id: string,
  input: unknown,
): Promise<UpdateEquipmentResult> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { ok: false, status: 400, error: "Invalid equipment id." };
  }

  const parsed = EquipmentFormSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      status: 400,
      error: "Validation failed.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const form = parsed.data;

  try {
    await connectDB();

    const objectId = new mongoose.Types.ObjectId(id);
    const existing = await EquipmentModel.findById(objectId).lean<Equipment>();

    if (!existing) {
      return { ok: false, status: 404, error: "Equipment not found." };
    }

    const code = form.equipmentCode;
    const duplicate = await EquipmentModel.findOne(
      {
        _id: { $ne: objectId },
        equipmentCode: {
          $regex: new RegExp(`^${escapeRegex(code)}$`, "i"),
        },
      },
      { _id: 1 },
    ).lean();

    if (duplicate) {
      return {
        ok: false,
        status: 409,
        error: `Mã thiết bị này: "${code}" đã tồn tại`,
      };
    }

    const updated = await EquipmentModel.findByIdAndUpdate(
      objectId,
      {
        equipmentName: form.equipmentName,
        equipmentCode: code,
        equipmentGroup: {
          level1: form.equipmentGroup.level1,
          level2: form.equipmentGroup.level2,
          level3: form.equipmentGroup.level3,
          level4: form.equipmentGroup.level4,
        },
        organization: {
          legalEntity: existing.organization?.legalEntity ?? "",
          factory: form.organization.factory,
          workshop: form.organization.workshop,
          layout: existing.organization?.layout ?? "",
          workCenter: existing.organization?.workCenter ?? "",
          area: existing.organization?.area ?? "",
        },
        manufacturer: {
          country: existing.manufacturer?.country ?? "",
          brand: form.manufacturer.brand,
          model: form.manufacturer.model,
          produceYear: existing.manufacturer?.produceYear ?? null,
        },
        specification: form.specification,
        installationLocation: form.installationLocation,
        note: form.note,
      },
      { new: true, runValidators: true },
    ).lean<Equipment>();

    if (!updated) {
      return { ok: false, status: 404, error: "Equipment not found." };
    }

    return { ok: true, data: updated };
  } catch (err) {
    console.error("[updateEquipment]", err);
    return {
      ok: false,
      status: 500,
      error: "Failed to update equipment.",
    };
  }
}
