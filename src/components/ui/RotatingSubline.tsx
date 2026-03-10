"use client";

import React, { useState, useEffect, useRef } from "react";

interface RotatingSublineProps {
    phrases: string[];
    intervalMs?: number;
}

export function RotatingSubline({ phrases, intervalMs = 3500 }: RotatingSublineProps) {
    const [index, setIndex] = useState(() => Math.floor(Math.random() * phrases.length));
    const [animating, setAnimating] = useState(false);
    const [direction, setDirection] = useState<"up" | "down">("up");
    const [displayed, setDisplayed] = useState(phrases[index] ?? "");
    const [next, setNext] = useState<string | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isHovered = useRef(false);

    useEffect(() => {
        const scheduleNext = () => {
            timerRef.current = setTimeout(() => {
                // Sanity: Ensure we don't pick the same index twice
                let nextIndex = Math.floor(Math.random() * phrases.length);
                while (nextIndex === index && phrases.length > 1) {
                    nextIndex = Math.floor(Math.random() * phrases.length);
                }

                setDirection("up");
                setNext(phrases[nextIndex]);
                setAnimating(true);

                // After slide-out completes, swap text and slide in
                setTimeout(() => {
                    setDisplayed(phrases[nextIndex]);
                    setIndex(nextIndex);
                    setNext(null);
                    setAnimating(false);
                    scheduleNext();
                }, 1000);
            }, intervalMs);
        };

        scheduleNext();
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [phrases, index, intervalMs]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div
            className="relative h-16 sm:h-12 md:h-14 overflow-hidden flex items-center justify-center"
            onMouseEnter={() => (isHovered.current = true)}
            onMouseLeave={() => (isHovered.current = false)}
        >
            {/* Current phrase — slides out upward */}
            <p
                className="absolute inset-x-0 text-sm sm:text-base text-white/70 font-medium leading-relaxed whitespace-normal"
                style={{
                    textShadow: "0 1px 4px rgba(0,0,0,0.6)",
                    transition: animating ? "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.45s ease" : "none",
                    transform: animating ? "translateY(-110%)" : "translateY(0)",
                    opacity: animating ? 0 : 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "inherit"
                }}
            >
                {displayed}
            </p>

            {/* Next phrase — slides in from below */}
            {next && (
                <p
                    className="absolute inset-x-0 text-sm sm:text-base text-white/70 font-medium leading-relaxed whitespace-normal"
                    style={{
                        textShadow: "0 1px 4px rgba(0,0,0,0.6)",
                        transition: "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.45s ease",
                        transform: animating ? "translateY(0)" : "translateY(110%)",
                        opacity: animating ? 1 : 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "inherit"
                    }}
                >
                    {next}
                </p>
            )}
        </div>
    );
}
