import { jwtDecode } from "jwt-decode";

export function handleGoogleSignInSuccess(
  credential: string,
  onSuccess: (user: any) => void,
  onError?: () => void
) {
  try {
    if (!credential || credential.trim() === "") {
      console.error("Invalid credential provided");
      if (onError) {
        onError();
      } else {
        alert("Google sign-in failed! Invalid credential.");
      }
      return;
    }

    // Decode and validate JWT
    const user = jwtDecode(credential);

    if (!user) {
      console.error("Failed to decode JWT token");
      if (onError) {
        onError();
      } else {
        alert("Google sign-in failed! Invalid token.");
      }
      return;
    }

    // Store authentication data
    localStorage.setItem("google_jwt", credential);
    localStorage.setItem("google_user", JSON.stringify(user));

    // Call success callback
    onSuccess(user);
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    if (onError) {
      onError();
    } else {
      alert("Google sign-in failed! Please try again.");
    }
  }
}
