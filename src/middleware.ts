import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;

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
        "invited": "/invited",
    };

    let subdomain = "";
    if (hostname.includes("steigeronline.co.za")) {
        subdomain = hostname.replace(".steigeronline.co.za", "").trim().toLowerCase();
    } else if (hostname.includes("localhost")) {
        // Allows local testing (e.g. furnish.localhost:3001)
        subdomain = hostname.split(".")[0].trim().toLowerCase();
    }

    if (subdomain && subdomainMapping[subdomain]) {
        const targetFolder = subdomainMapping[subdomain];

        // Scented domain routes: Scented homepage is at "/scented", but other pages (like /shop, /cart) are at root.
        if (subdomain === "scented") {
            if (pathname === "/" || pathname === "") {
                return NextResponse.rewrite(new URL("/scented", request.url));
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
                return NextResponse.rewrite(newUrl);
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

    return NextResponse.next();
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
