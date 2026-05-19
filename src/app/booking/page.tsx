'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Calendar, User, Search, ChevronRight, Zap, Coffee, Wind, Wifi, Star, X } from 'lucide-react';
import {
  Clock, LogIn, LogOut, CreditCard, Ship, Dumbbell,
  ShieldCheck, XCircle, Utensils, Waves,
} from '@/lib/icons';
import { getAvailableRooms, createGuestReservation, validateBookingDates } from '@/lib/bookingService';
import { listarPasadias, crearReservaPasadia, type PasadiaProducto } from '@/lib/contabiliClient';
import { useTranslation } from '@/i18n/useTranslation';
import { LANDING_CONTENT } from '@/content/landing';

type BookingTab = 'rooms' | 'pasadias' | 'estadia' | 'llegar' | 'politicas';

// Mapa de íconos para stayInfo (mismo que LandingView).
const STAY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Clock, LogIn, LogOut, Coffee, Utensils, Dumbbell,
  ShieldCheck, CreditCard, Waves, XCircle,
};

const ISO_RE = /^\d{4}-\d{2}-\d{2}$/;

// useSearchParams must live inside a Suspense boundary in Next 16, so the
// real page lives in BookingPageInner and the default export wraps it.
export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-zinc-500 font-bold uppercase tracking-widest">Cargando…</div>}>
      <BookingPageInner />
    </Suspense>
  );
}

interface AvailableRoom {
  id: string;
  number: string;
  name: string;
  type: string;
  pricePerNight: number;
  totalPrice: number;
  nights: number;
  baseRate?: number;
  appliedRatePlan?: {
    id: string;
    name: string;
    discountPct: number | null;
    channel: string;
  } | null;
  status: string;
  amenities: string[];
  image: string;
  description: string;
  rating: number;
}

function BookingPageInner() {
  const { t, language } = useTranslation();
  const searchParams = useSearchParams();

  // Pull initial values from the URL the landing search bar pushed.
  // Falls back to today / tomorrow / 2 guests.
  const qsCheckIn = searchParams.get('checkIn');
  const qsCheckOut = searchParams.get('checkOut');
  const qsGuests = parseInt(searchParams.get('guests') ?? '', 10);

  const [rooms, setRooms] = useState<AvailableRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkInDate, setCheckInDate] = useState(
    ISO_RE.test(qsCheckIn ?? '') ? qsCheckIn! : new Date().toISOString().split('T')[0],
  );
  const [checkOutDate, setCheckOutDate] = useState(
    ISO_RE.test(qsCheckOut ?? '') ? qsCheckOut! : new Date(Date.now() + 86400000).toISOString().split('T')[0],
  );
  const [guests, setGuests] = useState(
    Number.isFinite(qsGuests) && qsGuests >= 1 && qsGuests <= 12 ? qsGuests : 2,
  );
  const [selectedRoom, setSelectedRoom] = useState<AvailableRoom | null>(null);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [activeTab, setActiveTab] = useState<BookingTab>('rooms');
  const [bookingHero, setBookingHero] = useState('');

  const [checkoutData, setCheckoutData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    adults: 2,
    children: 0,
    notes: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // ------- PASADÍAS -------
  // Catálogo se carga una sola vez al entrar al tab. Las pasadías no dependen
  // de check-in/check-out: el cliente elige una fecha de visita aparte.
  const [pasadias, setPasadias] = useState<PasadiaProducto[]>([]);
  const [pasadiasLoading, setPasadiasLoading] = useState(false);
  const [pasadiasError, setPasadiasError] = useState('');
  const [pasadiasLoaded, setPasadiasLoaded] = useState(false);

  useEffect(() => {
    if (activeTab !== 'pasadias' || pasadiasLoaded) return;
    let cancelled = false;
    setPasadiasLoading(true);
    setPasadiasError('');
    listarPasadias()
      .then((data) => {
        if (cancelled) return;
        setPasadias(data);
        setPasadiasLoaded(true);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setPasadiasError(err instanceof Error ? err.message : 'Error cargando pasadías');
      })
      .finally(() => {
        if (!cancelled) setPasadiasLoading(false);
      });
    return () => { cancelled = true; };
  }, [activeTab, pasadiasLoaded]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  // Fetch CMS config and Available rooms
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch CMS Hero
        const configRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/config/cms_bookingHero`);
        if (configRes.ok) {
           const config = await configRes.json();
           if (config.value) setBookingHero(config.value);
        }

        const validation = validateBookingDates(checkInDate, checkOutDate);
        if (!validation.valid) {
          setError(validation.error ?? '');
          setRooms([]);
          setLoading(false);
          return;
        }

        const availableRooms = await getAvailableRooms(checkInDate, checkOutDate, guests);
        setRooms(availableRooms);
      } catch (err: any) {
        setError(err.message || 'Error fetching data');
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    if (checkInDate && checkOutDate) {
      fetchData();
    }
  }, [checkInDate, checkOutDate, guests]);

  const handleBookRoom = (room: AvailableRoom) => {
    setSelectedRoom(room);
    setShowCheckoutForm(true);
    setCheckoutData({ ...checkoutData, adults: guests });
  };

  const handleSubmitBooking = async () => {
    if (!selectedRoom || submitting) return;
    if (!checkoutData.guestName.trim() || !checkoutData.guestPhone.trim()) {
      setToast({ type: 'error', text: language === 'es' ? 'Nombre y teléfono son requeridos' : 'Name and phone are required' });
      return;
    }
    try {
      setSubmitting(true);
      const result = await createGuestReservation({
        roomId: selectedRoom.id,
        checkInDate,
        checkOutDate,
        guestName: checkoutData.guestName,
        guestEmail: checkoutData.guestEmail,
        guestPhone: checkoutData.guestPhone,
        adults: checkoutData.adults,
        children: checkoutData.children,
        notes: checkoutData.notes,
      });
      setToast({ type: 'success', text: `${t('booking.bookingConfirmed')} · ${result.codigo}` });
      setShowCheckoutForm(false);
      setSelectedRoom(null);
    } catch (err: any) {
      setToast({ type: 'error', text: `${t('common.error')}: ${err.message}` });
    } finally {
      setSubmitting(false);
    }
  };

  const nights = Math.ceil(
    (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  // Habitaciones siempre excluyen tipos legacy con "pasadia" en el nombre.
  // El listado de pasadías ahora viene de su propio endpoint (no de bookingPublic.disponibilidad).
  const filteredRooms = rooms.filter(room => {
      const name = (room.name || '').toLowerCase();
      const type = (room.type || '').toLowerCase();
      const isPasadia = name.includes('pasadia') || name.includes('pasadía') || type.includes('pasadia') || type.includes('pasadía');
      return !isPasadia;
  });

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-dark font-sans">
      {/* Checkout Form Modal */}
      {showCheckoutForm && selectedRoom && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl overflow-hidden relative">
             <button onClick={() => setShowCheckoutForm(false)} className="absolute top-6 right-6 text-zinc-400 hover:text-dark transition-colors"><X className="w-6 h-6" /></button>
             <h2 className="text-2xl font-black mb-6">{t('booking.checkout')}</h2>
             <div className="bg-zinc-50 p-6 rounded-2xl mb-6 border border-zinc-100">
                <p className="font-black text-lg text-dark">{selectedRoom.name || selectedRoom.type}</p>
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 mt-1 uppercase tracking-widest">
                   <Calendar className="w-3 h-3" /> {checkInDate} - {checkOutDate} ({nights} {t('booking.nights')})
                </div>
                <p className="text-2xl font-black text-primary mt-4">${selectedRoom.totalPrice}</p>
             </div>
             <div className="space-y-4">
                <label htmlFor="booking-name" className="sr-only">{t('booking.fullName')}</label>
                <input id="booking-name" type="text" required autoComplete="name" aria-required="true" placeholder={t('booking.fullName')} className="w-full p-4 bg-zinc-50 rounded-xl border border-zinc-100 text-sm font-bold" value={checkoutData.guestName} onChange={e => setCheckoutData({...checkoutData, guestName: e.target.value})} />
                <label htmlFor="booking-email" className="sr-only">{t('booking.email')}</label>
                <input id="booking-email" type="email" autoComplete="email" placeholder={t('booking.email')} className="w-full p-4 bg-zinc-50 rounded-xl border border-zinc-100 text-sm font-bold" value={checkoutData.guestEmail} onChange={e => setCheckoutData({...checkoutData, guestEmail: e.target.value})} />
                <label htmlFor="booking-phone" className="sr-only">{t('booking.phone')}</label>
                <input id="booking-phone" type="tel" required autoComplete="tel" aria-required="true" placeholder={t('booking.phone')} className="w-full p-4 bg-zinc-50 rounded-xl border border-zinc-100 text-sm font-bold" value={checkoutData.guestPhone} onChange={e => setCheckoutData({...checkoutData, guestPhone: e.target.value})} />
                <button onClick={handleSubmitBooking} disabled={submitting} aria-busy={submitting} className="w-full bg-dark text-white font-black py-5 rounded-2xl shadow-xl hover:bg-black transition-all uppercase tracking-widest text-[11px] mt-4 disabled:opacity-60 disabled:cursor-not-allowed">{submitting ? '...' : t('booking.confirmBooking')}</button>
             </div>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <section className="relative h-[45vh] min-h-[400px] flex items-center justify-center overflow-hidden">
         <div className="absolute inset-0">
            <img 
               src={bookingHero || 'https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&q=80&w=2000'} 
               alt="Booking Background" 
               className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#FDFCFB]"></div>
         </div>
         <div className="relative z-10 text-center text-white px-6">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 drop-shadow-2xl">
               {language === 'es' ? 'Reserva tu lugar en el paraíso' : 'Book your spot in paradise'}
            </h1>
            <p className="text-lg md:text-xl font-medium opacity-90 max-w-2xl mx-auto drop-shadow-md">
               {language === 'es' ? 'Momentos inolvidables te esperan en Hotel Candy Rose' : 'Unforgettable moments await at Hotel Candy Rose'}
            </p>
         </div>
      </section>

      {/* Horizontal Search Bar */}
      <div className="container mx-auto px-6 -mt-12 relative z-20">
         <div className="bg-white/90 backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] rounded-[40px] p-4 lg:p-6 border border-white grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2 px-4">
               <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest flex items-center gap-2"><Calendar className="w-3 h-3" /> {t('booking.checkIn')}</label>
               <input
                  type="date"
                  value={checkInDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => {
                    const v = e.target.value;
                    setCheckInDate(v);
                    // Si la salida queda igual o anterior a la entrada, auto-ajustar a +1 día.
                    if (v && checkOutDate && new Date(checkOutDate).getTime() <= new Date(v).getTime()) {
                      const next = new Date(v);
                      next.setDate(next.getDate() + 1);
                      setCheckOutDate(next.toISOString().split('T')[0]);
                    }
                  }}
                  className="w-full bg-transparent text-sm font-black outline-none border-b border-zinc-100 pb-2 focus:border-primary transition-colors"
               />
            </div>
            <div className="space-y-2 px-4">
               <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest flex items-center gap-2"><Calendar className="w-3 h-3" /> {t('booking.checkOut')}</label>
               <input
                  type="date"
                  value={checkOutDate}
                  min={(() => {
                    const d = new Date(checkInDate || new Date().toISOString().split('T')[0]);
                    d.setDate(d.getDate() + 1);
                    return d.toISOString().split('T')[0];
                  })()}
                  onChange={e => setCheckOutDate(e.target.value)}
                  className="w-full bg-transparent text-sm font-black outline-none border-b border-zinc-100 pb-2 focus:border-primary transition-colors"
               />
            </div>
            <div className="space-y-2 px-4">
               <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest flex items-center gap-2"><User className="w-3 h-3" /> {language === 'es' ? 'Huéspedes' : 'Guests'}</label>
               <input type="number" min="1" value={guests} onChange={e => setGuests(parseInt(e.target.value))} className="w-full bg-transparent text-sm font-black outline-none border-b border-zinc-100 pb-2 focus:border-primary transition-colors" />
            </div>
            <div className="p-2">
               <button className="w-full bg-primary hover:bg-orange-600 text-white font-black py-4 rounded-3xl shadow-lg transition-all uppercase tracking-widest text-[10px]">
                  {language === 'es' ? 'Actualizar Búsqueda' : 'Update Search'}
               </button>
            </div>
         </div>
      </div>

      <main className="container mx-auto px-6 pt-20 pb-20">
         {/* Tabs Navigation — 5 pestañas: 2 reservables + 3 informativas */}
         <div className="flex justify-center mb-16">
            <div className="bg-zinc-100 p-1.5 rounded-[2rem] flex flex-wrap gap-1 sm:gap-2 max-w-full">
               <button
                  onClick={() => setActiveTab('rooms')}
                  className={`px-4 sm:px-6 lg:px-10 py-3 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'rooms' ? 'bg-white text-dark shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
               >
                  {language === 'es' ? 'Habitaciones' : 'Rooms'}
               </button>
               <button
                  onClick={() => setActiveTab('pasadias')}
                  className={`px-4 sm:px-6 lg:px-10 py-3 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'pasadias' ? 'bg-white text-dark shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
               >
                  {language === 'es' ? 'Pasadías' : 'Day Passes'}
               </button>
               <button
                  onClick={() => setActiveTab('estadia')}
                  className={`px-4 sm:px-6 lg:px-10 py-3 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'estadia' ? 'bg-white text-dark shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
               >
                  {language === 'es' ? 'Información' : 'Info'}
               </button>
               <button
                  onClick={() => setActiveTab('llegar')}
                  className={`px-4 sm:px-6 lg:px-10 py-3 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'llegar' ? 'bg-white text-dark shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
               >
                  {language === 'es' ? 'Cómo llegar' : 'How to arrive'}
               </button>
               <button
                  onClick={() => setActiveTab('politicas')}
                  className={`px-4 sm:px-6 lg:px-10 py-3 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'politicas' ? 'bg-white text-dark shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
               >
                  {language === 'es' ? 'Políticas' : 'Policies'}
               </button>
            </div>
         </div>

         {/* Paneles informativos: muestran contenido editorial del cliente.
             PT no tiene contenido nuevo todavía, así que mostramos ES como fallback. */}
         {activeTab === 'estadia' && <StayInfoPanel language={language === 'en' ? 'en' : 'es'} />}
         {activeTab === 'llegar' && <HowToArrivePanel language={language === 'en' ? 'en' : 'es'} />}
         {activeTab === 'politicas' && <PoliciesPanel language={language === 'en' ? 'en' : 'es'} />}

         {activeTab === 'rooms' && loading && (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
               <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
               <p className="text-sm font-black text-zinc-300 uppercase tracking-[0.3em]">{t('booking.searchRooms')}</p>
            </div>
         )}

         {activeTab === 'rooms' && !loading && filteredRooms.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[40px] border border-zinc-100 shadow-sm">
               {error ? (
                  <>
                     <h3 className="text-2xl font-black mb-2 text-primary">
                        {language === 'es' ? 'Revisa las fechas' : 'Check your dates'}
                     </h3>
                     <p className="text-zinc-500 font-medium max-w-md mx-auto">
                        {language === 'es'
                           ? 'La fecha de salida debe ser al menos un día después de la fecha de entrada.'
                           : 'Check-out must be at least one day after check-in.'}
                     </p>
                  </>
               ) : (
                  <>
                     <span className="text-5xl block mb-6">🏝️</span>
                     <h3 className="text-2xl font-black mb-2">{t('booking.noRoomsAvailable')}</h3>
                     <p className="text-zinc-400 font-medium">Intenta con otras fechas o ajusta los huéspedes.</p>
                  </>
               )}
            </div>
         )}

         {/* Panel Pasadías — viene de bookingPublic.pasadiasCatalogo y reservas se
             crean con su propio mutation. NO depende de checkIn/checkOut. */}
         {activeTab === 'pasadias' && (
           <PasadiasPanel
             language={language}
             productos={pasadias}
             loading={pasadiasLoading}
             error={pasadiasError}
             onToast={setToast}
           />
         )}

         {activeTab === 'rooms' && (
         <div className="grid grid-cols-1 gap-12 max-w-6xl mx-auto">
            {filteredRooms.map((room) => (
              <div key={room.id} className="group bg-white rounded-[40px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] transition-all duration-500 border border-zinc-50 flex flex-col lg:flex-row">
                 <div className="lg:w-2/5 h-[300px] lg:h-auto relative overflow-hidden">
                    <img src={room.image || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000'} alt={room.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-primary">
                       {activeTab === 'rooms' ? 'Boutique' : 'All Day'}
                    </div>
                 </div>
                 <div className="flex-1 p-8 lg:p-12 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-4">
                           <h2 className="text-3xl font-black tracking-tight group-hover:text-primary transition-colors">{room.name || room.type}</h2>
                        </div>
                        <p className="text-zinc-400 font-medium leading-relaxed mb-8 max-w-lg">{room.description}</p>
                        
                        <div className="flex flex-wrap gap-6 mb-10">
                           {room.amenities.slice(0, 4).map(a => (
                              <div key={a} className="flex items-center gap-2 text-[10px] font-black text-zinc-300 uppercase tracking-widest">
                                 {a === 'Wifi' && <Wifi className="w-3.5 h-3.5" />}
                                 {a === 'AC' && <Wind className="w-3.5 h-3.5" />}
                                 {a === 'Coffee' && <Coffee className="w-3.5 h-3.5" />}
                                 {a}
                              </div>
                           ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-8 border-t border-zinc-50">
                       <div>
                          <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-1">{room.nights} {t('booking.nights')}</p>
                          {/* Show the applied rate plan as a small primary chip
                              so the guest knows why the price is what it is —
                              "Promo Verano -15%" feels different from a price
                              that just changed without explanation. */}
                          {room.appliedRatePlan && (
                            <p className="inline-flex items-center gap-1.5 text-[9px] font-black text-primary bg-orange-50 border border-orange-100 px-2 py-1 rounded-full uppercase tracking-widest mb-2">
                              {room.appliedRatePlan.name}
                              {room.appliedRatePlan.discountPct ? ` · -${room.appliedRatePlan.discountPct}%` : ''}
                            </p>
                          )}
                          <div className="flex items-baseline gap-2">
                             {/* Strike-through the base rate when a discount won so the saving is visible. */}
                             {room.baseRate && room.appliedRatePlan && room.baseRate > room.pricePerNight && (
                               <span className="text-base font-black text-zinc-300 line-through tracking-tighter">${(room.baseRate * room.nights).toFixed(0)}</span>
                             )}
                             <span className="text-4xl font-black text-dark tracking-tighter">${room.totalPrice}</span>
                             <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Total</span>
                          </div>
                       </div>
                       <button 
                          onClick={() => handleBookRoom(room)}
                          className="bg-dark hover:bg-primary text-white font-black px-10 py-5 rounded-2xl shadow-xl transition-all uppercase tracking-widest text-[11px] flex items-center gap-3 group/btn"
                       >
                          {t('booking.selectRoom')} <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                       </button>
                    </div>
                 </div>
              </div>
            ))}
         </div>
         )}
      </main>

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-[200] max-w-sm px-6 py-4 rounded-2xl shadow-2xl font-bold text-sm ${
            toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
          }`}
        >
          {toast.text}
        </div>
      )}
    </div>
  );
}

// ============================================================
// Paneles informativos
// ============================================================
// Estos tres paneles consumen el contenido editorial de LANDING_CONTENT
// (fuente de verdad única, evita duplicar texto entre landing y booking).
// Renderizan dentro del flujo del booking cuando el usuario elige una
// pestaña distinta de Habitaciones/Pasadías. La intención: que el huésped
// pueda revisar reglas y logística sin salir del flujo de reserva.

function StayInfoPanel({ language }: { language: 'es' | 'en' }) {
  const items = LANDING_CONTENT.stayInfo ?? [];
  const title = language === 'es' ? LANDING_CONTENT.stayInfoTitle_es : LANDING_CONTENT.stayInfoTitle_en;
  return (
    <section className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-3 block">
          {language === 'es' ? 'Antes de reservar' : 'Before booking'}
        </span>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-none text-dark">{title}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {items.map((item, i) => {
          const IconCmp = STAY_ICONS[item.icon] ?? Clock;
          const label = language === 'es' ? item.label_es : item.label_en;
          const value = language === 'es' ? item.value_es : item.value_en;
          const cardCls = item.highlight
            ? 'bg-primary/5 border-primary/30 md:col-span-2'
            : 'bg-white border-zinc-100';
          return (
            <div key={i} className={`flex items-start gap-5 p-6 lg:p-7 rounded-[2rem] border ${cardCls} shadow-sm`}>
              <span className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${item.highlight ? 'bg-primary text-white' : 'bg-zinc-50 text-primary'}`}>
                <IconCmp className="w-5 h-5" />
              </span>
              <div className="min-w-0">
                <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1.5">{label}</span>
                <span className={`block text-base font-bold leading-snug ${item.highlight ? 'text-dark' : 'text-dark/85'}`}>{value}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function HowToArrivePanel({ language }: { language: 'es' | 'en' }) {
  const title = language === 'es' ? LANDING_CONTENT.howToArriveTitle_es : LANDING_CONTENT.howToArriveTitle_en;
  const body = language === 'es' ? LANDING_CONTENT.howToArrive_es : LANDING_CONTENT.howToArrive_en;
  if (!body) return null;
  return (
    <section className="max-w-5xl mx-auto grid lg:grid-cols-12 gap-12 items-start">
      <div className="lg:col-span-4">
        <div className="aspect-square bg-gradient-to-br from-secondary/20 via-primary/10 to-accent/10 rounded-[3rem] flex items-center justify-center shadow-sm">
          <Ship className="w-24 h-24 text-primary" />
        </div>
      </div>
      <div className="lg:col-span-8">
        <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-3 block">
          {language === 'es' ? 'Acceso al hotel' : 'Getting here'}
        </span>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-none text-dark mb-8">{title}</h2>
        <div className="space-y-5 text-base lg:text-lg text-zinc-600 font-medium leading-relaxed whitespace-pre-line">{body}</div>
      </div>
    </section>
  );
}

function PoliciesPanel({ language }: { language: 'es' | 'en' }) {
  const title = language === 'es' ? LANDING_CONTENT.cancellationTitle_es : LANDING_CONTENT.cancellationTitle_en;
  const items = language === 'es' ? LANDING_CONTENT.cancellation_es : LANDING_CONTENT.cancellation_en;
  if (!items || items.length === 0) return null;
  return (
    <section className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-3 block">
          {language === 'es' ? 'Términos' : 'Terms'}
        </span>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-none text-dark">{title}</h2>
      </div>
      <ul className="space-y-5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-5 p-6 bg-zinc-50 rounded-[2rem] border border-zinc-100">
            <span className="w-9 h-9 rounded-full bg-primary/10 text-primary font-black flex items-center justify-center shrink-0 text-sm">
              {i + 1}
            </span>
            <span className="text-zinc-700 leading-relaxed font-medium pt-1.5">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ============================================================
// PASADÍAS PANEL
// ============================================================
// Render del catálogo + carrito + form de reserva. Las pasadías son un
// producto independiente de las habitaciones — el huésped no necesita
// elegir check-in/check-out, solo una fecha de visita.
function PasadiasPanel({
  language,
  productos,
  loading,
  error,
  onToast,
}: {
  language: 'es' | 'en' | 'pt';
  productos: PasadiaProducto[];
  loading: boolean;
  error: string;
  onToast: (t: { type: 'success' | 'error'; text: string } | null) => void;
}) {
  const lang: 'es' | 'en' = language === 'en' ? 'en' : 'es';
  const [cantidades, setCantidades] = useState<Record<string, number>>({});
  const [reservaOpen, setReservaOpen] = useState(false);
  const [fecha, setFecha] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [notas, setNotas] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const items = productos
    .map((p) => ({ producto: p, cantidad: cantidades[p.id] ?? 0 }))
    .filter((it) => it.cantidad > 0);
  const total = items.reduce((acc, it) => acc + it.producto.precio * it.cantidad, 0);

  function setCantidad(id: string, delta: number) {
    setCantidades((prev) => {
      const nuevo = Math.max(0, (prev[id] ?? 0) + delta);
      return { ...prev, [id]: nuevo };
    });
  }

  async function confirmar() {
    if (items.length === 0) {
      onToast({ type: 'error', text: lang === 'es' ? 'Selecciona al menos un pasadía' : 'Pick at least one day pass' });
      return;
    }
    if (!nombre.trim() || !email.trim()) {
      onToast({ type: 'error', text: lang === 'es' ? 'Nombre y email son requeridos' : 'Name and email are required' });
      return;
    }
    try {
      setSubmitting(true);
      const res = await crearReservaPasadia({
        fecha,
        nombre,
        email,
        telefono: telefono || undefined,
        notas: notas || undefined,
        items: items.map((it) => ({ productoId: it.producto.id, cantidad: it.cantidad })),
        idioma: lang,
      });
      onToast({ type: 'success', text: `${lang === 'es' ? 'Pasadía confirmada' : 'Day pass confirmed'} · ${res.codigo}` });
      setReservaOpen(false);
      setCantidades({});
      setNombre(''); setEmail(''); setTelefono(''); setNotas('');
    } catch (err: unknown) {
      onToast({ type: 'error', text: err instanceof Error ? err.message : 'Error' });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-black text-zinc-300 uppercase tracking-[0.3em]">
          {lang === 'es' ? 'Cargando pasadías…' : 'Loading day passes…'}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-white rounded-[40px] border border-zinc-100 shadow-sm">
        <h3 className="text-2xl font-black mb-2 text-red-600">
          {lang === 'es' ? 'No pudimos cargar el catálogo' : 'Could not load catalog'}
        </h3>
        <p className="text-zinc-500 font-medium max-w-md mx-auto">{error}</p>
      </div>
    );
  }

  if (productos.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-[40px] border border-zinc-100 shadow-sm">
        <h3 className="text-2xl font-black mb-2">
          {lang === 'es' ? 'Sin pasadías disponibles' : 'No day passes available'}
        </h3>
        <p className="text-zinc-400 font-medium">
          {lang === 'es' ? 'Vuelve a consultar pronto.' : 'Check back soon.'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {productos.map((p) => {
          const cantidad = cantidades[p.id] ?? 0;
          return (
            <div key={p.id} className="bg-white rounded-[28px] border border-zinc-100 shadow-sm p-6 flex flex-col">
              <div className="flex justify-between items-start mb-2 gap-3">
                <h3 className="text-xl font-black tracking-tight">{p.nombre}</h3>
                <span className="text-xl font-black text-primary whitespace-nowrap">${p.precio}</span>
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed mb-4 flex-1">{p.descripcion}</p>
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-zinc-50">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  {p.tipoHuesped === 'nino' ? (lang === 'es' ? 'Niño' : 'Child') : (lang === 'es' ? 'Adulto' : 'Adult')}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCantidad(p.id, -1)}
                    disabled={cantidad === 0}
                    className="w-9 h-9 rounded-full border border-zinc-200 hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed font-bold"
                    aria-label="Restar"
                  >−</button>
                  <span className="w-6 text-center font-bold">{cantidad}</span>
                  <button
                    type="button"
                    onClick={() => setCantidad(p.id, 1)}
                    className="w-9 h-9 rounded-full border border-zinc-200 hover:border-primary hover:text-primary font-bold"
                    aria-label="Sumar"
                  >+</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {items.length > 0 && (
        <div className="sticky bottom-4 bg-dark text-white rounded-[28px] p-5 lg:p-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">
              {lang === 'es' ? 'Total' : 'Total'}
            </p>
            <p className="text-3xl font-black tracking-tighter">${total.toFixed(2)}</p>
          </div>
          <button
            onClick={() => setReservaOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white font-black px-8 py-4 rounded-2xl uppercase tracking-widest text-[11px] flex items-center gap-2"
          >
            {lang === 'es' ? 'Continuar' : 'Continue'} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {reservaOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setReservaOpen(false)}>
          <div className="bg-white rounded-[28px] p-8 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-black tracking-tight">
                {lang === 'es' ? 'Confirma tu pasadía' : 'Confirm your day pass'}
              </h3>
              <button onClick={() => setReservaOpen(false)} aria-label="Cerrar" className="text-zinc-400 hover:text-dark">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block mb-1">
                  {lang === 'es' ? 'Fecha de visita' : 'Visit date'}
                </span>
                <input
                  type="date"
                  value={fecha}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-sm font-bold outline-none focus:border-primary"
                />
              </label>
              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block mb-1">
                  {lang === 'es' ? 'Nombre completo' : 'Full name'}
                </span>
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-sm outline-none focus:border-primary" required />
              </label>
              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block mb-1">Email</span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-sm outline-none focus:border-primary" required />
              </label>
              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block mb-1">
                  {lang === 'es' ? 'Teléfono' : 'Phone'}
                </span>
                <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-sm outline-none focus:border-primary" />
              </label>
              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block mb-1">
                  {lang === 'es' ? 'Notas' : 'Notes'}
                </span>
                <textarea value={notas} onChange={(e) => setNotas(e.target.value)} rows={2} className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-sm outline-none focus:border-primary" />
              </label>

              <div className="bg-zinc-50 rounded-2xl p-4 text-sm">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">
                  {lang === 'es' ? 'Resumen' : 'Summary'}
                </p>
                {items.map((it) => (
                  <div key={it.producto.id} className="flex justify-between mb-1">
                    <span>{it.cantidad} × {it.producto.nombre}</span>
                    <span className="font-bold">${(it.producto.precio * it.cantidad).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 mt-2 border-t border-zinc-200 font-black">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={confirmar}
                disabled={submitting}
                className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-black py-4 rounded-2xl uppercase tracking-widest text-[11px]"
              >
                {submitting ? (lang === 'es' ? 'Procesando…' : 'Processing…') : (lang === 'es' ? 'Confirmar reserva' : 'Confirm booking')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
