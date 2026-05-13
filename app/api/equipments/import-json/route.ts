import { NextRequest, NextResponse } from "next/server";
import { EquipmentModel } from "@/models/equipment.model";
import connectDB from "@/lib/mongodb";
import { sanitizeBatch, parseJsonText } from "@/lib/utils/equipmentSanitizer";
import type { SanitizedEquipment } from "@/lib/utils/equipmentSanitizer";

// ─── Response shape ───────────────────────────────────────────────────────────

export interface ImportSummary {
  inserted: number;
  skipped: number;
  errors: number;
  errorDetails?: { index: number; equipmentCode?: string; messages: string[] }[];
}

// ─── Server-side sanitizer re-run (defence-in-depth) ─────────────────────────

function revalidateRecord(r: SanitizedEquipment): boolean {
  return (
    typeof r.equipmentName === "string" &&
    r.equipmentName.trim().length > 0 &&
    typeof r.equipmentCode === "string" &&
    r.equipmentCode.trim().length > 0
  );
}

// ─── POST /api/equipments/import-json ────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();

    // ── Parse body ──
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Request body is not valid JSON." },
        { status: 400 }
      );
    }

    // Accept either a raw JSON text string or a pre-parsed array
    let rawArray: unknown[];
    if (typeof body === "string") {
      try {
        rawArray = parseJsonText(body);
      } catch (e) {
        return NextResponse.json(
          { error: e instanceof Error ? e.message : "Failed to parse JSON string." },
          { status: 400 }
        );
      }
    } else if (Array.isArray(body)) {
      rawArray = body;
    } else {
      return NextResponse.json(
        { error: "Request body must be a JSON array." },
        { status: 400 }
      );
    }

    if (rawArray.length === 0) {
      return NextResponse.json(
        { error: "The JSON array is empty — nothing to import." },
        { status: 400 }
      );
    }

    // ── Server-side sanitize (mirrors client) ──
    const { valid, errors } = sanitizeBatch(rawArray);

    if (valid.length === 0) {
      const summary: ImportSummary = {
        inserted: 0,
        skipped: 0,
        errors: errors.length,
        errorDetails: errors,
      };
      return NextResponse.json(summary, { status: 422 });
    }

    // ── Fetch codes that already exist in DB ──
    const incomingCodes = valid.map((r) => r.equipmentCode.toUpperCase());
    const existingDocs = await EquipmentModel.find(
      { equipmentCode: { $in: incomingCodes } },
      { equipmentCode: 1, _id: 0 }
    ).lean<{ equipmentCode: string }[]>();

    const existingCodes = new Set(
      existingDocs.map((d) => d.equipmentCode.toUpperCase())
    );

    const toInsert = valid.filter(
      (r) => !existingCodes.has(r.equipmentCode.toUpperCase()) && revalidateRecord(r)
    );
    const dbSkipped = valid.length - toInsert.length;

    // ── insertMany with ordered:false to survive partial failures ──
    let inserted = 0;
    let insertFailed = 0;

    if (toInsert.length > 0) {
      // Auto-assign `no` field from current max
      const maxNoDoc = await EquipmentModel.findOne(
        {},
        { no: 1 },
        { sort: { no: -1 } }
      ).lean<{ no: number }>();
      let nextNo = (maxNoDoc?.no ?? 0) + 1;

      const docs = toInsert.map((r) => ({
        ...r,
        no: r.no && r.no > 0 ? r.no : nextNo++,
        equipmentCode: r.equipmentCode.trim(),
        equipmentName: r.equipmentName.trim(),
      }));

      try {
        const result = await EquipmentModel.insertMany(docs, {
          ordered: false,
        });
        inserted = result.length;
      } catch (err: unknown) {
        // BulkWriteError — some docs may have inserted
        if (
          err !== null &&
          typeof err === "object" &&
          "insertedDocs" in err &&
          Array.isArray((err as { insertedDocs: unknown[] }).insertedDocs)
        ) {
          inserted = (err as { insertedDocs: unknown[] }).insertedDocs.length;
          insertFailed = toInsert.length - inserted;
        } else {
          // Unknown error
          console.error("[import-json] insertMany error:", err);
          return NextResponse.json(
            { error: "Database insert failed." },
            { status: 500 }
          );
        }
      }
    }

    const summary: ImportSummary = {
      inserted,
      skipped: dbSkipped,
      errors: errors.length + insertFailed,
      errorDetails: errors.length > 0 ? errors : undefined,
    };

    return NextResponse.json(summary, { status: 200 });
  } catch (err) {
    console.error("[POST /api/equipments/import-json]", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
