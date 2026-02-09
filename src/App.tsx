import { Toaster } from "@/components/ui/sonner";
import AppRouter from "@/router/appRouter";
import { ThemeProvider } from "@/context/themeContext";
import { CartProvider } from "@/context/cartContext";
import { WishlistProvider } from "@/context/wishlistContext";
import { AuthProvider } from "@/context/authContext";
import { CouponProvider } from "@/context/couponContext";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <CouponProvider>
            <WishlistProvider>
              <TooltipProvider>
                <AppRouter />
                <Toaster />
              </TooltipProvider>
            </WishlistProvider>
          </CouponProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
