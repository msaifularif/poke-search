<script setup>
import { computed } from 'vue';
import { getTypeStyle } from '../api/typeChart';

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: 'md', // 'sm', 'md', 'lg'
  },
  variant: {
    type: String,
    default: 'solid', // 'solid', 'light', 'outline'
  },
});

const style = computed(() => getTypeStyle(props.type));

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'text-[10px] px-2 py-0.5 tracking-wider';
    case 'lg':
      return 'text-sm px-4 py-1.5 font-semibold tracking-wide';
    default:
      return 'text-xs px-2.5 py-1 font-medium tracking-wide';
  }
});

const variantClasses = computed(() => {
  if (props.variant === 'light') {
    return style.value.light;
  }
  if (props.variant === 'outline') {
    return `border ${style.value.border} text-slate-700 dark:text-slate-200 bg-transparent`;
  }
  return `${style.value.bg} ${style.value.text} shadow-sm`;
});
</script>

<template>
  <span
    class="inline-flex items-center justify-center rounded-full uppercase transition-transform select-none font-bold"
    :class="[sizeClasses, variantClasses]"
  >
    {{ type }}
  </span>
</template>
