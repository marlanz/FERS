import mongoose from "mongoose";
import { DeleteEquipmentSchema } from "@/lib/schemas/equipment.schema";
import connectDB from "@/lib/mongodb";
import { EquipmentModel } from "@/models/equipment.model";

export type DeleteEquipmentResult =
  | { ok: true; deletedCount: number }
  | {
      ok: false;
      status: 400 | 500;
      error: string;
      fieldErrors?: Record<string, string[] | undefined>;
    };

/** Server-only bulk delete by MongoDB `_id`. */
export async function deleteEquipments(
  input: unknown,
): Promise<DeleteEquipmentResult> {
  const parsed = DeleteEquipmentSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      status: 400,
      error: "Validation failed.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const uniqueIds = [...new Set(parsed.data.ids)];

  const objectIds: mongoose.Types.ObjectId[] = [];
  for (const id of uniqueIds) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        ok: false,
        status: 400,
        error: "One or more ids are not valid ObjectIds.",
      };
    }
    objectIds.push(new mongoose.Types.ObjectId(id));
  }

  try {
    await connectDB();

    const result = await EquipmentModel.deleteMany({
      _id: { $in: objectIds },
    });

    return { ok: true, deletedCount: result.deletedCount };
  } catch (err) {
    console.error("[deleteEquipments]", err);
    return {
      ok: false,
      status: 500,
      error: "Failed to delete equipment.",
    };
  }
}
