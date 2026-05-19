import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

import connectDB from "@/lib/mongodb";
import { EquipmentModel } from "@/models/equipment.model";

import {
  normalizeEquipmentCode,
  parseEquipmentStatus,
} from "@/lib/utils/equipmentParser";

export async function POST(req: Request) {
  try {
    await connectDB();

    const formData = await req.formData();

    const file = formData.get("file") as File;
    const sheetIndex = Number(formData.get("sheetIndex") || 0);

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();

    const workbook = XLSX.read(bytes, {
      type: "array",
    });

    const sheetName = workbook.SheetNames[sheetIndex];

    const sheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(sheet, {
      defval: "",
    });

    const equipments = rows.map((row: any, index: number) => ({
      excelRow: index + 2, // +2 because Excel starts at row 1 and row 1 is header

      no: Number(row.no || index + 1),

      equipmentName: String(row.equipmentName || "").trim(),

      equipmentCode: normalizeEquipmentCode(row.equipmentCode),

      equipmentGroup: {
        level1: String(row.groupLevel1 || "").trim(),
        level2: String(row.groupLevel2 || "").trim(),
        level3: String(row.groupLevel3 || "").trim(),
        level4: String(row.groupLevel4 || "").trim(),
      },

      organization: {
        legalEntity: String(row.legalEntity || "").trim(),

        factory: String(row.factory || "").trim(),

        workshop: String(row.workshop || "").trim(),

        layout: String(row.layout || "").trim(),

        workCenter: String(row.workCenter || "").trim(),

        area: String(row.area || "").trim(),
      },

      manufacturer: {
        country: String(row.country || "").trim(),

        brand: String(row.brand || "").trim(),

        model: String(row.model || "").trim(),

        produceYear: Number(row.produceYear || 0),
      },

      specification: String(row.specification || "").trim(),

      installationLocation: String(row.installationLocation || "").trim(),

      note: String(row.note || "").trim(),

      status: parseEquipmentStatus(row.equipmentCode),
    }));

    try {
      const result = await EquipmentModel.insertMany(equipments, {
        ordered: false,
      });

      return NextResponse.json({
        success: true,
        inserted: result.length,
        total: equipments.length,
        skippedRows: [],
      });
    } catch (error: any) {
      // Mongo Bulk Write Error
      if (error?.writeErrors) {
        const skippedRows = error.writeErrors.map((err: any) => {
          const failedDoc = err.err.op;

          return {
            row: failedDoc.excelRow,
            equipmentCode: failedDoc.equipmentCode,
            equipmentName: failedDoc.equipmentName,
            reason: err.errmsg,
          };
        });

        const inserted = equipments.length - skippedRows.length;

        return NextResponse.json({
          success: true,
          inserted,
          total: equipments.length,
          skippedRows,
        });
      }

      throw error;
    }
  } catch (error: any) {
    console.error("[UPLOAD_ERROR]", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Upload failed",
      },
      {
        status: 500,
      },
    );
  }
}
