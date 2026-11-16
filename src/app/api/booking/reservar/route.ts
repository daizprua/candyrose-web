import { NextRequest, NextResponse } from "next/server";
import {
  crearReserva,
  honeypotLleno,
  ipDelCliente,
  leerJsonLimitado,
  mensajeZod,
  reservaSchema,
} from "@/lib/contabiliClient";

/** Proxy server-side para crear reserva de habitación. */
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // Tope de tamaño (16 KB) y validación antes de reenviar al backend.
  const cuerpo = await leerJsonLimitado(req);
  if (!cuerpo.ok) return NextResponse.json({ error: cuerpo.error }, { status: cuerpo.status });
  const parsed = reservaSchema.safeParse(cuerpo.data);
  if (!parsed.success) return NextResponse.json({ error: mensajeZod(parsed.error) }, { status: 400 });
  // Honeypot lleno: respuesta genérica, no se reenvía.
  if (honeypotLleno(parsed.data.website)) {
    return NextResponse.json({ error: "No se pudo procesar la solicitud." }, { status: 400 });
  }
  try {
    const result = await crearReserva(parsed.data, { ip: ipDelCliente(req.headers) });
    return NextResponse.json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
