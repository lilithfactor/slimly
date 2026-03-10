import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    try {
        const db = adminDb;
        if (!db) {
            console.error("Firebase Admin DB not initialized");
            return NextResponse.redirect(new URL("/", request.url));
        }

        const docRef = db.collection("links").doc(slug);

        // Use a transaction to ensure atomic increment and retrieval
        const originalUrl = await db.runTransaction(async (transaction) => {
            const doc = await transaction.get(docRef);

            if (!doc.exists) {
                return null;
            }

            const data = doc.data();

            // Increment visits
            transaction.update(docRef, {
                visits: FieldValue.increment(1),
                last_visited: FieldValue.serverTimestamp(),
            });

            return data?.original_url as string;
        });

        if (!originalUrl) {
            // If slug not found, redirect to home
            return NextResponse.redirect(new URL("/", request.url));
        }

        // Redirect to original URL
        return NextResponse.redirect(originalUrl);
    } catch (error) {
        console.error("Redirect failed:", error);
        return NextResponse.redirect(new URL("/", request.url));
    }
}
