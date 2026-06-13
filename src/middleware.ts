import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;
    
    // Create new headers so we can set x-pathname and x-subdomain for down-stream layouts/server components
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-pathname", pathname);

    // 1. Intercept preview triggers at the server edge to set the session cookie and redirect to a clean URL
    const previewTrigger = searchParams.get("preview") || searchParams.get("theme");
    if (previewTrigger) {
        const selected = previewTrigger.toLowerCase();
        const url = request.nextUrl.clone();
        url.searchParams.delete("preview");
        url.searchParams.delete("theme");
        
        const response = NextResponse.redirect(url);
        response.cookies.set("theme_preview", selected, {
            path: "/",
            maxAge: 3600,
            sameSite: "lax"
        });
        return response;
    }

    // 2. Subdomain Routing Logic
    const hostname = request.headers.get("host") || "";
    const subdomainMapping: Record<string, string> = {
        "scented": "/scented",
        "furnish": "/furnish",
        "foodco": "/food-co",
        "food-co": "/food-co",
        "home-appliances": "/home-appliances",
        "invited": "/invited",
        "hhm": "/hhm",
    };

    let subdomain = "";
    if (hostname.includes("steigeronline.co.za")) {
        subdomain = hostname.replace(".steigeronline.co.za", "").trim().toLowerCase();
    } else if (hostname.includes("localhost")) {
        // Allows local testing (e.g. furnish.localhost:3001)
        subdomain = hostname.split(".")[0].trim().toLowerCase();
    }

    // Resolve subdomain based on local testing environment or preview overrides
    if (subdomain === "localhost" || !subdomain) {
        // 1. Check for explicit preview cookie override
        const previewCookie = request.cookies.get("theme_preview")?.value;
        if (previewCookie) {
            subdomain = previewCookie.toLowerCase();
        } else {
            // 2. Check where the npm run dev process was initiated
            const initCwd = (typeof process !== "undefined" && process.env ? process.env.INIT_CWD : "") || "";
            const processCwd = typeof process !== "undefined" && typeof process.cwd === "function" ? process.cwd() : "";
            
            const normalizedInitCwd = initCwd.replace(/\\/g, "/").toLowerCase();
            const normalizedProcessCwd = processCwd.replace(/\\/g, "/").toLowerCase();
            
            const findStoreInPath = (pathStr: string) => {
                if (pathStr.includes("/hhm")) return "hhm";
                if (pathStr.includes("/furnish")) return "furnish";
                if (pathStr.includes("/scented")) return "scented";
                if (pathStr.includes("/food-co") || pathStr.includes("/foodco")) return "food-co";
                if (pathStr.includes("/home-appliances")) return "home-appliances";
                if (pathStr.includes("/invited")) return "invited";
                return null;
            };

            const storeFromInitCwd = findStoreInPath(normalizedInitCwd);
            const storeFromProcessCwd = findStoreInPath(normalizedProcessCwd);
            
            if (storeFromInitCwd) {
                subdomain = storeFromInitCwd;
            } else if (storeFromProcessCwd) {
                subdomain = storeFromProcessCwd;
            }
        }
    }


    if (subdomain) {
        requestHeaders.set("x-subdomain", subdomain);
    }

    if (subdomain && subdomainMapping[subdomain]) {
        const targetFolder = subdomainMapping[subdomain];

        // Scented domain routes: Scented homepage is at "/scented", but other pages (like /shop, /cart) are at root.
        if (subdomain === "scented") {
            if (pathname === "/" || pathname === "") {
                return NextResponse.rewrite(new URL("/scented", request.url), {
                    request: { headers: requestHeaders }
                });
            }
        } else {
            // For other subdomains (furnish, foodco, invited):
            // Redirect requests to their subfolders if not static files, APIs, or already pointing to target folder
            if (
                !pathname.startsWith(targetFolder) &&
                !pathname.startsWith("/api") &&
                !pathname.startsWith("/_next") &&
                !pathname.includes(".")
            ) {
                const rewrittenPath = `${targetFolder}${pathname === "/" ? "" : pathname}`;
                const newUrl = new URL(rewrittenPath, request.url);
                searchParams.forEach((val, key) => {
                    newUrl.searchParams.set(key, val);
                });
                return NextResponse.rewrite(newUrl, {
                    request: { headers: requestHeaders }
                });
            }
        }
    }

    const sessionCookie = request.cookies.get("auth_session");
    let user: any = null;
    let profileRole: string | null = null;

    if (sessionCookie?.value) {
        try {
            const session = JSON.parse(sessionCookie.value);
            user = {
                id: session.id,
                email: session.email,
                name: session.name
            };
            profileRole = session.role; // "super_admin" | "admin" | "manager" | "customer"
        } catch (e) {
            console.error("Failed to parse auth_session cookie in middleware:", e);
        }
    }


    // 1. Protect /super-admin routes (Strictly requires super_admin role)
    if (pathname.startsWith("/super-admin")) {
        if (!user) {
            return NextResponse.redirect(new URL("/login?redirect=" + encodeURIComponent(pathname), request.url));
        }

        if (profileRole !== "super_admin") {
            console.warn(`Unauthorized access attempt to /super-admin by ${user.email} (role: ${profileRole})`);
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    // 2. Protect /admin routes (Requires admin, manager, or super_admin)
    if (pathname.startsWith("/admin")) {
        if (!user) {
            return NextResponse.redirect(new URL("/login?redirect=" + encodeURIComponent(pathname), request.url));
        }

        if (profileRole !== "admin" && profileRole !== "manager" && profileRole !== "super_admin") {
            console.warn(`Unauthorized access attempt to /admin by ${user.email} (role: ${profileRole})`);
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    return NextResponse.next({
        request: { headers: requestHeaders }
    });
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public assets
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
