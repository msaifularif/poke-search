import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

const STORAGE_KEY = 'poke_team';

export const useTeamStore = defineStore('team', () => {
  const team = ref([]);
  const notification = ref(null);

  const loadTeam = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        team.value = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load team from localStorage:', e);
      team.value = [];
    }
  };

  const saveTeam = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(team.value));
    } catch (e) {
      console.error('Failed to save team to localStorage:', e);
    }
  };

  const isInTeam = (id) => {
    const numId = Number(id);
    return team.value.some((p) => Number(p.id) === numId);
  };

  const showNotification = (msg, isError = false) => {
    notification.value = { msg, isError };
    setTimeout(() => {
      notification.value = null;
    }, 3000);
  };

  const addToTeam = (pokemon) => {
    const numId = Number(pokemon.id);
    if (isInTeam(numId)) {
      showNotification(`${pokemon.displayName || pokemon.name} is already in your team!`, true);
      return false;
    }

    if (team.value.length >= 6) {
      showNotification('Your team is full! (Maximum 6 Pokémon)', true);
      return false;
    }

    team.value.push({
      id: pokemon.id,
      name: pokemon.name,
      displayName: pokemon.displayName || pokemon.name,
      formattedId: pokemon.formattedId || `#${String(pokemon.id).padStart(3, '0')}`,
      sprite: pokemon.sprites?.artwork || pokemon.sprite || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`,
      types: pokemon.types ? pokemon.types.map((t) => (typeof t === 'string' ? { name: t } : t)) : [],
    });

    saveTeam();
    showNotification(`Added ${pokemon.displayName || pokemon.name} to your team!`);
    return true;
  };

  const removeFromTeam = (id) => {
    const numId = Number(id);
    const removed = team.value.find((p) => Number(p.id) === numId);
    team.value = team.value.filter((p) => Number(p.id) !== numId);
    saveTeam();
    if (removed) {
      showNotification(`Removed ${removed.displayName || removed.name} from your team.`);
    }
  };

  const toggleTeamMember = (pokemon) => {
    if (isInTeam(pokemon.id)) {
      removeFromTeam(pokemon.id);
      return false;
    } else {
      return addToTeam(pokemon);
    }
  };

  const clearTeam = () => {
    team.value = [];
    saveTeam();
    showNotification('Your team has been reset.');
  };

  const count = computed(() => team.value.length);
  const isFull = computed(() => team.value.length >= 6);

  loadTeam();

  return {
    team,
    count,
    isFull,
    notification,
    isInTeam,
    addToTeam,
    removeFromTeam,
    toggleTeamMember,
    clearTeam,
  };
});
