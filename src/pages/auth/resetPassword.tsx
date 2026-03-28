import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  KeyRound,
  ShieldCheck,
  CircleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/authContext";
import { motion } from "motion/react";
import { toast } from "@/hooks/useToast";
import { useVerifyResetToken } from "@/services/auth/auth.query";

const ResetPassword = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const { mutateAsync: verifyResetToken } = useVerifyResetToken();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isVerifyingToken, setIsVerifyingToken] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const validateToken = async () => {
      if (!token) {
        if (!isMounted) return;
        setError("This reset link is invalid or missing. Please go to login.");
        setIsTokenValid(false);
        setIsVerifyingToken(false);
        return;
      }

      try {
        setIsVerifyingToken(true);
        await verifyResetToken({ token });
        if (!isMounted) return;
        setError("");
        setIsTokenValid(true);
      } catch (error: unknown) {
        if (!isMounted) return;
        const message =
          typeof error === "object" &&
          error !== null &&
          "response" in error &&
          typeof error.response === "object" &&
          error.response !== null &&
          "data" in error.response &&
          typeof error.response.data === "object" &&
          error.response.data !== null &&
          "message" in error.response.data &&
          typeof error.response.data.message === "string"
            ? error.response.data.message
            : "This reset link is invalid or expired. Please go to login.";

        setError(message);
        setIsTokenValid(false);
      } finally {
        if (isMounted) {
          setIsVerifyingToken(false);
        }
      }
    };

    validateToken();

    return () => {
      isMounted = false;
    };
  }, [token, verifyResetToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await resetPassword(token, password);
      toast({
        title: "Password updated",
        description:
          response.message || "Your password has been reset successfully.",
      });
      navigate("/login");
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof error.response === "object" &&
        error.response !== null &&
        "data" in error.response &&
        typeof error.response.data === "object" &&
        error.response.data !== null &&
        "message" in error.response.data &&
        typeof error.response.data.message === "string"
          ? error.response.data.message
          : "Failed to reset password. Please verify the reset code and try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.2)_0%,transparent_45%),linear-gradient(180deg,hsl(var(--background))_0%,hsl(var(--muted)/0.35)_100%)] px-4 py-8">
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute -top-24 -left-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg rounded-2xl border border-border/60 bg-card/90 p-6 shadow-2xl backdrop-blur sm:p-8"
        >
          <Link
            to="/forgot-password"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>

          <div className="mt-5 space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure Password Recovery
            </div>
            <h1 className="text-3xl font-display font-bold tracking-tight">
              Reset Password
            </h1>
            <p className="text-sm text-muted-foreground">
              {isTokenValid
                ? "Create a strong new password for your account."
                : "We are verifying your reset link before continuing."}
            </p>
          </div>

          {isVerifyingToken && (
            <div className="mt-6 rounded-xl border border-border/60 bg-muted/30 p-6 text-center">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">
                Validating reset token...
              </p>
            </div>
          )}

          {!isVerifyingToken && !isTokenValid && (
            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-destructive">
                <div className="flex items-start gap-2 text-sm">
                  <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    {error || "This reset link is invalid or expired."}
                  </span>
                </div>
              </div>
              <Button
                className="w-full py-5"
                onClick={() => navigate("/login")}
              >
                Go to Login Page
              </Button>
            </div>
          )}

          {!isVerifyingToken && isTokenValid && (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {error && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Use at least 8 characters with a mix of letters and numbers.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm New Password</Label>
                <Input
                  id="confirm"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-11 rounded-xl"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full py-5 text-sm"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <KeyRound className="mr-2 h-4 w-4" />
                )}
                Reset Password
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
