<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, ArrowUpRight, Clock } from "lucide-vue-next";
import IconGithub from "./components/IconGithub.vue";
import IconLinkedin from "./components/IconLinkedin.vue";

gsap.registerPlugin(ScrollTrigger);

// ── Cursor ─────────────────────────────────────────────────────────────────
const cursorDot = ref<HTMLElement | null>(null);
const cursorRing = ref<HTMLElement | null>(null);

// ── Lightbox ───────────────────────────────────────────────────────────────
const lightboxImg = ref<{ srcs: string[]; idx: number; title: string } | null>(null);

function openLightbox(srcs: string[], title: string) {
  lightboxImg.value = { srcs, idx: 0, title };
}
function closeLightbox() {
  lightboxImg.value = null;
}
function lightboxNext() {
  if (!lightboxImg.value) return;
  const { srcs, title, idx } = lightboxImg.value;
  lightboxImg.value = { srcs, title, idx: (idx + 1) % srcs.length };
}
function lightboxPrev() {
  if (!lightboxImg.value) return;
  const { srcs, title, idx } = lightboxImg.value;
  lightboxImg.value = { srcs, title, idx: (idx - 1 + srcs.length) % srcs.length };
}
function handleKey(e: KeyboardEvent) {
  if (e.key === "Escape") closeLightbox();
}

// ── GitHub Activity ────────────────────────────────────────────────────────
type Contribution = { date: string; count: number; level: number };
const allContributions = ref<Record<string, Contribution[]>>({});
const totals = ref<Record<string, number>>({});
const selectedYear = ref(new Date().getFullYear().toString());
const activityLoading = ref(true);

const availableYears = computed(() =>
  Object.keys(totals.value).sort((a, b) => Number(b) - Number(a))
);
const contributions = computed(() => allContributions.value[selectedYear.value] ?? []);
const weeks = computed(() => {
  const result: Contribution[][] = [];
  for (let i = 0; i < contributions.value.length; i += 7)
    result.push(contributions.value.slice(i, i + 7));
  return result;
});
const monthLabels = computed(() => {
  const labels: { label: string; col: number }[] = [];
  let lastMonth = "";
  contributions.value.forEach((d, i) => {
    const month = new Date(d.date).toLocaleString("en", { month: "short" });
    if (month !== lastMonth) {
      labels.push({ label: month, col: Math.floor(i / 7) });
      lastMonth = month;
    }
  });
  return labels;
});

function levelColor(level: number): string {
  return (
    ["bg-neutral-100", "bg-violet-100", "bg-violet-300", "bg-violet-500", "bg-violet-700"][
      level
    ] ?? "bg-neutral-100"
  );
}

// ── Marquee items ──────────────────────────────────────────────────────────
const marqueeItems = [
  "HTML5", "CSS3", "JavaScript", "TypeScript", "Vue.js", "Laravel", "PHP",
  "Node.js", "Express", "Prisma", "PostgreSQL", "MySQL", "Docker",
  "Linux", "Nginx", "Git", "WordPress", "Tailwind CSS", "Electron", "GitHub Actions",
];

// ── Data ───────────────────────────────────────────────────────────────────
const projects = [
  {
    title: "trackIT",
    desc: "Asset management and inventory tracking system built for internal operations.",
    tech: ["PHP", "Laravel", "MySQL"],
    url: "https://github.com/imkaiwhyask/trackIT",
  },
  {
    title: "phantix",
    desc: "Internal messaging desktop app for team communication.",
    tech: ["Electron", "PHP", "MySQL"],
    url: "https://github.com/imkaiwhyask/phantix",
  },
  {
    title: "CS2-Tags",
    desc: "Counter-Strike 2 server plugin for adding and managing custom player tags in-game.",
    tech: ["C#", "CS2", "CounterStrikeSharp"],
    url: "https://github.com/imkaiwhyask/CS2-Tags",
  },
  {
    title: "cs2-WeaponPaints",
    desc: "Custom weapon skin configuration plugin for Counter-Strike 2 servers.",
    tech: ["C#", "CS2", "CounterStrikeSharp"],
    url: "https://github.com/imkaiwhyask/cs2-WeaponPaints",
  },
  {
    title: "crest",
    desc: "Centralized digital workflow for customer master data requests — from submission and multi-level approval to SAP account creation.",
    tech: ["Laravel", "Blade", "Alpine.js", "Tailwind CSS"],
    url: "https://github.com/imkaiwhyask/crest",
  },
  {
    title: "helpIT",
    desc: "Full-stack IT helpdesk system — ticket management, SLA tracking, role-based access, self-service portal and knowledge base.",
    tech: ["Vue 3", "Pinia", "Node.js", "Express", "Prisma", "PostgreSQL", "Docker"],
    url: "https://github.com/imkaiwhyask/helpIT",
  },
];

const clientWork = [
  {
    title: "CREST",
    desc: "Centralized digital workflow for customer master data requests.",
    tech: ["Laravel", "Blade", "Alpine.js", "Tailwind CSS"],
    imgs: ["/work/portfolio_9.png", "/work/portfolio_9.1.png"],
  },
  {
    title: "trackIT",
    desc: "Asset management and inventory tracking system.",
    tech: ["PHP", "Laravel", "MySQL"],
    imgs: ["/work/portfolio_10.png", "/work/portfolio_10.1.png"],
  },
  {
    title: "SlashPlug",
    desc: "News and entertainment media website.",
    tech: ["WordPress", "Elementor"],
    imgs: ["/work/portfolio_1.jpg"],
  },
  {
    title: "Cross Country Immigration",
    desc: "Immigration consultancy and services website.",
    tech: ["PHP", "SCSS", "JavaScript"],
    imgs: ["/work/portfolio_2.jpg"],
  },
  {
    title: "Global Management",
    desc: "Corporate website for a creative solutions provider.",
    tech: ["PHP", "SCSS", "JavaScript"],
    imgs: ["/work/portfolio_3.jpg"],
  },
  {
    title: "ACB IT Solutions",
    desc: "Managed IT solutions and outsourcing company website.",
    tech: ["PHP", "SCSS", "JavaScript"],
    imgs: ["/work/portfolio_4.jpg"],
  },
  {
    title: "ifamous Technology",
    desc: "Technology company website with featured services showcase.",
    tech: ["PHP", "SCSS", "JavaScript"],
    imgs: ["/work/portfolio_5.jpg"],
  },
  {
    title: "Advance Technology H.K.",
    desc: "Web design and software development company, Hong Kong.",
    tech: ["Blade", "PHP", "CSS"],
    imgs: ["/work/portfolio_6.jpg"],
  },
  {
    title: "Orbweavers",
    desc: "Business solutions company website.",
    tech: ["WordPress", "Elementor"],
    imgs: ["/work/portfolio_7.jpg"],
  },
  {
    title: "helpIT × TPC Energy",
    desc: "Full-stack IT helpdesk and ticketing system for TPC Energy Corporation.",
    tech: ["Vue 3", "Node.js", "Prisma", "PostgreSQL", "Docker"],
    imgs: ["/work/portfolio_8.png", "/work/portfolio_8.1.png"],
  },
];

const stack = [
  {
    category: "Frontend",
    items: ["HTML5", "CSS3", "JavaScript", "Vue.js", "Bootstrap", "Blade", "ApexCharts"],
  },
  {
    category: "Backend / Apps",
    items: ["Laravel", "PHP", "Python", "MySQL", "Electron", "Dash"],
  },
  {
    category: "CMS / No-Code",
    items: ["WordPress", "Elementor", "WooCommerce", "Power Apps", "Power Automate"],
  },
  {
    category: "Infra & Systems",
    items: ["Linux", "Windows Server", "Active Directory", "Microsoft 365", "VMware", "FortiGate", "Wazuh", "Grafana"],
  },
  {
    category: "Containers & DevOps",
    items: ["Docker", "Nginx", "Git", "GitHub Actions", "GitLab CI"],
  },
];

// ── Cleanup store ──────────────────────────────────────────────────────────
const _cleanups: (() => void)[] = [];

// ── Lifecycle ──────────────────────────────────────────────────────────────
onMounted(async () => {
  window.addEventListener("keydown", handleKey);
  _cleanups.push(() => window.removeEventListener("keydown", handleKey));

  // ── Custom cursor ────────────────────────────────────────────────────────
  const hasHover = window.matchMedia("(hover: hover)").matches;
  if (hasHover && cursorDot.value && cursorRing.value) {
    gsap.set([cursorDot.value, cursorRing.value], { xPercent: -50, yPercent: -50, opacity: 0 });

    const xDot = gsap.quickTo(cursorDot.value, "x", { duration: 0.1, ease: "power3" });
    const yDot = gsap.quickTo(cursorDot.value, "y", { duration: 0.1, ease: "power3" });
    const xRing = gsap.quickTo(cursorRing.value, "x", { duration: 0.55, ease: "power3" });
    const yRing = gsap.quickTo(cursorRing.value, "y", { duration: 0.55, ease: "power3" });

    let visible = false;
    const onMove = (e: MouseEvent) => {
      xDot(e.clientX); yDot(e.clientY);
      xRing(e.clientX); yRing(e.clientY);
      if (!visible) {
        visible = true;
        gsap.to([cursorDot.value, cursorRing.value], { opacity: 1, duration: 0.4 });
      }
    };
    window.addEventListener("mousemove", onMove);
    _cleanups.push(() => window.removeEventListener("mousemove", onMove));

    const onEnter = () => {
      gsap.to(cursorDot.value, { scale: 0, duration: 0.25, ease: "power2.out" });
      gsap.to(cursorRing.value, { scale: 2, borderColor: "#7C3AED", opacity: 0.8, duration: 0.3, ease: "power2.out" });
    };
    const onLeave = () => {
      gsap.to(cursorDot.value, { scale: 1, duration: 0.25, ease: "power2.out" });
      gsap.to(cursorRing.value, { scale: 1, borderColor: "rgba(17,17,17,0.4)", opacity: 1, duration: 0.3, ease: "power2.out" });
    };
    const interactives = document.querySelectorAll("a, button");
    interactives.forEach(el => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });
    _cleanups.push(() =>
      interactives.forEach(el => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      })
    );
  }

  // ── Intro curtain sweep ──────────────────────────────────────────────────
  gsap.to(".intro-curtain", {
    y: "-100%",
    duration: 1.4,
    ease: "power4.inOut",
    delay: 0.1,
  });

  // ── Nav ──────────────────────────────────────────────────────────────────
  gsap.from(".nav-item", {
    y: -24, opacity: 0,
    duration: 0.6,
    stagger: 0.07,
    ease: "power3.out",
    delay: 0.65,
  });

  // ── Hero text mask reveal (overflow-hidden clips y-translated text) ───────
  gsap.from(".hero-line", {
    y: 90,
    duration: 1.1,
    stagger: 0.1,
    ease: "power4.out",
    delay: 0.75,
  });

  gsap.from(".hero-meta", {
    y: 20, opacity: 0,
    duration: 0.7,
    stagger: 0.1,
    ease: "power3.out",
    delay: 1.5,
  });

  // ── Marquee ──────────────────────────────────────────────────────────────
  requestAnimationFrame(() => {
    const inner = document.querySelector(".marquee-inner") as HTMLElement | null;
    if (inner) {
      gsap.to(".marquee-track", {
        x: -inner.offsetWidth,
        duration: 28,
        ease: "none",
        repeat: -1,
      });
    }
  });

  // ── Scroll reveal via IntersectionObserver (reliable, no ScrollTrigger) ──
  // gsap.from() + ScrollTrigger can silently miss triggers when elements are
  // far down the page or when the scroll container is ambiguous. IO is
  // browser-native and fires per-element with no configuration issues.
  const reveal = (
    selector: string,
    fromVars: gsap.TweenVars,
    stagger = 0,
    toExtra: gsap.TweenVars = {}
  ) => {
    const els = [...document.querySelectorAll<HTMLElement>(selector)];
    if (!els.length) return;
    gsap.set(els, fromVars);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        visible.forEach((entry, i) => {
          gsap.to(entry.target, {
            opacity: 1, x: 0, y: 0, scale: 1,
            duration: 0.75, ease: "power3.out",
            delay: i * stagger,
            ...toExtra,
          });
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );
    els.forEach(el => io.observe(el));
    _cleanups.push(() => io.disconnect());
  };

  // About
  reveal(".about-eyebrow", { opacity: 0, y: 20 });
  reveal(".about-title",   { opacity: 0, y: 60 }, 0, { duration: 1 });
  reveal(".about-body p",  { opacity: 0, y: 30 }, 0.15);

  // Stack
  reveal(".skills-eyebrow", { opacity: 0, y: 20 });
  reveal(".skill-group",    { opacity: 0, x: -30 }, 0.1);

  // Work
  reveal(".work-eyebrow", { opacity: 0, y: 20 });
  reveal(".work-title",   { opacity: 0, y: 30 });
  reveal(".work-gh",      { opacity: 0, y: 20 });
  reveal(".project-card", { opacity: 0, y: 50 }, 0.09);

  // Card lift on hover (GSAP — fine for interactions)
  document.querySelectorAll<HTMLElement>(".project-card").forEach(card => {
    card.addEventListener("mouseenter", () => gsap.to(card, { y: -6, duration: 0.3, ease: "power2.out" }));
    card.addEventListener("mouseleave", () => gsap.to(card, { y: 0,  duration: 0.4, ease: "power2.out" }));
  });

  // Shipped
  reveal(".shipped-eyebrow", { opacity: 0, y: 20 });
  reveal(".shipped-title",   { opacity: 0, y: 30 });
  reveal(".shipped-card",    { opacity: 0, y: 40 }, 0.07);

  // Activity
  reveal(".activity-header", { opacity: 0, y: 30 });

  // Contact — lines use mask reveal (y only, overflow-hidden parent clips them)
  // IO with threshold:0 fires as soon as 1px of the layout box is in view
  const contactLines = [...document.querySelectorAll<HTMLElement>(".contact-line")];
  if (contactLines.length) {
    gsap.set(contactLines, { y: 90 });
    const cio = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting);
      visible.forEach((entry, i) => {
        gsap.to(entry.target, { y: 0, duration: 1.1, delay: i * 0.12, ease: "power4.out" });
        cio.unobserve(entry.target);
      });
    }, { threshold: 0 });
    contactLines.forEach(el => cio.observe(el));
    _cleanups.push(() => cio.disconnect());
  }
  reveal(".contact-sub", { opacity: 0, y: 20 });
  reveal(".contact-btn", { opacity: 0, y: 20 }, 0.1);

  _cleanups.push(() => ScrollTrigger.getAll().forEach(t => t.kill()));

  // ── GitHub fetch ─────────────────────────────────────────────────────────
  try {
    const res = await fetch(
      "https://github-contributions-api.jogruber.de/v4/imkaiwhyask?y=all"
    );
    const data = await res.json();
    totals.value = data.total ?? {};
    const grouped: Record<string, Contribution[]> = {};
    for (const c of data.contributions as Contribution[]) {
      const year = c.date.slice(0, 4);
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push(c);
    }
    allContributions.value = grouped;
    selectedYear.value = new Date().getFullYear().toString();
    activityLoading.value = false;
    await nextTick();
    reveal(".activity-card", { opacity: 0, y: 30 });
  } catch {
    activityLoading.value = false;
  }
});

onUnmounted(() => {
  _cleanups.forEach(fn => fn());
  _cleanups.length = 0;
});
</script>

<template>
  <!-- Page intro curtain -->
  <div class="intro-curtain" />

  <!-- Custom cursor -->
  <div ref="cursorDot" class="cursor-dot" />
  <div ref="cursorRing" class="cursor-ring" />

  <div class="min-h-screen bg-cream text-[#111111]">

    <!-- ── Nav ────────────────────────────────────────────────────────────── -->
    <nav class="fixed inset-x-0 top-0 z-50 bg-cream/90 backdrop-blur-xl border-b border-neutral-200">
      <div class="max-w-7xl mx-auto px-6 md:px-12 h-16 flex justify-between items-center">
        <span class="nav-item font-mono text-sm font-medium text-[#111111]">kai.</span>
        <div class="flex items-center gap-1">
          <a href="#about"
            class="nav-item px-4 py-2 text-sm text-neutral-600 hover:text-[#111111] hover:bg-neutral-100 rounded-full transition-all duration-200">
            About
          </a>
          <a href="#work"
            class="nav-item px-4 py-2 text-sm text-neutral-600 hover:text-[#111111] hover:bg-neutral-100 rounded-full transition-all duration-200">
            Work
          </a>
          <a href="#contact"
            class="nav-item ml-2 px-5 py-2 bg-[#111111] text-white text-sm font-medium rounded-full hover:bg-neutral-800 transition-all duration-200">
            Let's talk →
          </a>
        </div>
      </div>
    </nav>

    <!-- ── Hero ───────────────────────────────────────────────────────────── -->
    <section class="relative min-h-dvh flex flex-col justify-end px-6 md:px-12 pt-24 pb-20 overflow-hidden">
      <!-- Violet glow blob -->
      <div class="absolute top-1/4 -right-32 w-[700px] h-[700px] rounded-full bg-violet-100/60 blur-[140px] pointer-events-none" />
      <div class="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-neutral-200/50 blur-[80px] pointer-events-none" />

      <div class="relative z-10 max-w-7xl mx-auto w-full">
        <!-- Eyebrow -->
        <div class="overflow-hidden mb-6">
          <p class="hero-line font-mono text-xs text-neutral-400 tracking-[0.2em] uppercase">
            01 — Hello, I'm Kai Angelo
          </p>
        </div>

        <!-- Display type -->
        <div class="mb-10 space-y-0">
          <div class="overflow-hidden">
            <h1 class="hero-line font-black leading-none tracking-tight text-[#111111]"
              style="font-size: clamp(58px, 11vw, 148px)">
              Full-stack
            </h1>
          </div>
          <div class="overflow-hidden">
            <h1 class="hero-line font-black leading-none tracking-tight text-violet-600"
              style="font-size: clamp(58px, 11vw, 148px)">
              developer.
            </h1>
          </div>
          <div class="overflow-hidden mt-2">
            <p class="hero-line font-light leading-none tracking-tight text-neutral-400"
              style="font-size: clamp(26px, 4.5vw, 60px)">
              I build things that work.
            </p>
          </div>
        </div>

        <!-- Meta row -->
        <div class="flex flex-wrap items-center gap-4">
          <div
            class="hero-meta inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-xs font-medium">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Available for work
          </div>
          <a href="#work"
            class="hero-meta group inline-flex items-center gap-2 px-6 py-2.5 bg-[#111111] text-white text-sm font-medium rounded-full hover:bg-neutral-800 transition-all duration-200">
            See My Work
            <ArrowUpRight
              class="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
          </a>
          <a href="#contact"
            class="hero-meta inline-flex items-center px-6 py-2.5 border border-neutral-300 text-neutral-700 text-sm font-medium rounded-full hover:bg-white hover:border-neutral-400 transition-all duration-200">
            Get in Touch
          </a>
        </div>
      </div>

      <!-- Scroll hint -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2">
        <div class="w-[1px] h-12 bg-neutral-300" />
        <span class="font-mono text-[10px] text-neutral-400 tracking-widest uppercase">scroll</span>
      </div>
    </section>

    <!-- ── Marquee ─────────────────────────────────────────────────────────── -->
    <div class="overflow-hidden border-y border-neutral-200 bg-white py-4">
      <div class="marquee-track flex items-center">
        <!-- Two identical rows for seamless loop -->
        <div class="marquee-inner flex items-center shrink-0">
          <template v-for="item in marqueeItems" :key="'a-' + item">
            <span class="font-mono text-sm text-neutral-400 px-7 shrink-0">{{ item }}</span>
            <span class="w-1 h-1 rounded-full bg-violet-400 shrink-0" />
          </template>
        </div>
        <div class="marquee-inner flex items-center shrink-0" aria-hidden="true">
          <template v-for="item in marqueeItems" :key="'b-' + item">
            <span class="font-mono text-sm text-neutral-400 px-7 shrink-0">{{ item }}</span>
            <span class="w-1 h-1 rounded-full bg-violet-400 shrink-0" />
          </template>
        </div>
      </div>
    </div>

    <!-- ── About ──────────────────────────────────────────────────────────── -->
    <section id="about" class="py-32 px-6 md:px-12 bg-white border-b border-neutral-200">
      <div class="max-w-7xl mx-auto">
        <p class="about-eyebrow font-mono text-xs text-neutral-400 tracking-[0.2em] uppercase mb-20">
          02 — About
        </p>
        <h2
          class="about-title text-5xl md:text-7xl font-light tracking-tight leading-[1.1] mb-24 max-w-5xl text-[#111111]">
          I turn complexity<br />
          <em class="not-italic text-violet-600">into clarity.</em>
        </h2>
        <div class="about-body grid md:grid-cols-2 gap-12 text-neutral-500 leading-relaxed text-lg">
          <p>
            I build full-stack applications and manage infrastructure. My focus is creating internal
            tools that are reliable, simple, and actually used by people.
          </p>
          <p>
            I enjoy solving real problems — whether it's approval workflows, ticketing platforms,
            or improving operations through clean code and solid architecture.
          </p>
        </div>
      </div>
    </section>

    <!-- ── Stack ──────────────────────────────────────────────────────────── -->
    <section id="skills" class="py-32 px-6 md:px-12 bg-cream border-b border-neutral-200">
      <div class="max-w-7xl mx-auto">
        <p class="skills-eyebrow font-mono text-xs text-neutral-400 tracking-[0.2em] uppercase mb-20">
          03 — Stack
        </p>
        <div class="space-y-12">
          <div v-for="group in stack" :key="group.category" class="skill-group">
            <p class="text-xs font-mono text-neutral-400 tracking-[0.15em] uppercase mb-4">
              {{ group.category }}
            </p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="item in group.items"
                :key="item"
                class="px-4 py-2 bg-white border border-neutral-200 rounded-full text-sm font-mono text-neutral-700
                       hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50 transition-all duration-200 cursor-default"
              >{{ item }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Work ───────────────────────────────────────────────────────────── -->
    <section id="work" class="py-32 px-6 md:px-12 bg-white border-b border-neutral-200">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-end justify-between mb-16">
          <div>
            <p class="work-eyebrow font-mono text-xs text-neutral-400 tracking-[0.2em] uppercase mb-4">
              04 — Work
            </p>
            <h2 class="work-title text-4xl md:text-5xl font-light tracking-tight">
              Selected Projects
            </h2>
          </div>
          <a
            href="https://github.com/imkaiwhyask"
            target="_blank"
            class="work-gh hidden md:inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-[#111111] transition-colors duration-200"
          >
            <IconGithub class="w-4 h-4" /> View all on GitHub
          </a>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="project in projects"
            :key="project.title"
            class="project-card bg-cream border border-neutral-200 rounded-2xl overflow-hidden hover:border-neutral-300 hover:shadow-md transition-colors duration-300"
          >
            <div class="p-7">
              <div class="flex items-start justify-between mb-5">
                <h3 class="font-mono font-medium text-lg">{{ project.title }}</h3>
                <a
                  :href="project.url"
                  target="_blank"
                  class="text-neutral-300 hover:text-violet-600 transition-colors duration-200 shrink-0 ml-3 mt-0.5"
                >
                  <ArrowUpRight class="w-4 h-4" />
                </a>
              </div>
              <p class="text-neutral-500 text-sm leading-relaxed mb-6">{{ project.desc }}</p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tech in project.tech"
                  :key="tech"
                  class="px-3 py-1 bg-violet-50 text-violet-700 rounded-full text-xs font-medium border border-violet-100"
                >{{ tech }}</span>
              </div>
            </div>
          </div>

          <!-- More coming -->
          <div
            class="project-card border-2 border-dashed border-neutral-200 rounded-2xl p-7 flex flex-col items-center justify-center text-center min-h-[200px]"
          >
            <div class="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
              <Clock class="w-4 h-4 text-neutral-400" />
            </div>
            <p class="text-sm font-medium text-neutral-400 mb-1">More coming</p>
            <p class="text-xs text-neutral-300">Cleaning up more repos.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Shipped Projects ────────────────────────────────────────────────── -->
    <section class="shipped-section py-32 px-6 md:px-12 bg-cream border-b border-neutral-200">
      <div class="max-w-7xl mx-auto">
        <p class="shipped-eyebrow font-mono text-xs text-neutral-400 tracking-[0.2em] uppercase mb-4">
          04.2 — Shipped
        </p>
        <h2 class="shipped-title text-4xl md:text-5xl font-light tracking-tight mb-16">
          Shipped Projects
        </h2>

        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="client in clientWork"
            :key="client.title"
            class="shipped-card group bg-white border border-neutral-200 rounded-xl overflow-hidden cursor-zoom-in
                   hover:border-violet-200 hover:shadow-lg transition-all duration-300"
            @click="openLightbox(client.imgs, client.title)"
          >
            <div class="relative h-44 overflow-hidden bg-neutral-50">
              <img
                :src="client.imgs[0]"
                :alt="client.title"
                class="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div
                v-if="client.imgs.length > 1"
                class="absolute top-2 right-2 px-2 py-0.5 bg-white/80 backdrop-blur-sm rounded-full font-mono text-[9px] text-neutral-500"
              >
                1/{{ client.imgs.length }}
              </div>
            </div>
            <div class="p-4">
              <h3 class="font-medium text-sm mb-1.5">{{ client.title }}</h3>
              <p class="text-neutral-500 text-xs leading-relaxed mb-3">{{ client.desc }}</p>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="tech in client.tech"
                  :key="tech"
                  class="px-2.5 py-1 bg-neutral-100 text-neutral-600 rounded-full text-[10px] font-medium"
                >{{ tech }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── GitHub Activity ─────────────────────────────────────────────────── -->
    <section class="py-24 px-6 md:px-12 bg-white border-b border-neutral-200">
      <div class="max-w-7xl mx-auto">
        <div class="activity-header mb-10">
          <p class="font-mono text-xs text-neutral-400 tracking-[0.2em] uppercase mb-4">Activity</p>
          <h2 class="text-3xl font-light tracking-tight">GitHub Contributions</h2>
        </div>

        <div v-if="activityLoading" class="h-28 flex items-center">
          <span class="font-mono text-xs text-neutral-400 animate-pulse">fetching activity...</span>
        </div>

        <div
          v-else-if="availableYears.length"
          class="activity-card bg-cream border border-neutral-200 rounded-2xl p-6"
        >
          <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div class="flex gap-1.5 flex-wrap">
              <button
                v-for="year in availableYears"
                :key="year"
                @click="selectedYear = year"
                :class="selectedYear === year
                  ? 'bg-violet-600 text-white border-violet-600'
                  : 'border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:text-[#111111]'"
                class="px-3 py-1 rounded-full border text-xs font-medium transition-all duration-200"
              >
                {{ year }}
              </button>
            </div>
            <span v-if="totals[selectedYear]" class="font-mono text-xs text-neutral-400">
              {{ totals[selectedYear].toLocaleString() }} contributions
            </span>
          </div>

          <div class="overflow-x-auto">
            <div class="min-w-max">
              <div class="relative h-5 mb-1">
                <div class="flex gap-1">
                  <div v-for="(_, wi) in weeks" :key="wi" class="w-3 shrink-0 relative">
                    <span
                      v-if="monthLabels.find(m => m.col === wi)"
                      class="absolute left-0 font-mono text-[10px] text-neutral-400 whitespace-nowrap"
                    >{{ monthLabels.find(m => m.col === wi)?.label }}</span>
                  </div>
                </div>
              </div>
              <div class="flex gap-1 pb-3">
                <div v-for="(week, wi) in weeks" :key="wi" class="flex flex-col gap-1">
                  <div
                    v-for="day in week"
                    :key="day.date"
                    :class="levelColor(day.level)"
                    class="w-3 h-3 rounded-sm transition-opacity duration-150 hover:opacity-60 cursor-default"
                    :title="`${day.date} — ${day.count} contribution${day.count !== 1 ? 's' : ''}`"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end gap-1.5 mt-1">
            <span class="font-mono text-[10px] text-neutral-400">less</span>
            <div v-for="l in [0, 1, 2, 3, 4]" :key="l" :class="levelColor(l)" class="w-3 h-3 rounded-sm" />
            <span class="font-mono text-[10px] text-neutral-400">more</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Contact ────────────────────────────────────────────────────────── -->
    <section id="contact" class="py-40 px-6 md:px-12 bg-[#0F0F0F] overflow-hidden">
      <div class="max-w-7xl mx-auto">
        <p class="font-mono text-xs text-neutral-600 tracking-[0.2em] uppercase mb-20">
          05 — Contact
        </p>

        <!-- Text mask reveal -->
        <div class="mb-16">
          <div class="overflow-hidden">
            <h2 class="contact-line font-black leading-none tracking-tight text-white"
              style="font-size: clamp(52px, 9.5vw, 130px)">Let's build</h2>
          </div>
          <div class="overflow-hidden">
            <h2 class="contact-line font-black leading-none tracking-tight text-violet-400"
              style="font-size: clamp(52px, 9.5vw, 130px)">something</h2>
          </div>
          <div class="overflow-hidden">
            <h2 class="contact-line font-black leading-none tracking-tight text-white"
              style="font-size: clamp(52px, 9.5vw, 130px)">great.</h2>
          </div>
        </div>

        <p class="contact-sub text-neutral-400 text-lg mb-12 max-w-lg leading-relaxed">
          Open to freelance, contracts, and interesting problems.
        </p>

        <div class="flex flex-wrap gap-4">
          <a
            href="mailto:kaiangelo017@gmail.com"
            class="contact-btn inline-flex items-center gap-2.5 px-7 py-3.5 bg-violet-600 text-white font-medium rounded-full hover:bg-violet-500 transition-all duration-200 text-sm"
          >
            <Mail class="w-4 h-4" /> Email Me
          </a>
          <a
            href="https://github.com/imkaiwhyask"
            target="_blank"
            class="contact-btn inline-flex items-center gap-2.5 px-7 py-3.5 border border-neutral-700 text-neutral-300 rounded-full hover:border-neutral-500 hover:text-white transition-all duration-200 text-sm font-medium"
          >
            <IconGithub class="w-4 h-4" /> GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/patrick-angelo-saba-01477b195/"
            target="_blank"
            class="contact-btn inline-flex items-center gap-2.5 px-7 py-3.5 border border-neutral-700 text-neutral-300 rounded-full hover:border-neutral-500 hover:text-white transition-all duration-200 text-sm font-medium"
          >
            <IconLinkedin class="w-4 h-4" /> LinkedIn
          </a>
        </div>
      </div>
    </section>

    <!-- ── Footer ─────────────────────────────────────────────────────────── -->
    <footer class="bg-[#0F0F0F] border-t border-neutral-800 py-8 px-6 md:px-12">
      <div class="max-w-7xl mx-auto flex items-center justify-between font-mono text-xs text-neutral-600">
        <span>© 2026 kai angelo — imkaiwhyask</span>
        <div class="flex items-center gap-5">
          <a
            href="https://github.com/imkaiwhyask"
            target="_blank"
            class="hover:text-violet-400 transition-colors duration-200"
          >
            <IconGithub class="w-4 h-4" />
          </a>
          <a
            href="https://www.linkedin.com/in/patrick-angelo-saba-01477b195/"
            target="_blank"
            class="hover:text-violet-400 transition-colors duration-200"
          >
            <IconLinkedin class="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>

  </div>

  <!-- ── Lightbox ───────────────────────────────────────────────────────── -->
  <Teleport to="body">
    <Transition name="lightbox">
      <div
        v-if="lightboxImg"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        @click.self="closeLightbox"
      >
        <div class="relative max-w-5xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl">
          <img
            :key="lightboxImg.idx"
            :src="lightboxImg.srcs[lightboxImg.idx]"
            :alt="lightboxImg.title"
            class="w-full"
          />
          <div class="px-5 py-4 flex items-center justify-between gap-4 border-t border-neutral-100">
            <p class="font-mono text-xs text-neutral-500 truncate">{{ lightboxImg.title }}</p>
            <template v-if="lightboxImg.srcs.length > 1">
              <div class="flex items-center gap-2 shrink-0">
                <button
                  @click="lightboxPrev"
                  class="px-4 py-1.5 rounded-full border border-neutral-200 text-xs font-medium hover:bg-neutral-50 transition-all"
                >← prev</button>
                <span class="font-mono text-xs text-neutral-400 min-w-[40px] text-center">
                  {{ lightboxImg.idx + 1 }} / {{ lightboxImg.srcs.length }}
                </span>
                <button
                  @click="lightboxNext"
                  class="px-4 py-1.5 rounded-full border border-neutral-200 text-xs font-medium hover:bg-neutral-50 transition-all"
                >next →</button>
              </div>
            </template>
            <button
              @click="closeLightbox"
              class="shrink-0 text-xs font-medium text-neutral-400 hover:text-[#111111] transition-colors"
            >close ×</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.2s ease;
}
.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
</style>
