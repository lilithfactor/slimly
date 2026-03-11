import { adminDb } from "./firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export interface RateLimitResult {
    allowed: boolean;
    retryAfter?: number; // seconds
}

/**
 * Simple Firestore-based rate limiter (Phase 1 implementation).
 */
export async function rateLimit(uid: string, ip: string): Promise<RateLimitResult> {
    const db = adminDb;
    if (!db) return { allowed: true }; // Fallback if DB missing

    const now = Date.now();
    const minuteKey = Math.floor(now / 60000).toString();
    const limitDoc = db.collection("ratelimits").doc(`${uid}_${minuteKey}`);

    try {
        const result = await db.runTransaction(async (transaction) => {
            const doc = await transaction.get(limitDoc);
            const count = (doc.data()?.count || 0) + 1;

            // Simple limit: 5 requests per minute per UID
            if (count > 5) {
                return { allowed: false, retryAfter: 60 };
            }

            transaction.set(limitDoc, {
                count,
                ip,
                timestamp: FieldValue.serverTimestamp(),
                // TTL logic: auto-delete via Firestore after 24h if enabled
                expiresAt: new Date(now + 24 * 60 * 60 * 1000)
            }, { merge: true });

            return { allowed: true };
        });

        return result;
    } catch (e) {
        console.error("Rate limit check failed:", e);
        return { allowed: true }; // Fail open for safety
    }
}
