//src/components/molecules/Nav.tsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../atoms/Button';


export default function Nav() {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    useEffect(() => {
        const close = () => setOpen(false);
        document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', close));
        return () => document.querySelectorAll('a[href^="#"]').forEach(a => a.removeEventListener('click', close));
    }, []);
    return (
        <div className="flex items-center gap-4">
            <nav className={`fixed inset-x-0 top-16 z-40 bg-white/90 backdrop-blur md:static md:bg-transparent ${open ? 'block' : 'hidden'} md:block`}>
                <ul className="md:flex md:items-center md:gap-6 p-4 md:p-0">
                    <li><a className="hover:text-indigo-600" href="#home">{t('nav.home')}</a></li>
                    <li><a className="hover:text-indigo-600" href="#services">{t('nav.services')}</a></li>
                    <li><a className="hover:text-indigo-600" href="#technologies">{t('nav.technologies')}</a></li>
                    <li><a className="hover:text-indigo-600" href="#about">{t('nav.about')}</a></li>
                    <li><a className="hover:text-indigo-600" href="#contact">{t('nav.contact')}</a></li>
                </ul>
            </nav>
            <Button className="md:hidden" onClick={() => setOpen(v => !v)} aria-label="Open menu">☰</Button>
        </div>
    );
}