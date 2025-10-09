// src/components/atoms/Icons.tsx

// --- Services (ya los tenías) ---
export const WebIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <path d="M3 9h18M8 13h3M8 16h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const MobileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
    <rect x="8" y="3" width="8" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="12" cy="17" r="1" fill="currentColor" />
  </svg>
);

export const UIUXIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
    <rect x="3" y="4.5" width="18" height="15" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <path d="M7 9h4M7 12h6M7 15h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

// --- Contact ---
export const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
    <path d="M12 21s7-5.1 7-11a7 7 0 10-14 0c0 5.9 7 11 7 11z" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

export const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
    <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
