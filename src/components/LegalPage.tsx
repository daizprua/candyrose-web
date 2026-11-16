import React from 'react';
import { SiteNav } from './SiteNav';
import { SiteFooter } from './SiteFooter';
import { LANDING_CONTENT } from '@/content/landing';

/**
 * Plantilla de las páginas legales (/terminos, /privacidad): mismo
 * encabezado y pie que la portada y un cuerpo de texto de lectura cómoda.
 */
export function LegalPage({
  titulo,
  actualizado,
  children,
}: {
  titulo: string;
  actualizado: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FCFBF7] text-dark font-sans flex flex-col">
      <SiteNav logo={LANDING_CONTENT.logo} />

      <main className="flex-1 container mx-auto px-6 pt-32 lg:pt-40 pb-20 lg:pb-28">
        <article
          className={[
            'max-w-3xl mx-auto bg-white rounded-[32px] border border-zinc-100 shadow-sm px-6 py-10 sm:px-10 lg:px-14 lg:py-14',
            'text-[15px] sm:text-base leading-relaxed text-zinc-700',
            '[&_h2]:text-xl [&_h2]:sm:text-2xl [&_h2]:font-black [&_h2]:tracking-tight [&_h2]:text-dark [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:scroll-mt-28',
            '[&_h3]:text-base [&_h3]:font-bold [&_h3]:text-dark [&_h3]:mt-6 [&_h3]:mb-2',
            '[&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-2',
            '[&_a]:text-primary [&_a]:font-semibold [&_a]:underline [&_a]:underline-offset-2 [&_strong]:text-dark',
          ].join(' ')}
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter leading-[1.05] text-dark mb-4">
            {titulo}
          </h1>
          <p className="text-sm font-bold text-zinc-400 mb-8 pb-8 border-b border-zinc-100">
            Última actualización: {actualizado}
          </p>
          {children}
        </article>
      </main>

      <SiteFooter content={LANDING_CONTENT} />
    </div>
  );
}
