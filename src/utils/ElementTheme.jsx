import React from 'react';

export const ELEMENT_THEMES = {
  Pyro: {
    text: 'text-orange-400',
    border: 'border-orange-500/40',
    glow: 'from-orange-500/15 via-orange-950/10 to-transparent',
    badge: 'bg-orange-500/10 text-orange-300 border-orange-500/30',
    accent: '#FB923C',
  },
  Hydro: {
    text: 'text-sky-400',
    border: 'border-sky-500/40',
    glow: 'from-sky-500/15 via-sky-950/10 to-transparent',
    badge: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
    accent: '#38BDF8',
  },
  Anemo: {
    text: 'text-teal-300',
    border: 'border-teal-400/40',
    glow: 'from-teal-400/15 via-teal-950/10 to-transparent',
    badge: 'bg-teal-400/10 text-teal-200 border-teal-400/30',
    accent: '#5EEAD4',
  },
  Electro: {
    text: 'text-violet-400',
    border: 'border-violet-500/40',
    glow: 'from-violet-500/15 via-violet-950/10 to-transparent',
    badge: 'bg-violet-500/10 text-violet-300 border-violet-500/30',
    accent: '#A78BFA',
  },
  Dendro: {
    text: 'text-emerald-400',
    border: 'border-emerald-500/40',
    glow: 'from-emerald-500/15 via-emerald-950/10 to-transparent',
    badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    accent: '#34D399',
  },
  Cryo: {
    text: 'text-cyan-300',
    border: 'border-cyan-400/40',
    glow: 'from-cyan-400/15 via-cyan-950/10 to-transparent',
    badge: 'bg-cyan-400/10 text-cyan-200 border-cyan-400/30',
    accent: '#67E8F9',
  },
  Geo: {
    text: 'text-amber-400',
    border: 'border-amber-500/40',
    glow: 'from-amber-500/15 via-amber-950/10 to-transparent',
    badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    accent: '#FBBF24',
  },
};

export function ElementGlyph({ element, className = 'w-4 h-4' }) {
  const theme = ELEMENT_THEMES[element] || ELEMENT_THEMES.Anemo;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`${className} ${theme.text}`}
      stroke="currentColor"
      strokeWidth="1.75"
    >
      {element === 'Pyro' && (
        <path d="M12 2C9 6 6 9.5 6 14a6 6 0 0 0 12 0c0-3.5-2-6-3.5-7.5-.5 2-1.5 3-2.5 3 0-2.5 1-5 0-7.5Z" />
      )}
      {element === 'Hydro' && (
        <path d="M12 2.5C12 2.5 6 9.2 6 14a6 6 0 0 0 12 0c0-4.8-6-11.5-6-11.5Z" />
      )}
      {element === 'Anemo' && (
        <path d="M4 12h11a3 3 0 1 0-3-3M6 16h12a2.5 2.5 0 1 1-2.5 2.5M5 8h6" strokeLinecap="round" />
      )}
      {element === 'Electro' && (
        <path d="M13 2 5 14h6l-1 8 9-12h-6l0-8Z" strokeLinejoin="round" />
      )}
      {element === 'Dendro' && (
        <path d="M12 3C7 3 4 7 4 12c0 4.5 3.5 8 8 8s8-3.5 8-8c0-2.5-1.5-5-3-6.5M12 20V9m0 4 4-3m-4 5-4-2.5" strokeLinecap="round" />
      )}
      {element === 'Cryo' && (
        <path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9 4.9 19.1" strokeLinecap="round" />
      )}
      {element === 'Geo' && (
        <polygon points="12 2 21 12 12 22 3 12 12 2" strokeLinejoin="round" />
      )}
    </svg>
  );
}