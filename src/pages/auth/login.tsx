import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import {
  Eye,
  EyeOff,
  Laptop,
  LogIn,
  Loader2,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/context/authContext";
import { toast } from "@/hooks/useToast";
import { motion } from "motion/react";
import GoogleLoginBtn from "@/components/user/auth/googleLoginBtn";
import type { DeviceSession, LoginResponse } from "@/services/auth/auth.types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import dayjs from "dayjs";

const Login = () => {
  const { login, loginLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [activeSessions, setActiveSessions] = useState<DeviceSession[]>([]);
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [sessionMessage, setSessionMessage] = useState("");
  const [managingDeviceId, setManagingDeviceId] = useState<string | null>(null);

  if (isAuthenticated) {
    navigate(from, { replace: true });
    return null;
  }

  const attemptLogin = async (forceLogoutDeviceId?: string) => {
    try {
      const response: LoginResponse = await login(
        email,
        password,
        forceLogoutDeviceId,
      );

      if (response.success) {
        setSessionModalOpen(false);
        toast({
          title: "Welcome back!",
          description: "You have been logged in successfully.",
        });
        navigate(from, { replace: true });
      } else {
        setError(response.message || "Invalid email or password");
      }
    } catch (error: any) {
      const statusCode = error?.response?.status;
      const responseData = error?.response?.data as LoginResponse | undefined;

      if (
        statusCode === 403 &&
        Array.isArray(responseData?.data) &&
        responseData.data.length > 0
      ) {
        setError("");
        setActiveSessions(responseData.data);
        setSessionMessage(
          responseData.message ||
            "You are already logged in on maximum allowed devices.",
        );
        setSessionModalOpen(true);
        return;
      }

      setError(
        responseData?.message ||
          "An error occurred during login. Please try again.",
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    await attemptLogin();
  };

  const handleLogoutDeviceAndRetry = async (deviceId: string) => {
    try {
      setManagingDeviceId(deviceId);
      toast({
        title: "Trying to login...",
        description: "Using selected device for force logout and sign in.",
      });

      await attemptLogin(deviceId);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Please try again.");
    } finally {
      setManagingDeviceId(null);
    }
  };

  const getDeviceLabel = (session: DeviceSession) => {
    const ua = session.user_agent?.toLowerCase() || "";
    const fallbackName = session.device_name?.trim() || "Unknown Device";

    if (
      ua.includes("android") ||
      ua.includes("iphone") ||
      ua.includes("mobile")
    ) {
      return "Mobile Device";
    }

    if (ua.includes("windows") || ua.includes("mac") || ua.includes("linux")) {
      return "Desktop Device";
    }

    return fallbackName;
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_10%,hsl(var(--primary)/0.22)_0%,transparent_35%),radial-gradient(circle_at_90%_90%,hsl(var(--success)/0.16)_0%,transparent_35%),linear-gradient(160deg,hsl(var(--background))_0%,hsl(var(--muted)/0.32)_100%)] px-4 py-8">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-14 -left-12 h-52 w-52 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-emerald-500/20 blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-2xl border border-border/60 bg-card/90 p-6 shadow-2xl backdrop-blur sm:p-8"
        >
          <div className="space-y-3 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure Sign In
            </div>
            <h1 className="text-3xl font-display font-bold tracking-tight">
              Welcome Back
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to continue shopping your favorites.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 rounded-xl pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={remember}
                onCheckedChange={(v) => setRemember(v as boolean)}
              />
              <label htmlFor="remember" className="cursor-pointer text-sm">
                Remember me
              </label>
            </div>

            <Button
              type="submit"
              className="w-full py-5"
              disabled={loginLoading}
            >
              {loginLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="mr-2 h-4 w-4" />
              )}
              Sign In
            </Button>
          </form>

          <div className="mt-4">
            <GoogleLoginBtn />
          </div>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-primary hover:underline"
            >
              Create one
            </Link>
          </p>
        </motion.div>
      </div>

      <Dialog open={sessionModalOpen} onOpenChange={setSessionModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Device Limit Reached</DialogTitle>
            <DialogDescription>
              {sessionMessage ||
                "You are already logged in on maximum allowed devices."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {activeSessions.map((session) => {
              const isMobile =
                session.user_agent?.toLowerCase().includes("android") ||
                session.user_agent?.toLowerCase().includes("iphone") ||
                session.user_agent?.toLowerCase().includes("mobile");

              const isRowLoading =
                loginLoading && managingDeviceId === session.device_id;

              return (
                <div
                  key={session.id}
                  className="rounded-xl border border-border bg-card/60 p-3"
                >
                  <div className="flex h-full flex-col justify-between gap-3">
                    <div className="flex items-start gap-2">
                      {isMobile ? (
                        <Smartphone className="h-4 w-4 text-primary mt-0.5" />
                      ) : (
                        <Laptop className="h-4 w-4 text-primary mt-0.5" />
                      )}

                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {getDeviceLabel(session)}
                        </p>
                        <p className="text-xs text-muted-foreground break-all">
                          Last used:{" "}
                          {session.last_used_at
                            ? dayjs(session.last_used_at).format(
                                "DD MMM YYYY, hh:mm A",
                              )
                            : "Unknown"}
                        </p>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      disabled={loginLoading}
                      onClick={() =>
                        handleLogoutDeviceAndRetry(session.device_id)
                      }
                    >
                      {isRowLoading ? (
                        <span className="inline-flex items-center gap-1.5">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Logging out...
                        </span>
                      ) : (
                        "Logout This Device"
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <Button
            variant="outline"
            onClick={() => setSessionModalOpen(false)}
            disabled={loginLoading}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
