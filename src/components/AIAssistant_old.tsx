"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, Sparkles, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    products?: any[];
    actions?: { label: string; url?: string; query?: string }[];
}

// Offline conversation tree — tile-based Q&A
const OFFLINE_FLOWS: Record<string, { response: string; actions: { label: string; url?: string; query?: string }[] }> = {
    "__welcome__": {
        response: "Awe! 👋 I'm Sean, your JSH assistant. How can I help?",
        actions: [
            { label: "🛍️ Browse Products", query: "browse" },
            { label: "🔥 On Sale", url: "/shop?sort=sale" },
            { label: "📦 Delivery Info", query: "delivery" },
            { label: "💳 Payment Options", query: "payment" },
            { label: "📋 Track My Order", query: "track" },
            { label: "❓ Help & Returns", query: "help" },
        ]
    },
    "browse": {
        response: "What are you looking for? Pick a category:",
        actions: [
            { label: "🖼️ Room Decor", url: "/shop?category=room-decor" },
            { label: "💻 Tech & Gadgets", url: "/shop?category=tech" },
            { label: "🍳 Kitchen & Appliances", url: "/shop?category=kitchenware" },
            { label: "🎮 Game Night", url: "/shop?category=gamenight" },
            { label: "🏃 Lifestyle", url: "/shop?category=lifestyle" },
            { label: "🛒 View All Products", url: "/shop" },
            { label: "⬅️ Back", query: "__welcome__" },
        ]
    },
    "delivery": {
        response: "We deliver to UJ & Wits campuses and surrounding areas! 📦\n\n• Free delivery over R500\n• Same-week delivery for Auckland Park area\n• Delivery charges may apply outside 2km of Auckland Park",
        actions: [
            { label: "📍 Full Delivery Policy", url: "/legal/delivery" },
            { label: "🛍️ Start Shopping", url: "/shop" },
            { label: "⬅️ Back", query: "__welcome__" },
        ]
    },
    "payment": {
        response: "We accept multiple payment methods! 💳\n\n• Card payments via Yoco (Visa, Mastercard)\n• PayFast (EFT, card, instant EFT)\n• All payments are 100% secure",
        actions: [
            { label: "🛒 Go to Checkout", url: "/checkout" },
            { label: "📞 Contact Us", url: "/contact" },
            { label: "⬅️ Back", query: "__welcome__" },
        ]
    },
    "track": {
        response: "Need to track your order? Use the link below — you'll need your order ID from the confirmation email.",
        actions: [
            { label: "📦 Track My Order", url: "/account" },
            { label: "📧 Contact Support", url: "/contact" },
            { label: "⬅️ Back", query: "__welcome__" },
        ]
    },
    "help": {
        response: "Here's what you might need:",
        actions: [
            { label: "↩️ Returns & Refunds", query: "returns" },
            { label: "📞 Contact Us", url: "/contact" },
            { label: "📜 Terms & Conditions", url: "/legal/terms" },
            { label: "🔒 Privacy Policy", url: "/legal/privacy" },
            { label: "⬅️ Back", query: "__welcome__" },
        ]
    },
    "returns": {
        response: "📋 Returns Policy:\n\n• 7-day return window from delivery\n• Items must be unused and in original packaging\n• Contact us to initiate a return\n• Refunds processed within 5-7 business days",
        actions: [
            { label: "📜 Full Returns Policy", url: "/legal/returns" },
            { label: "📞 Contact Us", url: "/contact" },
            { label: "⬅️ Back", query: "help" },
        ]
    },
};

export function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [isOnline, setIsOnline] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Check if Gemini API is available on mount, set appropriate welcome
    useEffect(() => {
        async function checkOnline() {
            try {
                const res = await fetch("/api/ai", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message: "ping", checkOnly: true }),
                });
                if (res.ok) {
                    setIsOnline(true);
                    // Online welcome — natural, no tiles
                    setMessages([{
                        id: "1",
                        role: "assistant",
                        content: "Awe! 👋 I'm Sean from Jozi Student Hub. What are you looking for today? I can help you find the perfect stuff for your res room, kitchen, or study setup!"
                    }]);
                } else {
                    throw new Error("offline");
                }
            } catch {
                setIsOnline(false);
                // Offline welcome — tile-based navigation
                setMessages([{
                    id: "1",
                    role: "assistant",
                    content: OFFLINE_FLOWS["__welcome__"].response,
                    actions: OFFLINE_FLOWS["__welcome__"].actions
                }]);
            }
        }
        checkOnline();
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, [messages, isOpen]);

    // Handle tile click — if online, send as typed message to AI; if offline, use flow tree
    const handleTileClick = (query: string) => {
        if (isOnline) {
            // Send the query text to the AI as if the user typed it
            const displayText = query === "__welcome__" ? "Start over" : query.charAt(0).toUpperCase() + query.slice(1);
            const userMsg: Message = { id: Date.now().toString(), role: "user", content: displayText };
            setMessages(prev => [...prev, userMsg]);
            setLoading(true);

            fetch("/api/ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: displayText }),
            })
                .then(res => res.json())
                .then(data => {
                    setMessages(prev => [...prev, {
                        id: (Date.now() + 1).toString(),
                        role: "assistant" as const,
                        content: data.response,
                        products: data.products,
                        actions: data.actions?.length > 0 ? data.actions : undefined
                    }]);
                })
                .catch(() => {
                    setMessages(prev => [...prev, {
                        id: (Date.now() + 1).toString(),
                        role: "assistant" as const,
                        content: "Eish, connection dropped. Let me help you the quick way:",
                        actions: OFFLINE_FLOWS["__welcome__"].actions
                    }]);
                    setIsOnline(false);
                })
                .finally(() => setLoading(false));
            return;
        }

        // Offline: use flow tree
        const flow = OFFLINE_FLOWS[query];
        if (!flow) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            content: query === "__welcome__" ? "Start over" : query.charAt(0).toUpperCase() + query.slice(1)
        };

        const aiMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: flow.response,
            actions: flow.actions
        };

        setMessages(prev => [...prev, userMsg, aiMsg]);
    };

    // Handle typed message send
    const handleSend = async () => {
        if (!input.trim()) return;

        // If offline, try to match to a known flow keyword
        if (!isOnline) {
            const lower = input.toLowerCase();
            for (const [key] of Object.entries(OFFLINE_FLOWS)) {
                if (lower.includes(key)) {
                    setInput("");
                    handleTileClick(key);
                    return;
                }
            }
            // No match, show default offline response
            setMessages(prev => [...prev,
            { id: Date.now().toString(), role: "user", content: input },
            { id: (Date.now() + 1).toString(), role: "assistant", content: "I'm in quick help mode right now. Use the tiles below to navigate! 👇", actions: OFFLINE_FLOWS["__welcome__"].actions }
            ]);
            setInput("");
            return;
        }

        const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMsg.content }),
            });
            const data = await res.json();

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.response,
                products: data.products,
                actions: data.actions?.length > 0 ? data.actions : undefined
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error(error);
            setIsOnline(false);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: "assistant" as const,
                content: "Connection issues! Let me help you the quick way instead:",
                actions: OFFLINE_FLOWS["__welcome__"].actions
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-20 right-4 z-50 flex flex-col items-end gap-4 pointer-events-none">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="w-[280px] md:w-[380px] h-[480px] md:h-[560px] max-h-[80vh] pointer-events-auto border rounded-2xl shadow-2xl bg-background/95 backdrop-blur-xl flex flex-col overflow-hidden ring-1 ring-white/10"
                    >
                        {/* Header */}
                        <div className="relative overflow-hidden bg-zinc-950 p-4 flex items-center justify-between text-white shadow-lg shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-purple-600/20" />
                            <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50" />

                            <div className="relative flex items-center gap-3 z-10">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-orange-500 blur-lg opacity-40 animate-pulse" />
                                    <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 p-2 rounded-xl backdrop-blur-md relative">
                                        <Bot className="h-5 w-5 text-orange-400" />
                                    </div>
                                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                        <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", isOnline ? "bg-green-400" : "bg-yellow-400")}></span>
                                        <span className={cn("relative inline-flex rounded-full h-3 w-3 border-2 border-zinc-950", isOnline ? "bg-green-500" : "bg-yellow-500")}></span>
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm tracking-wide bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">SEAN AI</h3>
                                    <div className="text-[10px] text-orange-400/80 font-mono flex items-center gap-1">
                                        {isOnline ? (
                                            <><Sparkles className="h-3 w-3" /> ONLINE</>
                                        ) : (
                                            <><WifiOff className="h-3 w-3" /> QUICK HELP</>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="relative z-10 h-8 w-8 hover:bg-white/10 text-white/70 hover:text-white rounded-full transition-colors" onClick={() => setIsOpen(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <ScrollArea className="flex-1 p-4 bg-zinc-50/50 dark:bg-zinc-900/50" ref={scrollRef}>
                            <div className="space-y-6">
                                {messages.map((m) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={m.id}
                                        className={cn("flex flex-col gap-2 max-w-[90%]", m.role === "user" ? "ml-auto items-end" : "items-start")}
                                    >
                                        <div
                                            className={cn(
                                                "p-3.5 rounded-2xl text-sm shadow-sm leading-relaxed relative overflow-hidden whitespace-pre-line",
                                                m.role === "user"
                                                    ? "bg-orange-600 text-white rounded-tr-sm"
                                                    : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 border rounded-tl-sm"
                                            )}
                                        >
                                            {m.role === "user" && (
                                                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 to-white/10 pointer-events-none" />
                                            )}
                                            {m.content}
                                        </div>
                                        {m.products && m.products.length > 0 && (
                                            <div className="flex flex-col gap-2 w-full mt-1">
                                                {m.products.slice(0, 4).map(p => (
                                                    <Link href={`/shop/${p.slug}`} key={p.id} className="group block p-3 border border-orange-500/10 rounded-xl bg-card hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300">
                                                        <div className="flex gap-3 items-center">
                                                            <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-secondary ring-1 ring-border shrink-0">
                                                                {p.image_urls?.[0] ? (
                                                                    <img src={p.image_urls[0]} alt="" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                                                                ) : (
                                                                    <Bot className="h-6 w-6 m-auto text-muted-foreground" />
                                                                )}
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <div className="font-semibold text-sm truncate group-hover:text-orange-600 transition-colors">{p.title}</div>
                                                                <div className="text-muted-foreground font-mono text-xs">
                                                                    R{p.price.toFixed(2)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                        {m.actions && m.actions.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {m.actions.map((action, idx) => (
                                                    action.url ? (
                                                        <Link
                                                            key={idx}
                                                            href={action.url}
                                                            className="px-4 py-2 text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors flex items-center gap-1"
                                                        >
                                                            {action.label}
                                                        </Link>
                                                    ) : (
                                                        <button
                                                            key={idx}
                                                            onClick={() => action.query && handleTileClick(action.query)}
                                                            className="px-4 py-2 text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors flex items-center gap-1"
                                                        >
                                                            {action.label}
                                                        </button>
                                                    )
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                                {loading && (
                                    <div className="flex gap-2 items-center text-muted-foreground text-xs pl-3 font-mono">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                                        </span>
                                        PROCESSING...
                                    </div>
                                )}
                            </div>
                        </ScrollArea>

                        {/* Input area — always allow typing, behavior differs online/offline */}
                        <div className="p-3 bg-background border-t backdrop-blur-xl shrink-0">
                            <div className="relative flex items-center gap-2">
                                <Input
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && handleSend()}
                                    placeholder={isOnline ? "Ask Sean anything..." : "Type a question..."}
                                    className="flex-1 pr-10 rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 focus:bg-background transition-all h-12 shadow-inner focus:ring-orange-500"
                                />
                                <Button
                                    size="icon"
                                    onClick={handleSend}
                                    disabled={loading}
                                    className="absolute right-1.5 h-9 w-9 rounded-lg bg-orange-600 hover:bg-orange-700 text-white shadow-sm hover:shadow-orange-500/25 transition-all"
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                    "pointer-events-auto h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-2xl transition-all duration-500 relative group z-50",
                    isOpen ? "bg-zinc-900 rotate-90 ring-4 ring-zinc-200 dark:ring-zinc-800" : "bg-zinc-900 dark:bg-zinc-950"
                )}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className={cn("absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500 to-purple-600 opacity-100 group-hover:opacity-90 transition-opacity", isOpen && "opacity-0")} />

                {!isOpen && (
                    <div className="absolute -inset-1 rounded-[18px] bg-gradient-to-r from-orange-600 to-purple-600 blur opacity-40 group-hover:opacity-75 transition-opacity duration-500 animate-pulse" />
                )}

                {isOpen ? (
                    <X className="h-5 w-5 text-white relative z-10" />
                ) : (
                    <div className="relative z-10">
                        <MessageSquare className="h-5 w-5 text-white drop-shadow-md" />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-orange-500"></span>
                        </span>
                    </div>
                )}
            </motion.button>
        </div>
    );
}
