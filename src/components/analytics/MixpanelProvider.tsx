"use client";

import { useEffect } from "react";
import { initMixpanel, trackEvent } from "@/lib/mixpanel";

export default function MixpanelProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    initMixpanel();
    trackEvent("Page View", {
      path: window.location.pathname,
      title: document.title,
    });
  }, []);

  return <>{children}</>;
}
