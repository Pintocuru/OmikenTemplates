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
     backgroundColor: message.backgroundColor
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
import { CharaType } from '../../../public/types'; // 型定義のインポートパス
import OneSDK from '@onecomme.com/onesdk';

export default defineComponent({
 name: 'ToastMessage',
 data() {
  return {
   messages: [] as Array<{
    content: string;
    botKey: string;
    textColor: string;
    backgroundColor: string;
    imageUrl: string | null;
   }>,
   maxWidth: 600,
   Charas: {} as Record<string, CharaType>
  };
 },
 methods: {
  show(botKey: string, iconKey: string = 'Default', message: string) {
   // Charasからキャラクター情報を取得
   const characterData = this.Charas[botKey];

   if (!characterData) {
    console.warn(`Character ${botKey} not found`);
    return;
   }

   // アイコンキーの検証（指定されたキーが存在しない場合はDefaultに戻す）
   const validIconKey = characterData.image[iconKey] ? iconKey : 'Default';

   const messageObj = {
    content: message,
    botKey: botKey,
    textColor: characterData.color['--lcv-text-color'] || 'white',
    backgroundColor: characterData.color['--lcv-background-color'] || 'rgba(0, 0, 0, 0.7)',
    imageUrl: characterData.image[validIconKey] ? `${characterData.image[validIconKey]}` : null
   };

   this.messages.unshift(messageObj);

   setTimeout(() => {
    const duration = 15000; // 15秒
    setTimeout(() => {
     this.messages.splice(this.messages.indexOf(messageObj), 1);
    }, duration);
   }, 10);
  },
  async initCharas() {
   const PLUGIN_UID = 'OmikenPlugin01';
   const url = `http://localhost:11180/api/plugins/${PLUGIN_UID}?mode=data&type=Charas`;

   try {
    const res = await OneSDK.get(url, {});
    this.Charas = res.data.response || {};
   } catch (error) {
    console.error('Failed to fetch Charas:', error);
    this.Charas = {};
   }
  }
 },
 mounted() {
  // キャラクターデータの初期化
  this.initCharas();

  // スタイルの追加
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
