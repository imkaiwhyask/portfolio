<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Github, Linkedin, Mail, ArrowRight, Clock, ExternalLink } from 'lucide-vue-next'

const fullText = "Full-stack developer.\nI build things that work."
const displayed = ref('')
const cursorOn = ref(true)

let typeTimer: ReturnType<typeof setInterval>
let blinkTimer: ReturnType<typeof setInterval>

onMounted(() => {
  let i = 0
  const startTyping = setTimeout(() => {
    typeTimer = setInterval(() => {
      if (i < fullText.length) {
        displayed.value = fullText.slice(0, ++i)
      } else {
        clearInterval(typeTimer)
      }
    }, 58)
  }, 350)

  blinkTimer = setInterval(() => {
    cursorOn.value = !cursorOn.value
  }, 530)

  onUnmounted(() => {
    clearTimeout(startTyping)
    clearInterval(typeTimer)
    clearInterval(blinkTimer)
  })
})

// Lightbox
const lightboxImg = ref<{ srcs: string[]; idx: number; title: string } | null>(null)

function openLightbox(srcs: string[], title: string) {
  lightboxImg.value = { srcs, idx: 0, title }
}

function closeLightbox() {
  lightboxImg.value = null
}

function lightboxNext() {
  if (lightboxImg.value)
    lightboxImg.value.idx = (lightboxImg.value.idx + 1) % lightboxImg.value.srcs.length
}

function lightboxPrev() {
  if (lightboxImg.value)
    lightboxImg.value.idx = (lightboxImg.value.idx - 1 + lightboxImg.value.srcs.length) % lightboxImg.value.srcs.length
}

onMounted(() => {
  const handleKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox()
  }
  window.addEventListener('keydown', handleKey)
  onUnmounted(() => window.removeEventListener('keydown', handleKey))
})

// GitHub activity
type Contribution = { date: string; count: number; level: number }
const allContributions = ref<Record<string, Contribution[]>>({})
const totals = ref<Record<string, number>>({})
const selectedYear = ref(new Date().getFullYear().toString())
const activityLoading = ref(true)

const availableYears = computed(() =>
  Object.keys(totals.value).sort((a, b) => Number(b) - Number(a))
)

const contributions = computed(() => allContributions.value[selectedYear.value] ?? [])

const weeks = computed(() => {
  const result: Contribution[][] = []
  for (let i = 0; i < contributions.value.length; i += 7) {
    result.push(contributions.value.slice(i, i + 7))
  }
  return result
})

const monthLabels = computed(() => {
  const labels: { label: string; col: number }[] = []
  let lastMonth = ''
  contributions.value.forEach((d, i) => {
    const month = new Date(d.date).toLocaleString('en', { month: 'short' })
    if (month !== lastMonth) {
      labels.push({ label: month, col: Math.floor(i / 7) })
      lastMonth = month
    }
  })
  return labels
})

function levelColor(level: number): string {
  return [
    'bg-md-surface-variant/50',
    'bg-[#3D1A6E]',
    'bg-[#6B32B5]/70',
    'bg-md-primary/70',
    'bg-md-primary',
  ][level] ?? 'bg-md-surface-variant/50'
}

onMounted(async () => {
  try {
    const res = await fetch('https://github-contributions-api.jogruber.de/v4/imkaiwhyask?y=all')
    const data = await res.json()
    totals.value = data.total ?? {}
    const grouped: Record<string, Contribution[]> = {}
    for (const c of data.contributions as Contribution[]) {
      const year = c.date.slice(0, 4)
      if (!grouped[year]) grouped[year] = []
      grouped[year].push(c)
    }
    allContributions.value = grouped
    selectedYear.value = new Date().getFullYear().toString()
  } catch {
    // silently fail — section stays hidden
  } finally {
    activityLoading.value = false
  }
})

const projects = [
  {
    title: 'trackIT',
    desc: 'Asset management and inventory tracking system built for internal operations.',
    tech: ['PHP', 'Laravel', 'MySQL'],
    url: 'https://github.com/imkaiwhyask/trackIT',
  },
  {
    title: 'phantix',
    desc: 'Internal messaging desktop app for team communication.',
    tech: ['Electron', 'PHP', 'MySQL'],
    url: 'https://github.com/imkaiwhyask/phantix',
  },
  {
    title: 'CS2-Tags',
    desc: 'Counter-Strike 2 server plugin for adding and managing custom player tags in-game.',
    tech: ['C#', 'CS2', 'CounterStrikeSharp'],
    url: 'https://github.com/imkaiwhyask/CS2-Tags',
  },
  {
    title: 'cs2-WeaponPaints',
    desc: 'Custom weapon skin configuration plugin for Counter-Strike 2 servers.',
    tech: ['C#', 'CS2', 'CounterStrikeSharp'],
    url: 'https://github.com/imkaiwhyask/cs2-WeaponPaints',
  },
  {
    title: 'crest',
    desc: 'Centralized digital workflow for customer master data requests — from submission and multi-level approval to SAP account creation.',
    tech: ['Laravel', 'Blade', 'Alpine.js', 'Tailwind CSS'],
    url: 'https://github.com/imkaiwhyask/crest',
  },
  {
    title: 'helpIT',
    desc: 'Full-stack IT helpdesk system — ticket management, SLA tracking, role-based access (Admin / Technician / End User), self-service portal and knowledge base.',
    tech: ['Vue 3', 'Pinia', 'Element Plus', 'ApexCharts', 'Node.js', 'Express', 'Prisma', 'PostgreSQL', 'Docker'],
    url: 'https://github.com/imkaiwhyask/helpIT',
  },
]

const clientWork = [
  {
    title: 'CREST',
    desc: 'Centralized digital workflow for customer master data requests — from submission and multi-level approval to SAP account creation.',
    tech: ['Laravel', 'Blade', 'Alpine.js', 'Tailwind CSS'],
    imgs: ['/work/portfolio_9.png', '/work/portfolio_9.1.png'],
  },
  {
    title: 'trackIT',
    desc: 'Asset management and inventory tracking system built for internal operations.',
    tech: ['PHP', 'Laravel', 'MySQL'],
    imgs: ['/work/portfolio_10.png', '/work/portfolio_10.1.png'],
  },
  {
    title: 'SlashPlug',
    desc: 'News and entertainment media website.',
    tech: ['WordPress', 'Elementor'],
    imgs: ['/work/portfolio_1.jpg'],
  },
  {
    title: 'The Cross Country Immigration',
    desc: 'Immigration consultancy and services website.',
    tech: ['PHP', 'SCSS', 'CSS', 'Less', 'HTML', 'JavaScript'],
    imgs: ['/work/portfolio_2.jpg'],
  },
  {
    title: 'Global Management',
    desc: 'Corporate website for a creative solutions provider.',
    tech: ['PHP', 'SCSS', 'CSS', 'Less', 'HTML', 'JavaScript'],
    imgs: ['/work/portfolio_3.jpg'],
  },
  {
    title: 'ACB IT Solutions',
    desc: 'Managed IT solutions and outsourcing company website.',
    tech: ['PHP', 'SCSS', 'CSS', 'Less', 'HTML', 'JavaScript'],
    imgs: ['/work/portfolio_4.jpg'],
  },
  {
    title: 'ifamous Technology',
    desc: 'Technology company website with featured services showcase.',
    tech: ['PHP', 'SCSS', 'CSS', 'Less', 'HTML', 'JavaScript'],
    imgs: ['/work/portfolio_5.jpg'],
  },
  {
    title: 'Advance Technology H.K.',
    desc: 'Web design and software development company based in Hong Kong.',
    tech: ['Blade', 'PHP', 'CSS'],
    imgs: ['/work/portfolio_6.jpg'],
  },
  {
    title: 'Orbweavers',
    desc: 'Business solutions company website.',
    tech: ['WordPress', 'Elementor'],
    imgs: ['/work/portfolio_7.jpg'],
  },
  {
    title: 'Solid Pick IT Solutions',
    desc: 'IT solutions and services company website.',
    tech: ['PHP', 'SCSS', 'CSS', 'Less', 'HTML', 'JavaScript'],
    imgs: ['/work/portfolio_8.jpg'],
  },
]

const stack = [
  {
    category: 'Frontend',
    items: ['HTML5', 'CSS3', 'JavaScript', 'Vue.js', 'Bootstrap', 'Blade', 'ApexCharts'],
  },
  {
    category: 'Backend / Apps',
    items: ['Laravel', 'PHP', 'Python', 'MySQL', 'Electron', 'Dash'],
  },
  {
    category: 'CMS / No-Code',
    items: ['WordPress', 'Elementor', 'WooCommerce', 'Power Apps', 'Power Automate'],
  },
  {
    category: 'Infra & Systems',
    items: ['Linux', 'Windows Server', 'Active Directory', 'Microsoft 365', 'Microsoft Entra', 'VMware', 'FortiGate', 'Wazuh', 'Grafana'],
  },
  {
    category: 'Containers & DevOps',
    items: ['Docker', 'Nginx', 'Git', 'GitHub Actions', 'GitLab CI'],
  },
]
</script>

<template>
  <main class="min-h-screen bg-md-bg text-md-on-bg overflow-x-hidden">

    <!-- Material App Bar -->
    <nav class="fixed inset-x-0 top-0 z-50 bg-md-surface/95 backdrop-blur-xl shadow-elevation-2">
      <div class="max-w-6xl mx-auto px-4 md:px-6 flex justify-between items-center h-16">
        <span class="font-mono text-sm font-medium text-md-primary select-none">imkaiwhyask</span>
        <div class="flex items-center gap-1">
          <a href="#about" class="px-4 py-2 text-sm font-medium text-md-on-surface hover:text-md-primary hover:bg-md-primary/8 rounded-full transition-all duration-200">About</a>
          <a href="#skills" class="px-4 py-2 text-sm font-medium text-md-on-surface hover:text-md-primary hover:bg-md-primary/8 rounded-full transition-all duration-200">Skills</a>
          <a href="#work" class="px-4 py-2 text-sm font-medium text-md-on-surface hover:text-md-primary hover:bg-md-primary/8 rounded-full transition-all duration-200">Work</a>
          <a href="#contact" class="ml-2 px-5 py-2 bg-md-primary/15 text-md-primary text-sm font-medium rounded-full hover:bg-md-primary/25 transition-all duration-200">Contact</a>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <section class="relative min-h-dvh flex items-center px-6 pt-16 bg-md-bg overflow-hidden">
      <div class="absolute inset-0 grid-bg pointer-events-none" />
      <div class="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-md-primary/6 blur-[100px] pointer-events-none" />
      <div class="absolute bottom-0 -left-20 w-96 h-96 rounded-full bg-md-secondary/5 blur-[80px] pointer-events-none" />

      <div class="relative z-10 max-w-5xl mx-auto w-full py-20">
        <!-- Status chip -->
        <div
          v-motion
          :initial="{ opacity: 0, y: -8 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }"
          class="inline-flex items-center gap-2 mb-10 px-4 py-1.5 bg-md-surface shadow-elevation-1 rounded-full border border-md-outline/20"
        >
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span class="text-xs font-medium text-md-on-surface">available for work</span>
        </div>

        <!-- Display headline -->
        <h1 class="text-5xl md:text-[80px] font-light tracking-tight leading-[1.1] mb-8 whitespace-pre-line">
          {{ displayed }}<span
            class="text-md-primary transition-opacity duration-75 select-none"
            :class="cursorOn ? 'opacity-100' : 'opacity-0'"
          >|</span>
        </h1>

        <p
          v-motion
          :initial="{ opacity: 0, y: 14 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 2700, duration: 700 } }"
          class="text-lg text-md-on-surface max-w-lg mb-10 leading-relaxed"
        >
          Full-stack developer &amp; systems engineer. I design and ship reliable internal tools — from APIs to infrastructure.
        </p>

        <div
          v-motion
          :initial="{ opacity: 0, y: 14 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 3000, duration: 700 } }"
          class="flex flex-wrap gap-3"
        >
          <a
            href="#work"
            class="group inline-flex items-center gap-2 px-7 py-3 bg-md-primary text-zinc-900 font-medium rounded-full shadow-elevation-2 hover:shadow-elevation-3 transition-all duration-200 text-sm"
          >
            See My Work
            <ArrowRight class="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
          </a>
          <a
            href="#contact"
            class="inline-flex items-center px-7 py-3 border border-md-outline text-md-primary rounded-full hover:bg-md-primary/8 transition-all duration-200 text-sm font-medium"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </section>

    <!-- About -->
    <section id="about" class="py-24 px-6 bg-md-bg">
      <div
        v-motion
        :initial="{ opacity: 0, y: 40 }"
        :visible="{ opacity: 1, y: 0, transition: { duration: 700 } }"
        class="max-w-5xl mx-auto"
      >
        <div class="bg-md-surface shadow-elevation-2 rounded-3xl p-8 md:p-12">
          <div class="flex items-center gap-3 mb-6">
            <div class="h-8 w-1 bg-md-primary rounded-full" />
            <p class="font-mono text-xs text-md-secondary tracking-[0.15em] uppercase">// about</p>
          </div>
          <h2 class="text-4xl md:text-5xl font-light tracking-tight leading-tight mb-8">
            I turn complexity<br />into clarity.
          </h2>
          <div class="grid md:grid-cols-2 gap-8 text-md-on-surface leading-relaxed">
            <p>
              I build full-stack applications and manage infrastructure. My focus is creating internal tools that are reliable, simple, and actually used by people.
            </p>
            <p>
              I enjoy solving real problems — whether it's approval systems, ticketing platforms, or improving workflows through clean code and solid architecture.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Skills -->
    <section id="skills" class="py-24 px-6 bg-md-surface">
      <div class="max-w-5xl mx-auto">
        <div
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :visible="{ opacity: 1, y: 0, transition: { duration: 600 } }"
          class="mb-12"
        >
          <p class="font-mono text-xs text-md-secondary tracking-[0.15em] uppercase mb-2">// stack</p>
          <h2 class="text-3xl font-light tracking-tight">What I work with</h2>
        </div>

        <div class="space-y-8">
          <div
            v-for="(group, gi) in stack"
            :key="group.category"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :visible="{ opacity: 1, y: 0, transition: { duration: 500, delay: gi * 80 } }"
          >
            <p class="text-xs font-medium text-md-on-surface/50 tracking-[0.12em] uppercase mb-3">{{ group.category }}</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(item, ii) in group.items"
                :key="item"
                v-motion
                :initial="{ opacity: 0, scale: 0.88 }"
                :visible="{ opacity: 1, scale: 1, transition: { delay: gi * 80 + ii * 45, duration: 350 } }"
                class="px-4 py-1.5 bg-md-bg border border-md-outline/30 rounded-full font-mono text-sm text-md-on-surface hover:border-md-primary/60 hover:text-md-primary hover:bg-md-primary/5 transition-all duration-200 cursor-default"
              >{{ item }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Work (Selected Projects) -->
    <section id="work" class="py-24 px-6 bg-md-bg">
      <div class="max-w-5xl mx-auto">
        <div
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :visible="{ opacity: 1, y: 0, transition: { duration: 600 } }"
          class="flex items-end justify-between mb-10"
        >
          <div>
            <p class="font-mono text-xs text-md-secondary tracking-[0.15em] uppercase mb-2">// work</p>
            <h2 class="text-3xl font-light tracking-tight">Selected Projects</h2>
          </div>
          <a
            href="https://github.com/imkaiwhyask"
            target="_blank"
            class="inline-flex items-center gap-1.5 text-sm text-md-on-surface/50 hover:text-md-primary transition-colors duration-200"
          >
            <Github class="w-4 h-4" /> github
          </a>
        </div>

        <div class="grid md:grid-cols-2 gap-4">
          <div
            v-for="(project, i) in projects"
            :key="project.title"
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :visible="{ opacity: 1, y: 0, transition: { duration: 600, delay: i * 80 } }"
            class="group bg-md-surface shadow-elevation-1 hover:shadow-elevation-3 rounded-2xl overflow-hidden transition-all duration-300"
          >
            <div class="h-0.5 w-full bg-gradient-to-r from-md-primary via-md-primary/50 to-md-secondary" />
            <div class="p-7">
              <div class="flex items-start justify-between mb-4">
                <h3 class="font-mono font-medium text-lg tracking-tight">{{ project.title }}</h3>
                <a
                  :href="project.url"
                  target="_blank"
                  class="text-md-on-surface/40 group-hover:text-md-primary transition-colors duration-200 shrink-0 ml-3"
                >
                  <ExternalLink class="w-4 h-4" />
                </a>
              </div>
              <p class="text-md-on-surface text-sm leading-relaxed mb-6">{{ project.desc }}</p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tech in project.tech"
                  :key="tech"
                  class="px-3 py-1 bg-md-primary/10 text-md-primary rounded-full font-mono text-xs font-medium"
                >{{ tech }}</span>
              </div>
            </div>
          </div>

          <!-- More coming -->
          <div
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :visible="{ opacity: 1, y: 0, transition: { duration: 600, delay: projects.length * 80 } }"
            class="border-2 border-dashed border-md-outline/25 rounded-2xl p-7 flex flex-col items-center justify-center text-center min-h-[180px]"
          >
            <div class="w-10 h-10 rounded-full bg-md-surface flex items-center justify-center mb-3 shadow-elevation-1">
              <Clock class="w-4 h-4 text-md-on-surface/40" />
            </div>
            <p class="text-sm font-medium text-md-on-surface/40 mb-1">More coming</p>
            <p class="text-xs text-md-on-surface/25">Cleaning up more repos.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Shipped Projects -->
    <section class="py-24 px-6 bg-md-surface">
      <div class="max-w-5xl mx-auto">
        <div
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :visible="{ opacity: 1, y: 0, transition: { duration: 600 } }"
          class="mb-10"
        >
          <p class="font-mono text-xs text-md-secondary tracking-[0.15em] uppercase mb-2">// projects</p>
          <h2 class="text-3xl font-light tracking-tight">Shipped Projects</h2>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="(client, i) in clientWork"
            :key="client.title"
            v-motion
            :initial="{ opacity: 0, y: 24 }"
            :visible="{ opacity: 1, y: 0, transition: { duration: 500, delay: i * 60 } }"
            class="group bg-md-bg shadow-elevation-1 hover:shadow-elevation-3 rounded-2xl overflow-hidden transition-all duration-300 cursor-zoom-in"
            @click="openLightbox(client.imgs, client.title)"
          >
            <div class="relative h-40 overflow-hidden bg-md-surface-variant">
              <img
                :src="client.imgs[0]"
                :alt="client.title"
                class="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div class="absolute inset-0 bg-md-bg/20 group-hover:bg-transparent transition-colors duration-300" />
              <div v-if="client.imgs.length > 1" class="absolute top-2 right-2 px-2 py-0.5 bg-md-bg/75 backdrop-blur-sm rounded-full font-mono text-[9px] text-md-on-surface/70">
                1/{{ client.imgs.length }}
              </div>
            </div>
            <div class="p-4">
              <h3 class="font-medium text-sm mb-1.5">{{ client.title }}</h3>
              <p class="text-md-on-surface text-xs leading-relaxed mb-3">{{ client.desc }}</p>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="tech in client.tech"
                  :key="tech"
                  class="px-2.5 py-0.5 bg-md-surface rounded-full text-[10px] font-medium text-md-on-surface/60"
                >{{ tech }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- GitHub Activity -->
    <section class="py-20 px-6 bg-md-bg">
      <div class="max-w-5xl mx-auto">
        <div
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :visible="{ opacity: 1, y: 0, transition: { duration: 600 } }"
          class="mb-8"
        >
          <p class="font-mono text-xs text-md-secondary tracking-[0.15em] uppercase mb-2">// activity</p>
          <h2 class="text-3xl font-light tracking-tight">GitHub Contributions</h2>
        </div>

        <div v-if="activityLoading" class="h-28 flex items-center">
          <span class="font-mono text-xs text-md-on-surface/30 animate-pulse">fetching activity...</span>
        </div>

        <div
          v-else-if="availableYears.length"
          v-motion
          :initial="{ opacity: 0 }"
          :visible="{ opacity: 1, transition: { duration: 800 } }"
          class="bg-md-surface shadow-elevation-2 rounded-2xl p-6"
        >
          <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div class="flex gap-1.5 flex-wrap">
              <button
                v-for="year in availableYears"
                :key="year"
                @click="selectedYear = year"
                :class="selectedYear === year
                  ? 'bg-md-primary/15 text-md-primary border-md-primary/40'
                  : 'border-md-outline/30 text-md-on-surface/50 hover:border-md-outline/60 hover:text-md-on-surface'"
                class="px-3 py-1 rounded-full border text-xs font-medium transition-all duration-200"
              >{{ year }}</button>
            </div>
            <span v-if="totals[selectedYear]" class="font-mono text-xs text-md-on-surface/50">
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
                      class="absolute left-0 font-mono text-[10px] text-md-on-surface/30 whitespace-nowrap"
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
            <span class="font-mono text-[10px] text-md-on-surface/30">less</span>
            <div v-for="l in [0, 1, 2, 3, 4]" :key="l" :class="levelColor(l)" class="w-3 h-3 rounded-sm" />
            <span class="font-mono text-[10px] text-md-on-surface/30">more</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact -->
    <section id="contact" class="py-28 px-6 bg-md-surface">
      <div class="max-w-5xl mx-auto">
        <p
          v-motion
          :initial="{ opacity: 0, y: 40 }"
          :visible="{ opacity: 1, y: 0, transition: { duration: 700 } }"
          class="font-mono text-xs text-md-secondary tracking-[0.15em] uppercase mb-4"
        >// contact</p>
      </div>
      <div
        v-motion
        :initial="{ opacity: 0, y: 40 }"
        :visible="{ opacity: 1, y: 0, transition: { duration: 700 } }"
        class="max-w-3xl mx-auto text-center"
      >
        <h2 class="text-4xl md:text-6xl font-light tracking-tight mb-6">
          Let's build<br />something great.
        </h2>
        <p class="text-md-on-surface mb-10 leading-relaxed">
          Open to freelance, contracts, and interesting problems.
        </p>

        <div class="flex justify-center flex-wrap gap-3">
          <a
            href="mailto:kaiangelo017@gmail.com"
            class="inline-flex items-center gap-2 px-7 py-3 bg-md-primary text-zinc-900 font-medium rounded-full shadow-elevation-2 hover:shadow-elevation-3 transition-all duration-200 text-sm"
          >
            <Mail class="w-4 h-4" /> Email Me
          </a>
          <a
            href="https://github.com/imkaiwhyask"
            target="_blank"
            class="inline-flex items-center gap-2 px-7 py-3 border border-md-outline text-md-on-surface rounded-full hover:bg-md-surface-variant transition-all duration-200 text-sm font-medium"
          >
            <Github class="w-4 h-4" /> GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/patrick-angelo-saba-01477b195/"
            target="_blank"
            class="inline-flex items-center gap-2 px-7 py-3 border border-md-outline text-md-on-surface rounded-full hover:bg-md-surface-variant transition-all duration-200 text-sm font-medium"
          >
            <Linkedin class="w-4 h-4" /> LinkedIn
          </a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-md-bg border-t border-md-outline/15 py-6 px-6">
      <div class="max-w-5xl mx-auto flex items-center justify-between font-mono text-xs text-md-on-surface/40">
        <span>© 2026 kai</span>
        <div class="flex items-center gap-4">
          <a href="https://github.com/imkaiwhyask" target="_blank" class="hover:text-md-primary transition-colors duration-200">
            <Github class="w-3.5 h-3.5" />
          </a>
          <a href="https://www.linkedin.com/in/patrick-angelo-saba-01477b195/" target="_blank" class="hover:text-md-primary transition-colors duration-200">
            <Linkedin class="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </footer>

    <!-- Lightbox (Material Dialog) -->
    <Teleport to="body">
      <Transition name="lightbox">
        <div
          v-if="lightboxImg"
          class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          @click.self="closeLightbox"
        >
          <div class="relative max-w-5xl w-full bg-md-surface shadow-elevation-5 rounded-3xl overflow-hidden">
            <img
              :src="lightboxImg.srcs[lightboxImg.idx]"
              :alt="lightboxImg.title"
              class="w-full"
            />
            <div class="px-5 py-4 flex items-center justify-between gap-4">
              <p class="font-mono text-xs text-md-on-surface/60 truncate">{{ lightboxImg.title }}</p>
              <template v-if="lightboxImg.srcs.length > 1">
                <div class="flex items-center gap-2 shrink-0">
                  <button @click="lightboxPrev" class="px-4 py-1.5 rounded-full border border-md-outline/40 text-xs font-medium text-md-on-surface hover:bg-md-surface-variant transition-all">← prev</button>
                  <span class="font-mono text-xs text-md-on-surface/40 min-w-[40px] text-center">{{ lightboxImg.idx + 1 }} / {{ lightboxImg.srcs.length }}</span>
                  <button @click="lightboxNext" class="px-4 py-1.5 rounded-full border border-md-outline/40 text-xs font-medium text-md-on-surface hover:bg-md-surface-variant transition-all">next →</button>
                </div>
              </template>
              <button @click="closeLightbox" class="shrink-0 text-xs font-medium text-md-on-surface/40 hover:text-md-on-surface transition-colors">close ×</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </main>
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
