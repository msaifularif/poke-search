<script setup>
import { onMounted } from 'vue';
import { ExternalLink, CheckCircle2, ShieldCheck, Zap, Heart, Database, Code2 } from 'lucide-vue-next';

onMounted(() => {
  document.title = 'About Poke-Search — Architecture & Documentation';
});

const features = [
  'Instant search with real-time debounce for names and Pokédex IDs',
  'Filter by Pokémon Type and Generation (Gen 1 through Gen 9)',
  'Detailed Pokémon profiles with official artwork, animated showdown GIFs, and shiny forms',
  'Base stats visualizations with color-coded progress bars',
  'Interactive Pokémon cries audio playback',
  'Interactive evolution chains with branching support and evolution triggers',
  'Type effectiveness calculator for 4×, 2× weaknesses, resistances, and immunities',
  'Personal favorites system saved directly to browser localStorage',
  'Side-by-side Pokémon battle comparison tool',
  'Dark and Light theme toggle with system preference detection',
];

const techStack = [
  { name: 'Vue 3', desc: 'Composition API with <script setup>' },
  { name: 'Vite 6', desc: 'Next generation frontend tooling' },
  { name: 'Tailwind CSS 3', desc: 'Utility-first modern styling' },
  { name: 'Pinia', desc: 'Intuitive, type-friendly store management' },
  { name: 'Vue Router 4', desc: 'Client-side SPA navigation' },
  { name: 'PokéAPI v2', desc: 'Public RESTful Pokémon API' },
];
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
    <!-- Header -->
    <div class="space-y-3 text-center sm:text-left">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-poke-blue/10 dark:bg-yellow-400/10 text-poke-blue dark:text-yellow-400 text-xs font-bold uppercase tracking-wider">
        <Zap class="w-3.5 h-3.5" />
        Product Documentation
      </div>
      <h1 class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
        About Poke-Search
      </h1>
      <p class="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
        Poke-Search is a responsive, modern web application designed for exploring Pokémon data from Generation 1 to Generation 9. Built with Vue 3, Vite, Tailwind CSS, and powered by the public PokéAPI.
      </p>
    </div>

    <!-- Tech Stack Grid -->
    <div class="space-y-4">
      <h2 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <Code2 class="w-5 h-5 text-poke-blue dark:text-yellow-400" />
        Technology Stack
      </h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div
          v-for="tech in techStack"
          :key="tech.name"
          class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800"
        >
          <div class="font-bold text-slate-900 dark:text-white text-sm">
            {{ tech.name }}
          </div>
          <div class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {{ tech.desc }}
          </div>
        </div>
      </div>
    </div>

    <!-- Core Features List -->
    <div class="space-y-4">
      <h2 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <CheckCircle2 class="w-5 h-5 text-emerald-500" />
        Key Capabilities
      </h2>
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm divide-y divide-slate-100 dark:divide-slate-800/60">
        <div
          v-for="(feat, idx) in features"
          :key="idx"
          class="py-3 first:pt-0 last:pb-0 flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-poke-blue dark:bg-yellow-400"></span>
          <span>{{ feat }}</span>
        </div>
      </div>
    </div>

    <!-- Data Attribution & Disclaimer -->
    <div class="p-6 rounded-3xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
      <h3 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <Database class="w-4 h-4 text-slate-500" />
        Data Source & Disclaimer
      </h3>
      <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
        All Pokémon data, sprites, audio cries, and stats are consumed dynamically via the
        <a href="https://pokeapi.co" target="_blank" rel="noopener noreferrer" class="text-poke-blue dark:text-yellow-400 font-semibold underline">PokéAPI REST v2</a>.
        Data is cached in client memory to optimize performance and prevent rate limiting.
      </p>
      <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
        Pokémon and Pokémon character names are trademarks of Nintendo, Creatures Inc., and Game Freak. This project is open-source and intended solely for non-commercial educational purposes.
      </p>
    </div>
  </div>
</template>