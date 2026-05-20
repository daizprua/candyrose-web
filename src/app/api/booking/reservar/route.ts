import { NextRequest, NextResponse } from "next/server";
import { crearReserva, type ReservaInput } from "@/lib/contabiliClient";

/** Proxy server-side para crear reserva de habitación. */
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ReservaInput;
    const result = await crearReserva(body);
    return NextResponse.json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
