"use client";

import { useState, useEffect } from "react";
import { Star, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

interface Review {
    id: string;
    rating: number;
    comment: string | null;
    created_at: string;
    user_id: string | null;
}

export function Reviews({ productId }: { productId: string }) {
    const rawReviews = useQuery(api.reviews.getReviews, { productId }) || [];
    const addReview = useMutation(api.reviews.addReview);

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [user, setUser] = useState<any>(null);

    // Map Convex records to expected local Review interface
    const reviews: Review[] = rawReviews.map((r: any) => ({
        id: r._id.toString(),
        rating: r.rating,
        comment: r.comment || null,
        created_at: new Date(r.createdAt).toISOString(),
        user_id: r.userId || null,
    }));

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = () => {
        const savedUserStr = typeof window !== "undefined" ? localStorage.getItem("white_label_user") : null;
        if (savedUserStr) {
            setUser(JSON.parse(savedUserStr));
        } else {
            setUser(null);
        }
    };

    const handleSubmit = async () => {
        if (!user) {
            alert("Please login to review.");
            return;
        }
        setSubmitting(true);
        try {
            await addReview({
                productId,
                userId: user.id,
                rating,
                comment,
            });
            setComment("");
            setRating(5);
        } catch (error: any) {
            alert("Failed to post review: " + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 py-8 border-t">
            <h2 className="text-2xl font-bold">Customer Reviews ({reviews.length})</h2>

            {user ? (
                <div className="bg-secondary/10 p-6 rounded-lg space-y-4">
                    <h3 className="font-semibold">Write a Review</h3>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`cursor-pointer h-6 w-6 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                                onClick={() => setRating(star)}
                            />
                        ))}
                    </div>
                    <Textarea
                        placeholder="Tell us what you think..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <Button onClick={handleSubmit} disabled={submitting}>
                        {submitting ? "Posting..." : "Post Review"}
                    </Button>
                </div>
            ) : (
                <div className="p-4 bg-secondary/5 rounded-lg text-center">
                    <p>Please <a href="/login" className="underline">login</a> to write a review.</p>
                </div>
            )}

            <div className="grid gap-6">
                {reviews.map((review) => (
                    <div key={review.id} className="flex gap-4 border-b pb-6 last:border-0">
                        <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center">
                            <User className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">Verified Buyer</span>
                                <div className="flex text-yellow-400">
                                    {Array.from({ length: review.rating }).map((_, i) => (
                                        <Star key={i} className="h-3 w-3 fill-current" />
                                    ))}
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</p>
                            <p className="mt-2 text-sm">{review.comment}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

