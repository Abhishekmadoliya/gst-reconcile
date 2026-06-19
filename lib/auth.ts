import { cookies } from "next/headers";
import { API_URL } from "./config";
import { UserProfile } from "@/store/useAuthStore";

export async function getServerUser(): Promise<UserProfile | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return null;
    }

    // Call Express backend /me endpoint forwarding the access token
    const response = await fetch(`${API_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
      // Ensure Next.js doesn't cache this user-specific request
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    if (result && result.success) {
      return result.data;
    }
    
    return null;
  } catch (err) {
    console.error("getServerUser error:", err);
    return null;
  }
}
