export const MESSAGE_KEYS = [
  "langSwitch",
  "noscript",
  "copy",
  "copied",
  "loading",
  "errorLoad",
  "countryLabel",
  "countryUnknown",
  "countryPrivate",
  "ipAria",
  "copyAria",
] as const;

export type MessageKey = (typeof MESSAGE_KEYS)[number];
