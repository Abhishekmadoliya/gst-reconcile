import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Helper to decode JWT payload safely on Next.js Edge runtime
function getJwtPayload(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const payload = getJwtPayload(token);
  if (!payload || !payload.exp) return true;
  // Current time in seconds (add a 10s buffer for safety)
  const currentTime = Math.floor(Date.now() / 1000) + 10;
  return payload.exp < currentTime;
}

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Define route classifications
  const isAuthRoute = path === "/login" || path === "/register";
  const isOnboardingRoute = path === "/onboarding";
  const isProtectedRoute = path.startsWith("/dashboard") || path.startsWith("/reconcile") || path.startsWith("/gstins") || isOnboardingRoute;
  const hasSkippedOnboarding = request.cookies.get("skip_onboarding")?.value === "true";

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const sessionToken = request.cookies.get("better-auth.session_token")?.value
    || request.cookies.get("__Secure-better-auth.session_token")?.value;

  let isAuthed = false;
  let userOnboardingCompleted: boolean | null = null;
  let newAccessToken: string | null = null;
  let newRefreshToken: string | null = null;

  // 1. Validate JWT Access Token
  if (accessToken && !isTokenExpired(accessToken)) {
    isAuthed = true;
    const payload = getJwtPayload(accessToken);
    if (payload && typeof payload.onboardingCompleted === "boolean") {
      userOnboardingCompleted = payload.onboardingCompleted;
    }
  } 
  // 2. Validate Better Auth Session Token (Google OAuth / SSO session)
  else if (sessionToken) {
    try {
      const allCookies = request.cookies.getAll();
      const cookieHeader = allCookies.map(c => `${c.name}=${c.value}`).join("; ");

      const meResponse = await fetch(`${API_URL}/api/auth/me`, {
        method: "GET",
        headers: {
          Cookie: cookieHeader,
        },
        cache: "no-store",
      });

      if (meResponse.ok) {
        isAuthed = true;
        const meData = await meResponse.json().catch(() => null);
        if (meData?.data && typeof meData.data.onboardingCompleted === "boolean") {
          userOnboardingCompleted = meData.data.onboardingCompleted;
        }

        // The backend /api/auth/me automatically issues accessToken and refreshToken cookies
        // when authenticated via Better Auth session. Propagate them to the response.
        const rawSetCookies = meResponse.headers.getSetCookie();
        rawSetCookies.forEach((cookieStr) => {
          const parts = cookieStr.split(";")[0].split("=");
          const name = parts[0].trim();
          const value = parts[1].trim();
          if (name === "accessToken") newAccessToken = value;
          if (name === "refreshToken") newRefreshToken = value;
        });

        if (newAccessToken && userOnboardingCompleted === null) {
          const payload = getJwtPayload(newAccessToken);
          if (payload && typeof payload.onboardingCompleted === "boolean") {
            userOnboardingCompleted = payload.onboardingCompleted;
          }
        }
      }
    } catch (err) {
      console.error("Better Auth session verification failed in proxy:", err);
    }
  }
  // 3. Token Rotation: Access token missing/expired but refresh token is present
  else if (refreshToken) {
    try {
      const refreshResponse = await fetch(`${API_URL}/api/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `refreshToken=${refreshToken}`,
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshResponse.ok) {
        const rawSetCookies = refreshResponse.headers.getSetCookie();
        rawSetCookies.forEach((cookieStr) => {
          const parts = cookieStr.split(";")[0].split("=");
          const name = parts[0].trim();
          const value = parts[1].trim();
          if (name === "accessToken") newAccessToken = value;
          if (name === "refreshToken") newRefreshToken = value;
        });

        if (newAccessToken) {
          isAuthed = true;
          const payload = getJwtPayload(newAccessToken);
          if (payload && typeof payload.onboardingCompleted === "boolean") {
            userOnboardingCompleted = payload.onboardingCompleted;
          }
        }
      }
    } catch (err) {
      console.error("Token rotation failed in proxy:", err);
    }
  }

  // 4. Handle Route Guards & Redirects
  let response = NextResponse.next();

  if (isProtectedRoute && !isAuthed) {
    // Redirect unauthenticated requests attempting to access protected routes
    response = NextResponse.redirect(new URL("/login", request.url));
  } else if (isAuthRoute && isAuthed) {
    // Redirect authenticated users trying to visit login/register
    if (userOnboardingCompleted === false && !hasSkippedOnboarding) {
      response = NextResponse.redirect(new URL("/onboarding", request.url));
    } else {
      response = NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } else if (
    isAuthed && 
    userOnboardingCompleted === false && 
    !hasSkippedOnboarding && 
    !isOnboardingRoute && 
    (path.startsWith("/dashboard") || path.startsWith("/reconcile"))
  ) {
    // Redirect newly registered / first-time login users directly to onboarding
    response = NextResponse.redirect(new URL("/onboarding", request.url));
  }

  // 5. Inject Updated Cookies to Response
  if (newAccessToken) {
    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60, // 15 mins
    });
  }

  if (newRefreshToken) {
    response.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });
  }

  // If credentials are completely invalid, clear cookies on response to ensure clean state
  if (!isAuthed && !sessionToken && (accessToken || refreshToken)) {
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|next.svg|vercel.svg).*)",
  ],
};
