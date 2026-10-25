import React from 'react';
import Link from 'next/link';

const footerLinks = {
  PRODUCT: [
    { label: 'Interactive demos', href: '/features' },
    { label: 'AI creation', href: '/how-it-works' },
    { label: 'Analytics', href: '/analytics' },
    { label: 'Pricing', href: '/pricing' },
  ],
  RESOURCES: [
    { label: 'Blog', href: '/blog' },
    { label: 'Demo library', href: '/demo' },
    { label: 'Help center', href: '/help' },
    { label: 'API docs', href: '/docs' },
  ],
  COMPANY: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Careers', href: '/careers' },
    { label: 'Security', href: '/security' },
  ],
  LEGAL: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Cookies', href: '/cookies' },
    { label: 'GDPR', href: '/gdpr' },
  ],
};

export default function Footer() {
  return (
    <>
      <footer className="bg-footer-dark text-white pt-16 pb-12 border-t border-white/[0.08]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-12 gap-10 lg:gap-12 mb-16">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-4 lg:col-span-4 pr-4">
              <Link href="/" className="flex items-center gap-2.5 mb-5">
                <div className="w-7 h-7 rounded-[7px] bg-brand-purple flex items-center justify-center">
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <rect x="3" y="7" width="10" height="8" rx="1.5" fill="white" fillOpacity="0.9" />
                    <path d="M5 7V5a3 3 0 016 0v2" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                  </svg>
                </div>
                <span className="text-[14px] font-bold tracking-[0.08em] text-white uppercase">
                  PREVEUO
                </span>
              </Link>
              <p className="text-[13.5px] text-muted leading-relaxed max-w-[280px] mb-6">
                Turn every product story into an experience people remember—and act on.
              </p>
              {/* Operational status */}
              <div className="flex items-center gap-2 text-[12.5px] text-muted">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>All systems operational</span>
              </div>
            </div>

            {/* 4 Link Columns */}
            {Object.entries(footerLinks).map(([section, links]) => (
              <div key={section} className="col-span-1 md:col-span-2">
                <h3 className="text-[11.5px] font-bold uppercase tracking-[0.16em] text-zinc-500 mb-5">
                  {section}
                </h3>
                <ul className="flex flex-col gap-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[13.5px] text-zinc-300 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/[0.08] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12.5px] text-zinc-500">
            <p>© 2025 Preveuo, Inc. All rights reserved.</p>
            <p>Built for teams that believe great products deserve great stories.</p>
          </div>
        </div>
      </footer>

      {/* Floating help button */}
      <button
        type="button"
        aria-label="Help and support"
        className="fixed bottom-6 right-6 w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center text-sm font-semibold shadow-lg z-50 cursor-pointer border border-white/10 transition-colors"
      >
        ?
      </button>
    </>
  );
}
