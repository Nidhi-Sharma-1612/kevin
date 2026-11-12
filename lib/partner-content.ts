import type { PartnerLang } from "@/lib/partner-pages";

// Copy for the partner-agencies page, supplied by the client already
// translated (agences-fr.html / agencias-es.html / agents-en.html, 2026-11).
// Kept verbatim — these pages are excluded from Google Translate, so this
// text is exactly what visitors read.

type Item = { title: string; text: string };

export type PartnerContent = {
  meta: { title: string; description: string; locale: string };
  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    lead2: string;
    commissionTitle: string;
    commissionText: string;
    talkCta: string;
    referCta: string;
    referMessage: string;
    proof: [string, string];
    imageAlt: string;
  };
  why: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    checklist: string[];
    quote: string;
    imageAlt: string;
  };
  offer: {
    eyebrow: string;
    title: string;
    commission: Item;
    estimate: Item & { bullets: string[]; tag: string };
    sellers: Item;
    buyers: Item;
  };
  steps: { eyebrow: string; title: string; items: Item[] };
  apart: {
    eyebrow: string;
    title: string;
    care: Item & { imageAlt: string };
    cleaning: Item & { imageAlt: string };
    marketing: Item & { imageAlt: string };
    welcome: Item & { imageAlt: string };
    pricing: Item & { days: string[]; normal: string; high: string; ariaLabel: string };
    team: Item & { imageAlt: string };
  };
  reviews: {
    eyebrow: string;
    title: string;
    items: { quote: string; name: string; detail: string }[];
  };
  reputation: { title: string; cta: string };
  form: {
    eyebrow: string;
    title: string;
    intro: string;
    heading: string;
    options: { label: string; value: string }[];
    nameLabel: string;
    agencyLabel: string;
    messageLabel: string;
    submit: string;
    fine: string;
    greeting: (name: string, agency: string) => string;
    interestedIn: string;
  };
  faq: { eyebrow: string; title: string; items: { question: string; answer: string }[] };
  final: {
    title: string;
    lead: string;
    cta: string;
    programmeLink: string;
    programmeMessage: string;
    emailSubject: string;
  };
  talkMessage: string;
  stickyLabel: string;
  // Phone numbers are listed with this page's own language first.
  phoneOrder: PartnerLang[];
  languageNames: Record<PartnerLang, string>;
};

const NBSP = " ";

const fr: PartnerContent = {
  meta: {
    title: "Partenariat agences immobilières à Torremolinos | La Conciergerie Del Sol",
    description:
      "Agences immobilières : recommandez-nous vos clients propriétaires. Commission à la signature, estimation de revenus à votre nom, gestion complète à Torremolinos.",
    locale: "fr_FR",
  },
  hero: {
    eyebrow: "Pour les agences immobilières",
    title: "Un partenaire de confiance pour gérer la location saisonnière de vos clients",
    lead: "Aidez vos acheteurs à rentabiliser leur bien sur la Costa del Sol avec une équipe locale qui prend soin du bien de vos clients et de votre réputation.",
    lead2: `Nous ne vendons pas de biens et ne faisons pas concurrence à votre agence. Vous gardez la relation avec votre client${NBSP}; nous nous occupons de la gestion.`,
    commissionTitle: "Une commission pour chaque contrat de gestion signé",
    commissionText: "Montant selon la taille du bien, détaillé dans notre programme partenaires.",
    talkCta: "Parlons-en",
    referCta: "Recommander un client",
    referMessage: "Bonjour, je souhaite vous recommander un client.",
    proof: ["Superhost sur Airbnb", "+30 appartements gérés"],
    imageAlt: "Terrasse avec vue sur la mer et la plage dans un appartement géré à Torremolinos",
  },
  why: {
    eyebrow: "Pourquoi nous recommander",
    title: "Vos clients entre de bonnes mains",
    paragraphs: [
      "Quand vous recommandez une conciergerie, votre réputation est en jeu. Avec notre propre équipe à Torremolinos, vos clients sont bien accompagnés dès le premier jour.",
      "Nous ne sommes pas une agence immobilière et ne faisons pas concurrence à votre agence. Nous gérons la location saisonnière de vos clients et vous les recommandons quand ils veulent vendre.",
    ],
    checklist: [
      "Apporter de la clarté à vos clients avant l'achat",
      "Fixer des attentes de revenus réalistes",
      "Garantir une gestion professionnelle dès le premier jour",
      "Savoir que vos clients sont accompagnés après la vente",
    ],
    quote: "La relation avec votre client continue bien après la signature.",
    imageAlt:
      "Salon avec vue panoramique sur la mer dans un appartement géré par La Conciergerie Del Sol",
  },
  offer: {
    eyebrow: "Ce que reçoit votre agence",
    title: "Tout ce qu'il vous faut pour nous recommander",
    commission: {
      title: "Une commission à la signature",
      text: `Une commission pour chaque propriétaire qui signe un contrat de gestion, selon la taille du bien. Elle est versée dès la signature et reste acquise${NBSP}: elle n'est jamais remboursée.`,
    },
    estimate: {
      title: "Une estimation au nom de votre agence",
      text: `Un rapport que vous remettez à votre acheteur comme un service de votre agence${NBSP}:`,
      bullets: [
        "Revenus annuels selon 3 scénarios",
        "Occupation et prix par nuit, mois par mois",
        "Comparaison avec des biens similaires et net pour le propriétaire",
      ],
      tag: "Gratuite · sous 48 h · sans engagement",
    },
    sellers: {
      title: "Des vendeurs pour votre agence",
      text: "Quand l'un des propriétaires que nous gérons souhaite vendre, nous lui recommandons votre agence. Des biens bien entretenus, avec des revenus locatifs connus, à présenter à vos acheteurs.",
    },
    buyers: {
      title: "Des acheteurs parmi nos voyageurs",
      text: "Quand l’un de nos voyageurs souhaite acheter sur la Costa del Sol, nous le mettons en relation avec une agence partenaire. Un acheteur qui connaît déjà la région et l’apprécie.",
    },
  },
  steps: {
    eyebrow: "Étape par étape",
    title: "Comment fonctionne le partenariat",
    items: [
      {
        title: "Vous nous présentez un propriétaire intéressé",
        text: "Avec son accord, vous nous mettez en contact.",
      },
      {
        title: "Nous étudions son bien et lui expliquons notre gestion",
        text: "Nous répondons à ses questions et préparons une proposition.",
      },
      {
        title: "Vous recevez votre commission",
        text: "Dès que le propriétaire signe le contrat de gestion, nous vous versons votre commission, sur facture.",
      },
    ],
  },
  apart: {
    eyebrow: "Ce qui nous distingue",
    title: "Une gestion pensée pour les propriétaires exigeants",
    care: {
      title: "Un bien entretenu avec soin",
      text: `Vérification après chaque séjour et capteur de bruit offert${NBSP}: le bien garde sa valeur, les voisins leur tranquillité.`,
      imageAlt: "Capteur de bruit installé au plafond d'un appartement géré",
    },
    cleaning: {
      title: "Un ménage impeccable",
      text: `Ménage le jour même du départ et blanchisserie interne${NBSP}: de meilleurs avis et plus de réservations répétées.`,
      imageAlt: "Lit préparé avec serviettes et chaussons pour les voyageurs",
    },
    marketing: {
      title: "Marketing et visibilité",
      text: "Photos professionnelles et annonces sur Airbnb, Booking, Vrbo et notre site. Superhost sur Airbnb.",
      imageAlt: "Jacuzzi sur le toit-terrasse d'un appartement géré à Torremolinos",
    },
    welcome: {
      title: `Accueil en personne et assistance 24${NBSP}h/24`,
      text: "Nous accueillons chaque voyageur, sans boîte à clés, et répondons jour et nuit en français, espagnol et anglais.",
      imageAlt: "Cadeau de bienvenue pour les voyageurs",
    },
    pricing: {
      title: "Prix dynamiques",
      text: "Tarifs ajustés chaque jour selon la demande, la saison et les événements, pour maximiser revenus et occupation.",
      days: ["L", "M", "M", "J", "V", "S", "D"],
      normal: "Demande normale",
      high: "Forte demande",
      ariaLabel: "Exemple de calendrier avec des prix qui changent chaque jour selon la demande",
    },
    team: {
      title: "Une équipe locale",
      text: "Bureau en plein centre de Torremolinos et plus de 30 appartements gérés sur la Costa del Sol.",
      imageAlt: "Bureau de La Conciergerie Del Sol au centre de Torremolinos",
    },
  },
  reviews: {
    eyebrow: "Ce qu'en disent les voyageurs",
    title: "Nous accueillons chaque voyageur en personne. Et ça se voit.",
    items: [
      {
        quote:
          "Nous avons été accueillis par Momo, le concierge, qui nous a fait visiter l'appartement et s'est montré très serviable. Il nous a bien fait comprendre qu'il restait disponible si nous avions besoin de lui. L'appartement était propre et parfaitement équipé. (…) Nous avons adoré notre séjour et reviendrions avec plaisir.",
        name: "Yvonne",
        detail: "Airbnb · mai 2026 · traduit de l'anglais",
      },
      {
        quote:
          "Nous avons passé un merveilleux séjour dans le logement de Philippe. L'emplacement est parfait pour être au centre de Torremolinos, avec une vue magnifique. Toute l'équipe a été formidable et on ne peut plus serviable.",
        name: "Adam",
        detail: "Airbnb · juin 2026 · traduit de l'anglais",
      },
    ],
  },
  reputation: {
    title: "Votre nom est en jeu. Nous en prenons soin comme du nôtre.",
    cta: "Recommander un client",
  },
  form: {
    eyebrow: "Parlons-en",
    title: `Comment pouvons-nous vous aider${NBSP}?`,
    intro: `Dites-nous ce dont vous avez besoin${NBSP}: nous vous répondons sur WhatsApp, en général dans la journée. Sans engagement.`,
    heading: "Je suis intéressé(e) par…",
    options: [
      {
        label: "Le programme de partenariat avec les agences",
        value: "le programme de partenariat avec les agences",
      },
      {
        label: "Une estimation de revenus rapide pour un bien en vente",
        value: "une estimation de revenus rapide pour un bien en vente",
      },
      {
        label: "Recevoir vos propriétaires qui veulent vendre",
        value: "recevoir vos propriétaires qui veulent vendre",
      },
      { label: "Vous présenter un propriétaire", value: "vous présenter un propriétaire" },
    ],
    nameLabel: "Nom",
    agencyLabel: "Agence",
    messageLabel: "Message (facultatif)",
    submit: "Envoyer sur WhatsApp",
    fine: "WhatsApp s'ouvrira avec votre message déjà rédigé. Aucune donnée n'est enregistrée sur cette page.",
    greeting: (name, agency) =>
      `Bonjour, je suis ${name || "[nom]"}${agency ? ` de l’agence ${agency}` : ""}.`,
    interestedIn: "Je suis intéressé(e) par :",
  },
  faq: {
    eyebrow: "Questions fréquentes",
    title: "Ce que nous demandent les agences",
    items: [
      {
        question: `Puis-je recommander un bien déjà en location${NBSP}?`,
        answer:
          "Oui. Si le propriétaire loue déjà son bien lui-même ou avec une autre société, nous étudions ses résultats et lui expliquons comment nous pouvons les améliorer.",
      },
      {
        question: `Et si le propriétaire part ensuite${NBSP}?`,
        answer: `Votre commission est acquise${NBSP}: elle n'est pas remboursée, même si le propriétaire résilie son contrat.`,
      },
      {
        question: `Le bien doit-il avoir une licence touristique${NBSP}?`,
        answer:
          "Oui, une licence de logement à usage touristique (VFT). Si le propriétaire ne l'a pas encore, nous l'aidons dans les démarches.",
      },
      {
        question: `Quelles zones couvrez-vous${NBSP}?`,
        answer: "Torremolinos, Benalmádena, Fuengirola et Málaga.",
      },
    ],
  },
  final: {
    title: "Prenons soin de vos clients, ensemble",
    lead: "Si vous cherchez un partenaire qui partage votre niveau d'exigence, de professionnalisme et de suivi, nous serons ravis de vous rencontrer.",
    cta: "Parlons-en",
    programmeLink: "Recevoir le programme partenaires complet",
    programmeMessage:
      "Bonjour, je souhaite recevoir votre programme partenaires pour les agences.",
    emailSubject: "Partenariat agence immobilière",
  },
  talkMessage: "Bonjour, je souhaite parler d'un partenariat.",
  stickyLabel: "Nous écrire sur WhatsApp",
  phoneOrder: ["fr", "es", "en"],
  languageNames: { fr: "Français", es: "Español", en: "English" },
};

const es: PartnerContent = {
  meta: {
    title: "Colaboración con inmobiliarias en Torremolinos | La Conciergerie Del Sol",
    description:
      "Inmobiliarias: recomiéndenos a sus clientes propietarios. Comisión a la firma, estimación de ingresos a nombre de su agencia, gestión integral en Torremolinos.",
    locale: "es_ES",
  },
  hero: {
    eyebrow: "Para agencias inmobiliarias",
    title: "Un socio de confianza para gestionar el alquiler turístico de sus clientes",
    lead: "Ayude a sus compradores a rentabilizar su vivienda en la Costa del Sol con un equipo local que cuida de la vivienda de sus clientes y de su reputación.",
    lead2:
      "No vendemos inmuebles ni competimos con su agencia. Usted mantiene la relación con su cliente; nosotros nos encargamos de la gestión.",
    commissionTitle: "Una comisión por cada contrato de gestión firmado",
    commissionText:
      "Importe según el tamaño de la vivienda, detallado en nuestro programa de colaboración.",
    talkCta: "Hablemos",
    referCta: "Recomendar un cliente",
    referMessage: "Hola, quiero recomendarles a un cliente.",
    proof: ["Superhost en Airbnb", "+30 pisos gestionados"],
    imageAlt: "Terraza con vistas al mar y a la playa en un piso gestionado en Torremolinos",
  },
  why: {
    eyebrow: "Por qué recomendarnos",
    title: "Sus clientes, en buenas manos",
    paragraphs: [
      "Cuando recomienda una empresa de gestión, su reputación está en juego. Con nuestro equipo propio en Torremolinos, sus clientes están bien atendidos desde el primer día.",
      "No somos una inmobiliaria y no competimos con su agencia. Gestionamos el alquiler turístico de sus clientes y le recomendamos cuando quieren vender.",
    ],
    checklist: [
      "Dar claridad a sus clientes antes de comprar",
      "Fijar expectativas de ingresos realistas",
      "Garantizar una gestión profesional desde el primer día",
      "Saber que sus clientes están acompañados después de la venta",
    ],
    quote: "La relación con su cliente continúa mucho después de la firma.",
    imageAlt:
      "Salón con vistas panorámicas al mar en un piso gestionado por La Conciergerie Del Sol",
  },
  offer: {
    eyebrow: "Lo que recibe su agencia",
    title: "Todo lo que necesita para recomendarnos",
    commission: {
      title: "Una comisión a la firma",
      text: "Una comisión por cada propietario que firma un contrato de gestión, según el tamaño de la vivienda. Se abona en cuanto el propietario firma y está ganada: no se devuelve.",
    },
    estimate: {
      title: "Una estimación a nombre de su agencia",
      text: "Un informe que usted entrega a su comprador como un servicio propio:",
      bullets: [
        "Ingresos anuales en 3 escenarios",
        "Ocupación y precio por noche, mes a mes",
        "Comparación con pisos similares y neto para el propietario",
      ],
      tag: "Gratis · en 48 h · sin compromiso",
    },
    sellers: {
      title: "Vendedores para su agencia",
      text: "Cuando uno de los propietarios que gestionamos quiere vender, le recomendamos su agencia. Pisos bien cuidados, con ingresos de alquiler conocidos, para presentar a sus compradores.",
    },
    buyers: {
      title: "Compradores entre nuestros viajeros",
      text: "Cuando uno de nuestros viajeros quiere comprar en la Costa del Sol, le ponemos en contacto con una agencia colaboradora. Un comprador que ya conoce y ama la zona.",
    },
  },
  steps: {
    eyebrow: "Paso a paso",
    title: "Cómo funciona la colaboración",
    items: [
      {
        title: "Nos presenta a un propietario interesado",
        text: "Con su autorización, nos pone en contacto con él.",
      },
      {
        title: "Estudiamos su vivienda y le explicamos nuestra gestión",
        text: "Resolvemos sus dudas y preparamos una propuesta.",
      },
      {
        title: "Usted recibe su comisión",
        text: "Cuando el propietario firma el contrato de gestión, le abonamos su comisión, contra factura.",
      },
    ],
  },
  apart: {
    eyebrow: "Lo que nos diferencia",
    title: "Una gestión pensada para propietarios exigentes",
    care: {
      title: "Un piso bien cuidado",
      text: "Revisión después de cada estancia y sensor de ruido gratis: el piso conserva su valor y los vecinos, su tranquilidad.",
      imageAlt: "Sensor de ruido instalado en el techo de un piso gestionado",
    },
    cleaning: {
      title: "Limpieza impecable",
      text: "Limpieza el mismo día de la salida y lavandería propia: mejores reseñas y más reservas repetidas.",
      imageAlt: "Cama preparada con toallas y zapatillas para los viajeros",
    },
    marketing: {
      title: "Marketing y visibilidad",
      text: "Fotos profesionales y anuncios en Airbnb, Booking, Vrbo y nuestra web. Superhost en Airbnb.",
      imageAlt: "Jacuzzi en la azotea de un piso gestionado en Torremolinos",
    },
    welcome: {
      title: "Recepción en persona y asistencia 24/7",
      text: "Recibimos a cada viajero, sin cajas de llaves, y respondemos día y noche en español, inglés y francés.",
      imageAlt: "Regalo de bienvenida para los viajeros",
    },
    pricing: {
      title: "Precios dinámicos",
      text: "Tarifas ajustadas cada día según demanda, temporada y eventos, para maximizar ingresos y ocupación.",
      days: ["L", "M", "X", "J", "V", "S", "D"],
      normal: "Demanda normal",
      high: "Alta demanda",
      ariaLabel: "Ejemplo de calendario con precios que cambian cada día según la demanda",
    },
    team: {
      title: "Un equipo local",
      text: "Oficina en el centro de Torremolinos y más de 30 pisos gestionados en la Costa del Sol.",
      imageAlt: "Oficina de La Conciergerie Del Sol en el centro de Torremolinos",
    },
  },
  reviews: {
    eyebrow: "Lo que dicen los viajeros",
    title: "Recibimos a cada viajero en persona. Y se nota.",
    items: [
      {
        quote:
          "Nos recibió Momo, el conserje, que nos enseñó el apartamento y fue muy servicial. Nos dejó claro que estaba disponible si lo necesitábamos. El apartamento estaba limpio y tenía todo lo necesario. (…) Disfrutamos mucho de la estancia y volveríamos encantados.",
        name: "Yvonne",
        detail: "Airbnb · mayo 2026 · traducido del inglés",
      },
      {
        quote:
          "Pasamos una estancia maravillosa en el alojamiento de Philippe. La ubicación es perfecta si quiere estar en el centro de Torremolinos con unas vistas impresionantes. Todo el personal fue increíble y no pudo ser más amable.",
        name: "Adam",
        detail: "Airbnb · junio 2026 · traducido del inglés",
      },
    ],
  },
  reputation: {
    title: "Su nombre está en juego. Lo cuidamos como si fuera el nuestro.",
    cta: "Recomendar un cliente",
  },
  form: {
    eyebrow: "Hablemos",
    title: "¿Cómo podemos ayudarle?",
    intro:
      "Díganos qué necesita: le contestamos por WhatsApp, normalmente en el mismo día. Sin compromiso.",
    heading: "Me interesa…",
    options: [
      {
        label: "El programa de colaboración con agencias",
        value: "el programa de colaboración con agencias",
      },
      {
        label: "Una estimación de ingresos rápida para un piso en venta",
        value: "una estimación de ingresos rápida para un piso en venta",
      },
      {
        label: "Recibir a sus propietarios que quieren vender",
        value: "recibir a sus propietarios que quieren vender",
      },
      { label: "Presentarles a un propietario", value: "presentarles a un propietario" },
    ],
    nameLabel: "Nombre",
    agencyLabel: "Agencia",
    messageLabel: "Mensaje (opcional)",
    submit: "Enviar por WhatsApp",
    fine: "Se abrirá WhatsApp con su mensaje ya escrito. No guardamos ningún dato en esta página.",
    greeting: (name, agency) =>
      `Hola, soy ${name || "[nombre]"}${agency ? ` de la agencia ${agency}` : ""}.`,
    interestedIn: "Me interesa:",
  },
  faq: {
    eyebrow: "Preguntas frecuentes",
    title: "Lo que nos preguntan las agencias",
    items: [
      {
        question: "¿Puedo recomendar un piso que ya se alquila?",
        answer:
          "Sí. Si el propietario ya alquila su piso por su cuenta o con otra empresa, estudiamos sus resultados y le explicamos cómo podemos mejorarlos.",
      },
      {
        question: "¿Y si el propietario se va después?",
        answer:
          "Su comisión está ganada: no se devuelve, aunque el propietario rescinda el contrato.",
      },
      {
        question: "¿El piso necesita licencia turística?",
        answer:
          "Sí, una licencia de vivienda con fines turísticos (VFT). Si el propietario aún no la tiene, le ayudamos con los trámites.",
      },
      {
        question: "¿Qué zonas cubren?",
        answer: "Torremolinos, Benalmádena, Fuengirola y Málaga.",
      },
    ],
  },
  final: {
    title: "Cuidemos juntos de sus clientes",
    lead: "Si busca un socio que comparta su nivel de exigencia, profesionalidad y seguimiento, nos encantará conocerle.",
    cta: "Hablemos",
    programmeLink: "Recibir el programa de colaboración completo",
    programmeMessage:
      "Hola, me gustaría recibir su programa de colaboración para agencias.",
    emailSubject: "Colaboración agencia inmobiliaria",
  },
  talkMessage: "Hola, me gustaría hablar de una colaboración.",
  stickyLabel: "Escribirnos por WhatsApp",
  phoneOrder: ["es", "fr", "en"],
  languageNames: { fr: "Français", es: "Español", en: "English" },
};

const en: PartnerContent = {
  meta: {
    title: "Real Estate Agency Partnership in Torremolinos | La Conciergerie Del Sol",
    description:
      "Real estate agents: refer your property-owner clients to us. Commission on signature, income estimate under your agency’s name, full holiday-rental management in Torremolinos.",
    locale: "en_GB",
  },
  hero: {
    eyebrow: "For real estate agencies",
    title: "A trusted partner to manage your clients’ holiday rentals",
    lead: "Help your buyers earn income from their property on the Costa del Sol, with a local team that looks after your clients’ homes and your reputation.",
    lead2:
      "We don’t sell property and we don’t compete with your agency. You keep the relationship with your client; we take care of the management.",
    commissionTitle: "A commission for every management contract signed",
    commissionText: "Amount based on property size, detailed in our partner programme.",
    talkCta: "Let’s talk",
    referCta: "Refer a client",
    referMessage: "Hello, I'd like to refer a client to you.",
    proof: ["Airbnb Superhost", "30+ apartments managed"],
    imageAlt: "Terrace with sea and beach views in an apartment we manage in Torremolinos",
  },
  why: {
    eyebrow: "Why recommend us",
    title: "Your clients in good hands",
    paragraphs: [
      "When you recommend a management company, your reputation is on the line. With our own team in Torremolinos, your clients are well looked after from day one.",
      "We are not an estate agency and we don’t compete with you. We manage your clients’ holiday rentals and refer them back to you when they want to sell.",
    ],
    checklist: [
      "Give your clients clarity before they buy",
      "Set realistic income expectations",
      "Ensure professional management from day one",
      "Know your clients are supported after the sale",
    ],
    quote: "Your relationship with your client continues long after the sale.",
    imageAlt:
      "Living room with panoramic sea views in an apartment managed by La Conciergerie Del Sol",
  },
  offer: {
    eyebrow: "What your agency gets",
    title: "Everything you need to recommend us",
    commission: {
      title: "A commission on signature",
      text: "A commission for every owner who signs a management contract, based on the size of the property. Paid as soon as the owner signs, and yours to keep: it is never refunded.",
    },
    estimate: {
      title: "An income estimate under your agency’s name",
      text: "A report you hand to your buyer as your own agency’s service:",
      bullets: [
        "Annual income in 3 scenarios",
        "Occupancy and nightly rate, month by month",
        "Comparison with similar properties and net income for the owner",
      ],
      tag: "Free · within 48 h · no obligation",
    },
    sellers: {
      title: "Sellers for your agency",
      text: "When one of the owners we manage wants to sell, we recommend your agency. Well-kept properties with a proven rental income to present to your buyers.",
    },
    buyers: {
      title: "Buyers among our guests",
      text: "When one of our guests wants to buy on the Costa del Sol, we put them in touch with a partner agency. A buyer who already knows and loves the area.",
    },
  },
  steps: {
    eyebrow: "Step by step",
    title: "How the partnership works",
    items: [
      { title: "You introduce an interested owner", text: "With their consent, you put us in touch." },
      {
        title: "We assess the property and explain our management",
        text: "We answer their questions and prepare a proposal.",
      },
      {
        title: "You receive your commission",
        text: "As soon as the owner signs the management contract, we pay your commission, against your invoice.",
      },
    ],
  },
  apart: {
    eyebrow: "What sets us apart",
    title: "Management designed for demanding owners",
    care: {
      title: "A carefully maintained property",
      text: "Inspection after every stay and a free noise sensor: the property keeps its value, and the neighbours their peace and quiet.",
      imageAlt: "Noise sensor fitted to the ceiling of a managed apartment",
    },
    cleaning: {
      title: "Spotless cleaning",
      text: "Same-day cleaning after check-out and our own laundry: better reviews and more repeat bookings.",
      imageAlt: "Bed made up with towels and slippers for guests",
    },
    marketing: {
      title: "Marketing and visibility",
      text: "Professional photos and listings on Airbnb, Booking, Vrbo and our own website. Airbnb Superhost.",
      imageAlt: "Rooftop jacuzzi at a managed apartment in Torremolinos",
    },
    welcome: {
      title: "In-person check-in and 24/7 support",
      text: "We welcome every guest in person, with no key boxes, and answer day and night in English, Spanish and French.",
      imageAlt: "Welcome gift for guests",
    },
    pricing: {
      title: "Dynamic pricing",
      text: "Rates adjusted daily to demand, season and local events, to maximise income and occupancy.",
      days: ["M", "T", "W", "T", "F", "S", "S"],
      normal: "Normal demand",
      high: "High demand",
      ariaLabel: "Example calendar with prices that change every day with demand",
    },
    team: {
      title: "A local team",
      text: "An office in the heart of Torremolinos and more than 30 apartments managed on the Costa del Sol.",
      imageAlt: "La Conciergerie Del Sol office in the centre of Torremolinos",
    },
  },
  reviews: {
    eyebrow: "What guests say",
    title: "We welcome every guest in person. And it shows.",
    // Translated back from the French by the client — swap in the original
    // Airbnb wording once they send it.
    items: [
      {
        quote:
          "We were welcomed by Momo, the concierge, who showed us around the apartment and was very helpful. He made it clear he was available if we needed anything. The apartment was clean and fully equipped. (…) We loved our stay and would happily come back.",
        name: "Yvonne",
        detail: "Airbnb · May 2026",
      },
      {
        quote:
          "We had a wonderful stay at Philippe’s place. The location is perfect, right in the centre of Torremolinos, with a stunning view. The whole team was fantastic and couldn’t have been more helpful.",
        name: "Adam",
        detail: "Airbnb · June 2026",
      },
    ],
  },
  reputation: {
    title: "Your name is on the line. We look after it like our own.",
    cta: "Refer a client",
  },
  form: {
    eyebrow: "Let’s talk",
    title: "How can we help?",
    intro: "Tell us what you need: we’ll reply on WhatsApp, usually the same day. No obligation.",
    heading: "I’m interested in…",
    options: [
      { label: "The agency partnership programme", value: "the agency partnership programme" },
      {
        label: "A quick income estimate for a property for sale",
        value: "a quick income estimate for a property for sale",
      },
      {
        label: "Receiving your owners who want to sell",
        value: "receiving your owners who want to sell",
      },
      { label: "Introducing an owner to you", value: "introducing an owner to you" },
    ],
    nameLabel: "Name",
    agencyLabel: "Agency",
    messageLabel: "Message (optional)",
    submit: "Send via WhatsApp",
    fine: "WhatsApp will open with your message ready to send. No data is stored on this page.",
    greeting: (name, agency) =>
      `Hello, this is ${name || "[name]"}${agency ? ` from ${agency}` : ""}.`,
    interestedIn: "I am interested in:",
  },
  faq: {
    eyebrow: "Frequently asked questions",
    title: "What agencies ask us",
    items: [
      {
        question: "Can I refer a property that is already rented out?",
        answer:
          "Yes. If the owner already rents it out themselves or through another company, we review their results and explain how we can improve them.",
      },
      {
        question: "What if the owner leaves later?",
        answer:
          "Your commission is yours to keep: it is not refunded, even if the owner ends the contract.",
      },
      {
        question: "Does the property need a tourist licence?",
        answer:
          "Yes, a holiday rental licence (VFT). If the owner doesn’t have one yet, we help with the application.",
      },
      {
        question: "Which areas do you cover?",
        answer: "Torremolinos, Benalmádena, Fuengirola and Málaga.",
      },
    ],
  },
  final: {
    title: "Let’s look after your clients, together",
    lead: "If you’re looking for a partner who shares your standards of care, professionalism and follow-up, we’d be delighted to meet you.",
    cta: "Let’s talk",
    programmeLink: "Get the full partner programme",
    programmeMessage: "Hello, I'd like to receive your agency partner programme.",
    emailSubject: "Real estate agency partnership",
  },
  talkMessage: "Hello, I'd like to talk about a partnership.",
  stickyLabel: "Message us on WhatsApp",
  phoneOrder: ["en", "es", "fr"],
  languageNames: { fr: "Français", es: "Español", en: "English" },
};

export const PARTNER_CONTENT: Record<PartnerLang, PartnerContent> = { fr, es, en };

// The client's address for this page, from their brief.
export const PARTNER_ADDRESS = "Av. Isabel Manoja, 6 · 29620 Torremolinos";
