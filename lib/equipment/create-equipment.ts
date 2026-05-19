import { EquipmentCreateSchema } from "@/lib/schemas/equipment.schema";
import connectDB from "@/lib/mongodb";
import { EquipmentModel } from "@/models/equipment.model";
import type { Equipment } from "@/types/equipment";

export type CreateEquipmentResult =
  | { ok: true; data: Equipment }
  | {
      ok: false;
      status: 400 | 409 | 500;
      error: string;
      fieldErrors?: Record<string, string[] | undefined>;
    };

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Server-only create logic — used by the API route (and reusable for Server Actions). */
export async function createEquipment(
  input: unknown,
): Promise<CreateEquipmentResult> {
  const parsed = EquipmentCreateSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      status: 400,
      error: "Validation failed.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const payload = parsed.data;
  const code = payload.equipmentCode;

  try {
    await connectDB();

    const existing = await EquipmentModel.findOne(
      {
        equipmentCode: {
          $regex: new RegExp(`^${escapeRegex(code)}$`, "i"),
        },
      },
      { _id: 1 },
    ).lean();

    if (existing) {
      return {
        ok: false,
        status: 409,
        error: `Mã thiết bị này: "${code}" đã tồn tại`,
      };
    }

    const maxNoDoc = await EquipmentModel.findOne(
      {},
      { no: 1 },
      { sort: { no: -1 } },
    ).lean<{ no: number }>();

    const nextNo = (maxNoDoc?.no ?? 0) + 1;

    const created = await EquipmentModel.create({
      ...payload,
      no: nextNo,
    });

    const doc = created.toObject();
    return { ok: true, data: doc as Equipment };
  } catch (err) {
    console.error("[createEquipment]", err);
    return {
      ok: false,
      status: 500,
      error: "Failed to create equipment.",
    };
  }
}
