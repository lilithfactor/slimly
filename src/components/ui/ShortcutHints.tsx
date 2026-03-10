"use client";

import React, { useState, useEffect } from "react";
import { ShortenResult } from "@/app/actions/ShortenAction";

interface ShortcutHintsProps {
    url: string;
    loading: boolean;
    result: ShortenResult | null;
}

export function ShortcutHints({ url, loading, result }: ShortcutHintsProps) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    const getHint = () => {
        if (result?.success) {
            return (
                <div className="flex items-center">
                    <kbd className="px-3 py-1.5 bg-white/20 rounded-lg text-xs font-mono mr-2 leading-none">Ctrl</kbd>
                    <span className="mr-2 text-white/40 leading-none">+</span>
                    <kbd className="px-3 py-1.5 bg-white/20 rounded-lg text-xs font-mono mr-3 leading-none">C</kbd>
                    <span className="leading-none">to copy link</span>
                </div>
            );
        }

        if (url && !loading) {
            return (
                <div className="flex items-center">
                    <kbd className="px-3 py-1.5 bg-white/20 rounded-lg text-xs font-mono mr-3 leading-none">Enter</kbd>
                    <span className="leading-none">to shorten</span>
                </div>
            );
        }

        if (!url && !loading) {
            return (
                <div className="flex items-center">
                    <kbd className="px-3 py-1.5 bg-white/20 rounded-lg text-xs font-mono mr-2 leading-none">Ctrl</kbd>
                    <span className="mr-2 text-white/40 leading-none">+</span>
                    <kbd className="px-3 py-1.5 bg-white/20 rounded-lg text-xs font-mono mr-3 leading-none">V</kbd>
                    <span className="leading-none">anywhere to paste link</span>
                </div>
            );
        }

        return null;
    };

    const content = getHint();
    if (!content || !mounted) return null;

    return (
        <div className="hidden md:flex w-fit mx-auto items-center justify-center px-6 py-3.5 glass-panel rounded-full text-white/40 text-[11px] font-black tracking-[0.2em] uppercase mb-6 animate-in fade-in slide-in-from-top-2 duration-700 pointer-events-none select-none">
            {content}
        </div>
    );
}
