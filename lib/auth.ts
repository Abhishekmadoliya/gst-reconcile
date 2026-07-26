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

    let response = await fetch(`${API_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
      cache: "no-store",
    });

    if (response.status === 401) {
      const refreshToken = cookieStore.get("refreshToken")?.value;
      if (refreshToken) {
        // Try to refresh the token via backend
        const refreshResponse = await fetch(`${API_URL}/api/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `refreshToken=${refreshToken}`,
          },
          body: JSON.stringify({}),
          cache: "no-store",
        });

        if (refreshResponse.ok) {
          // Extract the new accessToken from Set-Cookie header if possible, or response body
          const setCookie = refreshResponse.headers.get("set-cookie");
          let newAccessToken = null;
          
          if (setCookie) {
            const match = setCookie.match(/accessToken=([^;]+)/);
            if (match) {
              newAccessToken = match[1];
            }
          }

          if (newAccessToken) {
            // Retry /auth/me with the new access token
            response = await fetch(`${API_URL}/api/auth/me`, {
              method: "GET",
              headers: {
                Cookie: `accessToken=${newAccessToken}`,
              },
              cache: "no-store",
            });
          }
        }
      }
    }

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
