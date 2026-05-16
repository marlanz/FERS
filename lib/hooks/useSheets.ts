import { useMutation } from "@tanstack/react-query";

async function getSheetsFromFile(file: File): Promise<string[]> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/equipments/import-excel/get-sheets", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Failed to get sheets: ${res.statusText}`);
  }

  const data = await res.json();
  return data.sheets;
}

export function useGetSheetsMutation() {
  return useMutation({
    mutationFn: getSheetsFromFile,
  });
}
