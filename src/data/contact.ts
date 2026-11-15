// Placeholder contact details. Swap these two values when the real ones exist.
export const CONTACT_EMAIL = "test@test.com";
// International format, digits only (wa.me needs no + or spaces).
export const CONTACT_WHATSAPP = "919999999999";
export const CONTACT_WHATSAPP_DISPLAY = "+91 99999 99999";

// Opens a Gmail compose window with the To field filled in.
export const GMAIL_COMPOSE_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONTACT_EMAIL)}`;
export const WHATSAPP_URL = `https://wa.me/${CONTACT_WHATSAPP}`;
