//src/components/molecules/Nav.tsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../atoms/Button';
import { useSectionSpy } from '../../hooks/useSectionSpy';

export default function Nav() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  // ids en el orden del scroll
  const links = [
    { href: '#home', label: t('nav.home') },
    { href: '#services', label: t('nav.services') },
    { href: '#technologies', label: t('nav.technologies') },
    { href: '#about', label: t('nav.about') },
    { href: '#contact', label: t('nav.contact') },
  ];

  const active = useSectionSpy({
    sectionIds: links.map(l => l.href.slice(1)),
    offsetTop: 80, // tu header ~64px + respiro
  });

  useEffect(() => {
    const close = () => setOpen(false);
    document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', close));
    return () => document.querySelectorAll('a[href^="#"]').forEach(a => a.removeEventListener('click', close));
  }, []);

  return (
    <div className="flex items-center gap-4">
      <nav
        className={`fixed inset-x-0 top-16 z-40 md:static
        ${open ? 'block' : 'hidden'} md:block
        bg-[var(--surface)]/90 md:bg-transparent backdrop-blur`}
        aria-label="Main"
      >
        <ul className="p-4 md:p-0 md:flex md:items-center md:gap-6">
          {links.map(({ href, label }) => {
            const id = href.slice(1);
            const isActive = id === active;
            return (
              <li key={href}>
                <a
                  href={href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`inline-flex items-center px-2 py-2 rounded-app trans-app nav-underline hover-rise
                              hover:text-[var(--primary)] ${isActive ? 'nav-active' : ''}`}
                >
                  {label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <Button
        className="md:hidden"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-controls="main-nav"
        aria-label="Open menu"
      >
        ☰
      </Button>
    </div>
  );
}
