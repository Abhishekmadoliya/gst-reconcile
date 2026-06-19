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
  } catch (e) {
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
  // For this project phase, we classifications /dashboard, /reconcile, /gstins as protected
  const isProtectedRoute = path.startsWith("/dashboard") || path.startsWith("/reconcile") || path.startsWith("/gstins");

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  let isAuthed = false;
  let newAccessToken: string | null = null;
  let newRefreshToken: string | null = null;

  // 1. Validate Access Token
  if (accessToken && !isTokenExpired(accessToken)) {
    isAuthed = true;
  } 
  // 2. Token Rotation: Access token missing/expired but refresh token is present
  else if (refreshToken) {
    try {
      const refreshResponse = await fetch(`${API_URL}/api/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Forward the refresh cookie to backend
          Cookie: `refreshToken=${refreshToken}`
        },
        body: JSON.stringify({ refreshToken })
      });

      if (refreshResponse.ok) {
        // Parse custom set-cookie headers from Express backend
        const rawSetCookies = refreshResponse.headers.getSetCookie();
        
        rawSetCookies.forEach((cookieStr) => {
          // Parse cookie attributes
          const parts = cookieStr.split(";")[0].split("=");
          const name = parts[0].trim();
          const value = parts[1].trim();
          
          if (name === "accessToken") newAccessToken = value;
          if (name === "refreshToken") newRefreshToken = value;
        });

        if (newAccessToken) {
          isAuthed = true;
        }
      }
    } catch (err) {
      console.error("Token rotation failed in middleware:", err);
    }
  }

  // 3. Handle Route Guards & Redirects
  let response = NextResponse.next();

  if (isProtectedRoute && !isAuthed) {
    // Redirect unauthenticated requests attempting to access dashboard
    response = NextResponse.redirect(new URL("/login", request.url));
  } else if (isAuthRoute && isAuthed) {
    // Redirect authenticated users trying to visit login/register
    response = NextResponse.redirect(new URL("/", request.url));
  }

  // 4. Inject Updated Cookies to Response & Request (To prevent SSR token mismatch)
  if (newAccessToken) {
    // Write updated tokens to Next.js middleware response cookies
    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 // 15 mins
    });
    
    // Set cookie on request headers so Server Components in this render cycle immediately receive them
    request.cookies.set("accessToken", newAccessToken);
  }

  if (newRefreshToken) {
    response.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });
    
    request.cookies.set("refreshToken", newRefreshToken);
  }

  // If credentials are completely invalid, clear cookies on response to ensure state syncs
  if (!isAuthed && (accessToken || refreshToken)) {
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
  }

  return response;
}

// Next.js matcher configuration: Intercept pages, API routes, but exclude static assets
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (Next.js internal API routes, not backend routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - next.svg, vercel.svg (svgs)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|next.svg|vercel.svg).*)",
  ],
};
