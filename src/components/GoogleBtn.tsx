"use client";
import { GoogleLogin } from "@react-oauth/google";
import { createAuthClient } from "better-auth/client";

const authClient = createAuthClient();

interface GoogleSignInButtonProps {
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export function GoogleSignInButton({ onSuccess, onError }: GoogleSignInButtonProps) {
  const handleSuccess = async (credentialResponse: any) => {
    const idToken = credentialResponse.credential;

    if (idToken) {
      const { data, error } = await authClient.signIn.social({
        provider: "google",
            idToken,
            callbackURL: "/",
        })

      if (error) {
        onError?.("Google sign-in failed.");
        console.error("Server auth failed:", error);
      } else {
        onSuccess?.();
        console.log("Signed in with Google:", data);
      }
    }else{
        onError?.("Missing ID token from Google.");
        return;
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => {
        onError?.("Google Login was canceled or failed.");
        console.error("Google Login Failed");
      }}
    />
  );
}
