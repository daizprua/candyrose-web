/**
 * Contenido editable del landing y motor de reservas.
 *
 * Para editar textos, imágenes, datos de contacto: tocá este archivo,
 * commiteá y Dokploy redespliega automáticamente.
 *
 * Imágenes:
 * - Si están en /public, referencias como "/nombre.jpg"
 * - Si están en MinIO, referencias como
 *   "https://s3.hotelcandyrose.contabili.app/candyrose-web/nombre.jpg"
 */

export interface LandingContent {
  // SEO
  seoTitle_es: string;
  seoTitle_en: string;
  seoTitle_pt: string;
  seoDesc_es: string;
  seoDesc_en: string;
  seoDesc_pt: string;

  // Hero
  heroTitle_es: string;
  heroTitle_en: string;
  heroTitle_pt: string;
  heroSub_es: string;
  heroSub_en: string;
  heroSub_pt: string;
  heroBg: string;

  // About
  aboutTitle_es: string;
  aboutTitle_en: string;
  aboutTitle_pt: string;
  aboutSub_es: string;
  aboutSub_en: string;
  aboutSub_pt: string;
  about_es: string;
  about_en: string;
  about_pt: string;
  aboutImg: string;

  // Rooms section
  roomsTitle_es: string;
  roomsTitle_en: string;
  roomsTitle_pt: string;
  roomsSub_es: string;
  roomsSub_en: string;
  roomsSub_pt: string;

  // Contact
  contactTitle_es: string;
  contactTitle_en: string;
  contactTitle_pt: string;
  contactPhone: string;
  contactInsta: string;
  contactEmail: string;
  contactLocation: string;
  contactBg: string;

  // Gallery
  gallery: string[];
  logo: string;

  // Booking
  bookingHero: string;
}

export const LANDING_CONTENT: LandingContent = {
  seoTitle_es: "Hotel Candy Rose | Boutique Beach Hotel Panamá",
  seoTitle_en: "Hotel Candy Rose | Boutique Beach Hotel Panama",
  seoTitle_pt: "Hotel Candy Rose | Hotel Boutique de Praia Panamá",

  seoDesc_es: "Refugio boutique exclusivo en Isla Grande, Panamá. Experimenta el lujo donde la historia se encuentra con el paraíso.",
  seoDesc_en: "Exclusive beach retreat in Isla Grande, Panama. Experience boutique luxury where history meets paradise.",
  seoDesc_pt: "Refúgio boutique exclusivo em Isla Grande, Panamá. Experimente o luxo onde a história encontra o paraíso.",

  heroTitle_es: "Tu refugio tropical en el paraíso",
  heroTitle_en: "Your tropical escape in paradise",
  heroTitle_pt: "Seu refúgio tropical no paraíso",

  heroSub_es: "Bienvenidos a Hotel Candy Rose, donde el lujo boutique se encuentra con la calidez del Caribe.",
  heroSub_en: "Welcome to Hotel Candy Rose, where boutique luxury meets Caribbean warmth.",
  heroSub_pt: "Bem-vindos ao Hotel Candy Rose, onde o luxo boutique encontra a brisa do Caribe.",

  heroBg: "https://images.unsplash.com/photo-1544124499-58912cbddaad?q=80&w=1600&auto=format&fit=crop",

  aboutTitle_es: "Tu pedazo de paraíso.",
  aboutTitle_en: "Your piece of paradise.",
  aboutTitle_pt: "Seu pedaço de paraíso.",

  aboutSub_es: "NUESTRA ESENCIA",
  aboutSub_en: "OUR ESSENCE",
  aboutSub_pt: "NOSSA ESSÊNCIA",

  about_es: "En Hotel Candy Rose creamos experiencias únicas. Cada rincón está pensado para que vivas la calidez del Caribe panameño en un ambiente íntimo y exclusivo. Donde el mar abraza la historia, la naturaleza te recibe y la hospitalidad se siente en casa.",
  about_en: "At Hotel Candy Rose we create unique experiences. Every corner is designed for you to feel the warmth of the Panamanian Caribbean in an intimate and exclusive atmosphere. Where the sea embraces history, nature welcomes you, and hospitality feels like home.",
  about_pt: "No Hotel Candy Rose criamos experiências únicas. Cada canto é pensado para que você viva a brisa do Caribe panamenho em um ambiente íntimo e exclusivo. Onde o mar abraça a história, a natureza te recebe e a hospitalidade se sente como em casa.",

  aboutImg: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop",

  roomsTitle_es: "Nuestras Habitaciones",
  roomsTitle_en: "Our Rooms",
  roomsTitle_pt: "Nossos Quartos",

  roomsSub_es: "VIVE EL CARIBE",
  roomsSub_en: "LIVE THE CARIBBEAN",
  roomsSub_pt: "VIVA O CARIBE",

  contactTitle_es: "¿Listo para tu escape tropical?",
  contactTitle_en: "Ready for your tropical escape?",
  contactTitle_pt: "Pronto para sua fuga tropical?",

  contactPhone: "+507 6389-4132",
  contactInsta: "@hotelcandyrose",
  contactEmail: "hotelcandyrose@gmail.com",
  contactLocation: "Isla Grande, Colón",

  contactBg: "https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&q=80&w=1000",

  gallery: [
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1200&auto=format&fit=crop",
  ],

  logo: "/logo.jpg",

  bookingHero: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1600&auto=format&fit=crop",
};
