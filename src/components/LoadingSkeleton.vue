<script setup>
defineProps({
  count: {
    type: Number,
    default: 12,
  },
  type: {
    type: String,
    default: 'card', // 'card' or 'detail'
  },
});
</script>

<template>
  <!-- Card Grid Skeleton -->
  <div
    v-if="type === 'card'"
    class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-4"
  >
    <div
      v-for="i in count"
      :key="i"
      class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 space-y-3 animate-pulse"
    >
      <div class="flex justify-between items-center">
        <div class="h-3 w-10 bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div class="h-4 w-4 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
      </div>
      <div class="flex justify-center my-4">
        <div class="h-24 w-24 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
      </div>
      <div class="space-y-2">
        <div class="h-4 w-2/3 bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div class="flex gap-1.5">
          <div class="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
          <div class="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Detail Page Skeleton -->
  <div v-else class="max-w-4xl mx-auto space-y-8 animate-pulse p-4">
    <div class="h-8 w-40 bg-slate-200 dark:bg-slate-800 rounded"></div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
      <div class="flex flex-col items-center justify-center space-y-4">
        <div class="w-64 h-64 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
        <div class="flex gap-2">
          <div class="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
          <div class="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
        </div>
      </div>
      <div class="space-y-6">
        <div class="space-y-2">
          <div class="h-7 w-1/2 bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div class="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div class="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded"></div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="h-16 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          <div class="h-16 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        </div>
        <div class="space-y-3 pt-4">
          <div v-for="j in 6" :key="j" class="h-4 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
        </div>
      </div>
    </div>
  </div>
</template>
