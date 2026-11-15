import React from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-[#1E222D] bg-[#080A0F] px-6 lg:px-10 py-5 mt-auto">
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 font-mono-tech">
          <span className="text-slate-300 font-semibold">
            &copy; {currentYear} Teyvat Gauntlet
          </span>
          <span>•</span>
          <span>
            Built by{' '}
            <a
              href="https://github.com/Jukius30"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#E5C158] hover:underline underline-offset-4"
            >
              Julius Sebastian Wuwung
            </a>
          </span>
        </div>

        <p className="text-[11px] text-slate-600 text-center sm:text-right max-w-xl">
          Not affiliated with or endorsed by HoYoverse / COGNOSPHERE. Genshin Impact and all related trademarks belong to their respective owners.
        </p>
      </div>
    </footer>
  );
}