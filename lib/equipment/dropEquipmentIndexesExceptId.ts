import type { Collection } from "mongodb";

/**
 * Drops every index on the equipments collection except the default `_id` index.
 * Required when you need duplicate `equipmentCode` (or other) values in MongoDB.
 */
export async function dropEquipmentIndexesExceptId(
  collection: Collection,
): Promise<void> {
  await collection.dropIndexes();
}
