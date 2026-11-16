'use client';

import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

/** Visor de fotos a pantalla completa (galería de un tipo de habitación). */
export function GaleriaFotos({
  fotos,
  titulo,
  inicio = 0,
  onClose,
}: {
  fotos: string[];
  titulo: string;
  inicio?: number;
  onClose: () => void;
}) {
  const [i, setI] = useState(inicio);
  const total = fotos.length;
  const anterior = useCallback(() => setI((n) => (n - 1 + total) % total), [total]);
  const siguiente = useCallback(() => setI((n) => (n + 1) % total), [total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') anterior();
      else if (e.key === 'ArrowRight') siguiente();
    };
    window.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose, anterior, siguiente]);

  if (total === 0) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={titulo}
      className="fixed inset-0 z-[100] bg-black/90 flex flex-col"
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-4 py-3 text-white" onClick={(e) => e.stopPropagation()}>
        <div className="text-sm font-bold truncate pr-4">{titulo}</div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-white/70 tabular-nums">{i + 1} / {total}</span>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="p-2 rounded-full hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative flex-1 flex items-center justify-center px-2 sm:px-16 pb-4 min-h-0" onClick={(e) => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={fotos[i]} alt={`${titulo} — foto ${i + 1}`} className="max-h-full max-w-full object-contain rounded-lg select-none" />
        {total > 1 && (
          <>
            <button type="button" onClick={anterior} aria-label="Foto anterior"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/15 hover:bg-white/25 text-white">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button type="button" onClick={siguiente} aria-label="Foto siguiente"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/15 hover:bg-white/25 text-white">
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="flex gap-2 overflow-x-auto px-4 pb-4 justify-start sm:justify-center" onClick={(e) => e.stopPropagation()}>
          {fotos.map((f, k) => (
            <button key={f} type="button" onClick={() => setI(k)} aria-label={`Ver foto ${k + 1}`}
              className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 ${k === i ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f} alt="" loading="lazy" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
