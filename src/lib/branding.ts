import fs from 'fs';
import path from 'path';

export interface BrandingConfig {
    brandName: string;
    headline: string;
    sublines: string[];
    logo: {
        text: string;
        image?: string;
    };
    typography: {
        primaryFont: string;
        fallbackFont: string;
    };
    colors: {
        primary: string;
        secondary: string;
    };
    crosshairCursor: {
        enabled: boolean;
        color: string;
    };
    background: {
        gooey: boolean;
        colors: string[]; // RGB strings like "108, 0, 162"
        interactiveColor?: string; // RGB string
        baseBackground?: string; // Hex for body/bg
    };
    credits: {
        author: string;
        portfolioUrl: string;
        linkedinUrl: string;
        githubUrl?: string;
    };
    linksOutLabel: string;
    heartsInLabel: string;
    initialLikesCount: number;
    superpowerKey: string;
    displayDomain: string;
}

export function getBranding(): BrandingConfig {
    const filePath = path.join(process.cwd(), 'context/specific/branding.json');
    try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContents);
    } catch (error) {
        console.error('Error reading branding.json:', error);
        // Fallback defaults
        return {
            brandName: "Slimly",
            headline: "The ultimate link shortener.",
            sublines: ["The ultimate link shortener."],
            logo: { text: "S" },
            typography: { primaryFont: "Inter", fallbackFont: "sans-serif" },
            colors: { primary: "#ffffff", secondary: "rgba(255, 255, 255, 0.8)" },
            crosshairCursor: {
                enabled: true,
                color: "#ff98ecff"
            },
            background: {
                gooey: true,
                colors: [
                    "108, 0, 162",
                    "0, 17, 82",
                    "18, 113, 255",
                    "221, 74, 255",
                    "100, 220, 255"
                ],
                interactiveColor: "140, 100, 255",
                baseBackground: "#0a0a0a"
            },
            credits: {
                author: "Pranav",
                portfolioUrl: "https://pranav.com",
                linkedinUrl: "https://linkedin.com/in/pranav",
                githubUrl: "https://github.com/pranav"
            },
            linksOutLabel: "Links Out",
            heartsInLabel: "Hearts In",
            initialLikesCount: 0,
            superpowerKey: "proXA1",
            displayDomain: "slimly.co.in"
        };
    }
}
