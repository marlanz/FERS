import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

import connectDB from "@/lib/mongodb";
import { EquipmentModel } from "@/models/equipment.model";
import { dropEquipmentIndexesExceptId } from "@/lib/equipment/dropEquipmentIndexesExceptId";

const STATUS_ENUM = new Set([
  "active",
  "inactive",
  "sold",
  "pending-investment",
  "maintenance",
  "inspection",
]);

function pickCode(row: Record<string, unknown>): string {
  const keys = [
    "equipmentCode",
    "eqCode",
    "EqCode",
    "EQ_CODE",
    "Mã thiết bị",
    "Ma thiet bi",
  ];
  for (const k of keys) {
    const v = row[k];
    if (v !== undefined && v !== null && String(v).trim() !== "") {
      return String(v).trim();
    }
  }
  return "";
}

function pickStatus(row: Record<string, unknown>): string {
  const raw = String(row.status ?? row.equipmentStatus ?? "")
    .trim()
    .toLowerCase();
  if (raw && STATUS_ENUM.has(raw)) return raw;
  return "active";
}

export async function POST(req: Request) {
  try {
    await connectDB();

    // Allow duplicate codes / no unique constraints — only `_id` index remains.
    await dropEquipmentIndexesExceptId(EquipmentModel.collection);

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const sheetIndex = Number(formData.get("sheetIndex") || 0);

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const workbook = XLSX.read(bytes, { type: "array" });
    const sheetName = workbook.SheetNames[sheetIndex];
    const sheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
      defval: "",
    });

    // No validation: insert every row as mapped; duplicates and “invalid” codes allowed.
    const equipments = rows.map((row, index) => ({
      no: Number(row.no ?? index + 1) || index + 1,

      equipmentName: String(row.equipmentName ?? row.eqName ?? "").trim(),

      equipmentCode: pickCode(row),

      equipmentGroup: {
        level1: String(row.groupLevel1 ?? "").trim(),
        level2: String(row.groupLevel2 ?? "").trim(),
        level3: String(row.groupLevel3 ?? "").trim(),
        level4: String(row.groupLevel4 ?? "").trim(),
      },

      organization: {
        legalEntity: String(row.legalEntity ?? "").trim(),
        factory: String(row.factory ?? "").trim(),
        workshop: String(row.workshop ?? "").trim(),
        layout: String(row.layout ?? "").trim(),
        workCenter: String(row.workCenter ?? "").trim(),
        area: String(row.area ?? "").trim(),
      },

      manufacturer: {
        country: String(row.country ?? "").trim(),
        brand: String(row.brand ?? "").trim(),
        model: String(row.model ?? "").trim(),
        produceYear: Number(row.produceYear ?? 0) || 0,
      },

      specification: String(row.specification ?? "").trim(),
      installationLocation: String(row.installationLocation ?? "").trim(),
      note: String(row.note ?? "").trim(),

      status: pickStatus(row),
    }));

    const result = await EquipmentModel.insertMany(equipments, {
      ordered: true,
    });

    return NextResponse.json({
      success: true,
      inserted: result.length,
      total: equipments.length,
    });
  } catch (error: unknown) {
    console.error("[UPLOAD_ERROR]", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Upload failed",
      },
      { status: 500 },
    );
  }
}
