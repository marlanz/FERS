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

/** Server-only bulk delete by equipment codes. */
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

  const codes = [...new Set(parsed.data.equipmentCodes)];

  try {
    await connectDB();

    const result = await EquipmentModel.deleteMany({
      equipmentCode: { $in: codes },
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
