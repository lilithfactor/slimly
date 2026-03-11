"use client";

import { useEffect } from "react";
import { initMixpanel, trackEvent } from "@/lib/mixpanel";

export default function MixpanelProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const init = async () => {
      await initMixpanel();
    };
    init();
  }, []);

  return <>{children}</>;
}
