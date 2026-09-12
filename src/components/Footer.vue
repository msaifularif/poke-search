<script setup>
import { Heart, Github } from 'lucide-vue-next';
</script>

<template>
  <footer class="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 mt-16 py-10 text-xs text-slate-500 dark:text-slate-400">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
      <div>
        <p class="font-medium text-slate-700 dark:text-slate-300">
          Poke-Search — Modern Pokémon Search & Profile Web App
        </p>
        <p class="mt-1">
          Built with Vue 3, Vite, Tailwind CSS & PokéAPI.
        </p>
      </div>

      <div class="flex items-center gap-6">
        <a
          href="https://pokeapi.co"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-poke-blue dark:hover:text-yellow-400 transition-colors"
        >
          PokéAPI Documentation
        </a>
        <a
          href="https://github.com/msaifularif/poke-search"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1 hover:text-poke-blue dark:hover:text-yellow-400 transition-colors"
        >
          <Github class="w-4 h-4" />
          GitHub
        </a>
      </div>
    </div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 text-[11px] text-slate-400 text-center">
      Pokémon and Pokémon character names are trademarks of Nintendo, Creatures Inc., and Game Freak. This fan project is for educational purposes.
    </div>
  </footer>
</template>
