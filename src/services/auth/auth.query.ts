import { useMutation } from "@tanstack/react-query";
import { googleLogin, registerUser } from "./auth.api";
import type { RegisterBody } from "./auth.types";

const useGoogleLogin = () => {
  return useMutation({
    mutationFn: (credential: string) => googleLogin(credential),
  });
};


const useUserRegister = () => useMutation({
    mutationFn: (data: FormData) => registerUser(data),
})


export { useGoogleLogin, useUserRegister }