import { connection } from "next/server";

import { getAllEquipments } from "@/lib/data/equipments";
import DashboardContent from "@/components/DashboardContent";

export default async function DashboardPage() {
  await connection();

  const equipments = await getAllEquipments();

  return <DashboardContent initialData={equipments} />;
}
