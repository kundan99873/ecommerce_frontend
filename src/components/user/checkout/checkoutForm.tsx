import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { checkoutSchema, type CheckoutFormValues } from "./checkoutSchema";
import PincodeCheck from "@/components/product/pinCodeCheck";
import { useState } from "react";
import { getCurrentLocation, reverseGeocode } from "@/utils/locationService";
import { Loader2, MapPin } from "lucide-react";

interface Props {
  onSubmit: (data: CheckoutFormValues) => void;
  zipResult: {
    deliverable: boolean;
    eta?: string;
  } | null;
  setZipResult: (r: { deliverable: boolean; eta?: string }) => void;
  finalTotal: number;
}

const CheckoutForm = ({
  onSubmit,
  zipResult,
  setZipResult,
  finalTotal,
}: Props) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      address: "",
      city: "",
      state: "",
      country: "",
      pin_code: "",
    },
  });

  const [locationLoading, setLocationLoading] = useState(false);

  const handleAutoDetectLocation = async (e) => {
    // console.log(e.)
    setLocationLoading(true);
    try {
      const coords = await getCurrentLocation();
      if (coords) {
        const location = await reverseGeocode(coords.lat, coords.lon);
        if (location) {
          console.log(location);
          setValue("address", `${location.address_line1}, ${location.address_line2}`)
          setValue("city", location.city);
          setValue("state", location.state);
          setValue("country", location.country);
          setValue("pin_code", location.postcode);
          // toast.success("Location detected successfully");
        }
      }
    } catch (error) {
      console.error("Error detecting location:", error);
      // toast.error("Failed to detect location");
    } finally {
      setLocationLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="md:col-span-3 space-y-6">
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
            <>
              <MapPin className="h-4 w-4" />
              Auto-Detect My Location
            </>
          )}
        </button>
        <p className="text-xs text-primary mt-1 text-center">
          We'll auto-fill your address details
        </p>
      </div>
      <div>
        <h2 className="font-display text-lg font-bold mb-4">
          Contact Information
        </h2>

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <div>
              <Label>Email</Label>
              <Input type="email" {...field} />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          )}
        />
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
        name="address"
        control={control}
        render={({ field }) => (
          <div>
            <Label>Address</Label>
            <Input {...field} />
            {errors.address && (
              <p className="text-sm text-red-500 mt-1">
                {errors.address.message}
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

      {/* PINCODE CHECK */}
      <div className="bg-card border rounded-lg p-4">
        <PincodeCheck onResult={(r) => setZipResult(r)} />
      </div>

      {/* PAYMENT (UI ONLY) */}
      <div>
        <h2 className="font-display text-lg font-bold mb-4">Payment</h2>
        <Input placeholder="Card number" />
      </div>

      <Button
        type="submit"
        disabled={zipResult !== null && !zipResult.deliverable}
        className="w-full py-6 text-sm font-semibold"
      >
        Place Order — ${finalTotal.toFixed(2)}
      </Button>
    </form>
  );
};

export default CheckoutForm;
