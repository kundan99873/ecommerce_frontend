import { useState, useEffect } from "react";
import { MapPin, Check, X, Loader2, Truck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { getCurrentLocation, reverseGeocode } from "@/utils/locationService";
import { checkProductAvailability } from "@/services/product/product-pincode.api";

const PINCODE_KEY = "lumiere_pincode";

const getDeliveryETA = (): string => {
  const days = Math.floor(Math.random() * 4) + 3;
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

interface PincodeCheckProps {
  productSlug?: string;
  onResult?: (result: {
    deliverable: boolean;
    pincode: string;
    eta?: string;
  }) => void;
  compact?: boolean;
}

const PincodeCheck = ({
  productSlug,
  onResult,
  compact = false,
}: PincodeCheckProps) => {
  const [pincode, setPincode] = useState(
    () => localStorage.getItem(PINCODE_KEY) || "",
  );
  const [result, setResult] = useState<{
    deliverable: boolean;
    eta?: string;
  } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  // Mutation for manual API call
  const checkAvailabilityMutation = useMutation({
    mutationFn: () => checkProductAvailability(productSlug || "", pincode),
    onSuccess: (data) => {
      const deliverable = data.data?.is_available ?? false;
      const eta = deliverable ? getDeliveryETA() : undefined;
      setResult({ deliverable, eta });
      localStorage.setItem(PINCODE_KEY, pincode);
      onResult?.({ deliverable, pincode, eta });
    },
    onError: (error) => {
      console.error("Error checking availability:", error);
      setResult(null);
    },
  });

  const handleAutoDetectLocation = async () => {
    setLocationLoading(true);
    try {
      const coords = await getCurrentLocation();
      if (coords) {
        const location = await reverseGeocode(coords.lat, coords.lon);
        if (location) {
          console.log(location);
          setPincode(location.postcode);
          setResult(null); // Reset result when pincode changes
          // toast.success("Location detected successfully");
        }
      }
    } catch (error) {
      console.error("Error detecting location:", error);
    } finally {
      setLocationLoading(false);
    }
  };

  const handleCheck = async () => {
    if (!productSlug || pincode.length < 4) return;
    checkAvailabilityMutation.mutate();
  };

  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
        <span className={`font-medium ${compact ? "text-xs" : "text-sm"}`}>
          Delivery Check
        </span>
      </div>
      <div className="flex gap-2 relative">
        <Input
          placeholder="Enter PIN code"
          value={pincode}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, "").slice(0, 6);
            setPincode(v);
            setResult(null);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleCheck()}
          className={compact ? "text-xs h-8" : "text-sm"}
        />
        {locationLoading ? (
          <Loader2 className="h-5 animate-spin absolute right-24 top-2" />
        ) : (
          <MapPin
            className="absolute h-5 text-muted-foreground shrink-0 right-24 top-2 cursor-pointer"
            onClick={handleAutoDetectLocation}
          />
        )}
        <Button
          variant="outline"
          size={compact ? "sm" : "default"}
          onClick={handleCheck}
          disabled={
            pincode.length < 4 ||
            checkAvailabilityMutation.isPending ||
            !productSlug
          }
          className={compact ? "text-xs h-8" : "text-sm"}
        >
          {checkAvailabilityMutation.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            "Check"
          )}
        </Button>
      </div>
      {result && (
        <div
          className={`flex items-start gap-2 rounded-lg px-3 py-2 text-sm ${
            result.deliverable
              ? "bg-success/10 text-success"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {result.deliverable ? (
            <>
              <Check className="h-4 w-4 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-xs">Delivery available!</p>
                <p className="text-xs flex items-center gap-1 mt-0.5">
                  <Truck className="h-3 w-3" /> Estimated by {result.eta}
                </p>
              </div>
            </>
          ) : (
            <>
              <X className="h-4 w-4 mt-0.5 shrink-0" />
              <p className="font-medium text-xs">
                Not serviceable at this PIN code
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PincodeCheck;
