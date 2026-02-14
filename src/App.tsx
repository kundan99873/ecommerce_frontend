import { Toaster } from "@/components/ui/sonner";
import AppRouter from "@/router/appRouter";
import { ThemeProvider } from "@/context/themeContext";
import { CartProvider } from "@/context/cartContext";
import { WishlistProvider } from "@/context/wishlistContext";
import { AuthProvider } from "@/context/authContext";
import { CouponProvider } from "@/context/couponContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./api/client";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <GoogleOAuthProvider clientId={clientId}>
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
        </GoogleOAuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
