'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar, MapPin, Star, Utensils, Waves,
  Wine, Users, ChevronRight, Globe, Menu, X,
  Wifi, Coffee, Wind, Phone, Camera, Instagram, Map, Image,
  Clock, LogIn, LogOut, CreditCard, Ship, Dumbbell,
  ShieldCheck, PawPrint, XCircle, Anchor, Building2, Mail
} from '@/lib/icons';
import { hoyPanama, sumarDias } from '@/lib/bookingService';
import { useTranslation } from '@/i18n/useTranslation';
import { SiteNav } from './SiteNav';
import { SiteFooter } from './SiteFooter';

interface RoomEditorial {
  code: string;
  name_es: string;
  name_en: string;
  description_es: string;
  description_en: string;
  order: number;
  group: "main" | "villa";
}

interface StayInfoItem {
  icon: string;
  label_es: string;
  label_en: string;
  value_es: string;
  value_en: string;
  highlight?: boolean;
}

const STAY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Clock, LogIn, LogOut, Coffee, Utensils, Dumbbell,
  ShieldCheck, CreditCard, Waves, PawPrint, XCircle,
};

function normalizeCode(s: string | undefined | null): string {
  return (s ?? "").trim().toUpperCase();
}


interface CMSContent {
  heroTitle_es: string;
  heroTitle_en: string;
  heroSub_es: string;
  heroSub_en: string;
  about_es: string;
  about_en: string;
  seoTitle_es: string;
  seoTitle_en: string;
  seoDesc_es: string;
  seoDesc_en: string;
  gallery: string[];
  heroBg?: string;
  aboutImg?: string;
  logo?: string;
  aboutTitle_es: string;
  aboutTitle_en: string;
  aboutSub_es: string;
  aboutSub_en: string;
  roomsTitle_es: string;
  roomsTitle_en: string;
  roomsSub_es: string;
  roomsSub_en: string;
  contactTitle_es: string;
  contactTitle_en: string;
  contactDesc_es?: string;
  contactDesc_en?: string;
  contactPhone: string;
  contactInsta: string;
  contactEmail: string;
  contactLocation: string;
  contactBg?: string;
  // Editorial nuevos
  rooms?: RoomEditorial[];
  villasGroupLabel_es?: string;
  villasGroupLabel_en?: string;
  roomIncludesTitle_es?: string;
  roomIncludesTitle_en?: string;
  roomIncludes_es?: string[];
  roomIncludes_en?: string[];
  stayInfoTitle_es?: string;
  stayInfoTitle_en?: string;
  stayInfo?: StayInfoItem[];
  howToArriveTitle_es?: string;
  howToArriveTitle_en?: string;
  howToArrive_es?: string;
  howToArrive_en?: string;
  cancellationTitle_es?: string;
  cancellationTitle_en?: string;
  cancellation_es?: string[];
  cancellation_en?: string[];
}

export default function LandingView({ initialContent, rooms }: { initialContent: CMSContent, rooms: any[] }) {
  // Idioma compartido (contexto i18n, persistido en localStorage) para que
  // la elección se mantenga entre portada, /booking y páginas legales.
  const { language } = useTranslation();
  const lang: 'es' | 'en' = language === 'en' ? 'en' : 'es';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const t = {
    es: {
      heroTitle: initialContent.heroTitle_es,
      heroSub: initialContent.heroSub_es,
      about: initialContent.about_es,
      aboutTitle: initialContent.aboutTitle_es,
      aboutSub: initialContent.aboutSub_es,
      roomsTitle: initialContent.roomsTitle_es,
      roomsSub: initialContent.roomsSub_es,
      contactTitle: initialContent.contactTitle_es,
      bookNow: "Reservar ahora",
      checkIn: "Entrada",
      checkOut: "Salida",
      rooms: "Habitaciones",
      aboutUs: "Nosotros",
      contact: "Contacto",
      viewAllRooms: "Ver todas las habitaciones",
      exclusiveAmenities: "Comodidades Exclusivas",
      ourHistory: "Nuestra Historia",
      findYourRoom: "Encuentra tu refugio"
    },
    en: {
      heroTitle: initialContent.heroTitle_en,
      heroSub: initialContent.heroSub_en,
      about: initialContent.about_en,
      aboutTitle: initialContent.aboutTitle_en,
      aboutSub: initialContent.aboutSub_en,
      roomsTitle: initialContent.roomsTitle_en,
      roomsSub: initialContent.roomsSub_en,
      contactTitle: initialContent.contactTitle_en,
      bookNow: "Book Now",
      checkIn: "Check-in",
      checkOut: "Check-out",
      rooms: "Rooms",
      aboutUs: "About Us",
      contact: "Contact",
      viewAllRooms: "View all rooms",
      exclusiveAmenities: "Exclusive Amenities",
      ourHistory: "Our History",
      findYourRoom: "Find your escape"
    }
  }[lang];

  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  if (!isClient) return <div className="min-h-screen bg-[#FCFBF7]"></div>;

  return (
    <div className="min-h-screen bg-[#FCFBF7] text-dark overflow-x-hidden font-sans selection:bg-primary/30">
      <SiteNav logo={initialContent.logo} />

      {/* Hero Section
          Tamaño contenido (min-h pero no h-screen) para que entre a 100% de zoom
          sin obligar al usuario a hacer scroll o achicar el zoom del navegador.
          Tipografía y espaciados reducidos respecto al diseño original. */}
      <section className="relative min-h-[600px] lg:min-h-[640px] flex items-center justify-center overflow-hidden pt-28 pb-12 lg:py-20">
        {/* Abstract Beach Vibes Background */}
        <div className="absolute inset-0 z-0">
           {initialContent.heroBg ? (
             <div className="absolute inset-0">
               <img src={initialContent.heroBg} className="w-full h-full object-cover opacity-20" alt="" aria-hidden="true" />
               <div className="absolute inset-0 bg-gradient-to-b from-[#FCFBF7]/50 to-[#FCFBF7]"></div>
             </div>
           ) : (
             <>
               <div className="absolute top-0 right-0 w-2/3 h-full bg-[#FFF4E0] rounded-bl-[400px] -z-10 animate-pulse-slow"></div>
               <div className="absolute bottom-10 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
             </>
           )}
           <div className="absolute top-40 right-40 w-96 h-96 bg-secondary/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
           <div className="flex flex-col items-start text-left">
              {/* Logo del hotel. object-contain + ancho fluido = entra cualquier proporción. */}
              <div className="mb-5 animate-in zoom-in duration-700">
                <div className="bg-white rounded-2xl shadow-xl shadow-dark/10 border border-white/60 flex items-center justify-center overflow-hidden p-4 w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36">
                  {initialContent.logo ? (
                    <img
                      src={initialContent.logo}
                      alt="Hotel Candy Rose"
                      className="block w-full h-full object-contain"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <Building2 className="w-12 h-12 text-primary" />
                  )}
                </div>
              </div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-[10px] font-black px-3 py-1.5 rounded-full mb-5 tracking-[0.3em] uppercase animate-in slide-in-from-left duration-700">
                  <MapPin className="w-3 h-3 fill-current" /> {initialContent.contactLocation}
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-dark mb-5 leading-[1.05] max-w-2xl animate-in slide-in-from-left duration-1000 delay-200">
                 {t.heroTitle}
              </h1>
              <p className="text-base lg:text-lg text-zinc-500 max-w-lg mb-8 font-medium leading-relaxed animate-in slide-in-from-left duration-1000 delay-500">
                 {t.heroSub}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-700">
                  <Link href="/booking" className="bg-primary hover:bg-primary/90 text-white font-black px-7 py-3.5 rounded-2xl shadow-xl shadow-primary/30 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2 group">
                     {t.bookNow} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="#rooms" className="bg-white border border-zinc-100 hover:border-primary text-dark font-black px-7 py-3.5 rounded-2xl shadow-sm transition-all uppercase tracking-widest text-xs flex items-center justify-center">
                     {t.rooms}
                  </Link>
              </div>
           </div>

           {/* Bloque de imágenes — reducido para que el hero no se desborde a 100% zoom.
               aspect-[3/4] en vez de [4/5], esquinas un poco menos exageradas. */}
           <div className="hidden lg:block relative animate-in zoom-in duration-1000 delay-300">
              <div className={`relative z-10 w-full max-w-[420px] aspect-[3/4] bg-zinc-200 rounded-[40px] overflow-hidden shadow-xl rotate-3 hover:rotate-0 transition-all duration-700 border-[6px] border-white ${scrolled ? 'opacity-90' : 'opacity-100'}`}>
                 <img src={initialContent.heroBg || 'https://images.unsplash.com/photo-1544124499-58912cbddaad?q=80&w=1000&auto=format&fit=crop'} alt="Hotel Candy Rose" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 z-20 w-[45%] aspect-square bg-white p-3 rounded-[28px] shadow-xl -rotate-6">
                 <div className="w-full h-full bg-zinc-100 rounded-[20px] overflow-hidden">
                    <img src={initialContent.aboutImg || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000&auto=format&fit=crop'} alt="" className="w-full h-full object-cover" />
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Quick Access Bar — real form. Submitting carries dates+guests
          to /booking via querystring so the booking page pre-fills its
          own state and runs the availability search immediately. */}
      <SearchBar lang={lang} />

      {/* About Section */}
      <section id="about" className="py-20 lg:py-32 bg-white">
          <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-14 lg:gap-24 items-center">
              <div className="relative">
                  <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-6 pt-12">
                          <div className="aspect-[3/4] bg-zinc-100 rounded-[40px] overflow-hidden shadow-xl">
                             <img src={initialContent.gallery[0] || 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000&auto=format&fit=crop'} className="w-full h-full object-cover" alt="" />
                          </div>
                          <div className="aspect-square rounded-[40px] overflow-hidden shadow-xl transform -rotate-3 transition-transform hover:rotate-0">
                             {initialContent.gallery[2] ? (
                               <img src={initialContent.gallery[2]} className="w-full h-full object-cover" alt="" />
                             ) : (
                               <div className="w-full h-full bg-secondary/20 flex items-center justify-center p-10">
                                 <Waves className="w-12 h-12 text-secondary" />
                               </div>
                             )}
                          </div>
                      </div>
                      <div className="space-y-6">
                          <div className="aspect-square rounded-[40px] overflow-hidden shadow-xl transform rotate-3 transition-transform hover:rotate-0">
                             {initialContent.gallery[1] ? (
                               <img src={initialContent.gallery[1]} className="w-full h-full object-cover" alt="" />
                             ) : (
                               <div className="w-full h-full bg-primary/20 flex items-center justify-center p-10">
                                 <span className="text-4xl font-black text-primary italic">Est. 1972</span>
                               </div>
                             )}
                          </div>
                          <div className="aspect-[3/4] bg-zinc-100 rounded-[40px] overflow-hidden shadow-xl">
                             <img src={initialContent.gallery[3] || 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1000&auto=format&fit=crop'} className="w-full h-full object-cover" alt="" />
                          </div>
                      </div>
                  </div>
              </div>

              <div>
                  <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">{t.aboutSub}</span>
                  <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.05] mb-8 lg:mb-10 text-dark">
                      {t.aboutTitle}
                  </h2>
                  <p className="text-lg text-zinc-500 font-medium leading-relaxed mb-8 whitespace-pre-line">
                      {t.about || "Nuestra historia comenzó en 1972..."}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-8 pt-8 border-t border-zinc-100">
                      <div>
                          <span className="block text-4xl font-black text-dark tracking-tighter mb-2">50+</span>
                          <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">{lang === 'es' ? 'Años de tradición' : 'Years of tradition'}</span>
                      </div>
                      <div>
                          <span className="block text-4xl font-black text-dark tracking-tighter mb-2">100%</span>
                          <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">{lang === 'es' ? 'Compromiso familiar' : 'Family commitment'}</span>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Room Showcase — editorial × API merge.
          Names + descriptions vienen del landing.ts (editorial).
          Imágenes + id de reserva se buscan en la API por código del tipo de habitación.
          Si la API no tiene match, la card se muestra sin link a reserva. */}
      <RoomsSection lang={lang} t={t} initialContent={initialContent} rooms={rooms} />

      {/* Las secciones "Información para tu estadía", "Cómo llegar" y
          "Políticas de cancelación" viven ahora dentro del motor de
          reservas (/booking) como pestañas, para que el huésped las vea
          cuando está reservando, no como contenido pesado en el home. */}

      {/* Contact Section - Museum Gallery Style */}
      <section id="contact" className="py-20 lg:py-32 bg-[#FCFBF7]">
          <div className="container mx-auto px-6">
              <div className="flex flex-col lg:flex-row items-stretch gap-12 lg:gap-20">
                  {/* Left Side: Editorial Content */}
                  <div className="lg:w-1/2 flex flex-col justify-center">
                      <div className="mb-10 lg:mb-12">
                          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4 block">{lang === 'es' ? 'Hablemos de tu viaje' : "Let's talk about your trip"}</span>
                          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-dark tracking-tighter leading-[1.05] mb-6 lg:mb-8">
                              {t.contactTitle}
                          </h2>
                          <p className="text-lg lg:text-xl text-zinc-500 max-w-md leading-relaxed">
                              {(lang === 'es' ? initialContent.contactDesc_es : initialContent.contactDesc_en)
                                ?? (lang === 'es' ? 'Desde una consulta rápida hasta una reserva personalizada, estamos aquí para hacer tu escape realidad.' : 'From a quick inquiry to a personalized booking, we are here to make your escape a reality.')}
                          </p>
                      </div>

                      <div className="grid gap-6">
                           <a href={`https://wa.me/${initialContent.contactPhone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-5 sm:gap-6 p-5 sm:p-6 bg-white border border-zinc-100 rounded-[2rem] hover:shadow-xl hover:scale-[1.02] transition-all group">
                              <div className="w-14 h-14 shrink-0 bg-zinc-50 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                  <Phone className="w-6 h-6" />
                              </div>
                              <div>
                                  <span className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-0.5">{lang === 'es' ? 'WhatsApp / Teléfono' : 'WhatsApp / Phone'}</span>
                                  <span className="text-xl font-bold text-dark">{initialContent.contactPhone}</span>
                              </div>
                           </a>

                           <a href={`https://instagram.com/${initialContent.contactInsta.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-5 sm:gap-6 p-5 sm:p-6 bg-white border border-zinc-100 rounded-[2rem] hover:shadow-xl hover:scale-[1.02] transition-all group">
                              <div className="w-14 h-14 shrink-0 bg-zinc-50 rounded-2xl flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors">
                                  <Camera className="w-6 h-6" />
                              </div>
                              <div>
                                  <span className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-0.5">Instagram</span>
                                  <span className="text-xl font-bold text-dark">{initialContent.contactInsta}</span>
                              </div>
                           </a>

                           <div className="flex items-center gap-5 sm:gap-6 p-5 sm:p-6 bg-white border border-zinc-100 rounded-[2rem] group hover:shadow-lg transition-all">
                              <div className="w-14 h-14 shrink-0 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:text-accent group-hover:bg-accent/10 transition-all">
                                  <MapPin className="w-6 h-6" />
                              </div>
                              <div>
                                  <span className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-0.5">{lang === 'es' ? 'Ubicación' : 'Location'}</span>
                                  <span className="text-lg sm:text-xl font-bold text-dark">{initialContent.contactLocation}</span>
                              </div>
                           </div>
                      </div>
                  </div>

                  {/* Right Side: Portrait CTA Card */}
                  <div className="lg:w-1/2">
                      <div className="h-full min-h-[480px] lg:min-h-[600px] bg-dark rounded-[2.5rem] lg:rounded-[3rem] relative overflow-hidden group">
                          {/* Image Placeholder with Blur Effect */}
                          <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent z-10"></div>
                          <div className="absolute inset-0 z-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-[2s] opacity-60" style={{ backgroundImage: `url(${initialContent.contactBg})` }}></div>
                          
                          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-6 sm:p-12 text-center">
                              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] w-full max-w-sm hover:bg-white/20 transition-all">
                                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/70 mb-6 sm:mb-8 block">{lang === 'es' ? 'Escápate al paraíso' : 'Escape to Paradise'}</span>
                                  <h3 className="text-5xl lg:text-6xl font-black text-white tracking-tighter mb-8 sm:mb-10 leading-none">
                                      {lang === 'es' ? 'Reserva' : 'Book'} <br/> <span className="italic">{lang === 'es' ? 'hoy' : 'today'}</span>
                                  </h3>
                                  <Link href="/booking" className="inline-flex items-center gap-3 bg-primary text-white font-black px-8 py-4 rounded-full hover:bg-white hover:text-primary transition-all group/btn uppercase tracking-widest text-xs">
                                      {lang === 'es' ? 'Disponibilidad' : 'Availability'}
                                      <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                  </Link>
                              </div>
                          </div>

                          {/* Detail Info */}
                          <div className="absolute bottom-8 left-8 right-8 z-20 flex justify-between items-center text-white/40 text-[9px] font-black uppercase tracking-widest">
                              <span>©2026 CANDY ROSE</span>
                              <span>PANAMÁ</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      <SiteFooter content={initialContent} />
    </div>
  );
}

// ============================================================
// Secciones nuevas (editorial)
// ============================================================

interface RoomsSectionProps {
  lang: 'es' | 'en';
  t: { roomsSub: string; roomsTitle: string; viewAllRooms: string };
  initialContent: CMSContent;
  rooms: any[];
}

function RoomsSection({ lang, t, initialContent, rooms }: RoomsSectionProps) {
  // Si no hay override editorial, fallback al render genérico de la API.
  const editorial = initialContent.rooms;
  if (!editorial || editorial.length === 0) {
    return (
      <section id="rooms" className="py-20 lg:py-32 bg-zinc-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-dark mb-12">{t.roomsTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.slice(0, 6).map((room, i) => (
              <div key={i} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-zinc-100 flex flex-col">
                <div className="aspect-[4/5] bg-zinc-100">
                  {room.images?.[0] ? <img src={room.images[0]} className="w-full h-full object-cover" alt={room.name || room.type} /> : null}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-black mb-2">{room.name || room.type}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{room.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Merge editorial × API por código de tipo de habitación.
  // Usamos Record<string, any> en vez de Map para no chocar con el alias Map de @/lib/icons.
  const apiByCode: Record<string, any> = {};
  for (const r of rooms) {
    const key = normalizeCode(r.code ?? r.codigo ?? r.tipoCodigo);
    if (key) apiByCode[key] = r;
  }
  const sorted = [...editorial].sort((a, b) => a.order - b.order);
  const main = sorted.filter((r) => r.group === 'main');
  const villas = sorted.filter((r) => r.group === 'villa');

  // Las villas van en grid de 2 columnas: con proporción 4/5 cada tarjeta quedaba
  // casi del alto de la pantalla, así que usan una foto apaisada.
  const renderCard = (room: RoomEditorial) => {
    const apiRoom = apiByCode[normalizeCode(room.code)];
    const imageUrl = apiRoom?.images?.[0];
    const reservaHref = apiRoom?.id ? `/booking?roomId=${apiRoom.id}` : '/booking';
    const name = lang === 'es' ? room.name_es : room.name_en;
    const description = lang === 'es' ? room.description_es : room.description_en;
    return (
      <Link
        key={room.code}
        href={reservaHref}
        className="group bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-zinc-100 flex flex-col"
      >
        <div className={`${room.group === 'villa' ? 'aspect-[4/3]' : 'aspect-[4/5]'} relative overflow-hidden bg-zinc-100`}>
          {imageUrl ? (
            <img src={imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={name} />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Image className="w-10 h-10 text-zinc-300" />
            </div>
          )}
        </div>
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-lg font-black tracking-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">{name}</h3>
          <p className="text-zinc-500 font-medium text-sm leading-relaxed line-clamp-4">{description}</p>
        </div>
      </Link>
    );
  };

  const includes = lang === 'es' ? initialContent.roomIncludes_es : initialContent.roomIncludes_en;
  const includesTitle = lang === 'es' ? initialContent.roomIncludesTitle_es : initialContent.roomIncludesTitle_en;
  const villasLabel = lang === 'es' ? initialContent.villasGroupLabel_es : initialContent.villasGroupLabel_en;
  const includeIcons = [Coffee, Building2, Anchor, Utensils, Waves, Dumbbell];

  return (
    <section id="rooms" className="py-20 lg:py-32 bg-zinc-50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 lg:mb-16">
          <div className="max-w-2xl">
            <span className="text-secondary text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">{t.roomsSub}</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.05] text-dark">{t.roomsTitle}</h2>
          </div>
          <Link href="/booking" className="hidden lg:flex items-center gap-2 group text-sm font-black uppercase tracking-widest text-zinc-400 hover:text-dark transition-colors mt-8 lg:mt-0">
            {t.viewAllRooms} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {main.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {main.map(renderCard)}
          </div>
        )}

        {villas.length > 0 && (
          <>
            {villasLabel && (
              <div className="flex items-center gap-4 mb-8 mt-4">
                <div className="h-px flex-1 bg-zinc-200" />
                <span className="text-secondary text-[10px] font-black uppercase tracking-[0.4em] whitespace-nowrap">{villasLabel}</span>
                <div className="h-px flex-1 bg-zinc-200" />
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {villas.map(renderCard)}
            </div>
          </>
        )}

        {includes && includes.length > 0 && (
          <div className="mt-16 lg:mt-20 bg-white rounded-[32px] border border-zinc-100 p-6 sm:p-8 lg:p-12 shadow-sm">
            <h3 className="text-2xl lg:text-3xl font-black tracking-tight text-dark mb-8">{includesTitle}</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
              {includes.map((item, i) => {
                const IconCmp = includeIcons[i] ?? Coffee;
                return (
                  <li key={i} className="flex items-start gap-3 text-zinc-600 text-sm font-medium">
                    <span className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <IconCmp className="w-4 h-4" />
                    </span>
                    <span className="leading-snug pt-1.5">{item}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

// Las secciones StayInfoSection, HowToArriveSection y CancellationSection
// se eliminaron del landing en este commit — el contenido editorial ahora
// vive como pestañas dentro de /booking (StayInfoPanel, HowToArrivePanel,
// PoliciesPanel en src/app/booking/page.tsx). Fuente de verdad única:
// src/content/landing.ts.

interface SearchBarProps { lang: 'es' | 'en' }

function SearchBar({ lang }: SearchBarProps) {
  const router = useRouter();
  // Misma fecha "hoy" que usa /booking (hora de Panamá). Con UTC, después de
  // las 7 p. m. el buscador mostraba el día siguiente y bloqueaba el día actual.
  const today = hoyPanama();
  const tomorrow = sumarDias(today, 1);
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [guests, setGuests] = useState(2);
  const [error, setError] = useState('');

  // Keep checkOut at least 1 day after checkIn — important for the
  // backend availability query which rejects equal-day ranges.
  useEffect(() => {
    if (checkOut <= checkIn) {
      setCheckOut(sumarDias(checkIn, 1));
    }
  }, [checkIn, checkOut]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!checkIn || !checkOut) {
      setError(lang === 'es' ? 'Selecciona ambas fechas' : 'Pick both dates');
      return;
    }
    if (checkOut <= checkIn) {
      setError(lang === 'es' ? 'La salida debe ser después de la entrada' : 'Check-out must be after check-in');
      return;
    }
    const qs = new URLSearchParams({ checkIn, checkOut, guests: String(guests) }).toString();
    router.push(`/booking?${qs}`);
  };

  return (
    <div className="container mx-auto px-6 mt-4 lg:mt-10 relative z-20">
      <form
        onSubmit={submit}
        className="bg-white/85 backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[40px] p-4 lg:p-5 border border-white/60 flex flex-col lg:flex-row items-stretch gap-3 lg:gap-2 hover:shadow-2xl transition-all duration-500"
      >
        <label className="flex-1 flex flex-col justify-center px-5 py-3 rounded-3xl hover:bg-white/70 transition-colors group border-b lg:border-b-0 lg:border-r border-zinc-100 cursor-pointer">
          <span className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] mb-2 group-hover:text-primary group-focus-within:text-primary transition-colors">
            {lang === 'es' ? 'Entrada' : 'Check-in'}
          </span>
          <div className="flex items-center gap-3 text-dark">
            <Calendar className="w-5 h-5 text-primary shrink-0" />
            <input
              type="date"
              value={checkIn}
              min={today}
              onChange={(e) => setCheckIn(e.target.value)}
              className="bg-transparent outline-none font-bold text-base text-dark w-full"
              aria-label={lang === 'es' ? 'Fecha de entrada' : 'Check-in date'}
            />
          </div>
        </label>

        <label className="flex-1 flex flex-col justify-center px-5 py-3 rounded-3xl hover:bg-white/70 transition-colors group border-b lg:border-b-0 lg:border-r border-zinc-100 cursor-pointer">
          <span className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] mb-2 group-hover:text-primary group-focus-within:text-primary transition-colors">
            {lang === 'es' ? 'Salida' : 'Check-out'}
          </span>
          <div className="flex items-center gap-3 text-dark">
            <Calendar className="w-5 h-5 text-primary shrink-0" />
            <input
              type="date"
              value={checkOut}
              min={checkIn}
              onChange={(e) => setCheckOut(e.target.value)}
              className="bg-transparent outline-none font-bold text-base text-dark w-full"
              aria-label={lang === 'es' ? 'Fecha de salida' : 'Check-out date'}
            />
          </div>
        </label>

        <label className="flex-1 flex flex-col justify-center px-5 py-3 rounded-3xl hover:bg-white/70 transition-colors group cursor-pointer">
          <span className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] mb-2 group-hover:text-primary group-focus-within:text-primary transition-colors">
            {lang === 'es' ? 'Huéspedes' : 'Guests'}
          </span>
          <div className="flex items-center gap-3 text-dark">
            <Users className="w-5 h-5 text-primary shrink-0" />
            <select
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value, 10))}
              className="bg-transparent outline-none font-bold text-base text-dark w-full appearance-none cursor-pointer"
              aria-label={lang === 'es' ? 'Número de huéspedes' : 'Guest count'}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>
                  {n} {lang === 'es' ? (n === 1 ? 'Adulto' : 'Adultos') : (n === 1 ? 'Adult' : 'Adults')}
                </option>
              ))}
            </select>
          </div>
        </label>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-dark hover:bg-primary text-white px-8 py-4 rounded-[28px] font-black uppercase tracking-[0.2em] text-[11px] shadow-lg transition-all active:scale-95 lg:min-w-[220px]"
        >
          {lang === 'es' ? 'Ver Disponibilidad' : 'Check Availability'}
          <ChevronRight className="w-4 h-4" />
        </button>
      </form>
      {error && (
        <p className="mt-3 text-center text-xs font-bold text-rose-600">{error}</p>
      )}
    </div>
  );
}
