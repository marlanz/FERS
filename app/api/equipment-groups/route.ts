import { NextRequest, NextResponse } from "next/server";
import {
  listEquipmentGroups,
  createEquipmentGroup,
} from "@/lib/equipment-groups/services/equipment-group.service";
import type {
  ApiErrorResponse,
  ListEquipmentGroupsResponse,
  CreateEquipmentGroupResponse,
} from "@/lib/equipment-groups/api-types";

// GET /api/equipment-groups — list all
export async function GET() {
  const result = await listEquipmentGroups();

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error } satisfies ApiErrorResponse,
      { status: result.status },
    );
  }

  return NextResponse.json({ data: result.data } satisfies ListEquipmentGroupsResponse);
}

// POST /api/equipment-groups — create one
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Request body is not valid JSON." } satisfies ApiErrorResponse,
      { status: 400 },
    );
  }

  const result = await createEquipmentGroup(body);

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
    { data: result.data } satisfies CreateEquipmentGroupResponse,
    { status: 201 },
  );
}
