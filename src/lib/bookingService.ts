/**
 * Booking Service — wrapper para el código de landing/motor de reservas.
 *
 * Los componentes client-side llaman estas funciones, que internamente usan
 * los route handlers locales de Next (`/api/booking/*`). Esos handlers
 * corren en el servidor y tienen acceso al PUBLIC_BOOKING_TOKEN. Esto
 * evita exponer el token en el bundle del navegador.
 */

import type { DisponibilidadTipo } from "./contabiliClient";
import { withBase } from "@/lib/base-path";

export interface AvailableRoom {
  id: string;
  number: string;
  name: string;
  type: string;
  pricePerNight: number;
  totalPrice: number;
  taxRate: number;
  nights: number;
  baseRate?: number;
  appliedRatePlan?: null;
  status: string;
  capacity?: number;
  capacityAdults: number;
  capacityChildren: number;
  adultsIncluded: number;
  childrenIncluded: number;
  infantAgeMax: number;
  childAgeMax: number;
  extraAdultRate: number;
  extraChildRate: number;
  extraInfantRate: number;
  baseOccupancy?: number;
  bedType?: string | null;
  view?: string | null;
  includesBreakfast?: boolean;
  unitsAvailable?: number;
  amenities: string[];
  images?: string[];
  image: string;
  description: string;
  rating: number;
}

export interface BookingRequest {
  idempotencyKey: string;
  roomId: string; // en realidad es tipoHabitacionId — mantenemos nombre por compat
  checkInDate: string;
  checkOutDate: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  adults?: number;
  children?: number;
  childAges?: number[];
  notes?: string;
  pais: string;
  documentoTipo: "cedula_pa" | "pasaporte" | "otro";
  documentoNumero: string;
  captchaToken: string;
  /** Honeypot: campo oculto que un humano deja vacío. */
  website?: string;
}

const DEFAULT_IMG = withBase("/logo.jpg");

/** Foto principal + galería del tipo, sin repetidos. */
export function fotosDeTipo(t: { imagenUrl?: string | null; galeria?: string[] | null }): string[] {
  return Array.from(new Set([t.imagenUrl, ...(t.galeria ?? [])].filter((u): u is string => !!u)));
}

function mapDispToRoom(d: DisponibilidadTipo): AvailableRoom {
  const fotos = fotosDeTipo(d);
  return {
    id: d.tipoId,
    number: d.codigo,
    name: d.nombre,
    type: d.codigo,
    pricePerNight: d.tarifaNoche,
    totalPrice: d.totalNoche,
    taxRate: d.tasaImpuesto ?? 0.10,
    nights: d.noches,
    status: "available",
    capacity: d.capacidad,
    capacityAdults: d.capacidadAdultos,
    capacityChildren: d.capacidadNinos,
    adultsIncluded: d.adultosIncluidos,
    childrenIncluded: d.ninosIncluidos,
    infantAgeMax: d.edadInfanteHasta,
    childAgeMax: d.edadNinoHasta,
    extraAdultRate: d.cargoAdultoExtra,
    extraChildRate: d.cargoNinoExtra,
    extraInfantRate: d.cargoInfanteExtra,
    unitsAvailable: d.disponibles,
    amenities: [],
    images: fotos,
    image: fotos[0] ?? DEFAULT_IMG,
    description: d.descripcion,
    rating: 5,
  };
}

export async function getAvailableRooms(
  checkInDate: string,
  checkOutDate: string,
  guests = 1,
): Promise<AvailableRoom[]> {
  const qs = new URLSearchParams({
    checkIn: checkInDate,
    checkOut: checkOutDate,
    huespedes: String(guests),
  }).toString();
  const res = await fetch(withBase(`/api/booking/disponibilidad?${qs}`), { cache: "no-store" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Error desconocido" }));
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }
  const data = (await res.json()) as { tipos: DisponibilidadTipo[] };
  return (data.tipos ?? []).map(mapDispToRoom);
}

export async function createGuestReservation(b: BookingRequest): Promise<{
  ok: boolean;
  codigo: string;
  reservaId: string;
}> {
  const res = await fetch(withBase(`/api/booking/reservar`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      idempotencyKey: b.idempotencyKey,
      tipoHabitacionId: b.roomId,
      checkIn: b.checkInDate,
      checkOut: b.checkOutDate,
      adultos: b.adults ?? 2,
      ninos: b.children ?? 0,
      edadesNinos: b.childAges ?? [],
      nombre: b.guestName,
      email: b.guestEmail,
      telefono: b.guestPhone,
      pais: b.pais,
      documentoTipo: b.documentoTipo,
      documentoNumero: b.documentoNumero,
      captchaToken: b.captchaToken,
      notas: b.notes,
      website: b.website ?? "",
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Error desconocido" }));
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }
  return res.json();
}

export function validateBookingDates(checkInDate: string, checkOutDate: string) {
  // Comparamos las fechas como texto "YYYY-MM-DD", NO como Date. `new Date("2026-09-17")`
  // se parsea en UTC, y en Panama (UTC-5) eso cae el dia anterior a las 19:00, asi que
  // una llegada para HOY se rechazaba como "en el pasado" y el huesped no podia reservar.
  const hoy = hoyPanama();
  if (checkInDate < hoy) return { valid: false, error: "Check-in date cannot be in the past" };
  if (checkInDate >= checkOutDate) return { valid: false, error: "Check-out date must be after check-in date" };
  return { valid: true, error: undefined };
}

/** Fecha de hoy "YYYY-MM-DD" en la zona horaria del hotel (America/Panama). */
export function hoyPanama(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Panama",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/**
 * Suma dias a una fecha "YYYY-MM-DD" trabajando en UTC puro y devolviendo texto.
 * Se usa UTC a proposito: la fecha entra y sale como texto, nunca se muestra como
 * hora local, asi que no hay corrimiento de dia por zona horaria.
 */
export function sumarDias(fecha: string, dias: number): string {
  const [y, m, d] = fecha.split("-").map(Number);
  const base = Date.UTC(y, m - 1, d);
  return new Date(base + dias * 86400000).toISOString().slice(0, 10);
}
