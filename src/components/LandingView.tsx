'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar, MapPin, Star, Utensils, Waves,
  Wine, Users, ChevronRight, Globe, Menu, X,
  Wifi, Coffee, Wind, Phone, Camera, Instagram, Map, Image,
  Clock, LogIn, LogOut, CreditCard, Ship, Dumbbell,
  ShieldCheck, PawPrint, XCircle, Anchor, Building2
} from '@/lib/icons';

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

const isoDate = (d: Date) => d.toISOString().split('T')[0];

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
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      bookNow: "Reservar Ahora",
      checkIn: "Entrada",
      checkOut: "Salida",
      rooms: "Habitaciones",
      services: "Experiencias",
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
      services: "Experiences",
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
      {/* Navigation — sticky pill aligned to the right edge.
          Single compact group: menu links + language toggle + CTA, all
          inside one floating white pill that stays visible while scrolling.
          Once the user scrolls past the hero we deepen the shadow so the
          pill keeps standing out over content sections. */}
      <nav className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-5 flex justify-end transition-all duration-300 ${
        scrolled ? 'py-3' : 'py-5'
      }`}>
        <div className={`bg-white/85 backdrop-blur-xl rounded-full border border-white/60 pl-6 pr-2 py-2 flex items-center gap-6 transition-shadow duration-300 ${
          scrolled ? 'shadow-2xl shadow-dark/15' : 'shadow-xl shadow-dark/5'
        }`}>
          <div className="hidden lg:flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.18em] text-dark">
            <Link href="#rooms" className="hover:text-primary transition-colors">{t.rooms}</Link>
            <Link href="#services" className="hover:text-primary transition-colors">{t.services}</Link>
            <Link href="#about" className="hover:text-primary transition-colors">{t.aboutUs}</Link>
            <Link href="#contact" className="hover:text-primary transition-colors">{t.contact}</Link>
          </div>

          <button
            onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            className="hidden md:flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200 px-3 py-1.5 rounded-full border border-zinc-200 transition-all text-[11px] font-black tracking-widest"
            aria-label="Cambiar idioma"
          >
            <Globe className="w-3.5 h-3.5" /> {lang.toUpperCase()}
          </button>

          <Link
            href="/booking"
            className="bg-primary text-white px-5 md:px-6 py-2.5 rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 text-[11px] font-black tracking-widest uppercase whitespace-nowrap"
          >
            {t.bookNow}
          </Link>

          <button className="lg:hidden p-2 text-dark" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menú">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Abstract Beach Vibes Background */}
        <div className="absolute inset-0 z-0">
           {initialContent.heroBg ? (
             <div className="absolute inset-0">
               <img src={initialContent.heroBg} className="w-full h-full object-cover opacity-20" alt="Background" />
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

        <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-20 items-center">
           <div className="flex flex-col items-start text-left">
              {/* Hero brand block. The image goes through the backend storage
                  proxy, so we never depend on a stale presigned MinIO URL.
                  The logo carries its own wordmark, so we don't repeat the
                  hotel name beside it. */}
              <div className="mb-8 animate-in zoom-in duration-700">
                <div
                  className="bg-white rounded-3xl shadow-2xl shadow-dark/10 border border-white/60 flex items-center justify-center overflow-hidden p-4"
                  style={{ width: 250, height: 250 }}
                >
                  {initialContent.logo ? (
                    <img
                      src={initialContent.logo}
                      width={250}
                      height={250}
                      alt="Hotel Candy Rose"
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="text-7xl">🏨</span>
                  )}
                </div>
              </div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-[10px] font-black px-4 py-2 rounded-full mb-8 tracking-[0.3em] uppercase animate-in slide-in-from-left duration-700">
                  <MapPin className="w-3 h-3 fill-current" /> {initialContent.contactLocation}
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-dark mb-8 leading-[0.9] max-w-2xl animate-in slide-in-from-left duration-1000 delay-200">
                 {t.heroTitle}
              </h1>
              <p className="text-lg text-zinc-500 max-w-lg mb-12 font-medium leading-relaxed animate-in slide-in-from-left duration-1000 delay-500">
                 {t.heroSub}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-700">
                  <Link href="/booking" className="bg-primary hover:bg-orange-600 text-white font-black px-10 py-5 rounded-2xl shadow-2xl shadow-primary/30 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3 group">
                     {t.bookNow} <ChevronRight className="w-4 h-4 group-hover:translate-x-1" />
                  </Link>
                  <Link href="#rooms" className="bg-white border border-zinc-100 hover:border-primary text-dark font-black px-10 py-5 rounded-2xl shadow-sm transition-all uppercase tracking-widest text-xs flex items-center justify-center">
                     {t.rooms}
                  </Link>
              </div>
           </div>

           <div className="hidden lg:block relative animate-in zoom-in duration-1000 delay-300">
              <div className={`relative z-10 w-full aspect-[4/5] bg-zinc-200 rounded-[60px] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-all duration-700 border-8 border-white ${scrolled ? 'opacity-90' : 'opacity-100'}`}>
                 <img src={initialContent.heroBg || 'https://images.unsplash.com/photo-1544124499-58912cbddaad?q=80&w=1000&auto=format&fit=crop'} alt="Hotel" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-10 -left-10 z-20 w-1/2 aspect-square bg-white p-4 rounded-[40px] shadow-2xl -rotate-6">
                 <div className="w-full h-full bg-zinc-100 rounded-[30px] overflow-hidden">
                    <img src={initialContent.aboutImg || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000&auto=format&fit=crop'} alt="Details" className="w-full h-full object-cover" />
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
      <section id="about" className="py-32 bg-white">
          <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-24 items-center">
              <div className="relative">
                  <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-6 pt-12">
                          <div className="aspect-[3/4] bg-zinc-100 rounded-[40px] overflow-hidden shadow-xl">
                             <img src={initialContent.gallery[0] || 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000&auto=format&fit=crop'} className="w-full h-full object-cover" />
                          </div>
                          <div className="aspect-square rounded-[40px] overflow-hidden shadow-xl transform -rotate-3 transition-transform hover:rotate-0">
                             {initialContent.gallery[2] ? (
                               <img src={initialContent.gallery[2]} className="w-full h-full object-cover" />
                             ) : (
                               <div className="w-full h-full bg-secondary/20 flex items-center justify-center p-10">
                                 <span className="text-4xl">🏝️</span>
                               </div>
                             )}
                          </div>
                      </div>
                      <div className="space-y-6">
                          <div className="aspect-square rounded-[40px] overflow-hidden shadow-xl transform rotate-3 transition-transform hover:rotate-0">
                             {initialContent.gallery[1] ? (
                               <img src={initialContent.gallery[1]} className="w-full h-full object-cover" />
                             ) : (
                               <div className="w-full h-full bg-primary/20 flex items-center justify-center p-10">
                                 <span className="text-4xl font-black text-primary italic">Est. 1972</span>
                               </div>
                             )}
                          </div>
                          <div className="aspect-[3/4] bg-zinc-100 rounded-[40px] overflow-hidden shadow-xl">
                             <img src={initialContent.gallery[3] || 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1000&auto=format&fit=crop'} className="w-full h-full object-cover" />
                          </div>
                      </div>
                  </div>
              </div>

              <div>
                  <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">{t.aboutSub}</span>
                  <h2 className="text-5xl font-black tracking-tight leading-[1.1] mb-10 text-dark">
                      {t.aboutTitle}
                  </h2>
                  <p className="text-lg text-zinc-500 font-medium leading-relaxed mb-8 whitespace-pre-line">
                      {t.about || "Nuestra historia comenzó en 1972..."}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-8 pt-8 border-t border-zinc-100">
                      <div>
                          <span className="block text-4xl font-black text-dark tracking-tighter mb-2">50+</span>
                          <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Años de Tradición</span>
                      </div>
                      <div>
                          <span className="block text-4xl font-black text-dark tracking-tighter mb-2">100%</span>
                          <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Compromiso Familiar</span>
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

      {/* Información para tu estadía */}
      {(initialContent.stayInfo?.length ?? 0) > 0 && (
        <StayInfoSection lang={lang} initialContent={initialContent} />
      )}

      {/* Cómo llegar */}
      {(lang === 'es' ? initialContent.howToArrive_es : initialContent.howToArrive_en) && (
        <HowToArriveSection lang={lang} initialContent={initialContent} />
      )}

      {/* Políticas de cancelación */}
      {((lang === 'es' ? initialContent.cancellation_es : initialContent.cancellation_en)?.length ?? 0) > 0 && (
        <CancellationSection lang={lang} initialContent={initialContent} />
      )}

      {/* Contact Section - Museum Gallery Style */}
      <section id="contact" className="py-40 bg-[#FCFBF7]">
          <div className="container mx-auto px-6">
              <div className="flex flex-col lg:flex-row items-stretch gap-20">
                  {/* Left Side: Editorial Content */}
                  <div className="lg:w-1/2 flex flex-col justify-center">
                      <div className="mb-12">
                          <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-primary mb-4 block">{lang === 'es' ? 'Hablemos de tu viaje' : "Let's talk about your trip"}</span>
                          <h2 className="text-6xl lg:text-7xl font-black text-dark tracking-tighter leading-[0.85] mb-8">
                              {t.contactTitle}
                          </h2>
                          <p className="text-xl text-zinc-500 max-w-sm leading-relaxed">
                              {(lang === 'es' ? initialContent.contactDesc_es : initialContent.contactDesc_en)
                                ?? (lang === 'es' ? 'Desde una consulta rápida hasta una reserva personalizada, estamos aquí para hacer tu escape realidad.' : 'From a quick inquiry to a personalized booking, we are here to make your escape a reality.')}
                          </p>
                      </div>

                      <div className="grid gap-6">
                           <a href={`https://wa.me/${initialContent.contactPhone.replace(/\D/g, '')}`} target="_blank" className="flex items-center gap-6 p-6 bg-white border border-zinc-100 rounded-[2rem] hover:shadow-xl hover:scale-[1.02] transition-all group">
                              <div className="w-14 h-14 bg-zinc-50 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                  <Phone className="w-6 h-6" />
                              </div>
                              <div>
                                  <span className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-0.5">WhatsApp / Phone</span>
                                  <span className="text-xl font-bold text-dark">{initialContent.contactPhone}</span>
                              </div>
                           </a>

                           <a href={`https://instagram.com/${initialContent.contactInsta.replace('@', '')}`} target="_blank" className="flex items-center gap-6 p-6 bg-white border border-zinc-100 rounded-[2rem] hover:shadow-xl hover:scale-[1.02] transition-all group">
                              <div className="w-14 h-14 bg-zinc-50 rounded-2xl flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors">
                                  <Camera className="w-6 h-6" />
                              </div>
                              <div>
                                  <span className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-0.5">Instagram</span>
                                  <span className="text-xl font-bold text-dark">{initialContent.contactInsta}</span>
                              </div>
                           </a>

                           <div className="flex items-center gap-6 p-6 bg-white border border-zinc-100 rounded-[2rem] group hover:shadow-lg transition-all">
                              <div className="w-14 h-14 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:text-accent group-hover:bg-accent/10 transition-all">
                                  <MapPin className="w-6 h-6" />
                              </div>
                              <div>
                                  <span className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-0.5">{lang === 'es' ? 'Ubicación' : 'Location'}</span>
                                  <span className="text-xl font-bold text-dark">{initialContent.contactLocation}</span>
                              </div>
                           </div>
                      </div>
                  </div>

                  {/* Right Side: Portrait CTA Card */}
                  <div className="lg:w-1/2">
                      <div className="h-full min-h-[600px] bg-dark rounded-[3rem] relative overflow-hidden group">
                          {/* Image Placeholder with Blur Effect */}
                          <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent z-10"></div>
                          <div className="absolute inset-0 z-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-[2s] opacity-60" style={{ backgroundImage: `url(${initialContent.contactBg})` }}></div>
                          
                          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-12 text-center">
                              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-[2.5rem] w-full max-w-sm hover:bg-white/20 transition-all">
                                  <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/60 mb-8 block font-black">Escape to Paradise</span>
                                  <h3 className="text-5xl lg:text-7xl font-black text-white tracking-tighter mb-10 leading-none">
                                      Reserva <br/> <span className="italic">Hoy</span>
                                  </h3>
                                  <Link href="/booking" className="inline-flex items-center gap-4 bg-primary text-white font-black px-10 py-5 rounded-full hover:bg-white hover:text-primary transition-all group/btn">
                                      DISPONIBILIDAD
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

      {/* Footer */}
      <footer className="relative bg-dark text-white pt-24 pb-10 px-6 mt-32 overflow-hidden">
          {/* Soft brand glows so the dark surface doesn't feel flat */}
          <div className="absolute -top-32 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-32 -right-20 w-96 h-96 bg-secondary/15 rounded-full blur-[120px] pointer-events-none" />

          <div className="container mx-auto relative">
              {/* Main footer grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
                  {/* Brand */}
                  <div className="lg:col-span-4 space-y-5">
                      <div
                          className="bg-white rounded-3xl shadow-xl shadow-black/30 flex items-center justify-center overflow-hidden p-3"
                          style={{ width: 120, height: 120 }}
                      >
                          {initialContent.logo ? (
                              <img
                                  src={initialContent.logo}
                                  width={120}
                                  height={120}
                                  alt="Hotel Candy Rose"
                                  className="max-w-full max-h-full object-contain"
                                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                              />
                          ) : (
                              <span className="text-4xl">🏨</span>
                          )}
                      </div>
                      <p className="text-white/60 font-medium leading-relaxed text-sm max-w-xs">
                          {lang === 'es'
                              ? 'Un santuario boutique diseñado para crear recuerdos que duren toda una vida. Belleza, paz y hospitalidad caribeña.'
                              : 'A boutique sanctuary built to create memories that last a lifetime. Beauty, peace and Caribbean hospitality.'}
                      </p>
                  </div>

                  {/* Explorar */}
                  <div className="lg:col-span-2 space-y-5">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary block">
                          {lang === 'es' ? 'Explorar' : 'Explore'}
                      </span>
                      <ul className="space-y-3 text-sm font-bold text-white/70">
                          <li><Link href="#rooms" className="hover:text-white transition-colors">{t.rooms}</Link></li>
                          <li><Link href="#services" className="hover:text-white transition-colors">{t.services}</Link></li>
                          <li><Link href="#about" className="hover:text-white transition-colors">{t.aboutUs}</Link></li>
                          <li><Link href="#contact" className="hover:text-white transition-colors">{t.contact}</Link></li>
                          <li><Link href="/booking" className="text-primary hover:text-white transition-colors">{t.bookNow}</Link></li>
                      </ul>
                  </div>

                  {/* Contacto */}
                  <div className="lg:col-span-3 space-y-5">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary block">
                          {lang === 'es' ? 'Contacto' : 'Contact'}
                      </span>
                      <ul className="space-y-3 text-sm font-medium text-white/70">
                          {initialContent.contactPhone && (
                              <li className="flex items-start gap-2">
                                  <Phone className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                                  <a href={`tel:${initialContent.contactPhone}`} className="hover:text-white transition-colors">{initialContent.contactPhone}</a>
                              </li>
                          )}
                          {initialContent.contactEmail && (
                              <li className="flex items-start gap-2">
                                  <Globe className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                                  <a href={`mailto:${initialContent.contactEmail}`} className="hover:text-white transition-colors break-all">{initialContent.contactEmail}</a>
                              </li>
                          )}
                          {initialContent.contactLocation && (
                              <li className="flex items-start gap-2">
                                  <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                                  <span>{initialContent.contactLocation}</span>
                              </li>
                          )}
                          {initialContent.contactInsta && (
                              <li className="flex items-start gap-2">
                                  <Instagram className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                                  <a href={`https://instagram.com/${initialContent.contactInsta.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">@{initialContent.contactInsta.replace('@', '')}</a>
                              </li>
                          )}
                      </ul>
                  </div>

                  {/* Legales */}
                  <div className="lg:col-span-3 space-y-5">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary block">
                          {lang === 'es' ? 'Legales' : 'Legal'}
                      </span>
                      <ul className="space-y-3 text-sm font-bold text-white/70">
                          <li className="hover:text-white transition-colors cursor-pointer">{lang === 'es' ? 'Política de privacidad' : 'Privacy policy'}</li>
                          <li className="hover:text-white transition-colors cursor-pointer">{lang === 'es' ? 'Términos y condiciones' : 'Terms & conditions'}</li>
                          <li className="hover:text-white transition-colors cursor-pointer">{lang === 'es' ? 'Política de cookies' : 'Cookie policy'}</li>
                          <li className="hover:text-white transition-colors cursor-pointer">{lang === 'es' ? 'Política de cancelación' : 'Cancellation policy'}</li>
                      </ul>
                  </div>
              </div>

              {/* Bottom bar */}
              <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em]">
                  <p className="text-white/50 flex items-center gap-2 flex-wrap justify-center">
                      <span>© 2026 Hotel Candy Rose</span>
                      <span className="opacity-50">·</span>
                      <span>{lang === 'es' ? 'Desde 1972' : 'Since 1972'}</span>
                  </p>
                  <p className="text-white/40">
                      Crafted by <a href="https://devstack.agency" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-colors">Darinel Aizp · devstack.agency</a>
                  </p>
              </div>
          </div>
      </footer>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-white p-10 flex flex-col justify-between animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center">
                {initialContent.logo ? (
                  <img src={initialContent.logo} alt="Hotel Candy Rose" className="h-14 w-14 object-contain" />
                ) : (
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg">
                    <span className="text-xl">🌺</span>
                  </div>
                )}
                <button onClick={() => setIsMenuOpen(false)}><X className="w-8 h-8" /></button>
            </div>
            <ul className="space-y-8 text-4xl font-black tracking-tighter">
                <li><Link href="#rooms" onClick={() => setIsMenuOpen(false)}>{t.rooms}</Link></li>
                <li><Link href="#services" onClick={() => setIsMenuOpen(false)}>{t.services}</Link></li>
                <li><Link href="#about" onClick={() => setIsMenuOpen(false)}>{t.aboutUs}</Link></li>
                <li><Link href="/booking" className="text-primary">{t.bookNow}</Link></li>
            </ul>
            <div className="flex justify-between items-center pt-8 border-t border-zinc-100">
                <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')} className="font-black uppercase tracking-widest text-xs flex items-center gap-2">
                    <Globe className="w-4 h-4" /> {lang === 'es' ? 'English' : 'Español'}
                </button>
                <div className="flex gap-4">
                    <Camera className="w-5 h-5" />
                </div>
            </div>
        </div>
      )}
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
      <section id="rooms" className="py-32 bg-zinc-50">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-black tracking-tight text-dark mb-12">{t.roomsTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.slice(0, 6).map((room, i) => (
              <div key={i} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-zinc-100 flex flex-col">
                <div className="aspect-[4/5] bg-zinc-100">
                  {room.images?.[0] ? <img src={room.images[0]} className="w-full h-full object-cover" /> : null}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-black mb-2">{room.name || room.type}</h3>
                  <p className="text-zinc-500 text-[11px]">{room.description}</p>
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
        <div className="aspect-[4/5] relative overflow-hidden bg-zinc-100">
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
          <p className="text-zinc-500 font-medium text-[11px] leading-relaxed line-clamp-4">{description}</p>
        </div>
      </Link>
    );
  };

  const includes = lang === 'es' ? initialContent.roomIncludes_es : initialContent.roomIncludes_en;
  const includesTitle = lang === 'es' ? initialContent.roomIncludesTitle_es : initialContent.roomIncludesTitle_en;
  const villasLabel = lang === 'es' ? initialContent.villasGroupLabel_es : initialContent.villasGroupLabel_en;
  const includeIcons = [Coffee, Building2, Anchor, Utensils, Waves, Dumbbell];

  return (
    <section id="rooms" className="py-32 bg-zinc-50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-20">
          <div className="max-w-2xl">
            <span className="text-secondary text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">{t.roomsSub}</span>
            <h2 className="text-5xl md:text-6xl font-black tracking-tight leading-none text-dark">{t.roomsTitle}</h2>
          </div>
          <Link href="/booking" className="hidden lg:flex items-center gap-2 group text-sm font-black uppercase tracking-widest text-zinc-400 hover:text-dark transition-colors mt-8 lg:mt-0">
            {t.viewAllRooms} <ChevronRight className="w-4 h-4 group-hover:translate-x-1" />
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
          <div className="mt-20 bg-white rounded-[32px] border border-zinc-100 p-8 lg:p-12 shadow-sm">
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

function StayInfoSection({ lang, initialContent }: { lang: 'es' | 'en'; initialContent: CMSContent }) {
  const items = initialContent.stayInfo ?? [];
  const title = lang === 'es' ? initialContent.stayInfoTitle_es : initialContent.stayInfoTitle_en;
  return (
    <section id="estadia" className="py-32 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mb-16">
          <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">
            {lang === 'es' ? 'Antes de reservar' : 'Before booking'}
          </span>
          <h2 className="text-5xl md:text-6xl font-black tracking-tight leading-none text-dark">{title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {items.map((item, i) => {
            const IconCmp = STAY_ICONS[item.icon] ?? Clock;
            const label = lang === 'es' ? item.label_es : item.label_en;
            const value = lang === 'es' ? item.value_es : item.value_en;
            const cardCls = item.highlight
              ? 'bg-primary/5 border-primary/30 md:col-span-2'
              : 'bg-white border-zinc-100';
            return (
              <div
                key={i}
                className={`flex items-start gap-5 p-6 lg:p-7 rounded-[2rem] border ${cardCls} shadow-sm`}
              >
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
      </div>
    </section>
  );
}

function HowToArriveSection({ lang, initialContent }: { lang: 'es' | 'en'; initialContent: CMSContent }) {
  const title = lang === 'es' ? initialContent.howToArriveTitle_es : initialContent.howToArriveTitle_en;
  const body = lang === 'es' ? initialContent.howToArrive_es : initialContent.howToArrive_en;
  if (!body) return null;
  return (
    <section id="como-llegar" className="py-32 bg-zinc-50">
      <div className="container mx-auto px-6 grid lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-4">
          <div className="aspect-square bg-gradient-to-br from-secondary/20 via-primary/10 to-accent/10 rounded-[3rem] flex items-center justify-center shadow-sm">
            <Ship className="w-24 h-24 text-primary" />
          </div>
        </div>
        <div className="lg:col-span-8">
          <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">
            {lang === 'es' ? 'Acceso al hotel' : 'Getting here'}
          </span>
          <h2 className="text-5xl md:text-6xl font-black tracking-tight leading-none text-dark mb-10">{title}</h2>
          <div className="space-y-5 text-lg text-zinc-600 font-medium leading-relaxed whitespace-pre-line">{body}</div>
        </div>
      </div>
    </section>
  );
}

function CancellationSection({ lang, initialContent }: { lang: 'es' | 'en'; initialContent: CMSContent }) {
  const title = lang === 'es' ? initialContent.cancellationTitle_es : initialContent.cancellationTitle_en;
  const items = lang === 'es' ? initialContent.cancellation_es : initialContent.cancellation_en;
  if (!items || items.length === 0) return null;
  return (
    <section id="politicas" className="py-32 bg-white">
      <div className="container mx-auto px-6 max-w-4xl">
        <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">
          {lang === 'es' ? 'Términos' : 'Terms'}
        </span>
        <h2 className="text-5xl md:text-6xl font-black tracking-tight leading-none text-dark mb-12">{title}</h2>
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
      </div>
    </section>
  );
}

interface SearchBarProps { lang: 'es' | 'en' }

function SearchBar({ lang }: SearchBarProps) {
  const router = useRouter();
  const today = isoDate(new Date());
  const tomorrow = isoDate(new Date(Date.now() + 86400000));
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [guests, setGuests] = useState(2);
  const [error, setError] = useState('');

  // Keep checkOut at least 1 day after checkIn — important for the
  // backend availability query which rejects equal-day ranges.
  useEffect(() => {
    if (checkOut <= checkIn) {
      const next = new Date(checkIn);
      next.setDate(next.getDate() + 1);
      setCheckOut(isoDate(next));
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
    <div className="container mx-auto px-6 mt-16 lg:mt-24 relative z-20">
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
          className="flex items-center justify-center gap-2 bg-dark hover:bg-primary text-white px-8 py-5 lg:py-4 rounded-[28px] font-black uppercase tracking-[0.2em] text-[11px] shadow-lg transition-all active:scale-95 lg:min-w-[220px]"
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
