<!-- ToastMessage.vue -->
<template>
 <div id="message-container" ref="container">
  <transition-group name="message-fade" tag="div">
   <div
    v-for="(message, index) in messages"
    :key="index"
    class="message"
    :style="{
     color: message.textColor,
     backgroundColor: message.backgroundColor,
     '--lcv-background-brightness': message.brightness,
     '--lcv-background-opacity': message.opacity
    }"
   >
    <div class="message-content">{{ message.content }}</div>
    <img v-if="message.imageUrl" :src="message.imageUrl" class="message-image" :alt="message.botKey" />
   </div>
  </transition-group>
 </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { CharaType } from '../../../public/types/';
import { CommentTemp } from './commentTypes';

export default defineComponent({
 name: 'ToastMessage',
 props: {
  Charas: {
   type: Object as () => Record<string, CharaType>,
   required: true
  }
 },
 data() {
  return {
   messages: [] as Array<{
    content: string;
    botKey: string;
    textColor: string;
    backgroundColor: string;
    imageUrl: string | null;
    brightness: string;
    opacity: string;
   }>,
   maxWidth: 600
  };
 },
 methods: {
  showComment(comment: CommentTemp) {
   if (!comment) return;

   // キャラクターを探す
   const chara = Object.values(this.Charas).find((c) => c.name === comment.data.name);

   if (!chara) {
    console.warn(`Character not found for name: ${comment.data.name}`);
    return;
   }

   const messageObj = {
    content: comment.data.speechText || '',
    botKey: chara.name,
    textColor: comment.css['--lcv-text-color'] || 'white',
    backgroundColor: comment.css['--lcv-background-color'] || 'rgba(0, 0, 0, 0.7)',
    imageUrl: chara.image.Default ? `${this.getImagePath()}${chara.image.Default}` : null,
    brightness: comment.css['--lcv-background-brightness'] || '100%',
    opacity: comment.css['--lcv-background-opacity'] || '100%'
   };

   this.messages.unshift(messageObj);

   setTimeout(() => {
    const duration = this.calculateLifeTime(comment);
    setTimeout(() => {
     this.messages.splice(this.messages.indexOf(messageObj), 1);
    }, duration);
   }, 10);
  },
  getImagePath() {
   // 画像のベースパスを返す（プロジェクトに合わせて調整）
   return '/path/to/images/';
  },
  calculateLifeTime(comment: CommentTemp): number {
   const LIFE_TIME = 10000; // 基本表示時間
   const THRESHOLD = 30; // この文字数以上であれば表示時間を延長
   const extraTime = Math.max((comment.data.speechText?.length ?? 0) - THRESHOLD, 0) * 100;
   return LIFE_TIME + extraTime;
  }
 },
 mounted() {
  // スタイルの追加（前回と同様）
  const style = document.createElement('style');
  style.textContent = `
      #message-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 5000;
        display: flex;
        flex-direction: column-reverse;
        align-items: flex-end;
      }
      .message {
        display: flex;
        align-items: center;
        padding: 5px 5px 5px 25px;
        border-radius: 995px;
        font-size: 28px;
        margin-top: 10px;
        max-width: ${this.maxWidth}px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        user-select: none;
        background-color: var(--lcv-background-color);
        opacity: calc(var(--lcv-background-opacity, 100%) / 100);
        filter: brightness(var(--lcv-background-brightness, 100%));
      }
      .message-content {
        flex-grow: 1;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
      .message-image {
        width: 50px;
        height: 50px;
        margin-left: 5px;
        object-fit: cover;
        border-radius: 25px;
      }
      .message-fade-enter-active, .message-fade-leave-active {
        transition: opacity 0.3s ease-in-out;
      }
      .message-fade-enter, .message-fade-leave-to {
        opacity: 0;
      }
    `;
  document.head.appendChild(style);
 }
});
</script>
