import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";
import { coreShortenUrl } from "@/lib/core/shorten";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
    try {
        // 1. Authenticate (Firebase ID Token)
        const authHeader = req.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized. Provide a Bearer Token." }, { status: 401 });
        }

        const idToken = authHeader.split("Bearer ")[1];
        let uid: string;
        try {
            const decodedToken = await getAdminAuth().verifyIdToken(idToken);
            uid = decodedToken.uid;
        } catch (e) {
            return NextResponse.json({ error: "Invalid or expired token." }, { status: 401 });
        }

        // 2. Validate Input
        const body = await req.json();
        const { url, customSlug } = body;

        if (!url) {
            return NextResponse.json({ error: "URL is required." }, { status: 400 });
        }

        // 3. Rate Limiting
        const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
        const limitResult = await rateLimit(uid, ip);

        if (!limitResult.allowed) {
            return NextResponse.json(
                { error: "Too many requests.", retryAfter: limitResult.retryAfter },
                { 
                    status: 429,
                    headers: { "Retry-After": String(limitResult.retryAfter) }
                }
            );
        }

        // 4. Execute Shortening
        const host = req.headers.get("host") || "slimly.io";
        const protocol = host.includes("localhost") ? "http" : "https";
        const baseUrl = `${protocol}://${host}`;

        const result = await coreShortenUrl({
            url,
            customSlug,
            uid,
            baseUrl
        });

        if (result.success) {
            return NextResponse.json(result, { status: 201 });
        } else {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }

    } catch (error: any) {
        console.error("API Route Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
