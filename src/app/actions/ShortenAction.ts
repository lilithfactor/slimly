"use server";

import { coreShortenUrl } from "@/lib/core/shorten";

export interface ShortenResult {
    success: boolean;
    shortUrl?: string;
    qrDataUrl?: string;
    error?: string;
    performanceMs?: number;
}

export async function shortenUrlAction(formData: FormData): Promise<ShortenResult> {
    const url = formData.get("url") as string;
    const customSlug = formData.get("customSlug") as string;
    const preGeneratedSlug = formData.get("preGeneratedSlug") as string;
    const uid = formData.get("uid") as string; // Optional UID from client

    if (!url) return { success: false, error: "URL is required" };

    try {
        const headersList = await (await import("next/headers")).headers();
        const host = headersList.get("host");
        const protocol = host?.includes("localhost") ? "http" : "https";
        const baseUrl = `${protocol}://${host}`;

        const result = await coreShortenUrl({
            url,
            customSlug,
            preGeneratedSlug,
            uid,
            baseUrl
        });
        return result;
    } catch (error: any) {
        console.error("Shortening failed:", error);
        return { success: false, error: error.message || "An unexpected error occurred" };
    }
}
