import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { CalendarIcon, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { couponSchema, type CouponFormValues } from "./coupon.schema";
import type { AdminCoupon } from "@/services/couponService";
import { Label } from "@/components/ui/label";

interface CouponFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: AdminCoupon | null;
  onSubmit: (values: CouponFormValues) => void;
  isLoading?: boolean;
}

const CouponFormModal = ({
  open,
  onOpenChange,
  defaultValues,
  onSubmit,
  isLoading,
}: CouponFormModalProps) => {
  const isEdit = !!defaultValues?.id;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: "",
      description: "",
      discount_type: "PERCENTAGE",
      discount_value: 0,
      start_date: new Date(),
      end_date: new Date(Date.now() + 30 * 86400000),
      max_uses: null,
      min_purchase: null,
      is_active: true,
      is_global: false,
    },
  });

  useEffect(() => {
    if (open && defaultValues) {
      reset({
        code: defaultValues.code,
        description: defaultValues.description || "",
        discount_type: defaultValues.discount_type,
        discount_value: defaultValues.discount_value,
        start_date: new Date(defaultValues.start_date),
        end_date: new Date(defaultValues.end_date),
        max_uses: defaultValues.max_uses,
        min_purchase: defaultValues.min_purchase,
        is_active: defaultValues.is_active,
        is_global: defaultValues.is_global,
      });
    }
  }, [open, defaultValues, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Coupon" : "Add Coupon"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Code */}
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="code"
              control={control}
              render={({ field }) => (
                <div className="space-y-1">
                  <Label>Code *</Label>
                  <Input
                    {...field}
                    placeholder="SAVE20"
                    className="uppercase"
                  />
                  {errors.code && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.code.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Discount Type */}
            <Controller
              name="discount_type"
              control={control}
              render={({ field }) => (
                <div className="space-y-1">
                  <Label>Discount Type *</Label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                      <SelectItem value="FIXED">Fixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
          </div>

          {/* Description */}
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <div className="space-y-1">
                <Label>Description</Label>
                <Textarea {...field} placeholder="Coupon description..." />
              </div>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            {/* Discount Value */}
            <Controller
              name="discount_value"
              control={control}
              render={({ field }) => (
                <div className="space-y-1">
                  <Label>Discount Value*</Label>
                  <Input
                    type="number"
                    value={field.value}
                    onChange={(e) => field.onChange(+e.target.value)}
                  />
                  {errors.discount_value && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.discount_value.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Min Purchase */}

            <Controller
              name="min_purchase"
              control={control}
              render={({ field }) => (
                <div className="space-y-1">
                  <Label>Minimum Purchase</Label>
                  <Input
                    type="number"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(e.target.value ? +e.target.value : null)
                    }
                  />
                </div>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Start Date */}
            <Controller
              name="start_date"
              control={control}
              render={({ field }) => (
                <div className="space-y-1">
                  <Label className="block">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-full" />
                        {field.value
                          ? dayjs(field.value).format("Do MMM YYYY")
                          : "Pick date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            />

            {/* End Date */}
            <Controller
              name="end_date"
              control={control}
              render={({ field }) => (
                <div className="space-y-1">
                  <Label className="block">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value
                          ? dayjs(field.value).format("Do MMM YYYY")
                          : "Pick date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            />
          </div>

          {/* Checkboxes */}
          <div className="flex gap-6">
            <Controller
              name="is_active"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <Label>Active</Label>
                </div>
              )}
            />

            <Controller
              name="is_global"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <Label>Global (applies to all products)</Label>
                </div>
              )}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isEdit ? "Save Changes" : "Add Coupon"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CouponFormModal;
