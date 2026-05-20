import { NextRequest, NextResponse } from "next/server";
import {
  getEquipmentGroupById,
  updateEquipmentGroup,
  deleteEquipmentGroup,
} from "@/lib/equipment-groups/services/equipment-group.service";
import type {
  ApiErrorResponse,
  GetEquipmentGroupResponse,
  UpdateEquipmentGroupResponse,
  DeleteEquipmentGroupResponse,
} from "@/lib/equipment-groups/api-types";

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/equipment-groups/[id]
export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;

  const result = await getEquipmentGroupById(id);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error } satisfies ApiErrorResponse,
      { status: result.status },
    );
  }

  return NextResponse.json({ data: result.data } satisfies GetEquipmentGroupResponse);
}

// PATCH /api/equipment-groups/[id]
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Request body is not valid JSON." } satisfies ApiErrorResponse,
      { status: 400 },
    );
  }

  const result = await updateEquipmentGroup(id, body);

  if (!result.ok) {
    return NextResponse.json(
      {
        error: result.error,
        ...(result.fieldErrors ? { fieldErrors: result.fieldErrors } : {}),
      } satisfies ApiErrorResponse,
      { status: result.status },
    );
  }

  return NextResponse.json({ data: result.data } satisfies UpdateEquipmentGroupResponse);
}

// DELETE /api/equipment-groups/[id]
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;

  const result = await deleteEquipmentGroup(id);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error } satisfies ApiErrorResponse,
      { status: result.status },
    );
  }

  return NextResponse.json(
    { deletedId: result.data.deletedId } satisfies DeleteEquipmentGroupResponse,
  );
}
