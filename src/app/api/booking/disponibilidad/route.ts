import { NextRequest, NextResponse } from "next/server";
import { consultarDisponibilidad, disponibilidadSchema, ipDelCliente, mensajeZod } from "@/lib/contabiliClient";

/** Proxy server-side. Igual que pasadías: el token está en el servidor. */
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  // Validación con zod antes de reenviar (el backend acota rango y fechas).
  const parsed = disponibilidadSchema.safeParse({
    checkIn: sp.get("checkIn") ?? "",
    checkOut: sp.get("checkOut") ?? "",
    huespedes: sp.get("huespedes") ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: mensajeZod(parsed.error) }, { status: 400 });
  }
  try {
    const tipos = await consultarDisponibilidad(parsed.data, { ip: ipDelCliente(req.headers) });
    return NextResponse.json({ tipos });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
