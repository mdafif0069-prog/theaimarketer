import React from 'react';
import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-noor-bg/60">
      <div className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 lg:px-10">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-noor-glow text-noor-bg">
                <span className="font-display text-lg font-extrabold">N</span>
              </span>
              <span className="font-display text-xl font-extrabold">
                Noor<span className="noor-text-gradient">Stream</span>
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-noor-muted">
              Halal, family-safe streaming. Press play without worry.
            </p>
          </div>

          <FooterCol title="Explore" links={[['Home', '/'], ['Browse', '/browse'], ['Kids', '/browse/kids'], ['Plans', '/plans']]} />
          <FooterCol title="Company" links={[['About', '/'], ['Content standard', '/'], ['Careers', '/'], ['Contact', '/']]} />
          <FooterCol title="Legal" links={[['Privacy', '/'], ['Terms', '/'], ['Parental controls', '/settings'], ['Accessibility', '/']]} />
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-noor-muted sm:flex-row">
          <p>© {new Date().getFullYear()} NoorStream. All rights reserved.</p>
          <button className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 hover:text-noor-text">
            <Globe className="h-4 w-4" />
            English (EN)
          </button>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-noor-text">{title}</h3>
      <ul className="space-y-2 text-sm">
        {links.map(([label, to]) => (
          <li key={label}>
            <Link to={to} className="text-noor-muted transition-colors hover:text-noor-text">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
