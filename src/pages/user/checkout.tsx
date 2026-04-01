import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useCart } from "@/context/cartContext";
import { useAuth } from "@/context/authContext";
import { useRazorpay } from "@/hooks/useRazorpay";
import { useAddOrder } from "@/services/order/order.query";
import { checkProductAvailability } from "@/services/product/product-pincode.api";

import AddressManager from "@/components/user/checkout/AddressManager";
import UndeliverableProductsDialog from "@/components/user/checkout/undeliverableProductsDialog";
import CouponInput from "@/components/cart/couponInput";

import { formatCurrency } from "@/utils/utils";
import { toast } from "@/hooks/useToast";

import type { Address } from "@/services/user/user.types";
import type { CartItem } from "@/services/cart/cart.types";

type PaymentMethod = "RAZORPAY" | "COD";

const Checkout = () => {
  const navigate = useNavigate();

  const { items, totalPrice, clearCart, discount, appliedCoupon, removeItem } =
    useCart();
  const { user } = useAuth();
  const { openPayment } = useRazorpay();
  const addOrderMutation = useAddOrder();
  const isOrderLoading = addOrderMutation.isPending;

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("RAZORPAY");
  const [processing, setProcessing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [undeliverableItems, setUndeliverableItems] = useState<CartItem[]>([]);
  const [undeliverableDialogOpen, setUndeliverableDialogOpen] = useState(false);

  useEffect(() => {
    if (!successOpen) return;

    setRedirectCountdown(5);

    const intervalId = window.setInterval(() => {
      setRedirectCountdown((prev) => {
        if (prev <= 1) {
          window.clearInterval(intervalId);
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [successOpen, navigate]);

  if (items.length === 0 && !successOpen) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <Button className="mt-6" onClick={() => navigate("/")}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  /* ---------------- PRICE CALCULATION ---------------- */

  const shipping = totalPrice >= 100 ? 0 : 9.99;
  const finalTotal = totalPrice - discount + shipping;

  /* ---- CHECK PRODUCT AVAILABILITY ---- */

  const checkProductsAvailability = useCallback(
    async (addPincode: string) => {
      if (!addPincode || items.length === 0) return true;

      setCheckingAvailability(true);
      const undeliverable: CartItem[] = [];

      try {
        // Check each product's availability
        for (const item of items) {
          // For demo, simulate API call - in production this would be real API
          // In actual implementation, this would call the checkProductAvailability API
          const isAvailable = await checkSingleProductAvailability(
            item.slug,
            addPincode,
          );

          if (!isAvailable) {
            undeliverable.push(item);
          }
        }

        if (undeliverable.length > 0) {
          setUndeliverableItems(undeliverable);
          setUndeliverableDialogOpen(true);
          return false;
        }

        return true;
      } catch (error) {
        console.error("Error checking availability:", error);
        toast({
          title: "Error",
          description: "Failed to check product availability",
        });
        return false;
      } finally {
        setCheckingAvailability(false);
      }
    },
    [items],
  );

  const checkSingleProductAvailability = async (
    slug: string,
    pincode: string,
  ): Promise<boolean> => {
    const response = await checkProductAvailability(slug, pincode);
    return response.data?.is_available ?? false;
  };

  const handleRemoveUndeliverableProducts = async (items: CartItem[]) => {
    setCheckingAvailability(true);
    try {
      for (const item of items) {
        removeItem(item.slug);
      }
      toast({
        title: "Products removed",
        description: `${items.length} undeliverable product(s) have been removed from your cart.`,
      });
      setUndeliverableDialogOpen(false);
    } finally {
      setCheckingAvailability(false);
    }
  };

  /* ---------------- MAIN ORDER FUNCTION ---------------- */

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast({
        title: "Select Address",
        description: "Please select a delivery address.",
      });
      return;
    }

    // Check availability before proceeding
    const allAvailable = await checkProductsAvailability(
      selectedAddress.pin_code,
    );

    if (!allAvailable) {
      setConfirmOpen(false);
      return;
    }

    if (processing) return;

    try {
      setProcessing(true);

      /* ---------------- COD FLOW ---------------- */

      if (paymentMethod === "COD") {
        const order = await addOrderMutation.mutateAsync({
          address_id: Number(selectedAddress.id),
          coupon_code: appliedCoupon?.code,
          payment_method: paymentMethod,
        });

        if (!order?.success) {
          toast({
            title: "Order Failed",
            description: order?.message || "Please try again.",
          });
          setProcessing(false);
          return;
        }

        clearCart();
        setSuccessOpen(true);
        setConfirmOpen(false);

        toast({
          title: "Order Placed Successfully",
          description: "Redirecting to home page in 5 seconds.",
        });

        setProcessing(false);
        return;
      }

      /* ---------------- RAZORPAY FLOW ---------------- */

      await openPayment({
        amount: finalTotal,
        name: "E-Commerce Store",
        description: "Order Payment",
        email: user?.email ?? "",
        contact: selectedAddress.phone_number ?? "",

        onSuccess: async (response) => {
          try {
            console.log("Payment Success:", response);

            const order = await addOrderMutation.mutateAsync({
              address_id: Number(selectedAddress.id),
              coupon_code: appliedCoupon?.code,
              payment_method: "RAZORPAY",
              payment_id: response?.razorpay_payment_id,
            });

            if (!order?.success) {
              toast({
                title: "Order Failed",
                description: order?.message || "Please try again.",
              });
              return;
            }

            clearCart();
            setSuccessOpen(true);
            setConfirmOpen(false);

            toast({
              title: "Order Placed Successfully",
              description: "Redirecting to home page in 5 seconds.",
            });
          } catch {
            toast({
              title: "Verification Failed",
              description: "Please contact support.",
            });
          } finally {
            setProcessing(false);
          }
        },

        onFailure: (response) => {
          const reason =
            response?.error ||
            response?.description ||
            "Payment popup could not complete. Please try again.";

          toast({
            title: "Payment Failed",
            description: reason,
          });
          setProcessing(false);
        },
      });
    } catch (err) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
      });
      setProcessing(false);
    }
  };

  /* ---------------- MAIN CHECKOUT UI ---------------- */

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {(isOrderLoading || checkingAvailability) && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-md flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-sm rounded-2xl border border-primary/20 bg-card/95 shadow-2xl p-6"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="absolute -inset-1 rounded-full border border-primary/30 animate-ping" />
              </div>
              <div>
                <p className="text-sm font-semibold">
                  {checkingAvailability
                    ? "Checking availability"
                    : "Placing your order"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Hold on while we confirm everything.
                </p>
              </div>
            </div>

            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full w-1/3 rounded-full bg-primary"
                animate={{ x: ["-120%", "360%"] }}
                transition={{
                  duration: 1.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>

            <div className="mt-4 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary/80 animate-bounce [animation-delay:-0.2s]" />
              <span className="h-2 w-2 rounded-full bg-primary/70 animate-bounce [animation-delay:-0.1s]" />
              <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" />
            </div>
          </motion.div>
        </div>
      )}

      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" /> Order Placed
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Your order is placed successfully. Redirecting to home page in{" "}
            <strong>{redirectCountdown}</strong> second
            {redirectCountdown === 1 ? "" : "s"}.
          </p>

          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden mt-2">
            <motion.div
              className="h-full bg-green-600"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 5, ease: "linear" }}
              key={
                successOpen
                  ? "success-progress-open"
                  : "success-progress-closed"
              }
            />
          </div>
        </DialogContent>
      </Dialog>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid md:grid-cols-5 gap-8">
        {/* LEFT SIDE */}
        <div className="md:col-span-3 space-y-6">
          <AddressManager
            onSelect={(addr) =>
              setSelectedAddress((prev) => (prev?.id === addr.id ? prev : addr))
            }
            selectedId={selectedAddress?.id}
          />

          {/* PAYMENT METHOD */}
          <div className="bg-card border rounded-xl p-5">
            <h2 className="font-semibold mb-4">Payment Method</h2>

            <RadioGroup
              value={paymentMethod}
              onValueChange={(val) => setPaymentMethod(val as PaymentMethod)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="RAZORPAY" id="razorpay" />
                <label htmlFor="razorpay">Pay Online (Razorpay)</label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="COD" id="cod" />
                <label htmlFor="cod">Cash on Delivery</label>
              </div>
            </RadioGroup>
          </div>

          <Button
            className="w-full py-6 font-semibold"
            disabled={
              !selectedAddress ||
              processing ||
              isOrderLoading ||
              checkingAvailability
            }
            onClick={() => setConfirmOpen(true)}
          >
            {processing || isOrderLoading || checkingAvailability ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {checkingAvailability
                  ? "Checking availability..."
                  : "Processing..."}
              </span>
            ) : (
              <>Place Order - {formatCurrency(finalTotal)}</>
            )}
          </Button>
        </div>

        {/* RIGHT SIDE SUMMARY */}
        <div className="md:col-span-2">
          <div className="bg-card border rounded-lg p-5 sticky top-24">
            <h2 className="font-bold mb-4">Order Summary</h2>

            {items.map((product) => (
              <div
                key={product.sku}
                className="flex justify-between text-sm mb-2"
              >
                <span>
                  {product.name} × {product.quantity}
                </span>
                <span>{formatCurrency(product.subtotal)}</span>
              </div>
            ))}

            <Separator className="my-4" />

            <CouponInput cartTotal={totalPrice} />

            <div className="space-y-2 text-sm mt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? "Free" : formatCurrency(shipping)}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatCurrency(finalTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONFIRM MODAL */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Order</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            You are about to place an order of{" "}
            <strong>{formatCurrency(finalTotal)}</strong> using{" "}
            <strong>{paymentMethod}</strong>.
          </p>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={processing || isOrderLoading}
            >
              Cancel
            </Button>

            <Button
              disabled={processing || isOrderLoading || checkingAvailability}
              onClick={handlePlaceOrder}
            >
              {processing || isOrderLoading || checkingAvailability ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </span>
              ) : (
                "Confirm Order"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* UNDELIVERABLE PRODUCTS DIALOG */}
      <UndeliverableProductsDialog
        open={undeliverableDialogOpen}
        onOpenChange={setUndeliverableDialogOpen}
        undeliverableItems={undeliverableItems}
        onRemoveProducts={handleRemoveUndeliverableProducts}
        onChangeAddress={() => {
          setUndeliverableDialogOpen(false);
          setUndeliverableItems([]);
        }}
        isRemoving={checkingAvailability}
      />
    </div>
  );
};

export default Checkout;
