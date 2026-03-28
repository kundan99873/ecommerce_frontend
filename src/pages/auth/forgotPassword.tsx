import { useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  Mail,
  Loader2,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/authContext";
import { motion } from "motion/react";
import { toast } from "@/hooks/useToast";

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      const response = await forgotPassword(email.trim());
      setSent(true);
      toast({
        title: "Reset link sent",
        description:
          response.message ||
          "Please check your inbox for password reset instructions.",
      });
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
          : "Failed to send reset instructions. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_15%_15%,hsl(var(--primary)/0.24)_0%,transparent_35%),radial-gradient(circle_at_92%_85%,hsl(var(--chart-2)/0.24)_0%,transparent_35%),linear-gradient(160deg,hsl(var(--background))_0%,hsl(var(--muted)/0.35)_100%)] px-4 py-8">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-14 -right-10 h-52 w-52 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-teal-500/20 blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-2xl border border-border/60 bg-card/90 p-6 shadow-2xl backdrop-blur sm:p-8"
        >
          <Link
            to="/login"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to login
          </Link>

          {sent ? (
            <div className="py-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
              <h1 className="mt-4 text-2xl font-display font-bold tracking-tight">
                Check your email
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                We&apos;ve sent a password reset link to{" "}
                <strong>{email}</strong>
              </p>
              <Link to="/login">
                <Button variant="outline" className="mt-6 w-full">
                  Back to Login
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="mt-5 space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Recover Account
                </div>
                <h1 className="text-3xl font-display font-bold tracking-tight">
                  Forgot Password
                </h1>
                <p className="text-sm text-muted-foreground">
                  Enter your email to receive a reset link
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {error && (
                  <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="h-11 rounded-xl"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full py-5"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Mail className="mr-2 h-4 w-4" />
                  )}
                  Send Reset Link
                </Button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
