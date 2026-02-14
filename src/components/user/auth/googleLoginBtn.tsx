import { useGoogleLogin as useReactGoogleLogin } from "@react-oauth/google";
import { useGoogleLogin } from "@/services/auth/auth.query";
import { Button } from "@/components/ui/button";

export default function GoogleLoginBtn() {
  const mutation = useGoogleLogin();

  const googleLogin = useReactGoogleLogin({
    flow:"implicit",
    onSuccess: (response) => {
      mutation.mutate(response.access_token);
    },
    onError: () => {
      console.error("Google login failed");
    },
  });

  return (
    <Button
      onClick={() => googleLogin()}
      className="w-full py-5 rounded"
    >
      {/* <Google /> */}
      Login with Google
    </Button>
  );
}
