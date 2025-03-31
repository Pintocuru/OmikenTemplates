<!-- src/apps/configMaker/components/CounterSetInfo.vue -->
<template>
 <div class="space-y-4">
  <div class="form-control">
   <label class="label">
    <span class="label-text">ID</span>
   </label>
   <input
    type="text"
    v-model="counterSet.id"
    placeholder="一意のID"
    class="input input-bordered w-full"
   />
   <label class="label">
    <span class="label-text-alt">システム内で一意の識別子を設定してください</span>
   </label>
  </div>
 </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type { CounterSet } from '@scripts/types';

const props = defineProps<{
 counterSet: CounterSet;
}>();
</script>
