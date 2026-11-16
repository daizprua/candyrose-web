'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, Menu, X, Camera, Building2 } from '@/lib/icons';
import { useTranslation } from '@/i18n/useTranslation';

/**
 * Navegación del sitio (pastilla flotante + menú del celular). Se comparte
 * entre la portada, /booking y las páginas legales. En la portada las anclas
 * son "#seccion"; en las demás páginas apuntan a "/#seccion" para volver a
 * la portada y bajar a la sección.
 */
export function SiteNav({ logo }: { logo?: string }) {
  const { language, setLanguage } = useTranslation();
  const lang: 'es' | 'en' = language === 'en' ? 'en' : 'es';
  const toggleLang = () => setLanguage(lang === 'es' ? 'en' : 'es');
  const pathname = usePathname();
  const seccion = (id: string) => (pathname === '/' ? `#${id}` : `/#${id}`);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const t = {
    es: { bookNow: 'Reservar ahora', rooms: 'Habitaciones', aboutUs: 'Nosotros', contact: 'Contacto' },
    en: { bookNow: 'Book Now', rooms: 'Rooms', aboutUs: 'About Us', contact: 'Contact' },
  }[lang];

  return (
    <>
      {/* Navigation — sticky pill aligned to the right edge.
          Single compact group: menu links + language toggle + CTA, all
          inside one floating white pill that stays visible while scrolling.
          Once the user scrolls past the hero we deepen the shadow so the
          pill keeps standing out over content sections. */}
      <nav className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-5 flex justify-end transition-all duration-300 ${
        scrolled ? 'py-3' : 'py-5'
      }`}>
        <div className={`bg-white/85 backdrop-blur-xl rounded-full border border-white/60 pl-6 pr-2 py-2 flex items-center gap-6 transition-shadow duration-300 ${
          scrolled ? 'shadow-2xl shadow-dark/15' : 'shadow-xl shadow-dark/5'
        }`}>
          <div className="hidden lg:flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.18em] text-dark">
            <Link href={seccion('rooms')} className="hover:text-primary transition-colors">{t.rooms}</Link>
            <Link href={seccion('about')} className="hover:text-primary transition-colors">{t.aboutUs}</Link>
            <Link href={seccion('contact')} className="hover:text-primary transition-colors">{t.contact}</Link>
          </div>

          <button
            onClick={toggleLang}
            className="hidden md:flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200 px-3 py-1.5 rounded-full border border-zinc-200 transition-all text-[11px] font-black tracking-widest"
            aria-label="Cambiar idioma"
          >
            <Globe className="w-3.5 h-3.5" /> {lang.toUpperCase()}
          </button>

          <Link
            href="/booking"
            className="bg-primary text-white px-5 md:px-6 py-2.5 rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 text-[11px] font-black tracking-widest uppercase whitespace-nowrap"
          >
            {t.bookNow}
          </Link>

          <button className="lg:hidden p-2 text-dark" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label={lang === 'es' ? 'Menú' : 'Menu'}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-white p-10 flex flex-col justify-between animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center">
                {logo ? (
                  <img src={logo} alt="Hotel Candy Rose" className="h-14 w-14 object-contain" />
                ) : (
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg">
                    <Building2 className="w-6 h-6" />
                  </div>
                )}
                <button onClick={() => setIsMenuOpen(false)} aria-label={lang === 'es' ? 'Cerrar menú' : 'Close menu'}><X className="w-8 h-8" /></button>
            </div>
            <ul className="space-y-8 text-4xl font-black tracking-tighter">
                <li><Link href={seccion('rooms')} onClick={() => setIsMenuOpen(false)}>{t.rooms}</Link></li>
                <li><Link href={seccion('about')} onClick={() => setIsMenuOpen(false)}>{t.aboutUs}</Link></li>
                <li><Link href={seccion('contact')} onClick={() => setIsMenuOpen(false)}>{t.contact}</Link></li>
                <li><Link href="/booking" className="text-primary" onClick={() => setIsMenuOpen(false)}>{t.bookNow}</Link></li>
            </ul>
            <div className="flex justify-between items-center pt-8 border-t border-zinc-100">
                <button onClick={toggleLang} className="font-black uppercase tracking-widest text-xs flex items-center gap-2">
                    <Globe className="w-4 h-4" /> {lang === 'es' ? 'English' : 'Español'}
                </button>
                <div className="flex gap-4">
                    <Camera className="w-5 h-5" />
                </div>
            </div>
        </div>
      )}
    </>
  );
}
