/**
 * Booking Service — wrapper sobre contabiliClient para que el código del
 * landing y motor de reservas conserve la API original.
 */

import { consultarDisponibilidad, crearReserva, type DisponibilidadTipo } from "./contabiliClient";

export interface AvailableRoom {
  id: string;
  number: string;
  name: string;
  type: string;
  pricePerNight: number;
  totalPrice: number;
  nights: number;
  baseRate?: number;
  appliedRatePlan?: null;
  status: string;
  capacity?: number;
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
  roomId: string; // en realidad es tipoHabitacionId — mantenemos nombre por compat
  checkInDate: string;
  checkOutDate: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  adults?: number;
  children?: number;
  notes?: string;
}

const DEFAULT_IMG = "/logo.jpg";

function mapDispToRoom(d: DisponibilidadTipo): AvailableRoom {
  return {
    id: d.tipoId,
    number: d.codigo,
    name: d.nombre,
    type: d.codigo,
    pricePerNight: d.tarifaNoche,
    totalPrice: d.totalNoche,
    nights: d.noches,
    status: "available",
    capacity: d.capacidad,
    unitsAvailable: d.disponibles,
    amenities: [],
    image: DEFAULT_IMG,
    description: d.descripcion,
    rating: 5,
  };
}

export async function getAvailableRooms(
  checkInDate: string,
  checkOutDate: string,
  guests = 1,
): Promise<AvailableRoom[]> {
  const tipos = await consultarDisponibilidad({
    checkIn: checkInDate,
    checkOut: checkOutDate,
    huespedes: guests,
  });
  return tipos.map(mapDispToRoom);
}

export async function createGuestReservation(b: BookingRequest): Promise<{
  ok: boolean;
  codigo: string;
  reservaId: string;
  clienteId: string;
}> {
  return crearReserva({
    tipoHabitacionId: b.roomId,
    checkIn: b.checkInDate,
    checkOut: b.checkOutDate,
    adultos: b.adults ?? 2,
    ninos: b.children ?? 0,
    nombre: b.guestName,
    email: b.guestEmail,
    telefono: b.guestPhone,
    notas: b.notes,
  });
}

export function validateBookingDates(checkInDate: string, checkOutDate: string) {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (checkIn < today) return { valid: false, error: "Check-in date cannot be in the past" };
  if (checkIn >= checkOut) return { valid: false, error: "Check-out date must be after check-in date" };
  return { valid: true, error: undefined };
}
