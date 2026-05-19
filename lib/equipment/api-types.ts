import type { Equipment } from "@/types/equipment";

export interface ApiErrorResponse {
  error: string;
  fieldErrors?: Record<string, string[] | undefined>;
}

export interface CreateEquipmentSuccessResponse {
  data: Equipment;
}

export type CreateEquipmentResponse =
  | CreateEquipmentSuccessResponse
  | ApiErrorResponse;

export interface DeleteEquipmentSuccessResponse {
  deletedCount: number;
}

export type DeleteEquipmentResponse =
  | DeleteEquipmentSuccessResponse
  | ApiErrorResponse;
