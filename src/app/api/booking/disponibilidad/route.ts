import { NextRequest, NextResponse } from "next/server";
import { consultarDisponibilidad } from "@/lib/contabiliClient";

/** Proxy server-side. Igual que pasadías: el token está en el servidor. */
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const checkIn = sp.get("checkIn") ?? "";
  const checkOut = sp.get("checkOut") ?? "";
  const huespedes = Number(sp.get("huespedes") ?? "2");
  if (!checkIn || !checkOut) {
    return NextResponse.json({ error: "checkIn y checkOut requeridos" }, { status: 400 });
  }
  try {
    const tipos = await consultarDisponibilidad({ checkIn, checkOut, huespedes });
    return NextResponse.json({ tipos });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
