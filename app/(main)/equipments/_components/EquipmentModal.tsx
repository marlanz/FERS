"use client";

import { useCallback, useEffect, type ReactNode } from "react";
import {
  useForm,
  useFormState,
  type FieldPath,
  type UseFormSetError,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Cpu, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import {
  EquipmentSchema,
  equipmentFormDefaultValues,
  type EquipmentFormValues,
} from "@/lib/schemas/equipment.schema";
import type {
  ApiErrorResponse,
  CreateEquipmentSuccessResponse,
} from "@/lib/equipment/api-types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface EquipmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called after a successful create — use to invalidate/refetch list data. */
  onSuccess?: () => void;
}

function FormSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="">
      <legend className="text-xs font-semibold tracking-wide text-primary uppercase">
        {title}
      </legend>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

function applyServerFieldErrors(
  fieldErrors: Record<string, string[] | undefined>,
  setError: UseFormSetError<EquipmentFormValues>,
) {
  for (const [key, messages] of Object.entries(fieldErrors)) {
    const message = messages?.[0];
    if (!message) continue;
    setError(key as FieldPath<EquipmentFormValues>, { message });
  }
}

/**
 * Client-only create modal. Data mutation goes through POST /api/equipments;
 * the route delegates to shared server-side createEquipment() with Zod validation.
 */
export default function EquipmentModal({
  open,
  onOpenChange,
  onSuccess,
}: EquipmentModalProps) {
  const form = useForm<EquipmentFormValues>({
    resolver: zodResolver(EquipmentSchema),
    defaultValues: equipmentFormDefaultValues,
    mode: "onBlur",
  });

  const { isSubmitting, errors, isValid } = useFormState({
    control: form.control,
  });

  useEffect(() => {
    if (open) {
      form.reset(equipmentFormDefaultValues);
    }
  }, [open, form]);

  const onSubmit = useCallback(
    async (values: EquipmentFormValues) => {
      try {
        const res = await fetch("/api/equipments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const json = (await res.json()) as
          | CreateEquipmentSuccessResponse
          | ApiErrorResponse;

        if (!res.ok) {
          const err = json as ApiErrorResponse;
          if (err.fieldErrors) {
            applyServerFieldErrors(err.fieldErrors, form.setError);
          }
          toast.error(err.error ?? "Failed to create equipment.");
          return;
        }

        toast.success("Equipment created successfully.");
        form.reset(equipmentFormDefaultValues);
        onOpenChange(false);
        onSuccess?.();
      } catch {
        toast.error("Network error. Please try again.");
      }
    },
    [form, onOpenChange, onSuccess],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-h-[min(90vh,800px)] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl"
        onInteractOutside={(e) => {
          if (isSubmitting) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (isSubmitting) e.preventDefault();
        }}
      >
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Cpu className="size-4" aria-hidden />
            </div>
            <div>
              <DialogTitle>Tạo thiết bị cơ khí mới</DialogTitle>
              <DialogDescription>
                Create a new equipment record. Fields marked with * are
                required.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 overscroll-contain">
          <Form {...form}>
            <form
              id="equipment-create-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
              noValidate
            >
              <FormSection title="Thông tin cơ bản">
                <FormField
                  control={form.control}
                  name="equipmentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Tên MMTB
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. CNC Milling Machine"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      {/* <FormMessage /> */}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="equipmentCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Mã MMTB
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. EQ-001"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      {/* <FormMessage /> */}
                    </FormItem>
                  )}
                />
              </FormSection>

              {/* ✅ Shared error message */}
              {(errors.equipmentName || errors.equipmentCode) && (
                <p className="text-sm text-destructive">
                  {errors.equipmentName?.message ||
                    errors.equipmentCode?.message}
                </p>
              )}

              <FormSection title="Nhóm MMTB">
                {(
                  [
                    ["level1", "Nhóm Thiết bị"],
                    ["level2", "Loại Thiết bị"],
                    ["level3", "Cấu hình"],
                    ["level4", "Công suất"],
                  ] as const
                ).map(([name, label]) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={`equipmentGroup.${name}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                          <Input autoComplete="off" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </FormSection>

              <FormSection title="Organization">
                <FormField
                  control={form.control}
                  name="organization.factory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nhà máy</FormLabel>
                      <FormControl>
                        <Input autoComplete="off" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="organization.workshop"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Xưởng/Layout</FormLabel>
                      <FormControl>
                        <Input autoComplete="off" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormSection>

              <FormSection title="Nhóm nhà sản xuất">
                <FormField
                  control={form.control}
                  name="manufacturer.brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hãng sản xuất</FormLabel>
                      <FormControl>
                        <Input autoComplete="off" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="manufacturer.model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      <FormControl>
                        <Input autoComplete="off" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormSection>

              <FormSection title="Các thông tin khác">
                <FormField
                  control={form.control}
                  name="specification"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Đặc tính kỹ thuật</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Technical specifications…"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="installationLocation"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Vị trí lắp đặt</FormLabel>
                      <FormControl>
                        <Input autoComplete="off" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Ghi chú</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Optional notes…"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormSection>
            </form>
          </Form>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="equipment-create-form"
            disabled={isSubmitting}
            className="min-w-35"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" aria-hidden />
                Saving…
              </>
            ) : (
              "Save Equipment"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
