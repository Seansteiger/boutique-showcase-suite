import { cn } from "@/lib/utils";

interface PaymentIconsProps {
    className?: string;
    variant?: "monochrome" | "color";
    size?: "sm" | "md" | "lg";
}

/**
 * High-Fidelity Payment Provider Logos (v6 - Professional Polish)
 * Uses locally hosted, official brand .svg files with optimized layout.
 */
export function PaymentIcons({ 
    className, 
    variant = "monochrome",
    size = "md" 
}: PaymentIconsProps) {
    const isMonochrome = variant === "monochrome";

    const logos = [
        { name: "Visa", src: "/images/payment-methods/visa.svg" },
        { name: "Mastercard", src: "/images/payment-methods/mastercard.svg" },
        { name: "PayFast", src: "/images/payment-methods/payfast.svg" },
        { name: "Yoco", src: "/images/payment-methods/yoco.svg" },
        { name: "Apple Pay", src: "/images/payment-methods/apple-pay.svg" },
        { name: "Google Pay", src: "/images/payment-methods/google-pay.svg" },
    ];

    const sizeClasses = {
        sm: "h-5 md:h-6",
        md: "h-8 md:h-10",
        lg: "h-10 md:h-12"
    };

    const gapClasses = {
        sm: "gap-4 md:gap-5",
        md: "gap-6 md:gap-8",
        lg: "gap-8 md:gap-12"
    };

    return (
        <div className={cn(
            "flex flex-wrap items-center justify-center", 
            gapClasses[size],
            className
        )}>
            {logos.map((logo) => (
                <div 
                    key={logo.name}
                    className="relative group transition-all duration-300 transform hover:scale-105"
                >
                    <img 
                        src={logo.src} 
                        alt={logo.name}
                        className={cn(
                            "w-auto object-contain transition-all duration-500",
                            sizeClasses[size],
                            // Handle monochrome rendering if needed
                            isMonochrome && "brightness-0 invert opacity-80 group-hover:opacity-100"
                        )}
                        style={{ 
                            filter: isMonochrome ? "brightness(0) invert(1)" : "none" 
                        }}
                    />
                </div>
            ))}
        </div>
    );
}
