import { FragranceFinder } from "@/components/home/FragranceFinder";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scent Discovery | SCENTED",
  description: "Allow your intuition to guide you. Select sensory options to discover perfectly balanced olfactory formulations.",
};

export default function ScentDiscoveryPage() {
  return (
    <div className="bg-background min-h-screen pt-4 pb-12">
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        {/* Simple elegant breadcrumb navigation back to homepage */}
        <div className="py-4 font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
          <a href="/" className="hover:text-accent transition-colors">Home</a>
          <span className="mx-2 text-border/40">/</span>
          <span className="text-primary font-medium">Scent Discovery</span>
        </div>
      </div>
      
      {/* The full Scent Discovery interactive fragrance finder */}
      <FragranceFinder />
    </div>
  );
}
