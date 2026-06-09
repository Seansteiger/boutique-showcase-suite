"use client";

import { useCallback } from 'react';

export function useAnalytics() {
    const trackEvent = useCallback(async (type: 'view' | 'cart_add' | 'sale', productId: string) => {
        try {
            await fetch('/api/analytics/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, productId })
            });
        } catch (error) {
            console.error('Analytics Error:', error);
        }
    }, []);

    return {
        trackView: (id: string) => trackEvent('view', id),
        trackCartAdd: (id: string) => trackEvent('cart_add', id),
    };
}
