import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reserva tu habitación · Hotel Candy Rose',
  description: 'Reserva directa sin comisiones en Hotel Candy Rose. Habitaciones boutique, villas frente a piscina y pasadías. Disponibilidad en tiempo real.',
  openGraph: {
    title: 'Reserva tu habitación · Hotel Candy Rose',
    description: 'Habitaciones boutique, villas y pasadías. Reserva directa con mejor precio garantizado.',
    type: 'website',
    siteName: 'Hotel Candy Rose',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reserva tu habitación · Hotel Candy Rose',
    description: 'Reserva directa sin comisiones en Hotel Candy Rose.',
  },
  robots: { index: true, follow: true },
};

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
