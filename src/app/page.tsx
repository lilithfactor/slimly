import { getBranding } from "@/lib/branding";
import { ShortenForm } from "@/components/ui/ShortenForm";
// import { ShortcutGuide } from "@/components/ui/ShortcutGuide";
import { RotatingSubline } from "@/components/ui/RotatingSubline";

export default function Home() {
  const branding = getBranding();
  return (
    <div className="h-[100dvh] w-screen flex flex-col font-sans overflow-hidden">
      {/* 2-col body — vertically centered */}
      <div className="flex-1 flex items-center justify-center px-6 md:px-12 lg:px-20 overflow-y-auto md:overflow-hidden pt-28 pb-32 md:py-0">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">

          {/* ── Left: Brand + Guide ── */}
          <div className="flex flex-col gap-8 items-center text-center animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="flex flex-col items-center gap-6 md:gap-8">
              <h1 className="text-6xl sm:text-7xl md:text-9xl font-black text-white tracking-tighter"
                style={{ textShadow: "0 0 60px rgba(255,255,255,0.25), 0 2px 4px rgba(0,0,0,0.5)" }}>
                {branding.brandName}
              </h1>
              <h2 className="text-1xl sm:text-3xl md:text-5xl font-black text-white/90 tracking-tight">
                {branding.headline}
              </h2>
              <div className="max-w-xl w-full text-center">
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

