import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLogin as useGoogleMutation } from "@/services/auth/auth.query";
import type { DeviceSession } from "@/services/auth/auth.types";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface GoogleLoginBtnProps {
  onDeviceLimit?: (sessions: DeviceSession[], message?: string) => void;
  onErrorMessage?: (message: string) => void;
  forceLogoutDeviceId?: string | null;
  onForceLogoutHandled?: () => void;
  onRequestStateChange?: (isLoading: boolean) => void;
}

export default function GoogleLoginBtn({
  onDeviceLimit,
  onErrorMessage,
  forceLogoutDeviceId,
  onForceLogoutHandled,
  onRequestStateChange,
}: GoogleLoginBtnProps) {
  const mutation = useGoogleMutation();
  const location = useLocation();
  const navigate = useNavigate();
  const from = (location.state as { from?: string })?.from || "/";
  const [lastCredential, setLastCredential] = useState<string | null>(null);

  useEffect(() => {
    onRequestStateChange?.(mutation.isPending);
  }, [mutation.isPending, onRequestStateChange]);

  const runGoogleLogin = async (credential: string, retryDeviceId?: string) => {
    try {
      const response = await mutation.mutateAsync({
        token: credential,
        ...(retryDeviceId ? { force_logout_device_id: retryDeviceId } : {}),
      });

      const isDeviceLimitResponse =
        Array.isArray(response.data) && response.data.length > 0;

      if (isDeviceLimitResponse) {
        onDeviceLimit?.(response.data!, response.message);
        return;
      }

      if (response.success) {
        toast.success("Logged in successfully");
        navigate(from, { replace: true });
        return;
      }

      const message = response.message || "Google login failed";
      toast.error(message);
      onErrorMessage?.(message);
    } catch (error: any) {
      const responseData = error?.response?.data;
      if (Array.isArray(responseData?.data) && responseData.data.length > 0) {
        onDeviceLimit?.(responseData.data, responseData?.message);
        return;
      }

      const message =
        responseData?.message ||
        "Unable to sign in with Google. Please try again.";
      toast.error(message);
      onErrorMessage?.(message);
    }
  };

  useEffect(() => {
    if (!forceLogoutDeviceId) return;

    const retry = async () => {
      try {
        if (!lastCredential) {
          const message =
            "Please click Google Sign In once, then choose a device to logout.";
          toast.error(message);
          onErrorMessage?.(message);
          return;
        }

        await runGoogleLogin(lastCredential, forceLogoutDeviceId);
      } finally {
        onForceLogoutHandled?.();
      }
    };

    retry();
  }, [
    forceLogoutDeviceId,
    lastCredential,
    onErrorMessage,
    onForceLogoutHandled,
  ]);

  return (
    <div className="relative w-full">
      {mutation.isPending && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-md bg-background/75 backdrop-blur-sm">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing in with Google...
          </span>
        </div>
      )}

      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          if (!credentialResponse.credential) {
            const message = "Google login failed. Missing credential.";
            toast.error(message);
            onErrorMessage?.(message);
            return;
          }

          setLastCredential(credentialResponse.credential);
          await runGoogleLogin(credentialResponse.credential);
        }}
        onError={() => {
          const message = "Google login failed";
          toast.error(message);
          onErrorMessage?.(message);
        }}
        useOneTap
        theme="outline"
        size="large"
        shape="rectangular"
        width="100%"
      />
    </div>
  );
}
