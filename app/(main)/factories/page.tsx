"use client";

import { Equipment } from "@/types/equipment";
import { useState } from "react";

export default function UploadForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Equipment[]>([]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);

    try {
      setLoading(true);

      const res = await fetch("/api/equipments/import-excel", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      console.log(data.equipments);

      setResult(data.equipments || []);
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="border rounded-xl p-4 bg-white">
        <input type="file" accept=".xlsx,.xls" onChange={handleUpload} />

        {loading && <p className="mt-2 text-sm">Reading Excel...</p>}
      </div>

      {result.length > 0 && (
        <div className="border rounded-xl bg-white overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">#</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Code</th>
                <th className="p-2 text-left">Factory</th>
                <th className="p-2 text-left">Brand</th>
              </tr>
            </thead>

            <tbody>
              {result.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{item.equipmentName}</td>
                  <td className="p-2">{item.equipmentCode}</td>
                  <td className="p-2">{item.organization?.factory}</td>
                  <td className="p-2">{item.manufacturer?.brand}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
