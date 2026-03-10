"use client";

import React, { useEffect, useRef } from 'react';
import { BrandingConfig } from '@/lib/branding';
import './GooeyGradientBackground.css';

interface GooeyGradientBackgroundProps {
    children?: React.ReactNode;
    className?: string;
    branding?: BrandingConfig;
}

export function GooeyGradientBackground({ children, className = '', branding }: GooeyGradientBackgroundProps) {
    const interactiveRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let curX = 0;
        let curY = 0;
        let tgX = 0;
        let tgY = 0;

        const handleMouseMove = (event: MouseEvent) => {
            tgX = event.clientX;
            tgY = event.clientY;
        };

        const animate = () => {
            if (!interactiveRef.current) return;

            curX += (tgX - curX) / 20;
            curY += (tgY - curY) / 20;

            interactiveRef.current.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
            requestAnimationFrame(animate);
        };

        window.addEventListener('mousemove', handleMouseMove);
        animate();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div className={`gooey-wrapper w-full h-full relative overflow-hidden ${className}`}>
            {branding?.background && (
                <style jsx>{`
                    .gooey-wrapper {
                        ${branding.background.colors[0] ? `--color-bg1: rgb(${branding.background.colors[0]});` : ''}
                        ${branding.background.colors[1] ? `--color-bg2: rgb(${branding.background.colors[1]});` : ''}
                        ${branding.background.colors[0] ? `--color1: ${branding.background.colors[0]};` : ''}
                        ${branding.background.colors[1] ? `--color2: ${branding.background.colors[1]};` : ''}
                        ${branding.background.colors[2] ? `--color3: ${branding.background.colors[2]};` : ''}
                        ${branding.background.colors[3] ? `--color4: ${branding.background.colors[3]};` : ''}
                        ${branding.background.colors[4] ? `--color5: ${branding.background.colors[4]};` : ''}
                        ${branding.background.interactiveColor ? `--color-interactive: ${branding.background.interactiveColor};` : ''}
                    }
                `}</style>
            )}
            <div className={`gradient-bg ${branding?.background?.gooey === false ? 'static-gradient' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="hidden">
                    <defs>
                        <filter id="goo">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
                            <feBlend in="SourceGraphic" in2="goo" />
                        </filter>
                    </defs>
                </svg>
                {branding?.background?.gooey !== false && (
                    <div className="gradients-container">
                        <div className="g1"></div>
                        <div className="g2"></div>
                        <div className="g3"></div>
                        <div className="g4"></div>
                        <div className="g5"></div>
                        <div ref={interactiveRef} className="interactive"></div>
                    </div>
                )}
            </div>

            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
}

export default GooeyGradientBackground;
