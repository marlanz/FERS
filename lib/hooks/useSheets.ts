import { useMutation } from "@tanstack/react-query";

export function useGetSheetsMutation() {
  return useMutation({
    mutationFn: async (file: File): Promise<string[]> => {
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
    },
  });
}
