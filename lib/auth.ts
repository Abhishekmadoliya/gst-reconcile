import { cookies } from "next/headers";
import { API_URL } from "./config";
import { UserProfile } from "@/store/useAuthStore";

export async function getServerUser(): Promise<UserProfile | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken && !sessionToken) {
      return null;
    }

    const allCookies = cookieStore.getAll();
    const cookieHeader = allCookies.map(c => `${c.name}=${c.value}`).join("; ");

    let response = await fetch(`${API_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (response.status === 401 && !sessionToken) {
      const refreshToken = cookieStore.get("refreshToken")?.value;
      if (refreshToken) {
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
          const setCookie = refreshResponse.headers.get("set-cookie");
          let newAccessToken = null;
          
          if (setCookie) {
            const match = setCookie.match(/accessToken=([^;]+)/);
            if (match) {
              newAccessToken = match[1];
            }
          }

          if (newAccessToken) {
            response = await fetch(`${API_URL}/api/auth/me`, {
              method: "GET",
              headers: {
                Cookie: `accessToken=${newAccessToken}; ${cookieHeader}`,
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
