"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BrandingConfig } from '@/lib/branding';
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { likeProjectAction } from "@/app/actions/StatsActions";
import { gsap } from "gsap";
import { trackEvent } from "@/lib/mixpanel";

interface NavbarProps {
    branding: BrandingConfig;
}

export function Navbar({ branding }: NavbarProps) {
    const { linksOutLabel, heartsInLabel } = branding;
    const [stats, setStats] = useState({ totalLinks: 0, totalLikes: 0 });
    const [displayLinks, setDisplayLinks] = useState(0);
    const [displayLikes, setDisplayLikes] = useState(0);
    const [liked, setLiked] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);

    useEffect(() => {
        const hasLiked = localStorage.getItem("slimly_liked");
        if (hasLiked) setLiked(true);
    }, []);

    useEffect(() => {
        if (!db) return;
        
        const statsRef = doc(db, "stats", "global");
        const unsubscribe = onSnapshot(statsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data();
                const newLinks = data.total_links || 0;
                const newLikes = data.total_likes || 0;
                
                setStats({
                    totalLinks: newLinks,
                    totalLikes: newLikes,
                });
            }
        }, (error) => {
            console.error("Real-time stats error:", error);
        });
        return () => unsubscribe();
    }, [db]);

    // Smooth Counter Animations
    useEffect(() => {
        const obj = { val: displayLinks };
        gsap.to(obj, {
            val: stats.totalLinks,
            duration: 1.5,
            ease: "power2.out",
            onUpdate: () => setDisplayLinks(Math.floor(obj.val))
        });
    }, [stats.totalLinks]);

    useEffect(() => {
        const obj = { val: displayLikes };
        gsap.to(obj, {
            val: stats.totalLikes,
            duration: 1.5,
            ease: "power2.out",
            onUpdate: () => setDisplayLikes(Math.floor(obj.val))
        });
    }, [stats.totalLikes]);

    const handleLike = async () => {
        if (liked || likeLoading) return;
        setLikeLoading(true);
        const res = await likeProjectAction();
        if (res.success) {
            localStorage.setItem("slimly_liked", "true");
            setLiked(true);
            trackEvent("Heart Clicked");
        }
        setLikeLoading(false);
    };

    return (
        <div className="fixed top-8 left-0 w-full z-50 flex justify-center pointer-events-none">
            <style jsx>{`
                @keyframes heartbeat {
                    0% { transform: scale(1); }
                    14% { transform: scale(1.1); }
                    28% { transform: scale(1); }
                    42% { transform: scale(1.1); }
                    70% { transform: scale(1); }
                }
                .heart-pulsate {
                    animation: heartbeat 1.5s infinite ease-in-out;
                }
                .heart-active {
                    filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.6));
                }
            `}</style>

            {/* Stats Pill: # Links Out # <heart> In */}
            <div className="flex items-center gap-4 px-5 py-2.5 glass-panel rounded-full border-white/5 bg-black/40 backdrop-blur-xl shadow-2xl border border-white/10 select-none pointer-events-auto cursor-default">
                {/* Links Out */}
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    <span className="text-white/80 font-bold text-[10px] tracking-wider whitespace-nowrap">
                        {displayLinks.toLocaleString()} {linksOutLabel}
                    </span>
                </div>

                {/* Premium Separator */}
                <div className="w-0.5 h-3 bg-white/10 mx-1" />

                {/* Likes Count + Heart */}
                <div 
                    className="flex items-center gap-2 cursor-pointer group"
                    onClick={handleLike}
                >
                    <span className={`text-[10px] font-bold transition-colors whitespace-nowrap ${liked ? 'text-red-400' : 'text-white group-hover:text-white/90'}`}>
                        {displayLikes.toLocaleString()}
                    </span>
                    <div className={`relative w-3.5 h-3.5 transition-transform ${!liked ? 'heart-pulsate' : 'scale-110 active:scale-95'}`}>
                        <Image 
                            src={liked ? "/heart.png" : "/heart-no.png"} 
                            alt="Heart" 
                            fill 
                            className={`object-contain transition-all ${liked ? 'brightness-125 heart-active' : 'brightness-100 opacity-90 group-hover:opacity-100'}`} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
