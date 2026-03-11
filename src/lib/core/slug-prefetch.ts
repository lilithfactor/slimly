import { adminDb } from "@/lib/firebase-admin";
import { generateRandomSlug } from "@/lib/utils/url";

/**
 * Generates a unique slug and verifies it doesn't exist in Firestore.
 * This is meant to be called on page load to pre-fetch a slug.
 */
export async function prefetchUniqueSlug(): Promise<string> {
    const db = adminDb;
    if (!db) throw new Error("Firebase Admin DB not initialized");

    let isUnique = false;
    let slug = "";
    let attempts = 0;

    while (!isUnique && attempts < 5) {
        // Generate a random 6-character slug (default)
        slug = generateRandomSlug(6); 
        const doc = await db.collection("links").doc(slug).get();
        
        if (!doc.exists) {
            isUnique = true;
        }
        attempts++;
    }

    if (!isUnique) {
        throw new Error("Failed to generate a unique slug after 5 attempts");
    }

    return slug;
}
