import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { cn } from "@/utils/cn";

type MenuItem = {
  title: string;
  description: string;
  price: string;
  image: string;
  accent: string;
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mql.matches);
    onChange();
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

function useLenis() {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({
      duration: 1.0,
      smoothWheel: true,
      syncTouch: true,
      gestureOrientation: "vertical",
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [reduced]);
}

function Preloader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 1200;
    let raf = 0;

    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const value = Math.round(eased * 100);
      setProgress(value);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(onDone, 250);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <motion.div className="fixed inset-0 z-[100] bg-[#07070a]">
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-sm tracking-[0.35em] text-white/55">L U M I N A</div>
          <div className="mt-4 font-semibold tabular-nums text-white text-6xl md:text-7xl">
            {progress}%
          </div>
        </div>
      </div>

      {/* Curtain */}
      <motion.div
        className="absolute inset-0 origin-top bg-gradient-to-b from-white/[0.07] to-white/[0.02]"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: progress >= 100 ? 0 : 1 }}
        transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(1200px_circle_at_60%_40%,rgba(255,255,255,0.10),transparent_55%)]" />
    </motion.div>
  );
}

function CustomCursor() {
  const reduced = usePrefersReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const scale = useMotionValue(1);

  const sx = useSpring(x, { stiffness: 900, damping: 50, mass: 0.2 });
  const sy = useSpring(y, { stiffness: 900, damping: 50, mass: 0.2 });
  const sScale = useSpring(scale, { stiffness: 900, damping: 50, mass: 0.2 });

  useEffect(() => {
    if (reduced) return;

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const onOver = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const clickable = target.closest(
        "a, button, [role='button'], input, select, textarea, [data-cursor='hover']"
      );
      if (clickable) scale.set(2.2);
    };

    const onOut = () => scale.set(1);

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });

    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
    };
  }, [reduced, x, y, scale]);

  if (reduced) return null;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[90] mix-blend-difference"
      style={{ x: sx, y: sy }}
      aria-hidden="true"
    >
      <motion.div
        className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70 bg-white/10"
        style={{ width: 18, height: 18, scale: sScale }}
      />
    </motion.div>
  );
}

function Grain() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1] opacity-[0.12]"
      style={{
        backgroundImage:
          "url(data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E)",
      }}
    />
  );
}

function Marquee({ text }: { text: string }) {
  return (
    <div className="relative py-10 md:py-14 overflow-hidden border-y border-white/10">
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(800px_circle_at_50%_50%,rgba(255,255,255,0.08),transparent_60%)]" />
      <div className="flex gap-12 whitespace-nowrap will-change-transform">
        <motion.div
          className="flex gap-12 whitespace-nowrap"
          animate={{ x: [0, -1200] }}
          transition={{ duration: 18, ease: "linear", repeat: Infinity }}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="text-white/70 tracking-[0.25em] text-sm md:text-base">
              {text}
            </div>
          ))}
        </motion.div>
        <motion.div
          className="flex gap-12 whitespace-nowrap"
          animate={{ x: [0, -1200] }}
          transition={{ duration: 18, ease: "linear", repeat: Infinity }}
          aria-hidden="true"
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="text-white/70 tracking-[0.25em] text-sm md:text-base">
              {text}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function MenuSection({ items }: { items: MenuItem[] }) {
  const [hovered, setHovered] = useState<MenuItem | null>(null);
  const previewX = useMotionValue(-200);
  const previewY = useMotionValue(-200);
  const px = useSpring(previewX, { stiffness: 900, damping: 55, mass: 0.25 });
  const py = useSpring(previewY, { stiffness: 900, damping: 55, mass: 0.25 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      previewX.set(e.clientX + 24);
      previewY.set(e.clientY + 24);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [previewX, previewY]);

  return (
    <section id="menu" className="relative z-[2] px-5 md:px-10 lg:px-16 py-24 md:py-32">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between gap-8">
          <div>
            <div className="text-sm tracking-[0.35em] text-white/55">SIGNATURE MENU</div>
            <h2 className="mt-4 text-5xl md:text-7xl font-semibold tracking-tight text-white">
              Modern fusion, engineered.
            </h2>
          </div>
          <div className="hidden md:block text-white/55 max-w-sm text-base leading-relaxed">
            A seasonal tasting of contrast: heat + ice, smoke + citrus, umami + silence.
          </div>
        </div>

        <div className="mt-14 md:mt-18 grid gap-10">
          {items.map((it, idx) => (
            <MenuRow
              key={it.title}
              item={it}
              index={idx}
              onHover={(v) => setHovered(v)}
              onLeave={() => setHovered(null)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {hovered && (
          <motion.div
            className="pointer-events-none fixed z-[80]"
            style={{ x: px, y: py }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden="true"
          >
            <div className="w-[220px] h-[280px] rounded-2xl overflow-hidden border border-white/15 bg-white/5 backdrop-blur-xl shadow-[0_40px_140px_rgba(0,0,0,0.75)]">
              <img src={hovered.image} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function MenuRow({
  item,
  index,
  onHover,
  onLeave,
}: {
  item: MenuItem;
  index: number;
  onHover: (item: MenuItem) => void;
  onLeave: () => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "end 25%"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], [36, -36]);
  const textY = useTransform(scrollYProgress, [0, 1], [14, -14]);

  return (
    <motion.div
      ref={ref}
      className="group relative grid md:grid-cols-[1.05fr_.95fr] gap-7 md:gap-10 items-center"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      onPointerEnter={() => onHover(item)}
      onPointerLeave={onLeave}
      data-cursor="hover"
    >
      <motion.div style={{ y: textY }} className="min-w-0">
        <div className="flex items-baseline justify-between gap-6">
          <h3 className="text-3xl md:text-4xl font-medium tracking-tight text-white truncate">
            {item.title}
          </h3>
          <div className="text-white/70 tracking-[0.25em] text-sm md:text-base whitespace-nowrap">
            {item.price}
          </div>
        </div>
        <p className="mt-3 text-white/60 leading-relaxed max-w-xl text-base">
          {item.description}
        </p>
        <div className="mt-5 flex items-center gap-3">
          <div className="h-px w-10 bg-white/25" />
          <div className="text-sm tracking-[0.35em] text-white/55">{`COURSE ${String(index + 1).padStart(2, "0")}`}</div>
        </div>
      </motion.div>

      <motion.div
        style={{ y: imgY }}
        className="relative h-[240px] md:h-[300px] rounded-2xl overflow-hidden border border-white/10 bg-white/[0.04]"
      >
        <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/0" />
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <div className="text-white/80 text-sm tracking-[0.35em]">LUMINA</div>
          <div className="h-2.5 w-2.5 rounded-full" style={{ background: item.accent }} />
        </div>
      </motion.div>

      <div className="pointer-events-none absolute -inset-x-2 -inset-y-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 rounded-[28px] bg-gradient-to-r from-white/[0.05] via-white/[0.02] to-transparent" />
      </div>
    </motion.div>
  );
}

function ReservationButton() {
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const rotate = useTransform(scrollY, [0, 1400], [0, 180]);

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-[70] h-16 w-16 md:h-20 md:w-20 rounded-full border border-white/20 bg-white/5 backdrop-blur-xl shadow-[0_30px_120px_rgba(0,0,0,0.65)] grid place-items-center"
        style={{ rotate }}
        data-cursor="hover"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="reservation-modal"
      >
        <div className="absolute inset-0 rounded-full [background:radial-gradient(closest-side,rgba(255,255,255,0.16),transparent_70%)]" />
<span className="text-[10px] md:text-xs tracking-[0.2em] text-white/80">RESERVE</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[95]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            id="reservation-modal"
          >
            <div
              className="absolute inset-0 bg-black/70"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            <motion.div
              className="absolute bottom-6 right-6 left-6 md:left-auto md:w-[520px] rounded-3xl border border-white/15 bg-[#0b0b10]/85 backdrop-blur-2xl shadow-[0_60px_220px_rgba(0,0,0,0.8)] overflow-hidden"
              initial={{ y: 30, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 25, scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="p-6 md:p-8">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <div className="text-sm tracking-[0.35em] text-white/55">RESERVATION</div>
                    <h3 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-white">
                      Table for the night.
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="h-10 w-10 rounded-full border border-white/15 bg-white/5 grid place-items-center text-white/80"
                    data-cursor="hover"
                    aria-label="Close reservation form"
                  >
                    <span className="text-xl leading-none">×</span>
                  </button>
                </div>

                <form
                  className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setOpen(false);
                  }}
                >
                  <Field label="Name" placeholder="Aiko Tan" autoComplete="name" />
                  <Field label="Email" placeholder="aiko@domain.com" type="email" autoComplete="email" />
                  <Field label="Guests" placeholder="2" type="number" min={1} max={12} />
                  <Field label="Time" placeholder="19:30" type="time" />
                  <div className="md:col-span-2">
                    <label className="text-sm tracking-[0.25em] text-white/55">Notes</label>
                    <textarea
                      className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white/85 placeholder:text-white/25 outline-none focus:border-white/30 focus:ring-4 focus:ring-white/10 transition"
                      rows={3}
                      placeholder="Allergies, celebrations, preferences"
                    />
                  </div>
                  <div className="md:col-span-2 flex items-center justify-between pt-2">
                    <div className="text-sm text-white/45 leading-relaxed">
                      By submitting, you agree to our reservation policy.
                    </div>
                    <button
                      type="submit"
                      className="rounded-full px-5 py-3 border border-white/15 bg-white text-black text-sm tracking-[0.25em] hover:bg-white/90 transition"
                      data-cursor="hover"
                    >
                      CONFIRM
                    </button>
                  </div>
                </form>
              </div>
              <div className="h-px bg-white/10" />
              <div className="p-5 md:p-6 flex items-center justify-between text-sm tracking-[0.25em] text-white/55">
                <div>KYOTO · NYC · PARIS</div>
                <a href="#menu" className="text-white/70 hover:text-white transition" data-cursor="hover">
                  VIEW MENU
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-sm tracking-[0.25em] text-white/55">{label}</label>
      <input
        {...props}
        className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white/85 placeholder:text-white/25 outline-none focus:border-white/30 focus:ring-4 focus:ring-white/10 transition"
      />
    </div>
  );
}

function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    ["inset(0% 0% 0% 0%)", "inset(15% 5% 20% 5% round 24px)"]
  );
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const filter = useTransform(scrollYProgress, [0, 1], ["brightness(0.6) blur(0px)", "brightness(0.2) blur(10px)"]);

  const leftX = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]);
  const rightX = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={containerRef} className="relative h-[150vh] w-full">
      <motion.div style={{ clipPath }} className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-[#07070a]">
        <motion.video
          style={{ scale, filter }}
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src="/Food_Video_Generation_From_Descriptions.mp4"
        />

        {/* Text Container */}
        <div className="relative z-10 w-full flex flex-col items-center justify-center pointer-events-none">
          <div className="text-sm tracking-[0.35em] text-white/55 mb-6 text-center">MODERN FUSION · OMAKASE</div>
          
          <motion.div style={{ opacity: textOpacity }} className="flex gap-4 md:gap-8 overflow-hidden mix-blend-difference">
            {/* Left Word */}
            <motion.div style={{ x: leftX }} className="flex">
              {"TASTE".split("").map((char, i) => (
                <motion.span
                  key={`left-${i}`}
                  custom={i}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 1.5 + i * 0.05, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="font-display text-[clamp(5rem,12vw,14rem)] uppercase leading-none text-white tracking-tighter whitespace-pre"
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>

            {/* Right Words */}
            <motion.div style={{ x: rightX }} className="flex">
              {"THE VOID".split("").map((char, i) => (
                <motion.span
                  key={`right-${i}`}
                  custom={i + 5}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 1.5 + (i + 5) * 0.05, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="font-display text-[clamp(5rem,12vw,14rem)] uppercase leading-none text-white tracking-tighter whitespace-pre"
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          <p className="mt-8 text-white/65 max-w-xl leading-relaxed text-center px-6 text-base md:text-lg mix-blend-difference">
            Where fire meets ice. Lumina is a high-end modern fusion experience—minimalist luxury, maximal flavor.
          </p>
        </div>

        {/* Header Overlay */}
        <header className="absolute top-0 inset-x-0 z-20 px-5 md:px-10 lg:px-16 pt-8 flex items-center justify-between pointer-events-auto">
          <a href="#" className="text-white/85 tracking-[0.35em] text-sm" data-cursor="hover">LUMINA</a>
          <nav className="hidden md:flex items-center gap-8 text-sm tracking-[0.35em] text-white/55">
            <a href="#menu" className="hover:text-white/85 transition" data-cursor="hover">MENU</a>
            <a href="#story" className="hover:text-white/85 transition" data-cursor="hover">STORY</a>
            <a href="#hours" className="hover:text-white/85 transition" data-cursor="hover">HOURS</a>
          </nav>
          <a href="#menu" className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm tracking-[0.25em] text-white/80 hover:bg-white/10 transition" data-cursor="hover">
            EXPLORE
          </a>
        </header>

        {/* Scroll Indicator */}
{/* Scroll Indicator */}
<div className="absolute bottom-8 inset-x-0 z-20 px-5 md:px-10 lg:px-16 flex items-end justify-between gap-6 text-sm tracking-[0.25em] text-white/55 pointer-events-auto">
  <div className="hidden md:block">KYOTO / NEW YORK / PARIS</div>
</div>
      </motion.div>
    </section>
  );
}

function Story() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 25%"] });
  const y = useTransform(scrollYProgress, [0, 1], [28, -18]);
  return (
    <section id="story" className="relative z-[2] px-5 md:px-10 lg:px-16 py-24 md:py-32">
      <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-10 items-start" ref={ref}>
        <div className="md:col-span-5">
          <div className="text-sm tracking-[0.35em] text-white/55">THE PHILOSOPHY</div>
          <h2 className="mt-4 text-5xl md:text-6xl font-semibold tracking-tight text-white">
            Negative space, positive flavor.
          </h2>
        </div>
        <motion.div style={{ y }} className="md:col-span-7 text-white/65 leading-relaxed text-base">
          <p>
            Lumina is built on restraint. Each plate is a study in balance—quiet textures, precise heat, and a finishing
            brightness that lingers like a neon afterimage.
          </p>
          <p className="mt-6">
            Expect large typography, minimal gestures, and high-fidelity ingredients: yuzu, koji, smoked dashi, black
            garlic, and desert salt.
          </p>

          <div id="hours" className="mt-10 grid grid-cols-2 gap-6">
            <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
              <div className="text-sm tracking-[0.25em] text-white/55">HOURS</div>
              <div className="mt-3 text-white/80 text-base leading-relaxed">
                Tue–Sun · 17:30 → 23:30
                <br />
                Omakase seating 19:00 & 21:15
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
              <div className="text-sm tracking-[0.25em] text-white/55">ADDRESS</div>
              <div className="mt-3 text-white/80 text-base leading-relaxed">
                11 Mercer St
                <br />
                Lower Manhattan
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative z-[2] px-5 md:px-10 lg:px-16 py-16 border-t border-white/10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div>
          <div className="text-white/85 tracking-[0.35em] text-sm">LUMINA</div>
          <div className="mt-3 text-white/55 text-base max-w-md leading-relaxed">
            Modern fusion tasting room. Minimalist luxury. Maximum contrast.
          </div>
        </div>
        <div className="flex items-center gap-8 text-sm tracking-[0.35em] text-white/55">
          <a href="#menu" className="hover:text-white/85 transition" data-cursor="hover">
            MENU
          </a>
          <a href="#story" className="hover:text-white/85 transition" data-cursor="hover">
            STORY
          </a>
          <a href="#" className="hover:text-white/85 transition" data-cursor="hover">
            INSTAGRAM
          </a>
        </div>
      </div>
    </footer>
  );
}

export function App() {
  useLenis();

  const [ready, setReady] = useState(false);

  const items: MenuItem[] = [
    {
      title: "Yuzu-Charred Toro",
      description: "Bluefin belly · yuzu kosho · smoked dashi · citrus ash",
      price: "$38",
      image: "https://www.theyuzu.co/cdn/shop/articles/Otoro-Sashimi-yuzuco-kosho_44742a7c-8743-451e-a0e7-00b526ee7d7f.jpg?auto=format&fit=crop&w=1200&q=80",
      accent: "#f6e05e",
    },
    {
      title: "Koji Butter Lobster",
      description: "Basted tail · miso beurre blanc · shiso oil · sea-salt snow",
      price: "$52",
      image: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1200&q=80",
      accent: "#63b3ed",
    },
    {
      title: "Black Garlic Wagyu",
      description: "A5 strip · black garlic lacquer · roasted bone broth · charred scallion",
      price: "$74",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
      accent: "#f56565",
    },
    {
      title: "Ice-Glass Mochi",
      description: "Sake gel · vanilla smoke · salt caramel · cold flame",
      price: "$18",
      image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1200&q=80",
      accent: "#9f7aea",
    },
  ];

  return (
    <div className="min-h-screen bg-[#07070a] text-white">
      <CustomCursor />
      <Grain />

      <AnimatePresence>{!ready && <Preloader onDone={() => setReady(true)} />}</AnimatePresence>

      {/* Page */}
      <main className={cn("relative", !ready && "pointer-events-none select-none")}
      >
        <Hero />
        <Marquee text="YUZU · KOJI · SMOKED DASHI · BLACK GARLIC · SHISO · DESERT SALT" />
        <MenuSection items={items} />
        <Story />
        <Footer />
      </main>

      <ReservationButton />
    </div>
  );
}