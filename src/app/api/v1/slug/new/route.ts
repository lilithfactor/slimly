import { NextResponse } from "next/server";
import { prefetchUniqueSlug } from "@/lib/core/slug-prefetch";

/**
 * GET /api/v1/slug/new
 * Returns a guaranteed unique short-slug for pre-fetching.
 */
export async function GET() {
    try {
        const slug = await prefetchUniqueSlug();
        return NextResponse.json({ slug });
    } catch (error: any) {
        console.error("Slug pre-fetch failed:", error);
        return NextResponse.json({ error: "Failed to pre-fetch slug" }, { status: 500 });
    }
}
