<script setup>
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import {
  Sparkles,
  Heart,
  Scale,
  Sun,
  Moon,
  Info,
  Menu,
  X,
  Search,
  Dices,
} from 'lucide-vue-next';
import { useFavoritesStore } from '../stores/favorites';
import { useThemeStore } from '../stores/theme';

const router = useRouter();
const favoritesStore = useFavoritesStore();
const themeStore = useThemeStore();

const mobileMenuOpen = ref(false);

const goToRandomPokemon = () => {
  // Random integer between 1 and 1025
  const randomId = Math.floor(Math.random() * 1025) + 1;
  mobileMenuOpen.value = false;
  router.push(`/pokemon/${randomId}`);
};
</script>

<template>
  <header class="sticky top-0 z-50 w-full backdrop-blur-md bg-white/85 dark:bg-slate-950/85 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Brand / Logo -->
        <RouterLink
          to="/"
          class="flex items-center gap-2.5 group"
          @click="mobileMenuOpen = false"
        >
          <!-- Stylized Pokeball Icon -->
          <div class="relative w-8 h-8 rounded-full border-2 border-slate-900 dark:border-white overflow-hidden shadow-sm transition-transform group-hover:rotate-180 duration-500">
            <div class="h-1/2 bg-poke-red"></div>
            <div class="h-1/2 bg-white"></div>
            <div class="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[3px] bg-slate-900 dark:bg-white"></div>
            <div class="absolute inset-0 m-auto w-2.5 h-2.5 rounded-full border-2 border-slate-900 dark:border-white bg-white"></div>
          </div>

          <span class="text-xl font-black tracking-tight text-slate-900 dark:text-white">
            Poke<span class="text-poke-red">Search</span>
          </span>
        </RouterLink>

        <!-- Desktop Navigation Links -->
        <nav class="hidden md:flex items-center gap-1 text-sm font-semibold">
          <RouterLink
            to="/"
            class="px-3.5 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:text-poke-blue dark:hover:text-yellow-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all"
            active-class="!text-poke-blue dark:!text-yellow-400 bg-slate-100/70 dark:bg-slate-800/80 font-bold"
          >
            Pokedex
          </RouterLink>

          <RouterLink
            to="/favorites"
            class="relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:text-poke-blue dark:hover:text-yellow-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all"
            active-class="!text-poke-blue dark:!text-yellow-400 bg-slate-100/70 dark:bg-slate-800/80 font-bold"
          >
            <Heart class="w-4 h-4 text-red-500" />
            Favorites
            <span
              v-if="favoritesStore.count > 0"
              class="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-red-500 text-white"
            >
              {{ favoritesStore.count }}
            </span>
          </RouterLink>

          <RouterLink
            to="/compare"
            class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:text-poke-blue dark:hover:text-yellow-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all"
            active-class="!text-poke-blue dark:!text-yellow-400 bg-slate-100/70 dark:bg-slate-800/80 font-bold"
          >
            <Scale class="w-4 h-4" />
            Compare
          </RouterLink>

          <RouterLink
            to="/about"
            class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:text-poke-blue dark:hover:text-yellow-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all"
            active-class="!text-poke-blue dark:!text-yellow-400 bg-slate-100/70 dark:bg-slate-800/80 font-bold"
          >
            <Info class="w-4 h-4" />
            About
          </RouterLink>
        </nav>

        <!-- Right action buttons -->
        <div class="flex items-center gap-2">
          <!-- Random Pokemon Button (FR-13) -->
          <button
            type="button"
            @click="goToRandomPokemon"
            class="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-100 text-amber-900 hover:bg-amber-200 dark:bg-yellow-500/15 dark:text-yellow-300 dark:hover:bg-yellow-500/25 transition-all shadow-sm active:scale-95"
            title="Surprise me with a random Pokémon"
          >
            <Dices class="w-4 h-4" />
            <span>Random</span>
          </button>

          <!-- Theme Toggle (FR-12) -->
          <button
            type="button"
            @click="themeStore.toggleTheme"
            class="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            :title="themeStore.isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            aria-label="Toggle theme"
          >
            <Sun v-if="themeStore.isDark" class="w-5 h-5 text-yellow-400" />
            <Moon v-else class="w-5 h-5 text-slate-600" />
          </button>

          <!-- Mobile Menu Button -->
          <button
            type="button"
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Open menu"
          >
            <Menu v-if="!mobileMenuOpen" class="w-6 h-6" />
            <X v-else class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Drawer Menu -->
    <div
      v-if="mobileMenuOpen"
      class="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-2 pb-6 space-y-2 shadow-lg"
    >
      <RouterLink
        to="/"
        @click="mobileMenuOpen = false"
        class="block px-4 py-2.5 rounded-xl text-base font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        Pokedex
      </RouterLink>

      <RouterLink
        to="/favorites"
        @click="mobileMenuOpen = false"
        class="flex items-center justify-between px-4 py-2.5 rounded-xl text-base font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <span class="flex items-center gap-2">
          <Heart class="w-4 h-4 text-red-500" />
          Favorites
        </span>
        <span
          v-if="favoritesStore.count > 0"
          class="px-2 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white"
        >
          {{ favoritesStore.count }}
        </span>
      </RouterLink>

      <RouterLink
        to="/compare"
        @click="mobileMenuOpen = false"
        class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <Scale class="w-4 h-4" />
        Compare Pokémon
      </RouterLink>

      <RouterLink
        to="/about"
        @click="mobileMenuOpen = false"
        class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <Info class="w-4 h-4" />
        About Project
      </RouterLink>

      <div class="pt-2">
        <button
          type="button"
          @click="goToRandomPokemon"
          class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-amber-100 text-amber-900 dark:bg-yellow-500/20 dark:text-yellow-300"
        >
          <Dices class="w-4 h-4" />
          I'm Feeling Lucky (Random)
        </button>
      </div>
    </div>
  </header>
</template>
