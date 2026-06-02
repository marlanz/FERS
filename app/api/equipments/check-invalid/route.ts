// app/api/equipments/check-invalid-codes/route.ts

import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

const PLANNED_VALUES = [
  "",
  "ĐẦU TƯ",
  "DAU TU",
  "DỰ KIẾN ĐẦU TƯ",
  "DU KIEN DAU TU",
  "N/A",
  "-",
];

function analyzeEquipmentCode(raw: unknown) {
  const original = String(raw || "").trim();

  const normalized = original.toUpperCase();

  // planned / empty
  if (PLANNED_VALUES.includes(normalized)) {
    return {
      type: "planned",
      valid: false,
    };
  }

  // detect all possible equipment codes
  const detectedCodes = normalized.match(/[A-Z]\d{6,}/g) || [];

  // multiple codes
  if (detectedCodes.length > 1) {
    return {
      type: "multiple",
      valid: false,
      detectedCodes,
    };
  }

  // invalid format
  if (detectedCodes.length === 0) {
    return {
      type: "invalid",
      valid: false,
    };
  }

  return {
    type: "valid",
    valid: true,
    normalizedCode: detectedCodes[0],
  };
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;

    const sheetIndex = Number(formData.get("sheetIndex") || 0);

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: "No file uploaded",
        },
        {
          status: 400,
        },
      );
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

    const invalidRows: any[] = [];

    const seenCodes = new Map<string, number[]>();

    rows.forEach((row: any, index: number) => {
      const rowNumber = index + 2;

      const rawCode = row.equipmentCode;

      const result = analyzeEquipmentCode(rawCode);

      // collect invalid rows
      if (!result.valid) {
        invalidRows.push({
          row: rowNumber,
          equipmentName: row.equipmentName || "",
          equipmentCode: rawCode,
          type: result.type,
          detectedCodes: "detectedCodes" in result ? result.detectedCodes : [],
        });

        return;
      }

      // duplicate checking — at this point result.valid === true
      const validResult = result as { type: "valid"; valid: true; normalizedCode: string };
      const code = validResult.normalizedCode;

      if (!seenCodes.has(code)) {
        seenCodes.set(code, []);
      }

      seenCodes.get(code)!.push(rowNumber);
    });

    // detect duplicates
    const duplicateCodes = Array.from(seenCodes.entries())
      .filter(([_, rows]) => rows.length > 1)
      .map(([code, rows]) => ({
        equipmentCode: code,
        rows,
        count: rows.length,
      }));

    return NextResponse.json({
      success: true,

      summary: {
        totalRows: rows.length,
        invalidRows: invalidRows.length,
        duplicateCodes: duplicateCodes.length,
      },

      invalidRows,

      duplicateCodes,
    });
  } catch (error: any) {
    console.error("[CHECK_INVALID_CODES]", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to analyze Excel",
      },
      {
        status: 500,
      },
    );
  }
}
