import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

// Opt out of Vercel edge runtime because sharp requires Node.js bindings
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");
    const widthParam = searchParams.get("w");
    const qualityParam = searchParams.get("q");

    if (!url) {
        return new NextResponse("Missing url parameter", { status: 400 });
    }

    const width = widthParam ? parseInt(widthParam, 10) : undefined;
    const quality = qualityParam ? parseInt(qualityParam, 10) : 80;

    try {
        // Fetch original image
        const response = await fetch(url);
        if (!response.ok) {
            return new NextResponse(`Failed to fetch original image: ${response.status}`, { status: response.status });
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Process with sharp
        // We use .resize({ width, withoutEnlargement: true }) to scale down proportionally
        // We don't specify height, so sharp preserves the exact original aspect ratio without cropping.
        const optimizedBuffer = await sharp(buffer)
            .resize({
                width: width || 800,
                withoutEnlargement: true,
            })
            .webp({ quality })
            .toBuffer();

        // Return optimized image with aggressive cache headers
        return new NextResponse(optimizedBuffer as unknown as BodyInit, {
            status: 200,
            headers: {
                "Content-Type": "image/webp",
                "Cache-Control": "public, max-age=31536000, immutable", // Cache for 1 year
            },
        });
    } catch (error) {
        console.error("Image optimization error:", error);
        // Fallback: Redirect to original image on failure
        return NextResponse.redirect(url, { status: 302 });
    }
}
