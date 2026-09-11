import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Home as HomeIcon,
  MapPinned,
  MessageCircleHeart,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Waves,
} from "lucide-react";
import Hero from "@/components/Hero";
import SectionCarousel from "@/components/SectionCarousel";
import FeaturedPropertyTile from "@/components/FeaturedPropertyTile";
import FaqAccordion from "@/components/FaqAccordion";
import TestimonialCard from "@/components/TestimonialCard";
import CtaSection from "@/components/CtaSection";
import Reveal from "@/components/Reveal";
import { RevealGroup, RevealItem } from "@/components/RevealGroup";
import { properties } from "@/lib/mock-properties";

// Distinct from HERO_IMAGES in Hero.tsx — avoids showing the same photo
// twice within one scroll (hero → welcome/concierge galleries).
const WELCOME_GALLERY = [
  "https://l.icdbcdn.com/oh/dfe84343-3455-4701-9427-6b851543df94.jpg?w=1000",
  "https://l.icdbcdn.com/oh/6d5ef51b-6006-4629-a86a-48764eae5a98.jpg?w=1000",
  "https://l.icdbcdn.com/oh/be7071d6-e4c2-40da-9281-2c016a5e637a.jpg?w=1000",
  "https://l.icdbcdn.com/oh/6e87286f-ea0d-48eb-b6aa-a063a2e4ba80.jpg?w=1000",
  "https://l.icdbcdn.com/oh/a36c8a77-8374-4ca1-b3a2-ce5c7c79fd8a.jpg?w=1000",
].map((src, i) => ({ src, alt: `Andalusian apartment interior ${i + 1}` }));

const CONCIERGE_GALLERY = [
  "https://l.icdbcdn.com/oh/40a54a52-4a66-46ef-bf3a-65964d467085.jpg?w=1000",
  "https://l.icdbcdn.com/oh/ff035e6f-0838-4365-9bd1-4f2fb9a34531.jpg?w=1000",
  "https://l.icdbcdn.com/oh/d2bb4f17-d588-4a37-aa68-4bd4c9bde6a3.jpg?w=1000",
].map((src, i) => ({ src, alt: `Concierge-managed apartment ${i + 1}` }));

const AMENITIES = [
  {
    icon: Waves,
    title: "Steps from the beach",
    text: "Most homes sit minutes from Torremolinos' golden sand and beachfront promenade.",
  },
  {
    icon: ShieldCheck,
    title: "Carefully vetted stays",
    text: "Every apartment is personally inspected and maintained to our comfort standard.",
  },
  {
    icon: Sparkles,
    title: "Spotless & well-equipped",
    text: "Fresh linens, full kitchens and thoughtful touches waiting on arrival.",
  },
  {
    icon: Sun,
    title: "Local, Andalusian soul",
    text: "Curated recommendations for gastronomy, culture and hidden corners of the coast.",
  },
];

// Bento layout for the 6 featured tiles: a 4-col x 3-row grid where a big
// 2x2 hero tile, a wide 2x1 tile, two 1x1 tiles and two more wide tiles
// tile perfectly with no gaps.
const BENTO_SPANS = [
  "lg:col-span-2 lg:row-span-2",
  "lg:col-span-2 lg:row-span-1",
  "lg:col-span-1 lg:row-span-1",
  "lg:col-span-1 lg:row-span-1",
  "lg:col-span-2 lg:row-span-1",
  "lg:col-span-2 lg:row-span-1",
];
const BENTO_SIZES: Array<"lg" | "md" | "sm"> = [
  "lg",
  "md",
  "sm",
  "sm",
  "md",
  "md",
];

const PROMISES = [
  { icon: MessageCircleHeart, title: "Always reachable" },
  { icon: MapPinned, title: "Local expertise" },
  { icon: ShieldCheck, title: "Peace of mind" },
];

const TESTIMONIALS = [
  {
    quote:
      "Our balcony overlooked the sea and the concierge team had everything ready before we even landed. Best stay we've had on the Costa del Sol.",
    name: "Sophie & Mark",
    detail: "Stayed in Santa Clara",
  },
  {
    quote:
      "Spotless apartment, fast WiFi, and the local restaurant recommendations were spot on. We'll be back every summer.",
    name: "Familie Weber",
    detail: "Stayed in La Nogalera",
  },
  {
    quote:
      "From check-in to check-out, everything was effortless. It felt like having a friend in Torremolinos.",
    name: "Elena R.",
    detail: "Stayed in City Centre",
  },
];

export default function Home() {
  const featured = properties.slice(0, 6);

  return (
    <div>
      <Hero />

      {/* Welcome */}
      <section className="relative overflow-hidden py-20">
        <div
          aria-hidden
          className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-cyan-200/30 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <p className="text-sm font-semibold tracking-[0.2em] text-cyan-600 uppercase">
                Welcome
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-ink-800 sm:text-4xl">
                Welcome to Andalusia!
              </h2>
              <div className="mt-5 space-y-4 text-ink-500">
                <p>
                  Welcome to Andalusia and to our charming apartments,
                  carefully managed by La Conciergerie del Sol.
                </p>
                <p>
                  Immerse yourself in the essence of Andalusian living by
                  staying in one of our magnificent properties, located in
                  the heart of this vibrant seaside town. Whether
                  you&apos;re looking for a seaside getaway, a cultural
                  stay, or a total immersion in local gastronomy, our
                  dedicated team is here to make your experience
                  unforgettable.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {[
                  { icon: HomeIcon, label: "26 Apartments" },
                  { icon: MapPinned, label: "4 Neighborhoods" },
                  { icon: Star, label: "5★ Hospitality" },
                ].map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-ink-600 shadow-card"
                  >
                    <Icon size={14} className="text-amber-500" />
                    {label}
                  </span>
                ))}
              </div>

              <Link
                href="/properties"
                className="mt-7 inline-flex items-center gap-2 font-semibold text-amber-600 hover:text-amber-500"
              >
                Discover our properties <ArrowRight size={16} />
              </Link>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="relative mx-auto max-w-md pb-10 pl-0 sm:pb-14 lg:mx-0 lg:max-w-none lg:pl-10">
                <SectionCarousel
                  images={WELCOME_GALLERY}
                  rounded="rounded-tl-[3rem] rounded-tr-2xl rounded-br-[3rem] rounded-bl-2xl"
                  className="relative z-10"
                />

                <div className="absolute -bottom-8 left-0 z-20 hidden h-36 w-28 overflow-hidden rounded-tr-[2.5rem] rounded-bl-[2.5rem] rounded-tl-lg rounded-br-lg border-4 border-sand-50 shadow-soft sm:block lg:h-44 lg:w-36">
                  <Image
                    src="https://l.icdbcdn.com/oh/1c5ad309-2c66-4f5f-8a19-d0c21aea5180.jpg?w=400"
                    alt="Sea-view pool terrace in Torremolinos"
                    fill
                    sizes="180px"
                    className="object-cover"
                  />
                </div>

                <div className="absolute right-3 bottom-3 z-30 flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-soft backdrop-blur sm:right-auto sm:-bottom-6 sm:left-24 lg:left-32">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-600">
                    <HomeIcon size={16} />
                  </span>
                  <span className="leading-tight">
                    <span className="block font-display text-lg font-semibold text-ink-800">
                      26+
                    </span>
                    <span className="block text-[11px] text-ink-500">
                      Homes across Torremolinos
                    </span>
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Featured properties */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-cyan-600 uppercase">
                Handpicked
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-ink-800 sm:text-4xl">
                Featured stays
              </h2>
            </div>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 font-semibold text-amber-600 hover:text-amber-500"
            >
              View all properties <ArrowRight size={16} />
            </Link>
          </Reveal>

          <RevealGroup className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[220px]">
            {featured.map((property, i) => {
              const span = BENTO_SPANS[i] ?? "lg:col-span-1 lg:row-span-1";
              const size = BENTO_SIZES[i] ?? "sm";
              return (
                <RevealItem
                  key={property.slug}
                  className={`aspect-[4/3] sm:aspect-square lg:aspect-auto ${span}`}
                >
                  <FeaturedPropertyTile
                    property={property}
                    size={size}
                    className="h-full"
                  />
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      {/* Comfort & Convenience */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <div className="lg:order-2">
              <Reveal>
                <p className="text-sm font-semibold tracking-[0.2em] text-cyan-600 uppercase">
                  Why stay with us
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold text-ink-800 sm:text-4xl">
                  Comfort &amp; Convenience
                </h2>
                <p className="mt-4 text-ink-500">
                  Our apartments, carefully selected for their comfort and
                  privileged location, are designed to make you feel
                  instantly at home.
                </p>
              </Reveal>

              <RevealGroup className="mt-8 border-t border-ink-100">
                {AMENITIES.map(({ icon: Icon, title, text }) => (
                  <RevealItem
                    key={title}
                    className="group flex items-start gap-4 border-b border-ink-100 py-5"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-600 transition-colors duration-300 group-hover:bg-amber-400 group-hover:text-white">
                      <Icon size={20} />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-ink-800">
                        {title}
                      </h3>
                      <p className="mt-1 text-sm text-ink-500">{text}</p>
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>

            <Reveal className="lg:order-1">
              <div className="relative mx-auto max-w-md lg:mx-0 lg:max-w-none">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-tl-[3rem] rounded-tr-2xl rounded-br-[3rem] rounded-bl-2xl shadow-soft">
                  <Image
                    src="https://l.icdbcdn.com/oh/4493cf1f-30e2-4fac-9476-b8f12f8c860e.jpg?w=900"
                    alt="Comfortable, spa-style interior of a La Conciergerie Del Sol apartment"
                    fill
                    sizes="(max-width: 1024px) 100vw, 560px"
                    className="object-cover"
                  />
                </div>
                <div className="absolute right-4 -bottom-6 flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-soft sm:right-8">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cyan-100 text-cyan-600">
                    <ShieldCheck size={18} />
                  </span>
                  <span className="leading-tight">
                    <span className="block font-display text-base font-semibold text-ink-800">
                      Quality checked
                    </span>
                    <span className="block text-[11px] text-ink-500">
                      Every stay, every time
                    </span>
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Concierge Excellence */}
      <section className="relative overflow-hidden bg-ink-900 py-20">
        <div
          aria-hidden
          className="absolute top-0 -right-24 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <Reveal>
                <p className="text-sm font-semibold tracking-[0.2em] text-amber-300 uppercase">
                  Our promise
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold text-sand-50 sm:text-4xl">
                  Concierge Excellence
                </h2>
                <p className="mt-4 text-ink-200">
                  As your dedicated concierge, we strive to exceed your
                  expectations at every stage of your trip. From booking to
                  arrival, we&apos;re here to answer your questions, provide
                  local recommendations and ensure your stay goes off
                  without a hitch.
                </p>
              </Reveal>

              <RevealGroup className="mt-8 flex flex-wrap gap-3">
                {PROMISES.map(({ icon: Icon, title }) => (
                  <RevealItem
                    key={title}
                    className="group flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 py-2 pr-4 pl-2.5 transition-colors duration-300 hover:border-amber-400/40 hover:bg-white/10"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-amber-400/15 text-amber-300 transition-colors duration-300 group-hover:bg-amber-400 group-hover:text-ink-900">
                      <Icon size={15} />
                    </span>
                    <span className="text-sm font-medium text-sand-100">
                      {title}
                    </span>
                  </RevealItem>
                ))}
              </RevealGroup>

              <Reveal delay={0.2}>
                <Link
                  href="/contact"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-ink-900 transition-colors hover:bg-amber-300"
                >
                  Talk to our concierge team
                </Link>
              </Reveal>
            </div>

            <Reveal>
              <div className="relative mx-auto max-w-md lg:mx-0 lg:max-w-none">
                <SectionCarousel
                  images={CONCIERGE_GALLERY}
                  rounded="rounded-tl-2xl rounded-tr-[3rem] rounded-br-2xl rounded-bl-[3rem]"
                />
                <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-soft sm:-bottom-6 sm:left-8">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-600">
                    <Star size={18} />
                  </span>
                  <span className="leading-tight">
                    <span className="block font-display text-base font-semibold text-ink-800">
                      5★ Hospitality
                    </span>
                    <span className="block text-[11px] text-ink-500">
                      Rated by our guests
                    </span>
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold tracking-[0.2em] text-cyan-600 uppercase">
              Guest stories
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink-800 sm:text-4xl">
              Loved by our guests
            </h2>
          </Reveal>

          <RevealGroup className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {TESTIMONIALS.map(({ quote, name, detail }) => (
              <RevealItem key={name}>
                <TestimonialCard quote={quote} name={name} detail={detail} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24 py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Reveal className="text-center">
            <p className="text-sm font-semibold tracking-[0.2em] text-cyan-600 uppercase">
              Good to know
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink-800 sm:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-ink-500">
              Can&apos;t find what you&apos;re looking for? Our concierge
              team is always a message away.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-10">
            <FaqAccordion />
          </Reveal>
        </div>
      </section>

      <CtaSection />
    </div>
  );
}
