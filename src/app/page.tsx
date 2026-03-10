import { getBranding } from "@/lib/branding";
import { ShortenForm } from "@/components/ui/ShortenForm";
// import { ShortcutGuide } from "@/components/ui/ShortcutGuide";
import { RotatingSubline } from "@/components/ui/RotatingSubline";

export default function Home() {
  const branding = getBranding();
  return (
    <div className="h-screen w-screen flex flex-col font-sans overflow-hidden">
      {/* 2-col body — vertically centered */}
      <div className="flex-1 flex items-center justify-center px-6 md:px-12 lg:px-20">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">

          {/* ── Left: Brand + Guide ── */}
          <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="flex flex-col gap-3">
              <h1 className="text-6xl lg:text-[5.5rem] font-extrabold tracking-[-0.04em] text-white leading-none"
                style={{ textShadow: "0 0 60px rgba(255,255,255,0.25), 0 2px 4px rgba(0,0,0,0.5)" }}>
                {branding.headline}
              </h1>
              <div className="max-w-xs">
                <RotatingSubline phrases={branding.sublines} />
              </div>
            </div>

            {/* <ShortcutGuide /> */}
          </div>

          {/* ── Right: Form Flow ── */}
          <div className="flex flex-col animate-in fade-in slide-in-from-right-8 duration-1000">
            <ShortenForm branding={branding} />
          </div>

        </div>
      </div>
    </div>
  );
}

