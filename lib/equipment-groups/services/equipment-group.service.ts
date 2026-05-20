import connectDB from "@/lib/mongodb";
import { EquipmentGroupModel } from "@/models/equipment-group.model";
import {
  EquipmentGroupCreateSchema,
  EquipmentGroupUpdateSchema,
} from "@/lib/schemas/equipment-group.schema";
import type { EquipmentGroupRecord } from "@/types/equipment-group";

// ---------------------------------------------------------------------------
// Result union — mirrors lib/equipment/create-equipment.ts pattern
// ---------------------------------------------------------------------------

type Ok<T> = { ok: true; data: T };
type Err = {
  ok: false;
  status: 400 | 404 | 409 | 500;
  error: string;
  fieldErrors?: Record<string, string[] | undefined>;
};
type ServiceResult<T> = Ok<T> | Err;

// ---------------------------------------------------------------------------
// Helper — convert Mongoose lean doc → serialisable record
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toRecord(doc: any): EquipmentGroupRecord {
  return {
    _id: String(doc._id),
    level1: doc.level1,
    level2: doc.level2,
    level3: doc.level3,
    level4: doc.level4,
    fullPath: doc.fullPath,
    createdAt:
      doc.createdAt instanceof Date
        ? doc.createdAt.toISOString()
        : String(doc.createdAt),
    updatedAt:
      doc.updatedAt instanceof Date
        ? doc.updatedAt.toISOString()
        : String(doc.updatedAt),
  };
}

// ---------------------------------------------------------------------------
// listEquipmentGroups
// ---------------------------------------------------------------------------

export async function listEquipmentGroups(): Promise<
  ServiceResult<EquipmentGroupRecord[]>
> {
  try {
    await connectDB();
    const docs = await EquipmentGroupModel.find({})
      .sort({ level1: 1, level2: 1, level3: 1, level4: 1 })
      .lean();
    return { ok: true, data: docs.map(toRecord) };
  } catch (err) {
    console.error("[listEquipmentGroups]", err);
    return { ok: false, status: 500, error: "Failed to fetch equipment groups." };
  }
}

// ---------------------------------------------------------------------------
// getEquipmentGroupById
// ---------------------------------------------------------------------------

export async function getEquipmentGroupById(
  id: string,
): Promise<ServiceResult<EquipmentGroupRecord>> {
  try {
    await connectDB();
    const doc = await EquipmentGroupModel.findById(id).lean();
    if (!doc) {
      return { ok: false, status: 404, error: "Equipment group not found." };
    }
    return { ok: true, data: toRecord(doc) };
  } catch (err) {
    console.error("[getEquipmentGroupById]", err);
    return { ok: false, status: 500, error: "Failed to fetch equipment group." };
  }
}

// ---------------------------------------------------------------------------
// createEquipmentGroup
// ---------------------------------------------------------------------------

export async function createEquipmentGroup(
  input: unknown,
): Promise<ServiceResult<EquipmentGroupRecord>> {
  const parsed = EquipmentGroupCreateSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      status: 400,
      error: "Validation failed.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const payload = parsed.data;

  try {
    await connectDB();

    // Pre-flight duplicate check for a friendlier 409
    const existing = await EquipmentGroupModel.findOne(
      { fullPath: payload.fullPath },
      { _id: 1 },
    ).lean();

    if (existing) {
      return {
        ok: false,
        status: 409,
        error: `Nhóm thiết bị "${payload.fullPath}" đã tồn tại.`,
      };
    }

    const created = await EquipmentGroupModel.create(payload);
    return { ok: true, data: toRecord(created.toObject()) };
  } catch (err: unknown) {
    if (typeof err === "object" && err !== null && "code" in err && (err as { code: number }).code === 11000) {
      return { ok: false, status: 409, error: "Nhóm thiết bị này đã tồn tại." };
    }
    console.error("[createEquipmentGroup]", err);
    return { ok: false, status: 500, error: "Failed to create equipment group." };
  }
}

// ---------------------------------------------------------------------------
// updateEquipmentGroup
// ---------------------------------------------------------------------------

export async function updateEquipmentGroup(
  id: string,
  input: unknown,
): Promise<ServiceResult<EquipmentGroupRecord>> {
  const parsed = EquipmentGroupUpdateSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      status: 400,
      error: "Validation failed.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const payload = parsed.data;

  try {
    await connectDB();

    // Duplicate check excluding the current document
    const conflict = await EquipmentGroupModel.findOne(
      { fullPath: payload.fullPath, _id: { $ne: id } },
      { _id: 1 },
    ).lean();

    if (conflict) {
      return {
        ok: false,
        status: 409,
        error: `Nhóm thiết bị "${payload.fullPath}" đã tồn tại.`,
      };
    }

    const updated = await EquipmentGroupModel.findByIdAndUpdate(
      id,
      { $set: payload },
      { new: true, runValidators: true },
    ).lean();

    if (!updated) {
      return { ok: false, status: 404, error: "Equipment group not found." };
    }

    return { ok: true, data: toRecord(updated) };
  } catch (err: unknown) {
    if (typeof err === "object" && err !== null && "code" in err && (err as { code: number }).code === 11000) {
      return { ok: false, status: 409, error: "Nhóm thiết bị này đã tồn tại." };
    }
    console.error("[updateEquipmentGroup]", err);
    return { ok: false, status: 500, error: "Failed to update equipment group." };
  }
}

// ---------------------------------------------------------------------------
// deleteEquipmentGroup
// ---------------------------------------------------------------------------

export async function deleteEquipmentGroup(
  id: string,
): Promise<ServiceResult<{ deletedId: string }>> {
  try {
    await connectDB();
    const deleted = await EquipmentGroupModel.findByIdAndDelete(id).lean();
    if (!deleted) {
      return { ok: false, status: 404, error: "Equipment group not found." };
    }
    return { ok: true, data: { deletedId: id } };
  } catch (err) {
    console.error("[deleteEquipmentGroup]", err);
    return { ok: false, status: 500, error: "Failed to delete equipment group." };
  }
}
