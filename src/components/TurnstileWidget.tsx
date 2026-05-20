'use client';

import { useEffect, useRef } from 'react';

/**
 * Widget de Cloudflare Turnstile. Carga el script de Cloudflare bajo demanda
 * y monta el widget en un div. Cuando el usuario pasa el reto, llama
 * onVerify(token). El token tiene validez corta (~300s) y se envía al
 * backend en la próxima request.
 *
 * Site key se lee de NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY (segura
 * exponer al cliente). El secret-key vive solo en el backend.
 *
 * Si la site key no está configurada, el widget no se monta y se llama
 * onVerify("dev-skip") inmediatamente — modo desarrollo. En producción
 * SIEMPRE debe estar configurada.
 */
declare global {
  interface Window {
    turnstile?: {
      render: (selector: string | HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
    onTurnstileLoad?: () => void;
  }
}

const SCRIPT_ID = "cf-turnstile-script";

export function TurnstileWidget({ onVerify, onExpire }: {
  onVerify: (token: string) => void;
  onExpire?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey) {
      // Sin site key configurada — modo desarrollo. Devolvemos token dummy.
      onVerify("dev-skip");
      return;
    }
    if (!containerRef.current) return;

    const mount = () => {
      if (!window.turnstile || !containerRef.current) return;
      // Limpiar instancia previa si quedó algo (StrictMode / re-render)
      if (widgetIdRef.current) {
        try { window.turnstile.remove(widgetIdRef.current); } catch { /* ignore */ }
        widgetIdRef.current = null;
      }
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token: string) => onVerify(token),
        'expired-callback': () => onExpire?.(),
        'error-callback': () => onExpire?.(),
        theme: 'light',
      });
    };

    // Cargar script de Cloudflare si no está
    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad&render=explicit";
      script.async = true;
      script.defer = true;
      window.onTurnstileLoad = mount;
      document.head.appendChild(script);
    } else if (window.turnstile) {
      mount();
    } else {
      // Script existe pero turnstile aún no listo: esperar
      window.onTurnstileLoad = mount;
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try { window.turnstile.remove(widgetIdRef.current); } catch { /* ignore */ }
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, onVerify, onExpire]);

  if (!siteKey) {
    return (
      <div className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
        Modo desarrollo: captcha desactivado. Configura NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY.
      </div>
    );
  }
  return <div ref={containerRef} />;
}
