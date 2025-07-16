<!-- src/ConfigMaker/components/display/DisplaySettingsEditor.vue -->
<template>
 <div class="space-y-4">
  <DisplaySettingsCard />
  <StartupSettingsCard />
  <DisplayModeSettingsCard />
  <AutoSwitchSettingsCard />
 </div>
</template>

<script setup lang="ts">
import DisplaySettingsCard from './DisplaySettingsCard.vue';
import StartupSettingsCard from './StartupSettingsCard.vue';
import DisplayModeSettingsCard from './DisplayModeSettingsCard.vue';
import AutoSwitchSettingsCard from './AutoSwitchSettingsCard.vue';
</script>
