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

const getOrCreateDeviceId = () => {
  if (typeof window === "undefined") return { id: null, isRepeat: false };
  
  const deviceId = localStorage.getItem("slimly_device_id");
  if (deviceId) {
    return { id: deviceId, isRepeat: true };
  }
  
  // Fallback for non-secure contexts where crypto.randomUUID might not be available
  const newId = (typeof crypto !== "undefined" && crypto.randomUUID) 
    ? crypto.randomUUID() 
    : Math.random().toString(36).substring(2, 11) + Math.random().toString(36).substring(2, 11);

  localStorage.setItem("slimly_device_id", newId);
  return { id: newId, isRepeat: false };
};

let initialRepeatStatus: boolean | null = null;
let hasTrackedInit = false;

export const initMixpanel = async () => {
  if (typeof window !== "undefined" && MIXPANEL_TOKEN) {
    if (initialRepeatStatus !== null) return initialRepeatStatus;

    mixpanel.init(MIXPANEL_TOKEN, {
      persistence: 'localStorage',
      autocapture: false,
      record_sessions_percent: 0,
    });

    const { id, isRepeat } = getOrCreateDeviceId();
    initialRepeatStatus = isRepeat;

    if (id) {
      mixpanel.identify(id);
    }

    // Register Super Properties (sent with every event)
    const superProps = {
      product: "slimly",
      fromLink: getEnvironment(),
      deviceType: getDeviceType(),
      userLoggedin: false,
    };
    mixpanel.register(superProps);

    // Fetch and register location data
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
      if (data && !data.error) {
        mixpanel.register({
          userCountry: data.country_name,
          userRegion: data.region,
          userCity: data.city,
        });
      }
    } catch (error) {
      console.warn("Mixpanel: Could not fetch location data", error);
    }

    // Track initialization ONLY ONCE per session
    if (!hasTrackedInit) {
      mixpanel.track("mixpanelInit", {
        repeatUser: isRepeat
      });
      hasTrackedInit = true;
    }

    return isRepeat;
  }
  return false;
};

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== "undefined") {
    // Note: Default properties (product, fromLink, deviceType, location) 
    // are now handled via mixpanel.register() in initMixpanel
    mixpanel.track(eventName, properties);
  }
};

export default mixpanel;
