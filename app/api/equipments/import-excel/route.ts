import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

import connectDB from "@/lib/mongodb";
import { EquipmentModel } from "@/models/equipment.model";

export async function POST(req: Request) {
  try {
    // Connect MongoDB
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

    // IMPORTANT
    // range: 0 nếu header nằm ngay dòng đầu
    const rows = XLSX.utils.sheet_to_json(sheet, {
      defval: "",
    });

    const equipments = rows.map((row: any, index: number) => ({
      no: Number(row.no || index + 1),

      equipmentName: String(row.equipmentName || "").trim(),

      equipmentCode: String(row.equipmentCode || "").trim(),

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

      status: "active",
    }));

    // Filter out equipments with duplicate equipmentCode (except those starting with 'Đầu tư')
    const codesToCheck = equipments
      .filter(eq => eq.equipmentCode && !eq.equipmentCode.startsWith('Đầu tư'))
      .map(eq => eq.equipmentCode);

    // Find existing codes in DB
    const existingDocs = codesToCheck.length > 0
      ? await EquipmentModel.find({ equipmentCode: { $in: codesToCheck } }, { equipmentCode: 1 }).lean()
      : [];
    const existingCodes = new Set(existingDocs.map(doc => doc.equipmentCode));

    // Filter equipments to insert
    const toInsert = equipments.filter(eq => {
      if (!eq.equipmentCode) return true;
      if (eq.equipmentCode.startsWith('Đầu tư')) return true;
      return !existingCodes.has(eq.equipmentCode);
    });
    const skippedCodes = equipments
      .filter(eq => eq.equipmentCode && !eq.equipmentCode.startsWith('Đầu tư') && existingCodes.has(eq.equipmentCode))
      .map(eq => eq.equipmentCode);

    // Save MongoDB
    let result = [];
    if (toInsert.length > 0) {
      result = await EquipmentModel.insertMany(toInsert, {
        ordered: false,
      });
    }

    return NextResponse.json({
      success: true,
      inserted: result.length,
      total: equipments.length,
      skippedCodes,
      // sheetName: sheet,
    });
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
