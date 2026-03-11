"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { signInAnonymously, onAuthStateChanged, User } from "firebase/auth";
import mixpanel from "@/lib/mixpanel";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    idToken: string | null;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    idToken: null,
});

export const useAuth = () => useContext(AuthContext);

export default function FirebaseAuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<User | null>(null);
    const [idToken, setIdToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth) return;

        const unsubscribe = onAuthStateChanged(auth as any, async (user) => {
            if (user) {
                setUser(user);
                const token = await user.getIdToken();
                setIdToken(token);
                
                // Update Mixpanel
                mixpanel.register({
                    userLoggedin: true,
                    firebaseUid: user.uid
                });

                // Logs for testing/verification
                console.log("[Auth] User ID:", user.uid);
                console.log("[Auth] ID Token:", token);
            } else {
                // Sign in anonymously if no user
                try {
                    await signInAnonymously(auth as any);
                } catch (error) {
                    console.error("Firebase Anonymous Auth failed:", error);
                }
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Periodically refresh token
    useEffect(() => {
        if (!user) return;
        const interval = setInterval(async () => {
            const token = await user.getIdToken(true);
            setIdToken(token);
        }, 10 * 60 * 1000); // 10 minutes
        return () => clearInterval(interval);
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, loading, idToken }}>
            {children}
        </AuthContext.Provider>
    );
}
