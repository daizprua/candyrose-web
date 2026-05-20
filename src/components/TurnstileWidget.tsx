'use client';

import { useEffect, useRef, useState } from 'react';

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
 *
 * IMPORTANTE: usamos refs para las callbacks para que el useEffect NO se
 * re-dispare cuando el padre re-renderiza (cada render crea funciones
 * nuevas). Si se re-disparaba, el widget quedaba en loop de mount/unmount
 * con "Verifying..." infinito.
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
  const onVerifyRef = useRef(onVerify);
  const onExpireRef = useRef(onExpire);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY;

  // Mantener refs actualizadas sin disparar el efecto principal
  useEffect(() => { onVerifyRef.current = onVerify; }, [onVerify]);
  useEffect(() => { onExpireRef.current = onExpire; }, [onExpire]);

  useEffect(() => {
    if (!siteKey) {
      // Sin site key configurada — modo desarrollo. Devolvemos token dummy.
      onVerifyRef.current("dev-skip");
      return;
    }
    if (!containerRef.current) return;

    const mount = () => {
      if (!window.turnstile || !containerRef.current) return;
      if (widgetIdRef.current) return; // ya montado
      try {
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token: string) => {
            setErrorCode(null);
            onVerifyRef.current(token);
          },
          'expired-callback': () => onExpireRef.current?.(),
          'error-callback': (code: string) => {
            setErrorCode(code || 'unknown');
            onExpireRef.current?.();
          },
          theme: 'light',
        });
      } catch (e) {
        setErrorCode(`mount: ${(e as Error).message}`);
      }
    };

    // Cargar script de Cloudflare si no está
    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad&render=explicit";
      script.async = true;
      script.defer = true;
      script.onerror = () => setErrorCode("script-load-failed");
      window.onTurnstileLoad = mount;
      document.head.appendChild(script);
    } else if (window.turnstile) {
      mount();
    } else {
      window.onTurnstileLoad = mount;
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try { window.turnstile.remove(widgetIdRef.current); } catch { /* ignore */ }
        widgetIdRef.current = null;
      }
    };
    // Dependencias: solo siteKey. onVerify/onExpire se acceden via ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey]);

  if (!siteKey) {
    return (
      <div className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
        Modo desarrollo: captcha desactivado. Configura NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY.
      </div>
    );
  }
  return (
    <div>
      <div ref={containerRef} />
      {errorCode && (
        <div className="text-[10px] text-red-700 bg-red-50 border border-red-200 rounded p-2 mt-2">
          Captcha error: <code>{errorCode}</code>. Recarga la página o verifica que el dominio esté autorizado en Cloudflare Turnstile.
        </div>
      )}
    </div>
  );
}
