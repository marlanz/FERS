import { NextRequest, NextResponse } from "next/server";
import { updateEquipment } from "@/lib/equipment/update-equipment";
import type {
  ApiErrorResponse,
  UpdateEquipmentSuccessResponse,
} from "@/lib/equipment/api-types";

type RouteContext = { params: Promise<{ id: string }> };

// PATCH /api/equipments/:id — update a single equipment record
export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Request body is not valid JSON." } satisfies ApiErrorResponse,
        { status: 400 },
      );
    }

    const result = await updateEquipment(id, body);

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
      { data: result.data } satisfies UpdateEquipmentSuccessResponse,
    );
  } catch (error) {
    console.error("[PATCH /api/equipments/:id]", error);
    return NextResponse.json(
      { error: "Failed to update equipment." } satisfies ApiErrorResponse,
      { status: 500 },
    );
  }
}
