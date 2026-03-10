import mixpanel from "mixpanel-browser";

const MIXPANEL_TOKEN = "1be6af35bf8c29e0f0eaba92a88a3598";

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
    mixpanel.track(eventName, properties);
  }
};

export default mixpanel;
