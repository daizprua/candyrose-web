/**
 * Cliente HTTP para llamar al backend tRPC de Contabili App.
 *
 * Solo expone los endpoints del router `bookingPublic`, que es público
 * (sin login) pero protegido por un token compartido en cada request.
 */

import { createHmac } from "node:crypto";
import { z } from "zod";

const API_URL = process.env.CONTABILI_API_URL ?? "https://hotelcandyrose.devstack.agency/app";
const TOKEN = process.env.PUBLIC_BOOKING_TOKEN ?? "";

if (!TOKEN && typeof window === "undefined") {
  console.warn("[contabiliClient] PUBLIC_BOOKING_TOKEN no configurado — las llamadas fallarán");
}

type TRPCQueryResponse<T> = { result: { data: { json: T } } } | { error: { json: { message: string } } };

/** Datos de la petición original del navegador que se reenvían al backend. */
export type ContextoCliente = { ip?: string | null };

const IP_RE = /^[0-9a-fA-F:.]{2,64}$/;

/**
 * IP real del navegador: último valor de x-forwarded-for (el que añade Traefik,
 * el único confiable; los anteriores los puede inventar el cliente) o x-real-ip.
 */
export function ipDelCliente(headers: Headers): string | null {
  const xff = headers.get("x-forwarded-for");
  const ultimo = xff?.split(",").map((s) => s.trim()).filter(Boolean).pop();
  const ip = ultimo || headers.get("x-real-ip")?.trim() || "";
  return IP_RE.test(ip) ? ip : null;
}

/**
 * Cabeceras hacia el backend: token en `x-booking-token` (además del input,
 * por compatibilidad) e IP del cliente firmada con HMAC-SHA256(ip, token).
 */
function cabeceras(ctx?: ContextoCliente): Record<string, string> {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (TOKEN) h["x-booking-token"] = TOKEN;
  const ip = ctx?.ip;
  if (ip && TOKEN && IP_RE.test(ip)) {
    h["x-client-ip"] = ip;
    h["x-client-ip-sig"] = createHmac("sha256", TOKEN).update(ip).digest("hex");
  }
  return h;
}

async function trpcQuery<T>(procedure: string, input: Record<string, unknown>, ctx?: ContextoCliente): Promise<T> {
  const inputWithToken = { ...input, token: TOKEN };
  const url = `${API_URL}/api/trpc/${procedure}?input=${encodeURIComponent(JSON.stringify({ json: inputWithToken }))}`;
  const res = await fetch(url, {
    headers: cabeceras(ctx),
    cache: "no-store",
  });
  const data = (await res.json()) as TRPCQueryResponse<T>;
  if ("error" in data) throw new Error(data.error.json.message);
  return data.result.data.json;
}

async function trpcMutation<T>(procedure: string, input: Record<string, unknown>, ctx?: ContextoCliente): Promise<T> {
  const inputWithToken = { ...input, token: TOKEN };
  const res = await fetch(`${API_URL}/api/trpc/${procedure}`, {
    method: "POST",
    headers: cabeceras(ctx),
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
  capacidadAdultos: number;
  capacidadNinos: number;
  edadInfanteHasta: number;
  edadNinoHasta: number;
  /** Foto principal y galería que se cargan en el app (Hotel › Tipos). */
  imagenUrl?: string | null;
  galeria?: string[];
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
  capacidadAdultos: number;
  capacidadNinos: number;
  adultosIncluidos: number;
  ninosIncluidos: number;
  edadInfanteHasta: number;
  edadNinoHasta: number;
  cargoAdultoExtra: number;
  cargoNinoExtra: number;
  cargoInfanteExtra: number;
  disponibles: number;
  totalHabitaciones: number;
  /** Tasa de ITBMS de hospedaje (0.10 = 10%). Se cobra encima de la tarifa. */
  tasaImpuesto?: number;
  imagenUrl?: string | null;
  galeria?: string[];
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
  /** Honeypot: siempre vacío en un envío humano. */
  website?: string;
}

export interface ReservaInput extends HuespedInput {
  idempotencyKey: string;
  tipoHabitacionId: string;
  checkIn: string;
  checkOut: string;
  adultos: number;
  ninos?: number;
  edadesNinos?: number[];
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
}, ctx?: ContextoCliente): Promise<DisponibilidadTipo[]> {
  return trpcQuery("bookingPublic.disponibilidad", {
    checkIn: args.checkIn,
    checkOut: args.checkOut,
    huespedes: args.huespedes ?? 2,
  }, ctx);
}

export async function crearReserva(input: ReservaInput, ctx?: ContextoCliente): Promise<{
  ok: boolean;
  codigo: string;
  reservaId: string;
}> {
  return trpcMutation("bookingPublic.crearReserva", {
    ...input,
    ninos: input.ninos ?? 0,
    edadesNinos: input.edadesNinos ?? [],
    pais: input.pais ?? "PA",
    idioma: input.idioma ?? "es",
  }, ctx);
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
  /** Tasa de ITBMS (0.07 = 7%). Ausente en versiones viejas del API: se asume 7%. */
  tasaItbms?: number;
  incluyeAlmuerzo: boolean;
  incluyeDesayuno: boolean;
  incluyeBebidas: boolean;
  imagenUrl: string | null;
}

export interface TextoLegal { titulo: string; contenido: string; actualizadoAt: string | null }

/** Términos o privacidad editados por gerencia en el sistema (Configuración › Textos legales). */
export async function obtenerTextoLegal(clave: "terminos" | "privacidad"): Promise<TextoLegal | null> {
  return trpcQuery("bookingPublic.textoLegal", { clave });
}

export async function listarPasadias(ctx?: ContextoCliente): Promise<PasadiaProducto[]> {
  return trpcQuery("bookingPublic.pasadiasCatalogo", {}, ctx);
}

export interface PasadiaReservaInput extends HuespedInput {
  fecha: string;
  horaLlegada?: string;
  items: Array<{ productoId: string; cantidad: number }>;
  notas?: string;
  idioma?: "es" | "en" | "pt";
}

export async function crearReservaPasadia(input: PasadiaReservaInput, ctx?: ContextoCliente): Promise<{
  ok: boolean;
  codigo: string;
  reservaId: string;
}> {
  return trpcMutation("bookingPublic.pasadiasCrearReserva", {
    ...input,
    pais: input.pais ?? "PA",
    idioma: input.idioma ?? "es",
  }, ctx);
}

// ============================================================
// Validación en el proxy (antes de reenviar al backend)
// ============================================================

/** Tope de cuerpo para las rutas de reserva (16 KB). */
export const MAX_BODY_BYTES = 16 * 1024;

/**
 * Lee el JSON del cuerpo con tope de tamaño. Devuelve status 413 si se pasa,
 * 400 si no es JSON.
 */
export async function leerJsonLimitado(req: Request): Promise<{ ok: true; data: unknown } | { ok: false; status: number; error: string }> {
  const declarado = Number(req.headers.get("content-length") ?? "0");
  if (declarado > MAX_BODY_BYTES) return { ok: false, status: 413, error: "Solicitud demasiado grande" };
  const texto = await req.text();
  if (Buffer.byteLength(texto, "utf8") > MAX_BODY_BYTES) return { ok: false, status: 413, error: "Solicitud demasiado grande" };
  try {
    return { ok: true, data: JSON.parse(texto) };
  } catch {
    return { ok: false, status: 400, error: "Solicitud inválida" };
  }
}

/** Primer mensaje de error de zod, para mostrarlo al huésped. */
export function mensajeZod(e: z.ZodError): string {
  return e.issues[0]?.message ?? "Datos inválidos";
}

const FECHA = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida");
// Mismas reglas que el backend: letras unicode, marcas, espacios, apóstrofo, punto y guion.
const NOMBRE_RE = /^[\p{L}\p{M}'’ .-]+$/u;

const huespedSchema = z.object({
  nombre: z
    .string()
    .max(200)
    .transform((s) => s.replace(/\s+/gu, " ").trim())
    .pipe(
      z
        .string()
        .min(2, "Nombre muy corto")
        .max(120, "Nombre muy largo")
        .regex(NOMBRE_RE, "El nombre solo puede tener letras, espacios, apóstrofo, punto y guion")
        .refine((s) => !/www/iu.test(s), { message: "Nombre inválido" })
        .refine((s) => s.split(" ").length >= 2, { message: "Ingresa nombre y apellido" })
        .refine((s) => s.split(" ").every((p) => p.length <= 60), { message: "Nombre inválido" }),
    ),
  email: z.string().trim().toLowerCase().pipe(z.email("Email no válido").max(160, "Email muy largo")),
  telefono: z
    .string()
    .max(40, "Teléfono inválido")
    .refine((t) => !/[^\d\s+().-]/.test(t.trim()), { message: "Teléfono inválido" })
    .refine((t) => { const n = t.replace(/\D/g, "").length; return n >= 8 && n <= 15; }, { message: "Teléfono inválido" }),
  pais: z.string().length(2),
  documentoTipo: z.enum(["cedula_pa", "pasaporte", "otro"]),
  documentoNumero: z.string().trim().min(4, "Número de documento requerido").max(40),
  captchaToken: z.string().min(1, "Captcha requerido").max(4096),
  website: z.string().max(500).optional(),
});

const notasSchema = z.string().max(300, "Notas: máximo 300 caracteres").optional();
const idiomaSchema = z.enum(["es", "en", "pt"]).optional();

export const reservaSchema = huespedSchema.extend({
  idempotencyKey: z.guid(),
  tipoHabitacionId: z.guid(),
  checkIn: FECHA,
  checkOut: FECHA,
  adultos: z.number().int().min(1).max(10),
  ninos: z.number().int().min(0).max(10).optional(),
  edadesNinos: z.array(z.number().int().min(0).max(17)).max(10).optional(),
  notas: notasSchema,
  idioma: idiomaSchema,
});

export const pasadiaReservaSchema = huespedSchema.extend({
  fecha: FECHA,
  horaLlegada: z.string().max(20).optional(),
  items: z.array(z.object({ productoId: z.guid(), cantidad: z.number().int().min(1).max(20) })).min(1).max(10),
  notas: notasSchema,
  idioma: idiomaSchema,
});

export const disponibilidadSchema = z.object({
  checkIn: FECHA,
  checkOut: FECHA,
  huespedes: z.coerce.number().int().min(1).max(12).default(2),
});

/** Honeypot lleno = bot. Respuesta genérica, sin pistas. */
export function honeypotLleno(website: string | undefined): boolean {
  return !!website && website.trim() !== "";
}
