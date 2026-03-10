// Actually, in Next.js 15, we use "use server" at the top of the file for server actions.
"use server";

import { adminDb } from "@/lib/firebase-admin";
import { normalizeUrl, generateSlug } from "@/lib/utils/url";
import { generateQrCode } from "@/lib/utils/qr";
import { FieldValue } from "firebase-admin/firestore";

export interface ShortenResult {
    success: boolean;
    shortUrl?: string;
    qrDataUrl?: string;
    error?: string;
}

export async function shortenUrlAction(formData: FormData): Promise<ShortenResult> {
    const url = formData.get("url") as string;
    const customSlug = formData.get("customSlug") as string;
    if (!url) return { success: false, error: "URL is required" };

    try {
        const normalizedUrl = normalizeUrl(url);
        let slug = customSlug?.trim() || generateSlug(normalizedUrl);

        // Basic validation for custom slug
        if (customSlug) {
            if (!/^[a-zA-Z0-9-_]{3,20}$/.test(slug)) {
                return { success: false, error: "Custom slug must be 3-20 characters (alphanumeric, - or _)" };
            }
        }

        const db = adminDb;
        if (!db) {
            console.error("Firestore Admin DB is null in ShortenAction");
            throw new Error("Firebase Admin DB not initialized. Please ensure your environment variables are set and the server has been restarted.");
        }

        console.log("Checking if slug already exists:", slug);
        const docRef = db.collection("links").doc(slug);
        let doc;
        try {
            doc = await docRef.get();
        } catch (e: any) {
            console.error("Firestore GET failed (links collection):", e);
            return { success: false, error: `Firestore lookup failed: ${e.message}. Is your Firestore database created in Native Mode?` };
        }

        if (doc.exists) {
            const data = doc.data();
            // If it was a custom slug attempt and it exists, we can't overwrite
            if (customSlug) {
                return { success: false, error: "This custom slug is already taken. Please try another one." };
            }

            return {
                success: true,
                shortUrl: `${process.env.NEXT_PUBLIC_APP_URL}/${slug}`,
                qrDataUrl: data?.qr_data_url,
            };
        }

        // Generate QR code for the short URL
        const shortUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${slug}`;
        const qrDataUrl = await generateQrCode(shortUrl);

        // Save to Firestore
        try {
            await db.runTransaction(async (transaction) => {
                transaction.set(docRef, {
                    original_url: normalizedUrl,
                    short_slug: slug,
                    qr_data_url: qrDataUrl,
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
            console.log("Transaction successful for slug:", slug);
        } catch (e: any) {
            console.error("Firestore Transaction failed:", e);
            return { success: false, error: `Database transaction failed: ${e.message}` };
        }

        return {
            success: true,
            shortUrl,
            qrDataUrl,
        };
    } catch (error: any) {
        console.error("Shortening failed:", error);
        return { success: false, error: error.message || "An unexpected error occurred" };
    }
}
