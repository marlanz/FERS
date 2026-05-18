import { NextRequest, NextResponse } from "next/server";
import { EquipmentModel } from "@/models/equipment.model";
import connectDB from "@/lib/mongodb";
import { sanitizeRecord } from "@/lib/utils/equipmentSanitizer";

// GET /api/equipments
// Returns all equipment documents as JSON array
export async function GET() {
  try {
    await connectDB();
    const equipments = await EquipmentModel.find({}).lean();
    return NextResponse.json(equipments);
  } catch (error) {
    console.error("[GET /api/equipments]", error);
    return NextResponse.json(
      { error: "Failed to fetch equipments" },
      { status: 500 },
    );
  }
}

// POST /api/equipments
// Creates a single equipment record
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Request body is not valid JSON." },
        { status: 400 },
      );
    }

    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return NextResponse.json(
        { error: "Request body must be a single equipment object." },
        { status: 400 },
      );
    }

    const { data, error } = sanitizeRecord(body, 0);
    if (error || !data) {
      return NextResponse.json(
        { error: "Validation failed.", messages: error?.messages ?? [] },
        { status: 400 },
      );
    }

    const code = data.equipmentCode.trim();
    const existing = await EquipmentModel.findOne(
      { equipmentCode: { $regex: new RegExp(`^${code.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") } },
      { _id: 1 },
    ).lean();

    if (existing) {
      return NextResponse.json(
        { error: `Equipment code "${code}" already exists.` },
        { status: 409 },
      );
    }

    const maxNoDoc = await EquipmentModel.findOne(
      {},
      { no: 1 },
      { sort: { no: -1 } },
    ).lean<{ no: number }>();
    const nextNo = data.no && data.no > 0 ? data.no : (maxNoDoc?.no ?? 0) + 1;

    const created = await EquipmentModel.create({
      ...data,
      no: nextNo,
      equipmentCode: code,
      equipmentName: data.equipmentName.trim(),
    });

    return NextResponse.json(created.toObject(), { status: 201 });
  } catch (error) {
    console.error("[POST /api/equipments]", error);
    return NextResponse.json(
      { error: "Failed to create equipment." },
      { status: 500 },
    );
  }
}
