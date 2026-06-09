"use client";



import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;

        try {
            // Mock recovery simulation
            await new Promise(r => setTimeout(r, 1000));
            setSuccess(true);

        } catch (err: any) {
            setError(err.message || "Failed to send reset email");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(80vh-200px)] px-4 py-12">
            <div className="w-full max-w-sm space-y-6 border p-8 rounded-lg shadow-sm bg-card">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">Reset Password</h1>
                    <p className="text-sm text-muted-foreground">
                        Enter your email to receive a reset link
                    </p>
                </div>

                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {success ? (
                    <div className="text-center space-y-4">
                        <div className="flex justify-center">
                            <CheckCircle className="h-12 w-12 text-green-500" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Check your email for a link to reset your password.
                        </p>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/login">Return to Login</Link>
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleReset} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" placeholder="m@example.com" type="email" required />
                        </div>
                        <Button className="w-full" disabled={isLoading}>
                            {isLoading ? "Sending Link..." : "Send Reset Link"}
                        </Button>
                    </form>
                )}

                <div className="text-center">
                    <Link href="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
                        <ArrowLeft className="mr-2 h-3 w-3" />
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
