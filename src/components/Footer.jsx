import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../context/LanguageContext.jsx';
import { LanguageSwitcher } from './LanguageSwitcher.jsx';

export function Footer() {
  const { t } = useI18n();
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
            <p className="mt-3 max-w-xs text-sm text-noor-muted">{t('footer.tagline')}</p>
          </div>

          <FooterCol title={t('footer.explore')} links={[[t('nav.home'), '/'], [t('nav.browse'), '/browse'], [t('nav.kids'), '/browse/kids'], [t('nav.plans'), '/plans']]} />
          <FooterCol title={t('footer.company')} links={[['About', '/'], ['Content standard', '/'], ['Careers', '/'], ['Contact', '/']]} />
          <FooterCol title={t('footer.legal')} links={[['Privacy', '/'], ['Terms', '/'], [t('nav.settings'), '/settings'], ['Accessibility', '/']]} />
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-noor-muted sm:flex-row">
          <p>© {new Date().getFullYear()} NoorStream. {t('footer.rights')}</p>
          <LanguageSwitcher />
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
