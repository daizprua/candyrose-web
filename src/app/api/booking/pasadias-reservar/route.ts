import { NextRequest, NextResponse } from "next/server";
import { crearReservaPasadia, type PasadiaReservaInput } from "@/lib/contabiliClient";

/**
 * Proxy server-side para crear reserva de pasadía.
 * Misma razón que el catálogo: el token vive solo en el servidor.
 */
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as PasadiaReservaInput;
    const result = await crearReservaPasadia(body);
    return NextResponse.json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
