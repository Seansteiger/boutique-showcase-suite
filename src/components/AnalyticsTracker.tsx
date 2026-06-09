"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function AnalyticsTracker() {
    const pathname = usePathname();
    const [visitorId, setVisitorId] = useState<string | null>(null);

    // 1. Establish Identity
    useEffect(() => {
        // Run only once in browser
        let id = localStorage.getItem("jsh_visitor_id");
        if (!id) {
            id = crypto.randomUUID();
            localStorage.setItem("jsh_visitor_id", id);
        }
        setVisitorId(id);
    }, []);

    // 2. Log Page Visited
    useEffect(() => {
        if (!visitorId || !pathname) return;

        // Optionally, ignore admin paths so staff don't skew the real customer metrics
        if (pathname.startsWith('/admin')) return;

        const logVisit = async () => {
            try {
                await fetch('/api/analytics/visit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ visitorId, pagePath: pathname }),
                    // don't abort immediately if they navigate away fast
                    keepalive: true,
                });
            } catch (err) {
                console.error("Traffic logger error:", err);
            }
        };

        // A small debounce to ensure page is loaded and prevent fast double-clicks
        const timeoutId = setTimeout(logVisit, 1000);

        return () => clearTimeout(timeoutId);
    }, [pathname, visitorId]);

    return null; // Headless tracker
}
