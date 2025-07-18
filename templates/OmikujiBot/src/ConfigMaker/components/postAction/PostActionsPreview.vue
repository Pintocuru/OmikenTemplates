<!-- src/configMaker/components/comments/PostActionsPreview.vue -->
<template>
 <div class="bg-base-200 rounded p-3 text-sm relative">
  <div v-if="actions.length !== 0" class="space-y-0">
   <div
    v-for="(action, index) in actions"
    :key="index"
    class="flex items-center gap-2 p-1 hover:bg-base-300 rounded"
   >
    <div class="flex items-center gap-2 flex-shrink-0">
     <span class="badge badge-primary badge-sm">{{ index + 1 }}</span>
     <span class="bg-accent text-accent-content text-xs px-1 rounded"
      >{{ action.delaySeconds }}s</span
     >
    </div>

    <div
     v-if="action.messageContent || action.messageToast"
     class="flex items-center gap-2 flex-shrink-0"
    >
     <CharacterIcon
      :character-key="action.characterKey"
      :icon-key="action.iconKey"
      img-class="w-6 h-6 rounded-full"
      fallback-class="w-6 h-6 rounded-full bg-base-300 flex items-center justify-center text-xs"
     />
     <span class="text-xs text-base-content/70">{{ charactersMap[action.characterKey].name }}</span>
    </div>

    <div class="flex-1 min-w-0">
     <div class="flex flex-wrap gap-1 items-center">
      <span v-if="action.messageContent" class="text-info">💬</span>
      <span v-if="action.messageToast" class="text-warning">🍞</span>
      <span v-if="action.wordParty" class="text-accent">🎉</span>
      <span class="text-base-content truncate">
       {{ action.messageContent || action.messageToast || action.wordParty }}
      </span>
     </div>
    </div>
   </div>
  </div>
  <div v-else class="text-base-content/70 italic">Post Actions が設定されていません</div>

  <button
   @click="postTestOmeComme"
   class="btn btn-sm btn-info absolute right-3 bottom-3 z-10"
   :disabled="actions.length === 0"
  >
   テスト投稿
  </button>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { DefaultPlaceholders, PostActionSchema, PostActionType } from '@type/';
import { useOmikujiStore } from '@/ConfigMaker/script/useOmikujiStore';
import { usePlaceholderStore } from '@ConfigScript/usePlaceholderStore';
import { useCharacterStore } from '@ConfigScript/useCharacterStore';
import CharacterIcon from '@ConfigComponents/parts/CharacterIcon.vue';
import { PostMessage } from '@/MainGenerator/utils/PostMessage2';
import { PlaceProcess } from '@/MainGenerator/utils/PlaceProcess2';
import { toast } from 'vue-sonner';
import { ScriptManager } from '@/MainGenerator/utils/ScriptManager';
import { UserCommentProcessor } from '@/MainGenerator/utils/UserCommentProcessor';

// Props
const props = defineProps<{
 actions: PostActionType[];
}>();

// Store
const omikujiStore = useOmikujiStore();
const characterStore = useCharacterStore();
const charactersMap = computed(() => characterStore.rulesMap);
const placeholderStore = usePlaceholderStore();
const placeholdersMap = computed(() => placeholderStore.rulesMap);

//

// プレビュー投稿
const postTestOmeComme = () => {
 const scriptManager = new ScriptManager(omikujiStore.data);
 const userCommentProcessor = new UserCommentProcessor(omikujiStore.data, scriptManager);
 const placeProcess = new PlaceProcess(placeholdersMap.value);
 const postMessage = new PostMessage(charactersMap.value);

 // TODO:userなどのプレースホルダーも処理が必要です
 const defaultPlaceholders: Record<DefaultPlaceholders, string | number> = {
  user: 'テストユーザー',
  lc: 0,
  tc: 0,
  viewer: 0,
  upVote: 0
 };
 placeProcess.updateResolvedValues(defaultPlaceholders);
 const processedActions = placeProcess.processPostActions(props.actions);
 postMessage.post(processedActions);
 toastTestPost(processedActions);
};

// toast用
const toastTestPost = async (posts: PostActionType[]): Promise<void> => {
 try {
  await Promise.all(
   posts.map(async (post) => {
    if (post.messageToast !== '') toast.success(post.messageToast);
   })
  );
 } catch (error) {
  console.error('メッセージ投稿処理のトースト表示中にエラーが発生しました:', error);
  // エラーが発生した場合にもユーザーにフィードバック
  toast.error('テスト投稿の表示中にエラーが発生しました。');
 }
};
</script>
