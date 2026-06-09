"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-2xl font-bold">Something went wrong!</h2>
            <p className="text-muted-foreground max-w-md">
                We encountered an error while loading this page. Please try again.
            </p>
            <Button onClick={() => reset()}>Try again</Button>
        </div>
    );
}
