import { NextRequest, NextResponse } from "next/server";
import { ipDelCliente, listarPasadias } from "@/lib/contabiliClient";

/**
 * Proxy server-side para el catálogo de pasadías de Contabili.
 *
 * El cliente del browser no tiene acceso al PUBLIC_BOOKING_TOKEN
 * (env var sin prefijo NEXT_PUBLIC_), entonces no puede hablar
 * directamente con la API de Contabili. Este route handler corre
 * en el server (Node) donde el token sí está disponible, y reenvía
 * la respuesta al browser.
 */
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // Se reenvía la IP real (firmada) para que el backend no vea un solo cliente.
    const productos = await listarPasadias({ ip: ipDelCliente(req.headers) });
    return NextResponse.json({ productos });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
