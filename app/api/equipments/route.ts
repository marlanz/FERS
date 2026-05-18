import { NextRequest, NextResponse } from "next/server";
import { EquipmentModel } from "@/models/equipment.model";
import connectDB from "@/lib/mongodb";
import { createEquipment } from "@/lib/equipment/create-equipment";
import type {
  ApiErrorResponse,
  CreateEquipmentSuccessResponse,
} from "@/lib/equipment/api-types";

// GET /api/equipments — list all equipment
export async function GET() {
  try {
    await connectDB();
    const equipments = await EquipmentModel.find({}).lean();
    return NextResponse.json(equipments);
  } catch (error) {
    console.error("[GET /api/equipments]", error);
    return NextResponse.json(
      { error: "Failed to fetch equipments" } satisfies ApiErrorResponse,
      { status: 500 },
    );
  }
}

// POST /api/equipments — create a single equipment record
export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Request body is not valid JSON." } satisfies ApiErrorResponse,
        { status: 400 },
      );
    }

    const result = await createEquipment(body);

    if (!result.ok) {
      return NextResponse.json(
        {
          error: result.error,
          ...(result.fieldErrors ? { fieldErrors: result.fieldErrors } : {}),
        } satisfies ApiErrorResponse,
        { status: result.status },
      );
    }

    return NextResponse.json(
      { data: result.data } satisfies CreateEquipmentSuccessResponse,
      { status: 201 },
    );
  } catch (error) {
    console.error("[POST /api/equipments]", error);
    return NextResponse.json(
      { error: "Failed to create equipment." } satisfies ApiErrorResponse,
      { status: 500 },
    );
  }
}
