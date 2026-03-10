"use client";

import React, { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { shortenUrlAction, ShortenResult } from "@/app/actions/ShortenAction";
import { ShortcutHints } from "./ShortcutHints";
import { trackEvent } from "@/lib/mixpanel";

import { BrandingConfig } from "@/lib/branding";

interface ShortenFormProps {
    branding: BrandingConfig;
}

function ShortenFormContent({ branding }: ShortenFormProps) {
    const searchParams = useSearchParams();
    const isSuperpower = searchParams.get("u") === branding.superpowerKey;

    const [url, setUrl] = useState("");
    const [customSlug, setCustomSlug] = useState("");
    const [result, setResult] = useState<ShortenResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [currentHost, setCurrentHost] = useState(branding.displayDomain);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentHost(window.location.host);
        }
    }, []);

    // JTBD-5: Auto-copy on success
    useEffect(() => {
        if (result?.success && result.shortUrl) {
            navigator.clipboard.writeText(result.shortUrl);
            setCopied(true);
            const timer = setTimeout(() => setCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [result]);

    // JTBD-2: Global Paste Support
    useEffect(() => {
        const handleGlobalPaste = (e: ClipboardEvent) => {
            // Don't intercept if an input or textarea is already focused
            const activeElement = document.activeElement;
            const isInputFocused = activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement;
            if (isInputFocused) return;

            const pastedText = e.clipboardData?.getData("text") || "";
            if (!pastedText) return;

            // Safer URL regex check to prevent ReDoS/Catastrophic Backtracking
            const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z]{2,})(\/[^\s]*)?$/i;
            if (urlPattern.test(pastedText)) {
                setUrl(pastedText);
                // Optionally scroll to input or highlight it
            }
        };

        window.addEventListener("paste", handleGlobalPaste);
        return () => window.removeEventListener("paste", handleGlobalPaste);
    }, []);

    const handleCopy = async () => {
        if (result?.shortUrl) {
            await navigator.clipboard.writeText(result.shortUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleDownloadQR = () => {
        if (result?.qrDataUrl) {
            const link = document.createElement("a");
            link.href = result.qrDataUrl;
            link.download = `qr-${result.shortUrl?.split('/').pop()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleShorten = async () => {
        if (loading) return;

        // Custom validation — no native browser popups
        if (!url.trim()) {
            setResult({ success: false, error: "Paste a link first. Try Ctrl+V anywhere." });
            return;
        }

        setLoading(true);
        setResult(null);
        setCopied(false);

        const formData = new FormData();
        formData.append("url", url);
        if (isSuperpower && customSlug) {
            formData.append("customSlug", customSlug);
        }

        const res = await shortenUrlAction(formData);
        
        if (res.success) {
            trackEvent("Link Shortened", {
                originalUrl: url,
                isCustomSlug: !!customSlug,
            });
        }

        setResult(res);
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleShorten();
    };

    // JTBD-4: Global Enter Support
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                // Don't intercept if an input or textarea is focused, 
                // UNLESS it's the main URL input (handled by handleSubmit)
                const activeElement = document.activeElement;
                const isFormElement = activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement;

                // Only trigger if no form element is focused OR if we want to allow it globally when URL is present
                if (!isFormElement && url && !loading) {
                    handleShorten();
                }
            }
        };

        window.addEventListener("keydown", handleGlobalKeyDown);
        return () => window.removeEventListener("keydown", handleGlobalKeyDown);
    }, [url, loading, isSuperpower, customSlug]); // Re-bind when state changes to have access to latest values

    // JTBD-5: Global Copy Support
    useEffect(() => {
        const handleGlobalCopy = (e: KeyboardEvent) => {
            // Only trigger if a short URL exists and Ctrl+C (or Cmd+C) is pressed
            const isCopyKey = (e.ctrlKey || e.metaKey) && e.key === "c";

            if (isCopyKey && result?.shortUrl) {
                // If the user has explicitly selected text, don't override the default copy
                const selection = window.getSelection()?.toString();
                if (selection) return;

                // Otherwise, copy the short link and show feedback
                handleCopy();
            }
        };

        window.addEventListener("keydown", handleGlobalCopy);
        return () => window.removeEventListener("keydown", handleGlobalCopy);
    }, [result, copied]); // Dependencies to ensure we have the latest result and handleCopy works correctly

    return (
        <>
        <ShortcutHints url={url} loading={loading} result={result} />
        <div className="p-6 glass-panel rounded-[32px] flex flex-col gap-4 w-full max-w-xl animate-in fade-in zoom-in-95 duration-700">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste a link..."
                    disabled={loading}
                    className="flex-1 px-5 py-4 glass-input rounded-2xl text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-white/10 min-w-0"
                />
                <button
                    type="submit"
                    disabled={loading}
                    title="Shorten"
                    className="shrink-0 w-14 h-14 flex items-center justify-center bg-white text-black rounded-2xl hover:scale-105 active:scale-95 disabled:opacity-40 transition-all shadow-[0_8px_20px_rgba(255,255,255,0.15)]"
                >
                    {loading ? (
                        <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                    ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                    )}
                </button>
            </form>

            {isSuperpower && (
                <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-white/60 uppercase tracking-[0.2em] font-bold ml-1">Custom Slug</label>
                    <div className="flex items-center glass-input rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-white/10">
                        <span className="pl-4 text-white/50 font-mono text-sm">{currentHost}/</span>
                        <input
                            type="text"
                            value={customSlug}
                            onChange={(e) => setCustomSlug(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                            placeholder="my-link"
                            disabled={loading}
                            className="w-full px-2 py-3 bg-transparent text-white outline-none text-sm"
                        />
                    </div>
                </div>
            )}

            {result?.success && (
                <div className="flex flex-col gap-3 p-4 glass-input rounded-[20px] text-white animate-in fade-in slide-in-from-bottom-4 duration-400">
                    {/* Header */}
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shrink-0" />
                        <span className="text-xs font-black uppercase tracking-[0.15em] text-white/80">Boom. Shortened.</span>
                    </div>

                    {/* Short URL row */}
                    <div className="flex items-center gap-2">
                        <div 
                            onClick={handleCopy}
                            className="flex-1 px-4 py-3 bg-black/40 border border-white/10 rounded-xl font-mono text-sm break-all cursor-pointer hover:bg-black/60 transition-all truncate text-white"
                            title="Click to copy"
                        >
                            {result.shortUrl}
                        </div>
                        <button
                            onClick={handleCopy}
                            title="Copy"
                            className={`shrink-0 w-11 h-11 flex items-center justify-center rounded-xl border transition-all ${copied
                                ? "bg-green-500/20 border-green-500/40 text-green-400"
                                : "bg-white/10 border-white/10 text-white hover:bg-white/20"
                                }`}
                        >
                            {copied ? (
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                            ) : (
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                            )}
                        </button>
                    </div>

                    {/* QR row — compact inline */}
                    {result.qrDataUrl && (
                        <div className="flex items-center gap-3 pt-1">
                            <div className="bg-white p-2 rounded-xl shrink-0">
                                <img src={result.qrDataUrl} alt="QR Code" className="w-16 h-16 block" />
                            </div>
                            <div className="flex flex-col gap-1 flex-1">
                                <span className="text-[10px] text-white/60 uppercase tracking-[0.2em] font-bold">QR Code</span>
                                <button
                                    onClick={handleDownloadQR}
                                    className="flex items-center gap-2 text-white/60 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors group"
                                >
                                    <span className="w-8 h-8 flex items-center justify-center glass-input rounded-lg group-hover:bg-white/20 transition-all">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                                        </svg>
                                    </span>
                                    Download
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {result && !result.success && (
                <div className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-semibold animate-in fade-in duration-300">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {result.error || "Something went wrong. Check your URL and try again."}
                </div>
            )}

        </div>
        </>
    );
}

export function ShortenForm({ branding }: ShortenFormProps) {
    return (
        <Suspense fallback={<div className="p-6 glass-panel rounded-[32px] w-full max-w-xl animate-pulse h-24" />}>
            <ShortenFormContent branding={branding} />
        </Suspense>
    );
}

