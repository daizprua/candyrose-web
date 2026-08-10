/**
 * Cliente HTTP para llamar al backend tRPC de Contabili App.
 *
 * Solo expone los endpoints del router `bookingPublic`, que es público
 * (sin login) pero protegido por un token compartido en cada request.
 */

const API_URL = process.env.CONTABILI_API_URL ?? "https://hotelcandyrose.contabili.app";
const TOKEN = process.env.PUBLIC_BOOKING_TOKEN ?? "";

if (!TOKEN && typeof window === "undefined") {
  console.warn("[contabiliClient] PUBLIC_BOOKING_TOKEN no configurado — las llamadas fallarán");
}

type TRPCQueryResponse<T> = { result: { data: { json: T } } } | { error: { json: { message: string } } };

async function trpcQuery<T>(procedure: string, input: Record<string, unknown>): Promise<T> {
  const inputWithToken = { ...input, token: TOKEN };
  const url = `${API_URL}/api/trpc/${procedure}?input=${encodeURIComponent(JSON.stringify({ json: inputWithToken }))}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  const data = (await res.json()) as TRPCQueryResponse<T>;
  if ("error" in data) throw new Error(data.error.json.message);
  return data.result.data.json;
}

async function trpcMutation<T>(procedure: string, input: Record<string, unknown>): Promise<T> {
  const inputWithToken = { ...input, token: TOKEN };
  const res = await fetch(`${API_URL}/api/trpc/${procedure}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ json: inputWithToken }),
  });
  const data = (await res.json()) as TRPCQueryResponse<T>;
  if ("error" in data) throw new Error(data.error.json.message);
  return data.result.data.json;
}

// ============================================================
// Tipos
// ============================================================
export interface TipoHabitacion {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  tarifaBase: number;
  capacidad: number;
}

export interface DisponibilidadTipo {
  tipoId: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  tarifaNoche: number;
  totalNoche: number;
  noches: number;
  capacidad: number;
  disponibles: number;
  totalHabitaciones: number;
}

export type TipoDocumento = "cedula_pa" | "pasaporte" | "otro";

/** Campos obligatorios del huésped (compartidos entre reserva habitación y pasadía). */
export interface HuespedInput {
  nombre: string;
  email: string;
  telefono: string;
  pais: string;
  documentoTipo: TipoDocumento;
  documentoNumero: string;
  /** Token devuelto por Cloudflare Turnstile. */
  captchaToken: string;
}

export interface ReservaInput extends HuespedInput {
  idempotencyKey: string;
  tipoHabitacionId: string;
  checkIn: string;
  checkOut: string;
  adultos: number;
  ninos?: number;
  notas?: string;
  idioma?: "es" | "en" | "pt";
}

// ============================================================
// API pública
// ============================================================

export async function listarTipos(): Promise<TipoHabitacion[]> {
  return trpcQuery("bookingPublic.tipos", {});
}

export async function consultarDisponibilidad(args: {
  checkIn: string;
  checkOut: string;
  huespedes?: number;
}): Promise<DisponibilidadTipo[]> {
  return trpcQuery("bookingPublic.disponibilidad", {
    checkIn: args.checkIn,
    checkOut: args.checkOut,
    huespedes: args.huespedes ?? 2,
  });
}

export async function crearReserva(input: ReservaInput): Promise<{
  ok: boolean;
  codigo: string;
  reservaId: string;
  clienteId: string;
}> {
  return trpcMutation("bookingPublic.crearReserva", {
    ...input,
    ninos: input.ninos ?? 0,
    pais: input.pais ?? "PA",
    idioma: input.idioma ?? "es",
  });
}

// ============================================================
// PASADÍAS
// ============================================================
export interface PasadiaProducto {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  tipoHuesped: "adulto" | "nino" | string;
  precio: number;
  incluyeAlmuerzo: boolean;
  incluyeDesayuno: boolean;
  incluyeBebidas: boolean;
  imagenUrl: string | null;
}

export async function listarPasadias(): Promise<PasadiaProducto[]> {
  return trpcQuery("bookingPublic.pasadiasCatalogo", {});
}

export interface PasadiaReservaInput extends HuespedInput {
  fecha: string;
  horaLlegada?: string;
  items: Array<{ productoId: string; cantidad: number }>;
  notas?: string;
  idioma?: "es" | "en" | "pt";
}

export async function crearReservaPasadia(input: PasadiaReservaInput): Promise<{
  ok: boolean;
  codigo: string;
  reservaId: string;
  clienteId: string;
  total: number;
}> {
  return trpcMutation("bookingPublic.pasadiasCrearReserva", {
    ...input,
    pais: input.pais ?? "PA",
    idioma: input.idioma ?? "es",
  });
}
