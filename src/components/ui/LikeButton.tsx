"use client";

import React, { useState, useEffect } from "react";
import { likeProjectAction } from "@/app/actions/StatsActions";

export function LikeButton() {
    const [liked, setLiked] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const hasLiked = localStorage.getItem("slimly_liked");
        if (hasLiked) {
            setLiked(true);
        }
    }, []);

    const handleLike = async () => {
        if (liked || loading) return;

        setLoading(true);
        const res = await likeProjectAction();

        if (res.success) {
            localStorage.setItem("slimly_liked", "true");
            setLiked(true);
        }
        setLoading(false);
    };

    return (
        <button
            onClick={handleLike}
            disabled={liked || loading}
            className={`px-4 py-1.5 rounded-full border transition-all text-sm font-medium ${liked
                    ? "bg-white/10 border-white/20 text-white/40 cursor-default"
                    : "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/30"
                }`}
        >
            {loading ? "..." : liked ? "♥ Liked" : "♡ Like"}
        </button>
    );
}
