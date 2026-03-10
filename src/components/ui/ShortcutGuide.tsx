import React from "react";

interface Shortcut {
    keys: string[];
    description: string;
}

const shortcuts: Shortcut[] = [
    { keys: ["Ctrl", "V"], description: "Paste link anywhere" },
    { keys: ["Enter"], description: "Shorten it" },
    { keys: ["Ctrl", "C"], description: "Copy result" },
];

export function ShortcutGuide() {
    return (
        <div className="flex flex-col gap-3 select-none">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40 mb-1">
                Shortcuts
            </p>
            {shortcuts.map((s) => (
                <div key={s.description} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 shrink-0">
                        {s.keys.map((key, i) => (
                            <React.Fragment key={key}>
                                {i > 0 && (
                                    <span className="text-white/30 text-[10px] font-bold mx-0.5">+</span>
                                )}
                                <kbd className="px-2.5 py-1 glass-panel rounded-lg text-[11px] font-black font-mono text-white/70"
                                    style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
                                    {key}
                                </kbd>
                            </React.Fragment>
                        ))}
                    </div>
                    <span className="text-white/60 text-xs font-semibold"
                        style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
                        {s.description}
                    </span>
                </div>
            ))}
        </div>
    );
}
