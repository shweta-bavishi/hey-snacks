// PostHog is initialised in src/components/analytics/Analytics.tsx, after the
// visitor accepts the cookie notice. Do not call posthog.init() here: this
// file runs on every page load, before any consent is given.
export {};
