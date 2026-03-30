import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

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

import AddressManager from "@/components/user/checkout/AddressManager";
import CouponInput from "@/components/cart/couponInput";

import { formatCurrency } from "@/utils/utils";
import { toast } from "@/hooks/useToast";

import type { Address } from "@/services/user/user.types";

type PaymentMethod = "RAZORPAY" | "COD";

const Checkout = () => {
  const navigate = useNavigate();

  const { items, totalPrice, clearCart, discount, appliedCoupon } = useCart();
  const { user } = useAuth();
  const { openPayment } = useRazorpay();
  const addOrderMutation = useAddOrder();

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("RAZORPAY");
  const [processing, setProcessing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (items.length === 0 && !placed) {
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

  /* ---------------- MAIN ORDER FUNCTION ---------------- */

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast({
        title: "Select Address",
        description: "Please select a delivery address.",
      });
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
        setPlaced(true);

        toast({
          title: "Order Confirmed",
          description: "Cash on Delivery selected.",
        });

        setTimeout(() => navigate("/"), 5000);

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
            });

            if (!order?.success) {
              toast({
                title: "Order Failed",
                description: order?.message || "Please try again.",
              });
              return;
            }

            clearCart();
            setPlaced(true);

            toast({
              title: "Payment Successful",
              description: "Redirecting to home page...",
            });

            setTimeout(() => navigate("/"), 5000);
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

  /* ---------------- SUCCESS PAGE ---------------- */

  if (placed) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-20 text-center"
      >
        <CheckCircle className="h-16 w-16 mx-auto text-green-600" />
        <h1 className="text-3xl font-bold mt-4">Order Confirmed!</h1>
        <p className="text-muted-foreground mt-2">
          You will be redirected shortly.
        </p>
      </motion.div>
    );
  }

  /* ---------------- MAIN CHECKOUT UI ---------------- */

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
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
            disabled={!selectedAddress || processing}
            onClick={() => setConfirmOpen(true)}
          >
            Place Order — {formatCurrency(finalTotal)}
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
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>

            <Button
              disabled={processing}
              onClick={() => {
                setConfirmOpen(false);
                handlePlaceOrder();
              }}
            >
              {processing ? "Processing..." : "Confirm Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Checkout;
