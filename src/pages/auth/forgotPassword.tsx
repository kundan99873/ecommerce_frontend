import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Mail, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/authContext";
import { motion } from "motion/react";

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError("Please enter your email"); return; }
    setLoading(true);
    await forgotPassword(email);
    setSent(true);
    setLoading(false);
  };

  return (
    <>
      <div className="container mx-auto px-4 py-12 max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <Link to="/login" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to login
          </Link>

          {sent ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 mx-auto text-success" />
              <h1 className="text-2xl font-display font-bold mt-4">Check your email</h1>
              <p className="text-muted-foreground mt-2">We've sent a password reset link to <strong>{email}</strong></p>
              <Link to="/reset-password">
                <Button variant="outline" className="mt-6">Enter Reset Code</Button>
              </Link>
            </div>
          ) : (
            <>
              <div>
                <h1 className="text-3xl font-display font-bold">Forgot Password</h1>
                <p className="text-muted-foreground mt-2">Enter your email to receive a reset link</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">{error}</div>}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required />
                </div>
                <Button type="submit" className="w-full py-5" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Mail className="h-4 w-4 mr-2" />}
                  Send Reset Link
                </Button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default ForgotPassword;
