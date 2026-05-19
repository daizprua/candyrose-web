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

export interface RoomEditorial {
  /** Código del tipo de habitación en el backend Contabili (SNL, STD, DLX, OAS, HRZ). */
  code: string;
  name_es: string;
  name_en: string;
  description_es: string;
  description_en: string;
  /** Orden en el grid. Menor primero. */
  order: number;
  /** main = edificio principal, villa = área de piscina (se renderizan en grids separados). */
  group: "main" | "villa";
}

export interface StayInfoItem {
  /** Nombre de ícono lucide-react. */
  icon: string;
  label_es: string;
  label_en: string;
  value_es: string;
  value_en: string;
  /** Si true, se destaca con fondo de acento (ej: garantía de tarjeta). */
  highlight?: boolean;
}

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

  /** Override editorial de habitaciones — fuente de verdad para nombres y descripciones. */
  rooms: RoomEditorial[];
  /** Subtítulo que separa las villas del edificio principal en el grid. */
  villasGroupLabel_es: string;
  villasGroupLabel_en: string;
  /** Bloque "Todas las habitaciones incluyen". */
  roomIncludesTitle_es: string;
  roomIncludesTitle_en: string;
  roomIncludes_es: string[];
  roomIncludes_en: string[];

  // Stay info (antes de reservar)
  stayInfoTitle_es: string;
  stayInfoTitle_en: string;
  stayInfo: StayInfoItem[];

  // How to arrive
  howToArriveTitle_es: string;
  howToArriveTitle_en: string;
  howToArrive_es: string;
  howToArrive_en: string;

  // Cancellation
  cancellationTitle_es: string;
  cancellationTitle_en: string;
  cancellation_es: string[];
  cancellation_en: string[];

  // Contact
  contactTitle_es: string;
  contactTitle_en: string;
  contactTitle_pt: string;
  contactDesc_es: string;
  contactDesc_en: string;
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
  seoTitle_es: "Hotel Candy Rose | Isla Grande, Colón, Panamá",
  seoTitle_en: "Hotel Candy Rose | Isla Grande, Colón, Panama",
  seoTitle_pt: "Hotel Candy Rose | Hotel Boutique de Praia Panamá",

  seoDesc_es: "Hotel frente al mar en Isla Grande, Colón, Panamá. Habitaciones cómodas, restaurante con terraza sobre el mar y experiencias únicas frente al Caribe panameño.",
  seoDesc_en: "Oceanfront hotel in Isla Grande, Colón, Panama. Comfortable rooms, restaurant with terrace over the sea, and unique experiences on the Panamanian Caribbean.",
  seoDesc_pt: "Refúgio boutique exclusivo em Isla Grande, Panamá. Experimente o luxo onde a história encontra o paraíso.",

  heroTitle_es: "Ven por el mar, quédate por todo lo demás.",
  heroTitle_en: "Come for the sea, stay for everything else.",
  heroTitle_pt: "Seu refúgio tropical no paraíso",

  heroSub_es: "Bienvenidos al Hotel Candy Rose. Habitaciones cómodas, cocina deliciosa y espacios frente al mar para disfrutar a tu ritmo.",
  heroSub_en: "Welcome to Hotel Candy Rose. Comfortable rooms, delicious food and oceanfront spaces to enjoy at your own pace.",
  heroSub_pt: "Bem-vindos ao Hotel Candy Rose, onde o luxo boutique encontra a brisa do Caribe.",

  heroBg: "https://images.unsplash.com/photo-1544124499-58912cbddaad?q=80&w=1600&auto=format&fit=crop",

  aboutTitle_es: "Así es Candy Rose",
  aboutTitle_en: "This is Candy Rose",
  aboutTitle_pt: "Seu pedaço de paraíso.",

  aboutSub_es: "Desde Isla Grande",
  aboutSub_en: "From Isla Grande",
  aboutSub_pt: "NOSSA ESSÊNCIA",

  about_es:
    "Ubicados en Isla Grande, Colón, Panamá. Desde sus humildes comienzos como las Cabañas Candy Rose en 1972, fundadas por la visionaria Sra. Cándida Rosa Palma para ofrecer refugio a los pescadores de Colón, hasta hoy, donde la tercera generación de la misma familia sigue comprometida con brindar experiencias únicas.\n\n" +
    "Contamos con cómodas y modernas habitaciones, rodeados de la serenidad del Caribe, deliciosa comida, ambiente acogedor y un amigable servicio personalizado.\n\n" +
    "Nuestra exclusiva área social cuenta con una piscina, jacuzzi, gimnasio y spa para máximo disfrute y relajación. Además, nuestro restaurante-bar a la carta El Muelle Rojo, situado a orillas de la playa con terraza sobre el mar, invita a crear recuerdos inolvidables para nuestros huéspedes, mientras disfrutan de exquisitos platillos y refrescantes bebidas junto al mar.\n\n" +
    "Adicionalmente, contamos con sala de eventos con vistas al mar, ideal para celebraciones, capacitaciones, reuniones y mucho más.\n\n" +
    "En el Hotel Candy Rose, cada momento se convierte en una experiencia única y memorable.",
  about_en:
    "Located in Isla Grande, Colón, Panama. From its humble beginnings as the Candy Rose Cabins in 1972, founded by the visionary Mrs. Cándida Rosa Palma to offer shelter to the fishermen of Colón, to today, where the third generation of the same family remains committed to delivering unique experiences.\n\n" +
    "We offer comfortable, modern rooms surrounded by the serenity of the Caribbean, delicious food, a welcoming atmosphere and friendly, personalized service.\n\n" +
    "Our exclusive social area features a pool, jacuzzi, gym and spa for maximum enjoyment and relaxation. Our à la carte restaurant-bar El Muelle Rojo, set right on the beach with a terrace over the sea, invites guests to create unforgettable memories while enjoying exquisite dishes and refreshing drinks by the water.\n\n" +
    "We also have an event hall with ocean views, ideal for celebrations, trainings, meetings and much more.\n\n" +
    "At Hotel Candy Rose, every moment becomes a unique and memorable experience.",
  about_pt:
    "No Hotel Candy Rose criamos experiências únicas. Cada canto é pensado para que você viva a brisa do Caribe panamenho em um ambiente íntimo e exclusivo. Onde o mar abraça a história, a natureza te recebe e a hospitalidade se sente como em casa.",

  aboutImg: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop",

  roomsTitle_es: "Nuestras Habitaciones",
  roomsTitle_en: "Our Rooms",
  roomsTitle_pt: "Nossos Quartos",

  roomsSub_es: "VIVE EL CARIBE",
  roomsSub_en: "LIVE THE CARIBBEAN",
  roomsSub_pt: "VIVA O CARIBE",

  rooms: [
    {
      code: "SNL",
      name_es: "Habitación Sencilla",
      name_en: "Single Room",
      description_es: "1 cama doble. Habitación de menor tamaño, en planta baja. Ideal para una estadía cómoda y práctica.",
      description_en: "1 double bed. Smaller room on the ground floor. Ideal for a comfortable, practical stay.",
      order: 1,
      group: "main",
    },
    {
      code: "STD",
      name_es: "Habitación Estándar",
      name_en: "Standard Room",
      description_es: "2 camas tamaño queen. Espacio cómodo y luminoso, ideal para familias o grupos pequeños.",
      description_en: "2 queen-size beds. Comfortable, bright space, ideal for families or small groups.",
      order: 2,
      group: "main",
    },
    {
      code: "DLX",
      name_es: "Habitación Deluxe Matrimonial",
      name_en: "Deluxe King Room",
      description_es: "1 cama tamaño king en 3er piso, con la mejor vista y balcón. Ideal para parejas.",
      description_en: "1 king-size bed on the 3rd floor, with the best view and balcony. Ideal for couples.",
      order: 3,
      group: "main",
    },
    {
      code: "OAS",
      name_es: "Villa Oasis",
      name_en: "Villa Oasis",
      description_es: "2 camas tamaño queen, planta baja frente a la piscina. Dos habitaciones pueden conectarse internamente.",
      description_en: "2 queen-size beds, ground floor facing the pool. Two rooms can connect internally.",
      order: 4,
      group: "villa",
    },
    {
      code: "HRZ",
      name_es: "Villa Horizonte",
      name_en: "Villa Horizonte",
      description_es: "2 camas tamaño queen, segundo nivel frente a la piscina, con balcón privado de vista espectacular y desayunador.",
      description_en: "2 queen-size beds, second floor facing the pool, with a private balcony with spectacular views and a breakfast nook.",
      order: 5,
      group: "villa",
    },
  ],

  villasGroupLabel_es: "Villas — Área de piscina",
  villasGroupLabel_en: "Villas — Pool area",

  roomIncludesTitle_es: "Todas las habitaciones incluyen",
  roomIncludesTitle_en: "All rooms include",
  roomIncludes_es: [
    "Desayuno incluido",
    "Uso de todas las instalaciones",
    "Desembarque directo en el muelle del hotel",
    "Acceso al restaurante-bar, terraza sobre el mar y ocean-front deck del Muelle Rojo",
    "Acceso exclusivo a piscina, jacuzzi y áreas de descanso",
    "Uso exclusivo del gimnasio",
  ],
  roomIncludes_en: [
    "Breakfast included",
    "Use of all facilities",
    "Direct disembarkation at the hotel's dock",
    "Access to the restaurant-bar, sea terrace and Muelle Rojo ocean-front deck",
    "Exclusive access to pool, jacuzzi and lounge areas",
    "Exclusive gym access",
  ],

  stayInfoTitle_es: "Información para tu estadía",
  stayInfoTitle_en: "Stay information",
  stayInfo: [
    {
      icon: "LogIn",
      label_es: "Hora de entrada",
      label_en: "Check-in",
      value_es: "3:00 pm – 8:00 pm",
      value_en: "3:00 pm – 8:00 pm",
    },
    {
      icon: "LogOut",
      label_es: "Hora de salida",
      label_en: "Check-out",
      value_es: "12:00 pm",
      value_en: "12:00 pm",
    },
    {
      icon: "Coffee",
      label_es: "Horario de desayuno",
      label_en: "Breakfast hours",
      value_es: "7:30 am – 10:30 am",
      value_en: "7:30 am – 10:30 am",
    },
    {
      icon: "Utensils",
      label_es: "Cocina abierta",
      label_en: "Kitchen open until",
      value_es: "Hasta las 9:00 pm",
      value_en: "Until 9:00 pm",
    },
    {
      icon: "Dumbbell",
      label_es: "Horario de gimnasio",
      label_en: "Gym hours",
      value_es: "8:00 am – 7:00 pm",
      value_en: "8:00 am – 7:00 pm",
    },
    {
      icon: "ShieldCheck",
      label_es: "Garantía de reserva",
      label_en: "Booking guarantee",
      value_es: "Esta reserva no se cobra a su tarjeta por anticipado. Su tarjeta es una garantía únicamente. Pagará al check-in.",
      value_en: "This booking is not charged to your card in advance. Your card is a guarantee only. You'll pay at check-in.",
      highlight: true,
    },
    {
      icon: "CreditCard",
      label_es: "Métodos de pago",
      label_en: "Payment methods",
      value_es: "Transferencia bancaria, Yappy, tarjeta clave, Visa, Mastercard o efectivo. Se recomienda llevar efectivo para traslados en lancha.",
      value_en: "Bank transfer, Yappy, debit card, Visa, Mastercard or cash. We recommend bringing cash for boat transfers.",
    },
    {
      icon: "Waves",
      label_es: "Instalaciones disponibles",
      label_en: "Available facilities",
      value_es: "Restaurante-bar con vista al mar, terraza, acceso directo a la playa, ocean-front deck, piscina, jacuzzi, gimnasio y spa.",
      value_en: "Ocean-view restaurant-bar, terrace, direct beach access, ocean-front deck, pool, jacuzzi, gym and spa.",
    },
    {
      icon: "PawPrint",
      label_es: "Mascotas",
      label_en: "Pets",
      value_es: "Por el momento no somos pet-friendly.",
      value_en: "We are currently not pet-friendly.",
    },
    {
      icon: "XCircle",
      label_es: "Alimentos y bebidas externas",
      label_en: "Outside food and drinks",
      value_es: "Por normas de seguridad no se permite ingresar coolers, hieleras o asadores.",
      value_en: "For safety reasons, coolers, ice chests or grills are not allowed.",
    },
  ],

  howToArriveTitle_es: "¿Cómo llegar?",
  howToArriveTitle_en: "How to get here",
  howToArrive_es:
    "La lancha se toma en La Guaira, donde se ubica el muelle, con los transportistas locales. Funciona como una estación de taxi y están a disposición apenas llega.\n\n" +
    "La tarifa que manejan es de aproximadamente $3.00 el viaje por persona. Una vez embarcados, son 7 a 10 minutos en lancha y desembarcan directamente en el muelle del hotel. Es un servicio externo al alojamiento y se paga directamente a los transportistas. Usualmente operan entre 8:00 am y 7:00 pm.\n\n" +
    "Estacionamiento: en La Guaira hay múltiples opciones de estacionamiento; al llegar le guiarán. Servicio externo.\n\n" +
    "Lo anterior son recomendaciones; si está familiarizado con espacios de estacionamiento alternos o servicio de traslado en lancha, siéntase cómodo de optar por ellos.",
  howToArrive_en:
    "Boats depart from La Guaira, where the dock is located, with local boat operators. It works like a taxi station — they are available as soon as you arrive.\n\n" +
    "The fare is approximately $3.00 per person per trip. Once onboard, the ride is 7 to 10 minutes and you disembark directly at the hotel's dock. This is a service external to the hotel, paid directly to the operators. They usually operate between 8:00 am and 7:00 pm.\n\n" +
    "Parking: La Guaira offers several parking options; on arrival, staff will guide you. External service.\n\n" +
    "The above are recommendations; if you are familiar with alternative parking or boat transfer services, feel free to use them.",

  cancellationTitle_es: "Políticas de cancelación",
  cancellationTitle_en: "Cancellation policy",
  cancellation_es: [
    "En caso de tener que cancelar la reserva, favor hacerlo 72 horas antes de la hora de check-in para evitar el cargo por cancelación (importe completo de la primera noche).",
    "Una vez iniciada la estadía, no se realizan reembolsos por salidas anticipadas motivadas por causas externas o ajenas a la operación del hotel.",
    "En situaciones de fuerza mayor —mal tiempo, desastres naturales, protestas, problemas de transporte, quebrantos de salud o accidentes— el hotel no puede asumir responsabilidad ni ofrecer reembolsos.",
  ],
  cancellation_en: [
    "If you need to cancel your booking, please do so 72 hours before check-in to avoid the cancellation charge (full amount of the first night).",
    "Once the stay has started, no refunds are issued for early departures caused by external factors outside hotel operations.",
    "In force-majeure situations — bad weather, natural disasters, protests, transport issues, health problems or accidents — the hotel cannot assume responsibility nor offer refunds.",
  ],

  contactTitle_es: "¿Listo para tu escape caribeño?",
  contactTitle_en: "Ready for your Caribbean escape?",
  contactTitle_pt: "Pronto para sua fuga tropical?",

  contactDesc_es: "Haz tu reserva directamente aquí de manera rápida y segura. Si tienes alguna duda, estamos disponibles por WhatsApp para ayudarte.",
  contactDesc_en: "Book directly here in a fast and secure way. If you have any questions, we are available on WhatsApp to help you.",

  contactPhone: "+507 6389-4132",
  contactInsta: "@hotelcandyrose",
  contactEmail: "hotelcandyrose@gmail.com",
  contactLocation: "Isla Grande, Colón, Panamá",

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
