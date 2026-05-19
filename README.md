# candyrose-web

Landing público + motor de reservas para **Hotel Candy Rose**.

## Stack

- Next.js 16 (App Router, standalone output)
- React 19
- Tailwind 4
- i18n nativo (ES default + EN + PT)
- Consume API tRPC de Contabili App (`bookingPublic`)

## Estructura

```
src/
├── app/                    Páginas Next
│   ├── page.tsx            Landing
│   ├── booking/page.tsx    Motor de reservas
│   └── layout.tsx
├── components/             UI
├── content/landing.ts      Contenido editable del landing (textos, imágenes)
├── i18n/                   Traducciones (es, en, pt)
└── lib/
    ├── contabiliClient.ts  Cliente HTTP a Contabili App
    ├── bookingService.ts   Wrapper sobre contabiliClient
    ├── icons.tsx
    └── format.ts
```

## Variables de entorno

| Variable | Descripción |
|---|---|
| `CONTABILI_API_URL` | URL del backend Contabili (ej. `https://hotelcandyrose.contabili.app`) |
| `PUBLIC_BOOKING_TOKEN` | Token compartido con el router `bookingPublic` de Contabili |

## Editar contenido del landing

Tocá `src/content/landing.ts` (textos, imágenes, contacto), commiteá y Dokploy redespliega.

Imágenes:
- En `/public` para assets del repo
- En `https://s3.hotelcandyrose.contabili.app/candyrose-web/...` para uploads del cliente
