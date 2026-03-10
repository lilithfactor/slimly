"use server";

import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function getGlobalStats() {
    const db = adminDb;
    if (!db) return { totalLinks: 0, totalLikes: 0 };

    try {
        const doc = await db.collection("stats").doc("global").get();
        if (!doc.exists) return { totalLinks: 0, totalLikes: 0 };

        const data = doc.data();
        return {
            totalLinks: data?.total_links || 0,
            totalLikes: data?.total_likes || 0,
        };
    } catch (err) {
        console.error("Failed to fetch global stats:", err);
        return { totalLinks: 0, totalLikes: 0 };
    }
}

export async function likeProjectAction() {
    const db = adminDb;
    if (!db) return { success: false };

    try {
        const statsRef = db.collection("stats").doc("global");
        await statsRef.set({
            total_likes: FieldValue.increment(1),
            last_updated: FieldValue.serverTimestamp(),
        }, { merge: true });

        return { success: true };
    } catch (err) {
        console.error("Failed to like project:", err);
        return { success: false };
    }
}
