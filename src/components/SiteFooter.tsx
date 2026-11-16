'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Mail, MapPin, Instagram, Building2 } from '@/lib/icons';
import { useTranslation } from '@/i18n/useTranslation';
import { withBase } from '@/lib/base-path';

export interface SiteFooterContent {
  logo?: string;
  contactPhone: string;
  contactEmail: string;
  contactLocation: string;
  contactInsta: string;
}

/**
 * Pie del sitio. Se comparte entre la portada, /booking y las páginas
 * legales. Los enlaces legales son <a> con withBase() (no <Link>) para no
 * duplicar el basePath.
 */
export function SiteFooter({ content }: { content: SiteFooterContent }) {
  const { language } = useTranslation();
  const lang: 'es' | 'en' = language === 'en' ? 'en' : 'es';
  const pathname = usePathname();
  const seccion = (id: string) => (pathname === '/' ? `#${id}` : `/#${id}`);

  const t = {
    es: { bookNow: 'Reservar ahora', rooms: 'Habitaciones', aboutUs: 'Nosotros', contact: 'Contacto' },
    en: { bookNow: 'Book Now', rooms: 'Rooms', aboutUs: 'About Us', contact: 'Contact' },
  }[lang];

  return (
      <footer className="relative bg-dark text-white pt-20 lg:pt-24 pb-10 px-6 overflow-hidden">
          {/* Soft brand glows so the dark surface doesn't feel flat */}
          <div className="absolute -top-32 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-32 -right-20 w-96 h-96 bg-secondary/15 rounded-full blur-[120px] pointer-events-none" />

          <div className="container mx-auto relative">
              {/* Main footer grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
                  {/* Brand */}
                  <div className="lg:col-span-4 space-y-5">
                      <div
                          className="bg-white rounded-3xl shadow-xl shadow-black/30 flex items-center justify-center overflow-hidden p-3"
                          style={{ width: 120, height: 120 }}
                      >
                          {content.logo ? (
                              <img
                                  src={content.logo}
                                  width={120}
                                  height={120}
                                  alt="Hotel Candy Rose"
                                  className="max-w-full max-h-full object-contain"
                                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                              />
                          ) : (
                              <Building2 className="w-10 h-10 text-primary" />
                          )}
                      </div>
                      <p className="text-white/60 font-medium leading-relaxed text-sm max-w-xs">
                          {lang === 'es'
                              ? 'Un santuario boutique diseñado para crear recuerdos que duren toda una vida. Belleza, paz y hospitalidad caribeña.'
                              : 'A boutique sanctuary built to create memories that last a lifetime. Beauty, peace and Caribbean hospitality.'}
                      </p>
                  </div>

                  {/* Explorar */}
                  <div className="lg:col-span-2 space-y-5">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary block">
                          {lang === 'es' ? 'Explorar' : 'Explore'}
                      </span>
                      <ul className="space-y-3 text-sm font-bold text-white/70">
                          <li><Link href={seccion('rooms')} className="hover:text-white transition-colors">{t.rooms}</Link></li>
                          <li><Link href={seccion('about')} className="hover:text-white transition-colors">{t.aboutUs}</Link></li>
                          <li><Link href={seccion('contact')} className="hover:text-white transition-colors">{t.contact}</Link></li>
                          <li><Link href="/booking" className="text-primary hover:text-white transition-colors">{t.bookNow}</Link></li>
                      </ul>
                  </div>

                  {/* Contacto */}
                  <div className="lg:col-span-3 space-y-5">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary block">
                          {lang === 'es' ? 'Contacto' : 'Contact'}
                      </span>
                      <ul className="space-y-3 text-sm font-medium text-white/70">
                          {content.contactPhone && (
                              <li className="flex items-start gap-2">
                                  <Phone className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                                  <a href={`tel:${content.contactPhone}`} className="hover:text-white transition-colors">{content.contactPhone}</a>
                              </li>
                          )}
                          {content.contactEmail && (
                              <li className="flex items-start gap-2">
                                  <Mail className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                                  <a href={`mailto:${content.contactEmail}`} className="hover:text-white transition-colors break-all">{content.contactEmail}</a>
                              </li>
                          )}
                          {content.contactLocation && (
                              <li className="flex items-start gap-2">
                                  <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                                  <span>{content.contactLocation}</span>
                              </li>
                          )}
                          {content.contactInsta && (
                              <li className="flex items-start gap-2">
                                  <Instagram className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                                  <a href={`https://instagram.com/${content.contactInsta.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">@{content.contactInsta.replace('@', '')}</a>
                              </li>
                          )}
                      </ul>
                  </div>

                  {/* Legales */}
                  <div className="lg:col-span-3 space-y-5">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary block">
                          {lang === 'es' ? 'Legales' : 'Legal'}
                      </span>
                      <ul className="space-y-3 text-sm font-bold text-white/70">
                          <li><a href={withBase('/privacidad')} className="hover:text-white transition-colors">{lang === 'es' ? 'Política de privacidad' : 'Privacy policy'}</a></li>
                          <li><a href={withBase('/terminos')} className="hover:text-white transition-colors">{lang === 'es' ? 'Términos y condiciones' : 'Terms & conditions'}</a></li>
                          <li><a href={withBase('/privacidad#cookies')} className="hover:text-white transition-colors">{lang === 'es' ? 'Política de cookies' : 'Cookie policy'}</a></li>
                          <li><a href={withBase('/terminos#cancelacion')} className="hover:text-white transition-colors">{lang === 'es' ? 'Política de cancelación' : 'Cancellation policy'}</a></li>
                      </ul>
                  </div>
              </div>

              {/* Bottom bar */}
              <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em]">
                  <p className="text-white/50 flex items-center gap-2 flex-wrap justify-center">
                      <span>© 2026 Hotel Candy Rose</span>
                      <span className="opacity-50">·</span>
                      <span>{lang === 'es' ? 'Desde 1972' : 'Since 1972'}</span>
                  </p>
                  <p className="text-white/40">
                      Crafted by <a href="https://devstack.agency" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-colors">Darinel Aizp · devstack.agency</a>
                  </p>
              </div>
          </div>
      </footer>
  );
}
