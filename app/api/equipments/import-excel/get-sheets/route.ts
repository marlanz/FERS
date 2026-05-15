import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

import connectDB from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    // Connect MongoDB
    await connectDB();

    const formData = await req.formData();

    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();

    const workbook = XLSX.read(bytes, {
      type: "array",
    });

    const sheets: string[] = workbook.SheetNames;

    // const sheetName = workbook.SheetNames[0];

    // const sheet = workbook.Sheets[sheetName];

    return NextResponse.json({
      // success: true,
      // inserted: result.length,
      // total: equipments.length,
      totalSheets: sheets,
    });
  } catch (err) {
    console.error("[UPLOAD_ERROR]", err);
  }
}
