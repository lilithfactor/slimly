"use client";

import React, { useState } from "react";
import Image from "next/image";
import { BrandingConfig } from "@/lib/branding";

interface FooterProps {
    branding: BrandingConfig;
}

export const Footer: React.FC<FooterProps> = ({ branding }) => {
    const { credits } = branding;



    return (
        <footer className="fixed bottom-0 left-0 w-full p-6 md:p-10 flex justify-center items-center z-40 select-none pointer-events-none">
            <div className="flex items-center pointer-events-auto transition-all duration-300">
                <div className="flex items-center glass-panel rounded-full border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl overflow-hidden">
                    {/* Build Credits Section */}
                    <div className="px-2 md:px-3 py-2.5 text-white text-[10px] md:text-[11px] font-bold tracking-[0.2em] md:tracking-[0.4em] transition-colors cursor-default whitespace-nowrap opacity-70"
                        style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
                        BUILT BY {credits.author?.toUpperCase()}
                    </div>

                    {/* Central Divider */}
                    <div className="w-[3px] h-3 bg-white/30 shrink-0" />

                    {/* Social Icons Section */}
                    <div className="px-2 md:px-3 py-2.5 flex items-center gap-4 md:gap-5">
                        {credits.portfolioUrl && (
                            <a href={credits.portfolioUrl} target="_blank" rel="noopener noreferrer" 
                               className="opacity-40 hover:opacity-100 transition-all hover:scale-110 active:scale-90" title="Portfolio">
                                <Image src="/portfolio.png" alt="Portfolio" width={16} height={16} className="brightness-0 invert" />
                            </a>
                        )}
                        {credits.linkedinUrl && (
                            <a href={credits.linkedinUrl} target="_blank" rel="noopener noreferrer"
                               className="opacity-40 hover:opacity-100 transition-all hover:scale-110 active:scale-90" title="LinkedIn">
                                <Image src="/linkedin.png" alt="LinkedIn" width={16} height={16} className="brightness-0 invert" />
                            </a>
                        )}
                        {credits.githubUrl && (
                            <a href={credits.githubUrl} target="_blank" rel="noopener noreferrer"
                               className="opacity-40 hover:opacity-100 transition-all hover:scale-110 active:scale-90" title="GitHub">
                                <Image src="/github.png" alt="GitHub" width={16} height={16} className="brightness-0 invert" />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
};
