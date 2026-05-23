<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Github, Linkedin, Mail, ArrowRight, Clock, ExternalLink } from 'lucide-vue-next'

const fullText = "I build tools\nthat feel effortless."
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
const lightboxImg = ref<{ src: string; title: string } | null>(null)

function openLightbox(src: string, title: string) {
  lightboxImg.value = { src, title }
}

function closeLightbox() {
  lightboxImg.value = null
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
  return ['bg-zinc-800/50', 'bg-cyan-950', 'bg-cyan-800/60', 'bg-cyan-500/70', 'bg-cyan-400'][level] ?? 'bg-zinc-800/50'
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
]

const clientWork = [
  {
    title: 'SlashPlug',
    desc: 'News and entertainment media website.',
    tech: ['WordPress', 'Elementor'],
    img: '/work/portfolio_1.jpg',
  },
  {
    title: 'The Cross Country Immigration',
    desc: 'Immigration consultancy and services website.',
    tech: ['PHP', 'SCSS', 'CSS', 'Less', 'HTML', 'JavaScript'],
    img: '/work/portfolio_2.jpg',
  },
  {
    title: 'Global Management',
    desc: 'Corporate website for a creative solutions provider.',
    tech: ['PHP', 'SCSS', 'CSS', 'Less', 'HTML', 'JavaScript'],
    img: '/work/portfolio_3.jpg',
  },
  {
    title: 'ACB IT Solutions',
    desc: 'Managed IT solutions and outsourcing company website.',
    tech: ['PHP', 'SCSS', 'CSS', 'Less', 'HTML', 'JavaScript'],
    img: '/work/portfolio_4.jpg',
  },
  {
    title: 'ifamous Technology',
    desc: 'Technology company website with featured services showcase.',
    tech: ['PHP', 'SCSS', 'CSS', 'Less', 'HTML', 'JavaScript'],
    img: '/work/portfolio_5.jpg',
  },
  {
    title: 'Advance Technology H.K.',
    desc: 'Web design and software development company based in Hong Kong.',
    tech: ['Blade', 'PHP', 'CSS'],
    img: '/work/portfolio_6.jpg',
  },
  {
    title: 'Orbweavers',
    desc: 'Business solutions company website.',
    tech: ['WordPress', 'Elementor'],
    img: '/work/portfolio_7.jpg',
  },
  {
    title: 'Solid Pick IT Solutions',
    desc: 'IT solutions and services company website.',
    tech: ['PHP', 'SCSS', 'CSS', 'Less', 'HTML', 'JavaScript'],
    img: '/work/portfolio_8.jpg',
  },
]

const stack = [
  {
    category: 'Frontend',
    items: ['HTML5', 'CSS3', 'JavaScript', 'Vue.js', 'Bootstrap', 'Blade'],
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
    items: ['Docker', 'Nginx', 'Git', 'GitHub Actions'],
  },
]
</script>

<template>
  <main class="min-h-screen bg-zinc-950 text-white overflow-x-hidden">

    <!-- Nav -->
    <nav class="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
      <div class="max-w-6xl mx-auto px-6 flex justify-between items-center h-16">
        <span class="font-mono text-sm select-none">
          <span class="text-cyan-400">imkaiwhyask</span>
        </span>
        <div class="flex items-center gap-8 text-sm text-zinc-500">
          <a href="#about" class="hover:text-white transition-colors duration-200">About</a>
          <a href="#skills" class="hover:text-white transition-colors duration-200">Skills</a>
          <a href="#work" class="hover:text-white transition-colors duration-200">Work</a>
          <a
            href="#contact"
            class="px-4 py-1.5 border border-zinc-700 rounded-lg text-zinc-400 hover:border-cyan-400 hover:text-cyan-400 transition-all duration-200 font-mono text-xs"
          >
            contact
          </a>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <section class="relative min-h-dvh flex items-center px-6 pt-16">
      <div class="absolute inset-0 grid-bg pointer-events-none" />
      <div class="absolute inset-0 hero-glow pointer-events-none" />
      <div class="absolute inset-0 radial-mask pointer-events-none" />

      <div class="relative z-10 max-w-5xl mx-auto w-full">
        <!-- Status badge -->
        <div
          v-motion
          :initial="{ opacity: 0, y: -8 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }"
          class="inline-flex items-center gap-2 mb-10 px-3 py-1.5 bg-zinc-900/80 border border-zinc-800 rounded-full"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span class="font-mono text-xs text-zinc-400">available for work</span>
        </div>

        <!-- Typewriter headline -->
        <h1
          class="text-6xl md:text-[84px] font-bold tracking-tighter leading-[1.05] mb-8 whitespace-pre-line"
        >{{ displayed }}<span
            class="text-cyan-400 transition-opacity duration-75 select-none"
            :class="cursorOn ? 'opacity-100' : 'opacity-0'"
          >|</span>
        </h1>

        <p
          v-motion
          :initial="{ opacity: 0, y: 14 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 2700, duration: 700 } }"
          class="text-lg text-zinc-400 max-w-lg mb-10 leading-relaxed"
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
            class="group inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-cyan-400 transition-colors duration-200 text-sm"
          >
            See My Work
            <ArrowRight class="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
          </a>
          <a
            href="#contact"
            class="inline-flex items-center px-6 py-3 border border-zinc-700 rounded-xl text-zinc-400 hover:border-zinc-500 hover:text-white transition-all duration-200 text-sm"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </section>

    <!-- About -->
    <section id="about" class="py-28 px-6">
      <div
        v-motion
        :initial="{ opacity: 0, y: 40 }"
        :visible="{ opacity: 1, y: 0, transition: { duration: 700 } }"
        class="max-w-5xl mx-auto"
      >
        <p class="font-mono text-xs text-cyan-400 tracking-widest mb-4">// about</p>
        <h2 class="text-4xl md:text-6xl font-bold tracking-tighter leading-tight mb-10">
          I turn complexity<br />into clarity.
        </h2>
        <div class="grid md:grid-cols-2 gap-8 text-zinc-400 leading-relaxed">
          <p>
            I build full-stack applications and manage infrastructure. My focus is creating internal tools that are reliable, simple, and actually used by people.
          </p>
          <p>
            I enjoy solving real problems — whether it's approval systems, ticketing platforms, or improving workflows through clean code and solid architecture.
          </p>
        </div>
      </div>
    </section>

    <!-- Skills -->
    <section id="skills" class="border-y border-zinc-900 py-20 px-6">
      <div class="max-w-5xl mx-auto">
        <div
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :visible="{ opacity: 1, y: 0, transition: { duration: 600 } }"
          class="mb-12"
        >
          <p class="font-mono text-xs text-cyan-400 tracking-widest mb-2">// stack</p>
          <h2 class="text-3xl font-bold tracking-tighter">What I work with</h2>
        </div>

        <div class="space-y-8">
          <div
            v-for="(group, gi) in stack"
            :key="group.category"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :visible="{ opacity: 1, y: 0, transition: { duration: 500, delay: gi * 80 } }"
          >
            <p class="font-mono text-xs text-zinc-600 tracking-widest uppercase mb-3">{{ group.category }}</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(item, ii) in group.items"
                :key="item"
                v-motion
                :initial="{ opacity: 0, scale: 0.88 }"
                :visible="{ opacity: 1, scale: 1, transition: { delay: gi * 80 + ii * 45, duration: 350 } }"
                class="px-3.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg font-mono text-sm text-zinc-300 hover:border-cyan-400/60 hover:text-cyan-400 hover:bg-zinc-800/80 transition-all duration-200 cursor-default"
              >{{ item }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Work -->
    <section id="work" class="py-28 px-6">
      <div class="max-w-5xl mx-auto">
        <div
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :visible="{ opacity: 1, y: 0, transition: { duration: 600 } }"
          class="flex items-end justify-between mb-10"
        >
          <div>
            <p class="font-mono text-xs text-cyan-400 tracking-widest mb-2">// work</p>
            <h2 class="text-3xl font-bold tracking-tighter">Selected Projects</h2>
          </div>
          <a
            href="https://github.com/imkaiwhyask"
            target="_blank"
            class="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-500 hover:text-white transition-colors duration-200"
          >
            <Github class="w-3.5 h-3.5" /> github
          </a>
        </div>

        <div class="grid md:grid-cols-2 gap-4">
          <div
            v-for="(project, i) in projects"
            :key="project.title"
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :visible="{ opacity: 1, y: 0, transition: { duration: 600, delay: i * 80 } }"
            class="group relative bg-zinc-900 border border-zinc-800 rounded-2xl p-7 hover:border-zinc-700 transition-all duration-300 hover:-translate-y-0.5"
          >
            <div class="flex items-start justify-between mb-4">
              <h3 class="font-mono font-semibold text-lg tracking-tight">{{ project.title }}</h3>
              <a
                :href="project.url"
                target="_blank"
                class="text-zinc-600 group-hover:text-cyan-400 transition-colors duration-200 shrink-0 ml-3"
              >
                <ExternalLink class="w-4 h-4" />
              </a>
            </div>
            <p class="text-zinc-400 text-sm leading-relaxed mb-6">{{ project.desc }}</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tech in project.tech"
                :key="tech"
                class="px-2.5 py-1 bg-zinc-950 border border-zinc-800 rounded-md font-mono text-xs text-zinc-500"
              >{{ tech }}</span>
            </div>
          </div>

          <!-- More coming soon -->
          <div
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :visible="{ opacity: 1, y: 0, transition: { duration: 600, delay: projects.length * 80 } }"
            class="relative border border-zinc-800 border-dashed rounded-2xl p-7 flex flex-col items-center justify-center text-center min-h-[180px]"
          >
            <div class="coming-soon-glow absolute inset-0 rounded-2xl pointer-events-none" />
            <div class="relative z-10">
              <div class="inline-flex items-center gap-1.5 px-2.5 py-1 mb-3 border border-zinc-800 rounded-full bg-zinc-900/60 font-mono text-xs text-zinc-600">
                <Clock class="w-3 h-3" /> more coming
              </div>
              <p class="text-zinc-600 text-sm">Cleaning up more repos.<br />Check back soon.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Freelance / Client Work -->
    <section class="border-t border-zinc-900 py-28 px-6">
      <div class="max-w-5xl mx-auto">
        <div
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :visible="{ opacity: 1, y: 0, transition: { duration: 600 } }"
          class="mb-10"
        >
          <p class="font-mono text-xs text-cyan-400 tracking-widest mb-2">// freelance</p>
          <h2 class="text-3xl font-bold tracking-tighter">Client Work</h2>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="(client, i) in clientWork"
            :key="client.title"
            v-motion
            :initial="{ opacity: 0, y: 24 }"
            :visible="{ opacity: 1, y: 0, transition: { duration: 500, delay: i * 60 } }"
            class="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all duration-300 hover:-translate-y-0.5"
          >
            <!-- Screenshot -->
            <div
              class="relative h-36 overflow-hidden bg-zinc-800 cursor-zoom-in"
              @click="openLightbox(client.img, client.title)"
            >
              <img
                :src="client.img"
                :alt="client.title"
                class="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div class="absolute inset-0 bg-zinc-950/20 group-hover:bg-zinc-950/0 transition-colors duration-300" />
            </div>

            <!-- Info -->
            <div class="p-4">
              <h3 class="font-semibold text-sm tracking-tight mb-1.5">{{ client.title }}</h3>
              <p class="text-zinc-500 text-xs leading-relaxed mb-3">{{ client.desc }}</p>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="tech in client.tech"
                  :key="tech"
                  class="px-2 py-0.5 bg-zinc-950 border border-zinc-800 rounded font-mono text-[10px] text-zinc-600"
                >{{ tech }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- GitHub Activity -->
    <section class="border-t border-zinc-900 py-20 px-6">
      <div class="max-w-5xl mx-auto">
        <div
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :visible="{ opacity: 1, y: 0, transition: { duration: 600 } }"
          class="mb-8"
        >
          <p class="font-mono text-xs text-cyan-400 tracking-widest mb-2">// activity</p>
          <h2 class="text-3xl font-bold tracking-tighter">GitHub Contributions</h2>
        </div>

        <!-- Loading -->
        <div v-if="activityLoading" class="h-28 flex items-center">
          <span class="font-mono text-xs text-zinc-600 animate-pulse">fetching activity...</span>
        </div>

        <div
          v-else-if="availableYears.length"
          v-motion
          :initial="{ opacity: 0 }"
          :visible="{ opacity: 1, transition: { duration: 800 } }"
        >
          <!-- Year tabs + total -->
          <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div class="flex gap-1.5 flex-wrap">
              <button
                v-for="year in availableYears"
                :key="year"
                @click="selectedYear = year"
                :class="selectedYear === year
                  ? 'border-cyan-400/60 text-cyan-400 bg-cyan-400/5'
                  : 'border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'"
                class="px-3 py-1 rounded-lg border font-mono text-xs transition-all duration-200"
              >{{ year }}</button>
            </div>
            <span v-if="totals[selectedYear]" class="font-mono text-xs text-zinc-500">
              {{ totals[selectedYear].toLocaleString() }} contributions
            </span>
          </div>

          <!-- Month labels -->
          <div class="overflow-x-auto">
            <div class="min-w-max">
              <div class="relative h-5 mb-1">
                <div class="flex gap-1">
                  <div
                    v-for="(_, wi) in weeks"
                    :key="wi"
                    class="w-3 shrink-0 relative"
                  >
                    <span
                      v-if="monthLabels.find(m => m.col === wi)"
                      class="absolute left-0 font-mono text-[10px] text-zinc-600 whitespace-nowrap"
                    >{{ monthLabels.find(m => m.col === wi)?.label }}</span>
                  </div>
                </div>
              </div>

              <!-- Heatmap grid -->
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

          <!-- Legend -->
          <div class="flex items-center justify-end gap-1.5 mt-1">
            <span class="font-mono text-[10px] text-zinc-600">less</span>
            <div v-for="l in [0, 1, 2, 3, 4]" :key="l" :class="levelColor(l)" class="w-3 h-3 rounded-sm" />
            <span class="font-mono text-[10px] text-zinc-600">more</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact -->
    <section id="contact" class="border-t border-zinc-900 py-28 px-6">
      <div class="max-w-5xl mx-auto">
        <p
          v-motion
          :initial="{ opacity: 0, y: 40 }"
          :visible="{ opacity: 1, y: 0, transition: { duration: 700 } }"
          class="font-mono text-xs text-cyan-400 tracking-widest mb-4"
        >// contact</p>
      </div>
      <div
        v-motion
        :initial="{ opacity: 0, y: 40 }"
        :visible="{ opacity: 1, y: 0, transition: { duration: 700 } }"
        class="max-w-3xl mx-auto text-center"
      >
        <h2 class="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
          Let's build<br />something great.
        </h2>
        <p class="text-zinc-400 mb-10 leading-relaxed">
          Open to freelance, contracts, and interesting problems.
        </p>

        <div class="flex justify-center flex-wrap gap-3">
          <a
            href="mailto:kaiangelo017@gmail.com"
            class="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-cyan-400 transition-colors duration-200 text-sm"
          >
            <Mail class="w-4 h-4" /> Email Me
          </a>
          <a
            href="https://github.com/imkaiwhyask"
            target="_blank"
            class="inline-flex items-center gap-2 px-6 py-3 border border-zinc-700 rounded-xl text-zinc-400 hover:border-zinc-500 hover:text-white transition-all duration-200 text-sm"
          >
            <Github class="w-4 h-4" /> GitHub
          </a>
          <!-- Update this href with your LinkedIn profile URL -->
          <a
            href="https://linkedin.com/in/"
            target="_blank"
            class="inline-flex items-center gap-2 px-6 py-3 border border-zinc-700 rounded-xl text-zinc-400 hover:border-zinc-500 hover:text-white transition-all duration-200 text-sm"
          >
            <Linkedin class="w-4 h-4" /> LinkedIn
          </a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-zinc-900 py-8 px-6">
      <div class="max-w-5xl mx-auto flex items-center justify-between font-mono text-xs text-zinc-600">
        <span>© 2026 kai</span>
        <div class="flex items-center gap-4">
          <a
            href="https://github.com/imkaiwhyask"
            target="_blank"
            class="hover:text-zinc-400 transition-colors duration-200"
          >
            <Github class="w-3.5 h-3.5" />
          </a>
          <!-- Update this href with your LinkedIn profile URL -->
          <a
            href="https://linkedin.com/in/"
            target="_blank"
            class="hover:text-zinc-400 transition-colors duration-200"
          >
            <Linkedin class="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </footer>

    <!-- Lightbox -->
    <Teleport to="body">
      <Transition name="lightbox">
        <div
          v-if="lightboxImg"
          class="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/90 backdrop-blur-sm p-4"
          @click.self="closeLightbox"
        >
          <div class="relative max-w-5xl w-full">
            <button
              @click="closeLightbox"
              class="absolute -top-10 right-0 font-mono text-xs text-zinc-500 hover:text-white transition-colors"
            >esc / close ×</button>
            <img
              :src="lightboxImg.src"
              :alt="lightboxImg.title"
              class="w-full rounded-xl shadow-2xl border border-zinc-800"
            />
            <p class="mt-3 font-mono text-xs text-zinc-500 text-center">{{ lightboxImg.title }}</p>
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
