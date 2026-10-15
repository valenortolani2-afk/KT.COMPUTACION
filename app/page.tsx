import Image from "next/image";

const NAV_LINKS = ["Tendencias", "Novedades", "Restaurados", "Configurador"];

const PRODUCTS = [
  {
    tag: "NUEVO",
    name: "MSI Trident 3",
    desc: "La definitiva PC gamer de nueva generación",
    price: "$1490",
  },
  {
    tag: "RESTAURADO",
    name: "MSI Trident 3",
    desc: "La definitiva PC gamer de nueva generación",
    price: "$1490",
  },
  {
    tag: "NUEVO",
    name: "MSI Trident 3",
    desc: "La definitiva PC gamer de nueva generación",
    price: "$1490",
  },
];

const MARQUEE_ITEMS = [
  "RTX 5080",
  "RYZEN 9",
  "ENVÍO GRATIS",
  "GARANTÍA 2 AÑOS",
  "SOPORTE 24/7",
  "ARMADO A MEDIDA",
];

const HERO_GALLERY = ["/pcgamer1.jpg", "/pcgamer2.jpg", "/pcgamer3.jpg", "/pcgamer4.jpg"];

function IconSearch(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

function IconCart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path d="M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L20 8H6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9.5" cy="20.5" r="1.5" />
      <circle cx="17.5" cy="20.5" r="1.5" />
    </svg>
  );
}

function IconUser(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.8-4 5-6 8-6s6.2 2 8 6" strokeLinecap="round" />
    </svg>
  );
}

function IconArrow(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconChevron(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconBolt(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13 2 3 14h7l-1 8 11-14h-7z" />
    </svg>
  );
}

// Silueta decorativa de una torre gamer usada como placeholder de producto.
function PCGlyph({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#1b1330] via-[#120f1c] to-black ${className}`}>
      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-violet-600/30 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-fuchsia-600/20 blur-3xl" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative flex h-28 w-20 flex-col items-center justify-around rounded-lg border border-white/15 bg-black/60 p-2 shadow-[0_0_30px_rgba(139,92,246,0.35)]">
          <span className="h-6 w-6 rounded-full border-2 border-violet-400/70 shadow-[0_0_12px_rgba(167,139,250,0.9)]" />
          <span className="h-6 w-6 rounded-full border-2 border-fuchsia-400/70 shadow-[0_0_12px_rgba(232,121,249,0.9)]" />
          <span className="h-1.5 w-10 rounded-full bg-violet-500/70 shadow-[0_0_10px_rgba(167,139,250,0.8)]" />
        </div>
      </div>
    </div>
  );
}

// Barra angosta en movimiento, del mismo ancho que el carrusel, con el aviso de ofertas en azul relámpago.
function OffersBar({ className = "" }: { className?: string }) {
  const items = ["OFERTAS", "OFERTAS", "OFERTAS", "OFERTAS"];
  const doubled = [...items, ...items];
  return (
    <div className={`overflow-hidden rounded-full border border-sky-500/30 bg-black ${className}`}>
      <div className="flex w-max animate-marquee items-center gap-8 px-4 py-2">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-2 whitespace-nowrap text-sm font-extrabold tracking-[0.2em] text-sky-300 [text-shadow:0_0_10px_#38bdf8,0_0_22px_#0ea5e9,0_0_40px_#0284c7]"
          >
            <IconBolt className="h-4 w-4 text-sky-400 drop-shadow-[0_0_6px_rgba(56,189,248,0.9)]" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// Serie de fotos reales del taller que se van desvaneciendo una tras otra en loop.
function HeroCarousel({ className = "" }: { className?: string }) {
  const cycle = HERO_GALLERY.length * 4;
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(139,92,246,0.25)] ${className}`}>
      {HERO_GALLERY.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt="Armado de PC gamer por KT Computación"
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="animate-hero-carousel object-cover"
          style={{ animationDuration: `${cycle}s`, animationDelay: `${-i * 4}s` }}
          priority={i === 0}
        />
      ))}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
    </div>
  );
}

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6">
        <a href="#" className="flex items-center gap-1 text-lg font-semibold tracking-tight text-white">
          Nexus<span className="text-violet-400">PC</span>
        </a>

        <nav className="hidden items-center gap-7 text-sm text-zinc-300 md:flex">
          {NAV_LINKS.map((link) => (
            <a key={link} href="#" className="flex items-center gap-1 transition-colors hover:text-white">
              {link}
              <IconChevron className="h-3.5 w-3.5 opacity-60" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-zinc-400 sm:flex">
            <IconSearch className="h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-40 bg-transparent outline-none placeholder:text-zinc-500"
            />
          </div>
          <button className="rounded-full border border-white/10 p-2 text-zinc-300 transition-colors hover:bg-white/10 hover:text-white sm:hidden">
            <IconSearch className="h-4 w-4" />
          </button>
          <button className="rounded-full border border-white/10 p-2 text-zinc-300 transition-colors hover:bg-white/10 hover:text-white">
            <IconCart className="h-4 w-4" />
          </button>
          <button className="rounded-full bg-violet-600 p-2 text-white transition-colors hover:bg-violet-500">
            <IconUser className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0b0812] md:min-h-[calc(100vh-4rem)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/3 h-96 w-96 rounded-full bg-violet-700/30 blur-[120px]" />
        <div className="absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-fuchsia-700/20 blur-[110px]" />
      </div>

      {/* logo de fondo: cubre la mitad izquierda de la sección, del tope hasta la barra en movimiento */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/2">
        <Image
          src="/logo.jpeg"
          alt=""
          fill
          sizes="50vw"
          className="object-contain opacity-25 mix-blend-screen"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0b0812]" />
      </div>

      <div className="relative grid w-full grid-cols-1 items-center gap-10 px-6 py-24 md:min-h-[calc(100vh-4rem)] md:grid-cols-2 md:py-0">
        <div className="relative flex flex-col items-center gap-6 text-center md:items-start md:text-left">
          <h1 className="max-w-lg text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            PCs que cambian el juego
          </h1>
          <p className="max-w-md text-lg text-zinc-400">
            Encuentra la configuración de tu computadora ideal
          </p>
          <a
            href="#trending"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/40 transition-transform hover:scale-105"
          >
            Comprar ahora
            <IconArrow className="h-4 w-4" />
          </a>
        </div>

        <div className="relative h-64 w-full md:absolute md:inset-y-0 md:right-0 md:h-auto md:w-1/2">
          <OffersBar className="absolute left-4 right-4 top-4 z-10" />
          <HeroCarousel className="h-full" />
        </div>
      </div>
    </section>
  );
}

function MarqueeBar() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="overflow-hidden border-y border-white/10 bg-black py-3">
      <div className="flex w-max animate-marquee gap-10">
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-3 whitespace-nowrap text-sm font-medium tracking-wide text-zinc-300"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function Trending() {
  return (
    <section id="trending" className="relative overflow-hidden bg-[#0b0812] px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-2xl font-semibold text-white sm:text-3xl">⚡OFERTAS RELAMPAGO⚡</h2>
        <p className="mt-2 text-zinc-400">Echa un vistazo a nuestras mejores configuraciones</p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((product, i) => (
            <div
              key={i}
              className="group rounded-2xl border border-white/10 bg-[#120f1c] p-4 transition-colors hover:border-violet-500/50"
            >
              <div className="relative">
                <PCGlyph className="h-44 w-full" />
                <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-violet-300">
                  {product.tag}
                </span>
              </div>
              <h3 className="mt-4 font-semibold text-white">{product.name}</h3>
              <p className="mt-1 text-sm text-zinc-400">{product.desc}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-bold text-white">{product.price}</span>
                <a
                  href="#"
                  className="flex items-center gap-1 text-sm font-medium text-violet-400 transition-colors group-hover:text-violet-300"
                >
                  Ver más
                  <IconArrow className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Spotlight() {
  return (
    <section className="bg-[#0b0812] px-6 py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 rounded-3xl border border-white/10 bg-[#120f1c] p-6 md:grid-cols-2 md:p-10">
        <PCGlyph className="h-72 w-full order-2 md:order-1" />

        <div className="order-1 flex flex-col gap-4 md:order-2">
          <span className="w-fit rounded-full bg-violet-600/20 px-3 py-1 text-xs font-semibold tracking-wide text-violet-300">
            DESTACADO
          </span>
          <h3 className="text-2xl font-bold text-white sm:text-3xl">Advanced PC 3015</h3>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li>AMD Ryzen 5 8400F</li>
            <li>ASUS PRIME B840M-A WiFi</li>
            <li>1000 GB SSD, M.2 PCIe</li>
            <li>GeForce RTX 5060 Ti, 16GB GDDR7</li>
            <li>32 GB DDR5-RAM, 6000 MHz</li>
          </ul>
          <div className="mt-2 flex items-center gap-4">
            <span className="text-2xl font-bold text-white">999,- €</span>
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105"
            >
              Más detalles
              <IconArrow className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black px-6 py-8 text-center text-sm text-zinc-500">
      © {new Date().getFullYear()} NexusPC — Todos los derechos reservados
    </footer>
  );
}

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-[#0b0812] font-sans">
      <Navbar />
      <Hero />
      <MarqueeBar />
      <Trending />
      <Spotlight />
      <MarqueeBar />
      <Footer />
    </div>
  );
}
