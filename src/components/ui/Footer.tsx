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
        <footer className="fixed bottom-0 left-0 w-full p-8 flex justify-center items-center z-40 select-none pointer-events-none">
            <div className="flex flex-col items-center gap-4 pointer-events-auto">


                {/* Socials & Credits Group */}
                <div className="flex flex-col items-center gap-3">
                    {/* Social Icons Row */}
                    <div className="flex items-center gap-6 px-5 py-2 glass-panel rounded-full border-white/5 bg-white/5 backdrop-blur-md">
                        {/* Portfolio */}
                        {credits.portfolioUrl && (
                            <a
                                href={credits.portfolioUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="opacity-40 hover:opacity-100 transition-all hover:scale-110 active:scale-90"
                                title="Portfolio"
                            >
                                <Image src="/portfolio.png" alt="Portfolio" width={18} height={18} className="brightness-0 invert" />
                            </a>
                        )}

                        {/* LinkedIn */}
                        {credits.linkedinUrl && (
                            <a
                                href={credits.linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="opacity-40 hover:opacity-100 transition-all hover:scale-110 active:scale-90"
                                title="LinkedIn"
                            >
                                <Image src="/linkedin.png" alt="LinkedIn" width={18} height={18} className="brightness-0 invert" />
                            </a>
                        )}

                        {/* GitHub */}
                        {credits.githubUrl && (
                            <a
                                href={credits.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="opacity-40 hover:opacity-100 transition-all hover:scale-110 active:scale-90"
                                title="GitHub"
                            >
                                <Image src="/github.png" alt="GitHub" width={18} height={18} className="brightness-0 invert" />
                            </a>
                        )}
                    </div>

                    {/* Build Credits */}
                    <div className="text-white text-[12px] font-bold tracking-[0.4em] transition-colors cursor-default"
                        style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
                        Built by {credits.author}
                    </div>
                </div>
            </div>
        </footer>
    );
};
