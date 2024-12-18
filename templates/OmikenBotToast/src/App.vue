<!-- App.vue -->
<template>
  <div class="app-container">
    <ToastMessage :processed-comments="processedComments" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useCommentSystem } from './useCommentSystem';
import ToastMessage from './ToastMessage.vue';

export default defineComponent({
  components: {
    ToastMessage
  },
  setup() {
    const PLUGIN_UID = 'OmikenPlugin01';
    const BOT_USER_ID = 'FirstCounter';

    const { processedComments, initializeOneSDK } = useCommentSystem(BOT_USER_ID, PLUGIN_UID);
console.log(processedComments);
    onMounted(async () => {
      document.body.removeAttribute('hidden');
      await initializeOneSDK();
    });

    return {
      processedComments
    };
  }
});
</script>

<style scoped>
.app-container {
  width: 100%;
  height: 100%;
}
</style>