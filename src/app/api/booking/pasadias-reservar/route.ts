import { NextRequest, NextResponse } from "next/server";
import {
  crearReservaPasadia,
  honeypotLleno,
  ipDelCliente,
  leerJsonLimitado,
  mensajeZod,
  pasadiaReservaSchema,
} from "@/lib/contabiliClient";

/**
 * Proxy server-side para crear reserva de pasadía.
 * Misma razón que el catálogo: el token vive solo en el servidor.
 */
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // Tope de tamaño (16 KB) y validación antes de reenviar al backend.
  const cuerpo = await leerJsonLimitado(req);
  if (!cuerpo.ok) return NextResponse.json({ error: cuerpo.error }, { status: cuerpo.status });
  const parsed = pasadiaReservaSchema.safeParse(cuerpo.data);
  if (!parsed.success) return NextResponse.json({ error: mensajeZod(parsed.error) }, { status: 400 });
  // Honeypot lleno: respuesta genérica, no se reenvía.
  if (honeypotLleno(parsed.data.website)) {
    return NextResponse.json({ error: "No se pudo procesar la solicitud." }, { status: 400 });
  }
  try {
    const result = await crearReservaPasadia(parsed.data, { ip: ipDelCliente(req.headers) });
    return NextResponse.json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
