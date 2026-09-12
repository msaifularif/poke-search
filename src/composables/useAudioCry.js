import { ref } from 'vue';

export function useAudioCry() {
  const isPlaying = ref(false);
  const error = ref(null);
  let audio = null;

  const playCry = (cryUrl) => {
    if (!cryUrl) {
      error.value = 'No sound cry available';
      return;
    }

    try {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }

      audio = new Audio(cryUrl);
      isPlaying.value = true;
      error.value = null;

      audio.onended = () => {
        isPlaying.value = false;
      };

      audio.onerror = (e) => {
        console.warn('Audio cry playback error:', e);
        isPlaying.value = false;
        error.value = 'Failed to play sound cry';
      };

      audio.play().catch((err) => {
        console.warn('Playback prevented by browser or failed:', err);
        isPlaying.value = false;
        error.value = 'Playback blocked';
      });
    } catch (err) {
      console.error(err);
      isPlaying.value = false;
      error.value = err.message;
    }
  };

  return {
    isPlaying,
    error,
    playCry,
  };
}
