// import { useState } from "react";
// import { Link, useNavigate } from "react-router";
// import { Eye, EyeOff, UserPlus, Loader2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import { useAuth } from "@/context/authContext";
// import { toast } from "@/hooks/useToast";
// import { motion } from "motion/react";
// import ImageUpload from "@/components/common/imageUpload";

// const passwordRules = [
//   { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
//   { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
//   { label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
//   { label: "One number", test: (p: string) => /\d/.test(p) },
//   { label: "One special character", test: (p: string) => /[!@#$%^&*]/.test(p) },
// ];

// const Register = () => {
//   const { register, isLoading, isAuthenticated } = useAuth();
//   const navigate = useNavigate();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [agreed, setAgreed] = useState(false);
//   const [error, setError] = useState("");
//   const [avatar, setAvatar] = useState<string | undefined>();

//   if (isAuthenticated) {
//     navigate("/", { replace: true });
//     return null;
//   }

//   const isPasswordStrong = passwordRules.every((r) => r.test(password));

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     if (!name.trim() || !email.trim() || !password || !confirmPassword) {
//       setError("Please fill in all fields");
//       return;
//     }
//     if (!isPasswordStrong) {
//       setError("Please meet all password requirements");
//       return;
//     }
//     if (password !== confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }
//     if (!agreed) {
//       setError("Please agree to the terms & conditions");
//       return;
//     }

//     const success = await register(name, email, password);
//     console.log(avatar)
//     if (success) {
//       toast({ title: "Account created!", description: "Welcome to LUMIÈRE." });
//       navigate("/", { replace: true });
//     } else {
//       setError("An account with this email already exists");
//     }
//   };

//   return (
//     <>
//       <div className="container mx-auto px-4 py-12 max-w-md">
//         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
//           <div className="text-center">
//             <h1 className="text-3xl font-display font-bold">Create Account</h1>
//             <p className="text-muted-foreground mt-2">Join LUMIÈRE today</p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">{error}</div>}

//             <ImageUpload onUpload={setAvatar} />

//             <div className="space-y-2">
//               <Label htmlFor="name">Full Name</Label>
//               <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Alex Johnson" />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="your@email.com" />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <div className="relative">
//                 <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required />
//                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
//                   {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                 </button>
//               </div>
//               {password && (
//                 <div className="grid grid-cols-2 gap-1 mt-2">
//                   {passwordRules.map((r) => (
//                     <p key={r.label} className={`text-xs ${r.test(password) ? "text-success" : "text-muted-foreground"}`}>
//                       {r.test(password) ? "✓" : "○"} {r.label}
//                     </p>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="confirm">Confirm Password</Label>
//               <Input id="confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
//               {confirmPassword && password !== confirmPassword && (
//                 <p className="text-xs text-destructive">Passwords do not match</p>
//               )}
//             </div>

//             <div className="flex items-start gap-2">
//               <Checkbox id="terms" checked={agreed} onCheckedChange={(v) => setAgreed(v as boolean)} className="mt-0.5" />
//               <label htmlFor="terms" className="text-sm cursor-pointer">
//                 I agree to the <span className="text-primary hover:underline">Terms & Conditions</span> and{" "}
//                 <span className="text-primary hover:underline">Privacy Policy</span>
//               </label>
//             </div>

//             <Button type="submit" className="w-full py-5" disabled={isLoading}>
//               {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />}
//               Create Account
//             </Button>
//           </form>

//           <p className="text-center text-sm text-muted-foreground">
//             Already have an account?{" "}
//             <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
//           </p>
//         </motion.div>
//       </div>
//     </>
//   );
// };

// export default Register;



import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, UserPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/context/authContext";
import { toast } from "@/hooks/useToast";
import { motion } from "motion/react";
import ImageUpload from "@/components/common/imageUpload";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { useUserRegister } from "@/services/auth/auth.query";

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreed: boolean;
  avatar?: File;
};

const passwordRules = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "One number", test: (p: string) => /\d/.test(p) },
  { label: "One special character", test: (p: string) => /[!@#$%^&*]/.test(p) },
];

const Register = () => {
  // const { register: registerUser, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    // setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreed: false,
      avatar: undefined,
    },
  });

  const password = watch("password");
  // const confirmPassword = watch("confirmPassword");

  const isPasswordStrong = passwordRules.every((r) => r.test(password || ""));

  const mutation = useUserRegister();

  // if (isAuthenticated) {
  //   navigate("/", { replace: true });
  //   return null;
  // }

  const onSubmit = async (data: RegisterFormValues) => {
    const formData = new FormData();

  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("password", data.password);

  if (data.avatar) {
    formData.append("avatar", data.avatar);
  }
  console.log(data.avatar instanceof File);
    console.log({formData})
    if (!isPasswordStrong) {
      return;
    }

    const response = await mutation.mutateAsync(formData)
    console.log({response})
    toast({ title: "Account created!", description: "Welcome to LUMIÈRE." });

    // const success = await registerUser(data.name, data.email, data.password);
    // if (success) {
    //   navigate("/", { replace: true });
    // }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center">
          <h1 className="text-3xl font-display font-bold">Create Account</h1>
          <p className="text-muted-foreground mt-2">Join LUMIÈRE today</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* IMAGE */}
          <Controller
            name="avatar"
            control={control}
            render={({ field }) => (
              <ImageUpload onUpload={(file) => field.onChange(file)} currentImage={undefined} />
            )}
          />

          {/* NAME */}
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input
              {...register("name", { required: "Name is required" })}
              placeholder="Alex Johnson"
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          {/* EMAIL */}
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              {...register("email", { required: "Email is required" })}
              placeholder="your@email.com"
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          {/* PASSWORD */}
          <div className="space-y-2">
            <Label>Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                {...register("password", { required: "Password is required" })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {password && (
              <div className="grid grid-cols-2 gap-1 mt-2">
                {passwordRules.map((r) => (
                  <p
                    key={r.label}
                    className={`text-xs ${
                      r.test(password) ? "text-success" : "text-muted-foreground"
                    }`}
                  >
                    {r.test(password) ? "✓" : "○"} {r.label}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* CONFIRM */}
          <div className="space-y-2">
            <Label>Confirm Password</Label>
            <Input
              type="password"
              {...register("confirmPassword", {
                required: "Confirm password",
                validate: (val) =>
                  val === password || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* TERMS */}
          <div className="flex items-start gap-2">
            <Controller
              name="agreed"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(v) => field.onChange(v)}
                />
              )}
            />
            <label className="text-sm">
              I agree to the{" "}
              <span className="text-primary hover:underline">Terms & Conditions</span> and{" "}
              <span className="text-primary hover:underline">Privacy Policy</span>
            </label>
          </div>
          {errors.agreed && (
            <p className="text-xs text-destructive">
              Please agree to the terms & conditions
            </p>
          )}

          <Button type="submit" className="w-full py-5" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <UserPlus className="h-4 w-4 mr-2" />
            )}
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
