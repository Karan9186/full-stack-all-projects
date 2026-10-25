'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronRight, LayoutDashboard, User } from 'lucide-react';
import { authService } from '@/lib/api/authService';

const navLinks = [
  { label: 'Product', href: '/' },
  { label: 'How it works', href: '/how-it-works' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Resources', href: '/resources' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userFullName, setUserFullName] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    // Check if user is authenticated via stored session or cookie
    const session = authService.getStoredSession();
    const hasCookie = typeof document !== 'undefined' && document.cookie.includes('preveuo_token=');
    if (session || hasCookie) {
      setIsAuthenticated(true);
      if (session?.user?.fullName) {
        setUserFullName(session.user.fullName);
      }
    }
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const userInitial = userFullName ? userFullName[0].toUpperCase() : 'W';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-200 ${
        scrolled ? 'border-b border-border-default' : 'border-b border-border-light'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-[60px] flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-[8px] bg-brand-purple flex items-center justify-center">
            {/* Lock/shield icon */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="3" y="7" width="10" height="8" rx="1.5" fill="white" fillOpacity="0.9"/>
              <path d="M5 7V5a3 3 0 016 0v2" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              <circle cx="8" cy="11" r="1" fill="currentColor" className="text-brand-purple"/>
            </svg>
          </div>
          <span className="text-[15px] font-bold tracking-[0.05em] text-heading uppercase">
            Preveuo
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3.5 py-1.5 rounded-full text-[13.5px] font-medium transition-all duration-150 ${
                isActive(link.href)
                  ? 'bg-white text-heading ring-1 ring-border-default font-semibold'
                  : 'text-gray-600 hover:text-heading'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Dynamic CTA depending on auth state */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <Link
              href="/workspace"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-[13.5px] font-semibold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="w-5 h-5 rounded-md bg-white/20 flex items-center justify-center text-xs font-bold text-white">
                {userInitial}
              </div>
              <span>Go to Workspace</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[13.5px] font-medium text-gray-700 hover:text-heading transition-colors px-2"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-purple hover:bg-brand-purple-hover text-white text-[13.5px] font-semibold transition-colors shadow-sm hover:bg-brand-purple-hover"
              >
                Start for free
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-gray-700"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border-light bg-white px-6 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium ${
                isActive(link.href)
                  ? 'text-brand-purple bg-brand-purple/5'
                  : 'text-gray-700'
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-3 pt-3 border-t border-border-light flex flex-col gap-2">
            {isAuthenticated ? (
              <Link
                href="/workspace"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-brand-purple rounded-xl shadow-sm"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Go to Workspace</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-center py-2.5 text-sm font-medium text-gray-700 border border-border-default rounded-lg"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="text-center py-2.5 text-sm font-semibold text-white bg-brand-purple rounded-lg"
                >
                  Start for free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
