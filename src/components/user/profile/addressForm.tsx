import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { isValidPhoneNumber } from "libphonenumber-js";

import {
  checkoutSchema,
  type CheckoutFormValues,
} from "@/components/user/checkout/checkoutSchema";
import { useState } from "react";
import { getCurrentLocation, reverseGeocode } from "@/utils/locationService";

import { Loader2, MapPin } from "lucide-react";
import { useAuth } from "@/context/authContext";
import { toast } from "@/hooks/useToast";
import { useAddAddress, useUpdateAddress } from "@/services/user/user.query";
import type { Address } from "@/services/user/user.types";

const AddressForm = ({
  modalControl,
  data,
}: {
  modalControl: React.Dispatch<React.SetStateAction<boolean>>;
  data?: Address;
}) => {
  const { user } = useAuth();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      first_name: data?.first_name ? data.first_name : user?.name || "",
      phone_number: data?.phone_number
        ? `${data?.phone_code}${data?.phone_number}`
        : "",
      phone_code: data?.phone_code || "+1",
      last_name: data?.last_name || "",
      line1: data?.line1 || "",
      line2: data?.line2 || "",
      landmark: data?.landmark || "",
      city: data?.city || "",
      state: data?.state || "",
      country: data?.country || "",
      pin_code: data?.pin_code || "",
    },
  });

  const [locationLoading, setLocationLoading] = useState(false);
  const addAddressMutation = useAddAddress();
  const updateAddressMutation = useUpdateAddress();

  const handleAutoDetectLocation = async () => {
    setLocationLoading(true);
    try {
      const coords = await getCurrentLocation();
      if (coords) {
        const location = await reverseGeocode(coords.lat, coords.lon);
        if (location) {
          console.log(location);
          setValue("line1", `${location.address_line1}`);
          setValue("line2", location.address_line2 || "");
          setValue("city", location.city);
          setValue("state", location.state);
          setValue("country", location.country);
          setValue("pin_code", location.postcode);
        }
      }
    } catch (error) {
      console.error("Error detecting location:", error);
    } finally {
      setLocationLoading(false);
    }
  };

  const onSubmit = async (datas: CheckoutFormValues) => {
    if (!isValidPhoneNumber(datas.phone_number)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number",
      });
      return;
    }
    if (
      datas.phone_number &&
      datas.phone_code &&
      datas.phone_number.startsWith(datas.phone_code)
    ) {
      datas.phone_number = datas.phone_number
        .slice(datas.phone_code.length)
        .trim();
    }

    if (data?.first_name) {
      const res = await updateAddressMutation.mutateAsync({
        id: data.id,
        data: datas,
      });
      if (res.success) {
        toast({
          title: "Address updated successfully",
        });
        modalControl(false);
      } else {
        toast({
          title: "Failed to update address",
          description: res.message || "Please try again",
        });
      }
    } else {
      const res = await addAddressMutation.mutateAsync(datas);
      if (res.success) {
        toast({
          title: "Address added successfully",
        });
        modalControl(false);
      } else {
        toast({
          title: "Failed to add address",
          description: res.message || "Please try again",
        });
      }
    }

    console.log("Form Data:", data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="md:col-span-3 space-y-2 max-h-[80vh] overflow-y-auto px-2"
    >
      <div className="bg-card border rounded-lg p-3 mx-2 mb-3">
        <button
          type="button"
          onClick={handleAutoDetectLocation}
          disabled={locationLoading}
          className="w-full flex items-center justify-center gap-2 text-primary font-semibold text-sm transition-colors disabled:opacity-50"
        >
          {locationLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Detecting Location...
            </>
          ) : (
            <div className="cursor-pointer flex">
              <MapPin className="h-4 w-4" />
              Auto-Detect My Location
            </div>
          )}
        </button>
        <p className="text-xs text-primary mt-1 text-center">
          We'll auto-fill your address details
        </p>
      </div>
      {/* NAME */}
      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="first_name"
          control={control}
          render={({ field }) => (
            <div>
              <Label>First Name</Label>
              <Input {...field} />
              {errors.first_name && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.first_name.message}
                </p>
              )}
            </div>
          )}
        />

        <Controller
          name="last_name"
          control={control}
          render={({ field }) => (
            <div>
              <Label>Last Name</Label>
              <Input {...field} />
              {errors.last_name && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.last_name.message}
                </p>
              )}
            </div>
          )}
        />
      </div>

      {/* ADDRESS */}
      <Controller
        name="phone_number"
        control={control}
        render={({ field }) => (
          <div>
            <Label>Phone</Label>
            <PhoneInput
              country="in"
              countryCodeEditable={false}
              enableSearch={true}
              searchPlaceholder="Search country"
              value={field.value}
              // onChange={(value) => field.onChange("+" + value)}
              onChange={(value, data: any) => {
                const dialCode = data?.dialCode || "";
                field.onChange(value ? "+" + value : "");
                setValue("phone_code", "+" + dialCode);
              }}
              inputStyle={{ width: "100%" }}
              inputClass="!w-full !bg-transparent !text-base !border !dark:bg-input/30 !border-input !rounded-md"
              dropdownClass="!bg-popover !text-popover-foreground !border !dark:bg-input/30 !border-input !rounded-md selected:!bg-accent"
              //   searchClass="!bg-transparent !text-base !dark:bg-input/30"
              //   containerClass="!bg-transparent !text-base !dark:bg-input/30"
              //   buttonClass="!bg-transparent !text-base !dark:bg-input/30 hover:!bg-red-500"
            />
            {errors.phone_number && (
              <p className="text-sm text-red-500 mt-1">
                {errors.phone_number.message}
              </p>
            )}
          </div>
        )}
      />

      <Controller
        name="line1"
        control={control}
        render={({ field }) => (
          <div>
            <Label>Address Line 1</Label>
            <Input {...field} />
            {errors.line1 && (
              <p className="text-sm text-red-500 mt-1">
                {errors.line1.message}
              </p>
            )}
          </div>
        )}
      />
      <Controller
        name="line2"
        control={control}
        render={({ field }) => (
          <div>
            <Label>Address Line 2</Label>
            <Input {...field} />
            {errors.line2 && (
              <p className="text-sm text-red-500 mt-1">
                {errors.line2.message}
              </p>
            )}
          </div>
        )}
      />

      <Controller
        name="landmark"
        control={control}
        render={({ field }) => (
          <div>
            <Label>Landmark</Label>
            <Input {...field} />
            {errors.landmark && (
              <p className="text-sm text-red-500 mt-1">
                {errors.landmark.message}
              </p>
            )}
          </div>
        )}
      />

      {/* CITY / STATE / COUNTRY / PIN */}
      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="city"
          control={control}
          render={({ field }) => (
            <div>
              <Label>City</Label>
              <Input {...field} />
              {errors.city && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.city.message}
                </p>
              )}
            </div>
          )}
        />

        <Controller
          name="state"
          control={control}
          render={({ field }) => (
            <div>
              <Label>State</Label>
              <Input {...field} />
              {errors.state && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.state.message}
                </p>
              )}
            </div>
          )}
        />

        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <div>
              <Label>Country</Label>
              <Input {...field} />
              {errors.country && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.country.message}
                </p>
              )}
            </div>
          )}
        />

        <Controller
          name="pin_code"
          control={control}
          render={({ field }) => (
            <div>
              <Label>Pincode</Label>
              <Input {...field} />
              {errors.pin_code && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.pin_code.message}
                </p>
              )}
            </div>
          )}
        />
      </div>

      <Button
        type="submit"
        className="w-full py-6 mt-2 text-sm font-semibold"
        disabled={
          addAddressMutation.isPending || updateAddressMutation.isPending
        }
      >
        {addAddressMutation.isPending || updateAddressMutation.isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : data?.first_name ? (
          "Update Address"
        ) : (
          "Add Address"
        )}
      </Button>
    </form>
  );
};

export default AddressForm;
