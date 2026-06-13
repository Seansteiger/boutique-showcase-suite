"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { requestWhatsAppOtp, verifyWhatsAppOtp } from "@/app/actions/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, MessageSquare, ShieldCheck, Smartphone, User } from "lucide-react";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function RegisterPage() {
    const router = useRouter();
    const pathname = usePathname();
    const prefix = pathname.startsWith("/food-co") ? "/food-co" :
                   pathname.startsWith("/furnish") ? "/furnish" :
                   pathname.startsWith("/home-appliances") ? "/home-appliances" : "";
    const settings = useStoreSettings();
    
    // Auth method state: "email" | "whatsapp"
    const [authMethod, setAuthMethod] = useState<"email" | "whatsapp">("email");
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    
    // Email state
    const [showPassword, setShowPassword] = useState(false);
    
    // WhatsApp state
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [otpCode, setOtpCode] = useState("");
    const [step, setStep] = useState<"phone" | "otp">("phone");
    const [resendTimer, setResendTimer] = useState(0);
    const [simulatedNotification, setSimulatedNotification] = useState<{
        code: string;
        message: string;
    } | null>(null);

    // Resend countdown effect
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { loginUser } = await import("@/app/actions/auth");
            const res = await loginUser("customer@scented.co", "customer");
            if (res.error) throw new Error(res.error);
            localStorage.setItem("white_label_user", JSON.stringify(res.user));
            alert("Simulated Google Sign-in successful!");
            router.push(`${prefix}/account`);
        } catch (err: any) {
            setError(err.message || "Failed to sign in with Google");
            setIsLoading(false);
        }
    };

    // Handle traditional email registration
    const handleEmailRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);

        try {
            const { registerUser } = await import("@/app/actions/auth");
            const result = await registerUser(formData);

            if (result.error) {
                throw new Error(result.error);
            }

            if (result.message) {
                setSuccess(result.message + " Redirecting to login...");
                setTimeout(() => {
                    router.push(`${prefix}/login`);
                }, 1500);
            }
        } catch (err: any) {
            setError(err.message || "Failed to register account");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle OTP Request
    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!phone || !fullName) {
            setError("Please fill in both name and phone number.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setSimulatedNotification(null);

        try {
            const res = await requestWhatsAppOtp(phone);

            if (res.error) {
                setError(res.error);
                return;
            }

            setStep("otp");
            setResendTimer(60);
            setSuccess("Verification code sent successfully!");

            // Display simulated on-screen notification in development
            if (res.devCode) {
                setSimulatedNotification({
                    code: res.devCode,
                    message: `Your L'Artelier verification code is ${res.devCode}. It is valid for 5 minutes.`
                });
            }
        } catch (err: any) {
            setError(err.message || "Failed to send code. Please check your number.");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle OTP Verification and B2C Creation
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otpCode || otpCode.length !== 6) {
            setError("Please enter a valid 6-digit code.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const res = await verifyWhatsAppOtp(phone, otpCode, fullName);

            if (res.error) {
                setError(res.error);
                return;
            }

            if (res.user) {
                localStorage.setItem("white_label_user", JSON.stringify(res.user));
                setSuccess("Account verified and registered successfully!");
                
                // If cart recovery token exists in session, route back to checkout
                const recoveryCart = typeof window !== "undefined" ? sessionStorage.getItem("recovery_cart_trigger") : null;
                if (recoveryCart) {
                    router.push(`${prefix}/checkout`);
                } else {
                    router.push(`${prefix}/`);
                }
            } else {
                router.push(`${prefix}/`);
            }

            router.refresh();
        } catch (err: any) {
            setError(err.message || "Verification failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Styling overrides from settings
    const btnRadiusClass = settings?.theme?.buttonRadius === "0px"
        ? "rounded-none"
        : settings?.theme?.buttonRadius === "4px"
            ? "rounded-sm"
            : settings?.theme?.buttonRadius === "8px"
                ? "rounded-lg"
                : settings?.theme?.buttonRadius === "9999px"
                    ? "rounded-full"
                    : "rounded-[2rem_0.5rem_2rem_0.5rem]"; // default Scented

    const inputRadiusClass = settings?.theme?.buttonRadius === "0px" ? "rounded-none" : "rounded-lg";

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-220px)] px-4 py-8 relative">
            
            {/* Beautiful Interactive Dev Notification Toast Banner */}
            <AnimatePresence>
                {simulatedNotification && (
                    <motion.div
                        initial={{ opacity: 0, y: -40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="fixed top-6 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50 rounded-2xl bg-[#075e54] text-white p-4 shadow-2xl border border-emerald-500/20"
                    >
                        <div className="flex gap-3">
                            <div className="bg-[#128c7e] rounded-full p-2.5 h-10 w-10 flex items-center justify-center text-white font-bold text-lg shrink-0">
                                💬
                            </div>
                            <div className="space-y-1 w-full">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">Simulated WhatsApp</span>
                                    <span className="text-[10px] text-emerald-200/80">Just now</span>
                                </div>
                                <p className="text-xs leading-relaxed font-sans">
                                    <strong>{settings?.brandName || "SCENTED"}:</strong> Your verification code is <strong className="bg-[#128c7e] px-1.5 py-0.5 rounded text-sm select-all">{simulatedNotification.code}</strong>. Valid for 5 mins.
                                </p>
                                <button
                                    onClick={() => {
                                        setOtpCode(simulatedNotification.code);
                                        setSuccess("Code copied and pasted!");
                                    }}
                                    className="text-[10px] bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-wider px-3 py-1 rounded transition-colors block mt-2"
                                >
                                    Auto-Fill Code
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="w-full max-w-md space-y-6 border custom-border p-8 rounded-[2rem_0.5rem_2rem_0.5rem] shadow-xl bg-card relative overflow-hidden ambient-glow">
                
                {/* Visual Glassmorphic Branding accents */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col space-y-2 text-center relative">
                    <h1 className="text-2xl font-serif font-medium uppercase tracking-widest text-primary">
                        Create an account
                    </h1>
                    <p className="text-xs text-muted-foreground tracking-wide font-sans">
                        Register to start shopping at {settings?.brandName || "SCENTED"}
                    </p>
                </div>

                {/* Elegant Method Switcher Tabs */}
                <div className="grid grid-cols-2 p-1 bg-secondary/35 rounded-full border border-border/10">
                    <button
                        onClick={() => {
                            setAuthMethod("email");
                            setError(null);
                            setSuccess(null);
                        }}
                        className={cn(
                            "py-2.5 text-[10px] uppercase font-bold tracking-widest transition-all rounded-full flex items-center justify-center gap-1.5",
                            authMethod === "email"
                                ? "bg-primary text-secondary shadow-md"
                                : "text-muted-foreground hover:text-primary"
                        )}
                    >
                        <ShieldCheck className="h-3.5 w-3.5" /> Email
                    </button>
                    <button
                        onClick={() => {
                            setAuthMethod("whatsapp");
                            setError(null);
                            setSuccess(null);
                        }}
                        className={cn(
                            "py-2.5 text-[10px] uppercase font-bold tracking-widest transition-all rounded-full flex items-center justify-center gap-1.5",
                            authMethod === "whatsapp"
                                ? "bg-primary text-secondary shadow-md"
                                : "text-muted-foreground hover:text-primary"
                        )}
                    >
                        <Smartphone className="h-3.5 w-3.5" /> WhatsApp OTP
                    </button>
                </div>

                {error && (
                    <Alert variant="destructive" className="rounded-xl border-destructive/20 bg-destructive/5 text-destructive">
                        <AlertDescription className="text-xs font-sans font-medium">{error}</AlertDescription>
                    </Alert>
                )}

                {success && (
                    <Alert className="rounded-xl border-green-500/20 bg-green-500/5 text-green-600 dark:text-green-400">
                        <AlertDescription className="text-xs font-sans font-medium">{success}</AlertDescription>
                    </Alert>
                )}

                <AnimatePresence mode="wait">
                    {authMethod === "email" ? (
                        <motion.form
                            key="email-form"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            onSubmit={handleEmailRegister}
                            className="space-y-4 font-sans text-xs"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="fullName" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Full Name</Label>
                                <Input 
                                    id="fullName" 
                                    name="fullName" 
                                    placeholder="John Doe" 
                                    required 
                                    className={cn("bg-secondary/20 border-border/10 focus:border-accent/40 py-5", inputRadiusClass)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Email Address</Label>
                                <Input 
                                    id="email" 
                                    name="email" 
                                    placeholder="m@example.com" 
                                    type="email" 
                                    required 
                                    className={cn("bg-secondary/20 border-border/10 focus:border-accent/40 py-5", inputRadiusClass)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        minLength={6}
                                        className={cn("bg-secondary/20 border-border/10 focus:border-accent/40 py-5 pr-10", inputRadiusClass)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        <span className="sr-only">Toggle password visibility</span>
                                    </button>
                                </div>
                            </div>
                            <Button className={cn("w-full py-6 text-[10px] uppercase font-bold tracking-widest mt-2", btnRadiusClass)} disabled={isLoading}>
                                {isLoading ? "Creating account..." : "Sign Up"}
                            </Button>
                        </motion.form>
                    ) : (
                        <motion.div
                            key="whatsapp-form"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="space-y-4 font-sans text-xs"
                        >
                            {step === "phone" ? (
                                <form onSubmit={handleRequestOtp} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="regName" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Full Name</Label>
                                        <div className="relative flex">
                                            <div className="flex items-center justify-center px-3 bg-secondary/50 border border-r-0 border-border/10 rounded-l-lg text-[11px] font-bold text-primary shrink-0 select-none">
                                                <User className="h-3.5 w-3.5 text-muted-foreground" />
                                            </div>
                                            <Input
                                                id="regName"
                                                type="text"
                                                placeholder="John Doe"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                required
                                                className={cn("bg-secondary/20 border-border/10 focus:border-accent/40 py-5 rounded-l-none rounded-r-lg w-full", inputRadiusClass)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">WhatsApp Phone Number</Label>
                                        <div className="relative flex">
                                            <div className="flex items-center justify-center px-3 bg-secondary/50 border border-r-0 border-border/10 rounded-l-lg text-[11px] font-bold text-primary shrink-0 select-none">
                                                🇿🇦 +27
                                            </div>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                placeholder="82 123 4567"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                required
                                                className={cn("bg-secondary/20 border-border/10 focus:border-accent/40 py-5 rounded-l-none rounded-r-lg w-full", inputRadiusClass)}
                                            />
                                        </div>
                                        <span className="text-[9px] text-muted-foreground leading-normal block">
                                            We will dispatch a secure 6-digit verification code to your WhatsApp app to verify your phone.
                                        </span>
                                    </div>
                                    <Button 
                                        type="submit" 
                                        className={cn("w-full py-6 text-[10px] uppercase font-bold tracking-widest flex items-center justify-center gap-1.5 mt-2", btnRadiusClass)} 
                                        disabled={isLoading || !phone || !fullName}
                                    >
                                        <MessageSquare className="h-3.5 w-3.5" /> {isLoading ? "Dispatching..." : "Send WhatsApp OTP"}
                                    </Button>
                                </form>
                            ) : (
                                <form onSubmit={handleVerifyOtp} className="space-y-4">
                                    <div className="space-y-3 text-center">
                                        <Label htmlFor="otpCode" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                                            Enter the 6-Digit Code sent to +{phone.replace(/\D/g, "")}
                                        </Label>
                                        
                                        <Input
                                            id="otpCode"
                                            value={otpCode}
                                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                            placeholder="••••••"
                                            className="text-center font-bold tracking-[0.6em] text-lg py-6 bg-secondary/20 border-border/10 focus:border-accent/40 rounded-xl w-full max-w-[200px] mx-auto"
                                            required
                                            maxLength={6}
                                            autoFocus
                                        />
                                        
                                        <div className="flex justify-between items-center text-[10px] pt-1">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setStep("phone");
                                                    setError(null);
                                                    setSuccess(null);
                                                }}
                                                className="text-accent hover:underline uppercase font-bold tracking-wider"
                                            >
                                                Change Details
                                            </button>
                                            
                                            {resendTimer > 0 ? (
                                                <span className="text-muted-foreground">Resend code in {resendTimer}s</span>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={handleRequestOtp}
                                                    className="text-primary hover:underline uppercase font-bold tracking-wider"
                                                >
                                                    Resend Code
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <Button 
                                        type="submit" 
                                        className={cn("w-full py-6 text-[10px] uppercase font-bold tracking-widest mt-4", btnRadiusClass)} 
                                        disabled={isLoading || otpCode.length !== 6}
                                    >
                                        {isLoading ? "Validating OTP..." : "Verify & Create Account"}
                                    </Button>
                                </form>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-[8px] tracking-widest text-muted-foreground font-bold font-sans">Or continue with</span>
                    </div>
                </div>

                <Button variant="outline" type="button" disabled={isLoading} className={cn("w-full py-5 text-[10px] uppercase font-bold tracking-widest font-sans border-border/10 flex items-center justify-center gap-2 hover:bg-secondary/40", inputRadiusClass)} onClick={handleGoogleLogin}>
                    <svg className="h-3.5 w-3.5 shrink-0" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                    </svg>
                    Google Sync
                </Button>

                <div className="text-center text-[10px] uppercase tracking-wider text-muted-foreground font-sans pt-2">
                    Already have an account?{" "}
                    <Link href={`${prefix}/login`} className="underline text-accent hover:text-primary font-bold">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}
