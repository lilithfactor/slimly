import * as admin from "firebase-admin";

function initializeAdmin() {
    if (!admin.apps.length) {
        const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
        const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

        if (serviceAccountKey) {
            try {
                const serviceAccount = JSON.parse(
                    Buffer.from(serviceAccountKey, 'base64').toString()
                );
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount),
                });
            } catch (e) {
                console.error("Firebase Admin initialization failed:", e);
            }
        } else if (projectId) {
            admin.initializeApp({
                projectId: projectId
            });
        }
    }
    return admin.firestore();
}

export const adminDb = typeof window === "undefined" ? initializeAdmin() : null;
