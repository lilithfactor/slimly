import mixpanel from "mixpanel-browser";

const MIXPANEL_TOKEN = "1be6af35bf8c29e0f0eaba92a88a3598";

const getDeviceType = () => {
  if (typeof window === "undefined") return "unknown";
  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
};

const getEnvironment = () => {
  if (typeof window === "undefined") return "localhost";
  const host = window.location.host;
  if (host.includes("localhost")) return "localhost";
  if (host.includes("staging")) return "staging";
  return "main";
};

export const initMixpanel = () => {
  if (typeof window !== "undefined" && MIXPANEL_TOKEN) {
    mixpanel.init(MIXPANEL_TOKEN, {
      autocapture: false,
      record_sessions_percent: 0,
    });
  }
};

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== "undefined") {
    const defaultProps = {
      product: "slimly",
      fromLink: getEnvironment(),
      deviceType: getDeviceType(),
      userLoggedin: false, // Defaulting to false as no auth system is present
    };

    mixpanel.track(eventName, {
      ...defaultProps,
      ...properties,
    });
  }
};

export default mixpanel;
