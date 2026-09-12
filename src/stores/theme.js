import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  // Check localStorage or system preference
  const savedTheme = localStorage.getItem('poke_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const isDark = ref(savedTheme !== null ? savedTheme === 'dark' : prefersDark);

  const applyTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    isDark.value = !isDark.value;
    localStorage.setItem('poke_theme', isDark.value ? 'dark' : 'light');
    applyTheme();
  };

  // Initial apply
  applyTheme();

  return {
    isDark,
    toggleTheme,
    applyTheme,
  };
});
