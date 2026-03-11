import { adminDb } from "@/lib/firebase-admin";
import { normalizeUrl, generateSlug } from "@/lib/utils/url";
import { generateQrCode } from "@/lib/utils/qr";
import { FieldValue } from "firebase-admin/firestore";

export interface ShortenOptions {
    url: string;
    customSlug?: string;
    preGeneratedSlug?: string; // Experimental: skip checks
    uid?: string; // Optional ownership
    baseUrl: string;
}

export interface ShortenResult {
    success: boolean;
    shortUrl?: string;
    qrDataUrl?: string;
    error?: string;
    performanceMs?: number; // Added for experiment
}

/**
 * Core business logic for shortening a URL.
 */
export async function coreShortenUrl({
    url,
    customSlug,
    preGeneratedSlug,
    uid,
    baseUrl
}: ShortenOptions): Promise<ShortenResult> {
    const startTime = performance.now();
    if (!url) return { success: false, error: "URL is required" };

    try {
        const normalizedUrl = normalizeUrl(url);
        let slug = customSlug?.trim() || preGeneratedSlug || generateSlug(normalizedUrl);

        // Basic validation for custom slug
        if (customSlug) {
            if (!/^[a-zA-Z0-9-_]{3,20}$/.test(slug)) {
                return { success: false, error: "Custom slug must be 3-20 characters (alphanumeric, - or _)" };
            }
        }

        const db = adminDb;
        if (!db) {
            throw new Error("Firebase Admin DB not initialized. Check environment variables.");
        }

        const docRef = db.collection("links").doc(slug);

        // EXTRA OPTIMIZATION: If we have a pre-generated slug from our pre-fetcher, 
        // we trust it's unique and skip the initial GET.
        if (!preGeneratedSlug) {
            const doc = await docRef.get();

            if (doc.exists) {
                const data = doc.data();
                // If it was a custom slug attempt and it exists, we can't overwrite
                if (customSlug) {
                    return { success: false, error: "This custom slug is already taken." };
                }

                return {
                    success: true,
                    shortUrl: `${baseUrl}/${slug}`,
                    qrDataUrl: data?.qr_data_url,
                    performanceMs: performance.now() - startTime
                };
            }
        }

        // Generate QR code for the short URL
        const shortUrl = `${baseUrl}/${slug}`;
        const qrDataUrl = await generateQrCode(shortUrl);

        // Save to Firestore
        await db.runTransaction(async (transaction) => {
            transaction.set(docRef, {
                original_url: normalizedUrl,
                short_slug: slug,
                qr_data_url: qrDataUrl,
                uid: uid || "anonymous", // Track ownership
                created_at: FieldValue.serverTimestamp(),
                visits: 0,
            });

            // Update global stats
            const statsRef = db.collection("stats").doc("global");
            transaction.set(statsRef, {
                total_links: FieldValue.increment(1),
                last_updated: FieldValue.serverTimestamp(),
            }, { merge: true });
        });

        return {
            success: true,
            shortUrl,
            qrDataUrl,
            performanceMs: performance.now() - startTime
        };
    } catch (error: any) {
        console.error("Core shortening failed:", error);
        return { success: false, error: error.message || "An unexpected error occurred" };
    }
}
