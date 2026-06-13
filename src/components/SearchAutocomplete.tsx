"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

// Inline debounce for simplicity
function useDebounceValue<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

interface SearchAutocompleteProps {
    onSelect?: () => void; // callback to close menus, etc.
    className?: string;
}

export function SearchAutocomplete({ onSelect, className }: SearchAutocompleteProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);

    // Faster 200ms debounce for snappier suggestions
    const debouncedQuery = useDebounceValue(query, 200);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        async function fetchResults() {
            if (debouncedQuery.length < 2) {
                setResults([]);
                setIsOpen(false);
                return;
            }

            setIsLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
                const data = await res.json();
                setResults(data.results || []);
                setIsOpen(true);
            } catch (error) {
                console.error("Search error", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchResults();
    }, [debouncedQuery]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            router.push(`/shop?search=${encodeURIComponent(query)}`);
            setIsOpen(false);
            setQuery("");
            onSelect?.();
        }
        if (e.key === "Escape") {
            setIsOpen(false);
        }
    };

    const handleResultClick = () => {
        setIsOpen(false);
        setQuery("");
        onSelect?.();
    };

    return (
        <div className={`relative w-full ${className || ''}`} ref={containerRef}>
            <div className="relative">
                <Search
                    className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground cursor-pointer"
                    onClick={() => {
                        if (query.length >= 2) {
                            router.push(`/shop?search=${encodeURIComponent(query)}`);
                            setIsOpen(false);
                            setQuery("");
                            onSelect?.();
                        }
                    }}
                />
                <Input
                    type="search"
                    placeholder="Search products..."
                    className="w-full pl-9 pr-8 bg-secondary/10 border-transparent focus:bg-background focus:border-input transition-all"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        if (e.target.value.length >= 2) setIsOpen(true);
                    }}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                        if (results.length > 0) setIsOpen(true);
                    }}
                />
                {isLoading && (
                    <div className="absolute right-3 top-2.5">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                )}
            </div>

            {/* Results Dropdown */}
            {isOpen && (results.length > 0 || (query.length >= 2 && !isLoading)) && (
                <div className="relative mt-3 w-full md:absolute md:top-full md:mt-2 md:left-0 md:translate-x-0 md:w-full max-w-[450px] rounded-xl border bg-popover shadow-2xl overflow-hidden z-[60] animate-in fade-in zoom-in-95 duration-150">
                    <div className="max-h-[360px] overflow-y-auto p-1.5 scrollbar-hide">
                        {results.length > 0 ? (
                            <div className="space-y-1">

                                {results.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/shop/${product.slug}`}
                                        className="flex items-center gap-3 rounded-sm px-2 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
                                        onClick={handleResultClick}
                                    >
                                        <div className="relative h-14 w-14 overflow-hidden rounded-md border bg-muted shrink-0">
                                            {product.image ? (
                                                <Image
                                                    src={product.image}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                    sizes="56px"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-secondary">
                                                    <Search className="h-5 w-5 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col flex-1 min-w-0 justify-center">
                                            <span className="text-sm font-semibold truncate leading-tight">{product.name}</span>
                                            <span className="text-primary text-sm font-bold mt-0.5">R{product.price?.toFixed(2) || "0.00"}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="py-6 text-center text-sm text-muted-foreground">
                                No results found for "{query}"
                            </div>
                        )}
                    </div>
                    {results.length > 0 && (
                        <div className="border-t p-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-center text-xs h-8"
                                onClick={() => {
                                    router.push(`/shop?search=${encodeURIComponent(query)}`);
                                    setIsOpen(false);
                                    setQuery("");
                                    onSelect?.();
                                }}
                            >
                                View all results for "{query}"
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
