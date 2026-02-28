// import { useState } from "react";
// import { useNavigate } from "react-router";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/separator";
// import { useCart } from "@/context/cartContext";
// import { useCoupon } from "@/context/couponContext";
// import { toast } from "@/hooks/useToast";
// import { CheckCircle, Loader2, MapPin } from "lucide-react";
// import PincodeCheck from "@/components/product/pinCodeCheck";
// import CouponInput from "@/components/cart/couponInput";
// import { getCurrentLocation, reverseGeocode } from "@/utils/locationService";
// import { Controller, useForm } from "react-hook-form";

// const Checkout = () => {
//   const { items, totalPrice, clearCart } = useCart();
//   const { discount, appliedCoupon } = useCoupon();
//   const navigate = useNavigate();
//   const [placed, setPlaced] = useState(false);
//   const [zipResult, setZipResult] = useState<{
//     deliverable: boolean;
//     eta?: string;
//   } | null>(null);
//   const [locationLoading, setLocationLoading] = useState(false);

//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({

//   });

//   const shipping = totalPrice >= 100 ? 0 : 9.99;
//   const finalTotal = totalPrice - discount + shipping;

//   const onSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (zipResult && !zipResult.deliverable) {
//       toast({
//         title: "Cannot proceed",
//         description: "Delivery is not available at the entered ZIP code.",
//       });
//       return;
//     }
//     setPlaced(true);
//     clearCart();
//     toast({
//       title: "Order placed!",
//       description: "Your order has been successfully placed.",
//     });
//   };

//   if (placed) {
//     return (
//       <>
//         <div className="container mx-auto px-4 py-20 text-center">
//           <CheckCircle className="h-16 w-16 mx-auto text-success" />
//           <h1 className="text-3xl font-display font-bold mt-4">
//             Order Confirmed!
//           </h1>
//           <p className="text-muted-foreground mt-2">
//             Thank you for your purchase. You'll receive a confirmation email
//             shortly.
//           </p>
//           <Button className="mt-6" onClick={() => navigate("/orders")}>
//             View Orders
//           </Button>
//         </div>
//       </>
//     );
//   }

//   if (items.length === 0) {
//     navigate("/cart");
//     return null;
//   }

//   const handleAutoDetectLocation = async (e) => {
//     // console.log(e.)
//     setLocationLoading(true);
//     try {
//       const coords = await getCurrentLocation();
//       if (coords) {
//         const location = await reverseGeocode(coords.lat, coords.lon);
//         if (location) {
//           console.log(location);
//           // toast.success("Location detected successfully");
//         }
//       }
//     } catch (error) {
//       console.error("Error detecting location:", error);
//       // toast.error("Failed to detect location");
//     } finally {
//       setLocationLoading(false);
//     }
//   };

//   return (
//     <>
//       <div className="container mx-auto px-4 py-8 max-w-4xl">
//         <h1 className="text-3xl font-display font-bold mb-8">Checkout</h1>

//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           className="grid md:grid-cols-5 gap-8"
//         >
//           <div className="md:col-span-3 space-y-6">
//             <div className="bg-card border rounded-lg p-3 mx-2 mb-3">
//               <button
//                 type="button"
//                 onClick={handleAutoDetectLocation}
//                 disabled={locationLoading}
//                 className="w-full flex items-center justify-center gap-2 text-primary font-semibold text-sm transition-colors disabled:opacity-50"
//               >
//                 {locationLoading ? (
//                   <>
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                     Detecting Location...
//                   </>
//                 ) : (
//                   <>
//                     <MapPin className="h-4 w-4" />
//                     Auto-Detect My Location
//                   </>
//                 )}
//               </button>
//               <p className="text-xs text-primary mt-1 text-center">
//                 We'll auto-fill your address details
//               </p>
//             </div>
//             <div>
//               <h2 className="font-display text-lg font-bold mb-4">
//                 Contact Information
//               </h2>
//               <div className="grid gap-4">
//                 <Controller
//                   name="email"
//                   control={control}
//                   render={({ field }) => (
//                     <div>
//                       <Label htmlFor="email">Email</Label>
//                       <Input
//                         type="email"
//                         placeholder="your@email.com"
//                         value={field.value}
//                         onChange={(e) => field.onChange(e.target.value)}
//                       />
//                       {errors.email && (
//                         <p className="text-sm text-red-500 mt-1">
//                           {errors.email.message}
//                         </p>
//                       )}
//                     </div>
//                   )}
//                 />
//                 <div className="grid grid-cols-2 gap-4">
//                   <Controller
//                     name="first_name"
//                     control={control}
//                     render={({ field }) => (
//                       <div>
//                         <Label htmlFor="first">First Name</Label>
//                         <Input
//                           value={field.value}
//                           onChange={(e) => field.onChange(e.target.value)}
//                         />
//                         {errors.first_name && (
//                           <p className="text-sm text-red-500 mt-1">
//                             {errors.first_name.message}
//                           </p>
//                         )}
//                       </div>
//                     )}
//                   />
//                   <Controller
//                     name="last_name"
//                     control={control}
//                     render={({ field }) => (
//                       <div>
//                         <Label htmlFor="last">Last Name</Label>
//                         <Input
//                           value={field.value}
//                           onChange={(e) => field.onChange(e.target.value)}
//                         />
//                         {errors.last_name && (
//                           <p className="text-sm text-red-500 mt-1">
//                             {errors.last_name.message}
//                           </p>
//                         )}
//                       </div>
//                     )}
//                   />
//                 </div>
//               </div>
//             </div>

//             <div>
//               <h2 className="font-display text-lg font-bold mb-4">
//                 Shipping Address
//               </h2>
//               <div className="grid gap-4">
//                 <Controller
//                   name="address"
//                   control={control}
//                   render={({ field }) => (
//                     <div>
//                       <Label htmlFor="address">Address</Label>
//                       <Input
//                         value={field.value}
//                         onChange={(e) => field.onChange(e.target.value)}
//                       />
//                       {errors.address && (
//                         <p className="text-sm text-red-500 mt-1">
//                           {errors.address.message}
//                         </p>
//                       )}
//                     </div>
//                   )}
//                 />
//                 <div className="grid grid-cols-2 gap-4">
//                   <Controller
//                     name="city"
//                     control={control}
//                     render={({ field }) => (
//                       <div>
//                         <Label htmlFor="city">City</Label>
//                         <Input
//                           value={field.value}
//                           onChange={(e) => field.onChange(e.target.value)}
//                         />
//                         {errors.city && (
//                           <p className="text-sm text-red-500 mt-1">
//                             {errors.city.message}
//                           </p>
//                         )}
//                       </div>
//                     )}
//                   />
//                   <Controller
//                     name="state"
//                     control={control}
//                     render={({ field }) => (
//                       <div>
//                         <Label htmlFor="state">State</Label>
//                         <Input
//                           value={field.value}
//                           onChange={(e) => field.onChange(e.target.value)}
//                         />
//                         {errors.state && (
//                           <p className="text-sm text-red-500 mt-1">
//                             {errors.state.message}
//                           </p>
//                         )}
//                       </div>
//                     )}
//                   />
//                   <Controller
//                     name="country"
//                     control={control}
//                     render={({ field }) => (
//                       <div>
//                         <Label htmlFor="country">Country</Label>
//                         <Input
//                           value={field.value}
//                           onChange={(e) => field.onChange(e.target.value)}
//                         />
//                         {errors.country && (
//                           <p className="text-sm text-red-500 mt-1">
//                             {errors.country.message}
//                           </p>
//                         )}
//                       </div>
//                     )}
//                   />
//                   <Controller
//                     name="pin_code"
//                     control={control}
//                     render={({ field }) => (
//                       <div>
//                         <Label htmlFor="pin_code">Pincode</Label>
//                         <Input
//                           value={field.value}
//                           onChange={(e) => field.onChange(e.target.value)}
//                         />
//                         {errors.pincode && (
//                           <p className="text-sm text-red-500 mt-1">
//                             {errors.pincode.message}
//                           </p>
//                         )}
//                       </div>
//                     )}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Zipcode deliverability */}
//             <div className="bg-card border rounded-lg p-4">
//               <PincodeCheck onResult={(r) => setZipResult(r)} />
//             </div>

//             <div>
//               <h2 className="font-display text-lg font-bold mb-4">Payment</h2>
//               <div className="grid gap-4">
//                 <div>
//                   <Label htmlFor="card">Card Number</Label>
//                   <Input id="card" required placeholder="1234 5678 9012 3456" />
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="expiry">Expiry</Label>
//                     <Input id="expiry" required placeholder="MM/YY" />
//                   </div>
//                   <div>
//                     <Label htmlFor="cvv">CVV</Label>
//                     <Input id="cvv" required placeholder="123" />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <Button
//               type="submit"
//               className="w-full py-6 text-sm font-semibold tracking-wide"
//               disabled={zipResult !== null && !zipResult.deliverable}
//             >
//               Place Order — ${finalTotal.toFixed(2)}
//             </Button>
//           </div>

//           <div className="md:col-span-2">
//             <div className="bg-card border rounded-lg p-5 sticky top-24 space-y-4">
//               <h2 className="font-display text-lg font-bold">Your Items</h2>
//               <div className="space-y-3">
//                 {items.map(({ product, quantity }) => (
//                   <div key={product.id} className="flex gap-3">
//                     <img
//                       src={product.image}
//                       alt={product.name}
//                       className="h-16 w-14 object-cover rounded"
//                     />
//                     <div className="flex-1 text-sm">
//                       <p className="font-medium leading-tight">
//                         {product.name}
//                       </p>
//                       <p className="text-muted-foreground">Qty: {quantity}</p>
//                     </div>
//                     <span className="text-sm font-medium">
//                       ${product.price * quantity}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//               <Separator />
//               <CouponInput cartTotal={totalPrice} />
//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Subtotal</span>
//                   <span>${totalPrice.toFixed(2)}</span>
//                 </div>
//                 {discount > 0 && (
//                   <div className="flex justify-between text-success">
//                     <span>Discount ({appliedCoupon?.code})</span>
//                     <span>-${discount.toFixed(2)}</span>
//                   </div>
//                 )}
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Shipping</span>
//                   <span>{shipping === 0 ? "Free" : `$${shipping}`}</span>
//                 </div>
//                 {zipResult?.eta && (
//                   <div className="flex justify-between text-xs">
//                     <span className="text-muted-foreground">Est. Delivery</span>
//                     <span className="text-success">{zipResult.eta}</span>
//                   </div>
//                 )}
//                 <Separator />
//                 <div className="flex justify-between font-semibold">
//                   <span>Total</span>
//                   <span>${finalTotal.toFixed(2)}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>
//     </>
//   );
// };

// export default Checkout;

import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/cartContext";
import { useCoupon } from "@/context/couponContext";
import { toast } from "@/hooks/useToast";
import { CheckCircle } from "lucide-react";
import CouponInput from "@/components/cart/couponInput";
import type { CheckoutFormValues } from "@/components/user/checkout/checkoutSchema";
import CheckoutForm from "@/components/user/checkout/checkoutForm";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { discount, appliedCoupon } = useCoupon();
  const navigate = useNavigate();

  const [placed, setPlaced] = useState(false);
  const [zipResult, setZipResult] = useState<{
    deliverable: boolean;
    eta?: string;
  } | null>(null);

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const shipping = totalPrice >= 100 ? 0 : 9.99;
  const finalTotal = totalPrice - discount + shipping;

  const onSubmit = (data: CheckoutFormValues) => {
    if (zipResult && !zipResult.deliverable) {
      toast({
        title: "Cannot proceed",
        description: "Delivery is not available at the entered pincode.",
      });
      return;
    }

    console.log("Checkout Data:", data);

    setPlaced(true);
    clearCart();

    toast({
      title: "Order placed!",
      description: "Your order has been successfully placed.",
    });
  };

  if (placed) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <CheckCircle className="h-16 w-16 mx-auto text-success" />
        <h1 className="text-3xl font-display font-bold mt-4">
          Order Confirmed!
        </h1>
        <p className="text-muted-foreground mt-2">
          Thank you for your purchase. You'll receive a confirmation email
          shortly.
        </p>
        <Button className="mt-6" onClick={() => navigate("/orders")}>
          View Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-display font-bold mb-8">Checkout</h1>

      <div className="grid md:grid-cols-5 gap-8">
        {/* LEFT SIDE FORM */}
        <CheckoutForm
          onSubmit={onSubmit}
          zipResult={zipResult}
          setZipResult={setZipResult}
          finalTotal={finalTotal}
        />

        {/* RIGHT SIDE CART SUMMARY */}
        <div className="md:col-span-2">
          <div className="bg-card border rounded-lg p-5 sticky top-24 space-y-4">
            <h2 className="font-display text-lg font-bold">Your Items</h2>

            <div className="space-y-3">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-16 w-14 object-cover rounded"
                  />
                  <div className="flex-1 text-sm">
                    <p className="font-medium leading-tight">{product.name}</p>
                    <p className="text-muted-foreground">Qty: {quantity}</p>
                  </div>
                  <span className="text-sm font-medium">
                    ${product.price * quantity}
                  </span>
                </div>
              ))}
            </div>

            <Separator />

            <CouponInput cartTotal={totalPrice} />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>- ${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shipping === 0 ? "Free" : `$${shipping}`}</span>
              </div>

              {zipResult?.eta && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Est. Delivery</span>
                  <span className="text-success">{zipResult.eta}</span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
