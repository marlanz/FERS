import type { EquipmentFormValues } from "@/lib/schemas/equipment.schema";
import type { Equipment } from "@/types/equipment";

export function equipmentToFormValues(equipment: Equipment): EquipmentFormValues {
  return {
    equipmentName: equipment.equipmentName ?? "",
    equipmentCode: equipment.equipmentCode ?? "",
    equipmentGroup: {
      level1: equipment.equipmentGroup?.level1 ?? "",
      level2: equipment.equipmentGroup?.level2 ?? "",
      level3: equipment.equipmentGroup?.level3 ?? "",
      level4: equipment.equipmentGroup?.level4 ?? "",
    },
    organization: {
      factory: equipment.organization?.factory ?? "",
      workshop: equipment.organization?.workshop ?? "",
    },
    manufacturer: {
      brand: equipment.manufacturer?.brand ?? "",
      model: equipment.manufacturer?.model ?? "",
    },
    specification: equipment.specification ?? "",
    installationLocation: equipment.installationLocation ?? "",
    note: equipment.note ?? "",
  };
}
