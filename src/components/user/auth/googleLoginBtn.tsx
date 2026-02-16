import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLogin as useGoogleMutation } from "@/services/auth/auth.query";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router";

export default function GoogleLoginBtn() {
  const mutation = useGoogleMutation();
  const location = useLocation();
  const navigate = useNavigate();
  const from = (location.state as { from?: string })?.from || "/";

  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          if (!credentialResponse.credential) {
            toast.error("Google login failed");
            return;
          }

          const response = await mutation.mutateAsync(
            credentialResponse.credential,
          );
          console.log(response);
          if (response.success) {
            toast.success("Logged in successfully");
            navigate(from, { replace: true });
          } else {
            toast.error(response.message || "Google login failed");
          }
        }}
        onError={() => {
          toast.error("Google login failed");
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
