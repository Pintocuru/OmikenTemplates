<!-- src/MainGenerator/components/ViewUserVisits.vue -->
<template>
 <div class="user-visits-container">
  <div class="header">
   <h2>ユーザー訪問データ</h2>
   <div class="stats">
    <span class="total-users">総ユーザー数: {{ totalUsers }}</span>
    <span class="active-users">アクティブユーザー: {{ activeUsers }}</span>
   </div>
  </div>

  <div class="user-list" ref="userListRef">
   <div
    v-for="[userId, visitData] in userEntries"
    :key="userId"
    class="user-item"
    :class="{ active: visitData.isActive }"
   >
    <div class="user-info">
     <div class="user-id">{{ userId }}</div>
     <div class="user-name">{{ visitData.userName || 'Unknown' }}</div>
    </div>

    <div class="visit-details">
     <div class="service-info">
      <span class="service-name">{{ visitData.serviceName }}</span>
      <span class="visit-count">訪問: {{ visitData.visitCount }}回</span>
     </div>

     <div class="timestamps">
      <div class="first-visit">初回: {{ formatDate(visitData.firstVisit) }}</div>
      <div class="last-visit">最終: {{ formatDate(visitData.lastVisit) }}</div>
     </div>
    </div>

    <div class="status-indicator" :class="visitData.isActive ? 'online' : 'offline'">
     {{ visitData.isActive ? 'オンライン' : 'オフライン' }}
    </div>
   </div>
  </div>

  <div class="footer">
   <button @click="refreshData" class="refresh-btn">データ更新</button>
   <button @click="clearInactive" class="clear-btn">非アクティブユーザーを非表示</button>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, defineExpose } from 'vue';
import { ServiceVisitType } from '@common/types/ServiceTypes';

// Props
interface Props {
 userVisitsData: Record<string, ServiceVisitType>;
}

const props = defineProps<Props>();

// Refs
const userListRef = ref<HTMLElement>();

// Computed
const userEntries = computed(() => {
 return Object.entries(props.userVisitsData || {});
});

const totalUsers = computed(() => {
 return userEntries.value.length;
});

const activeUsers = computed(() => {
 return userEntries.value.filter(([_, visitData]) => visitData.isActive).length;
});

// Methods
const formatDate = (timestamp: number | Date) => {
 if (!timestamp) return 'N/A';
 const date = new Date(timestamp);
 return date.toLocaleDateString('ja-JP', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
 });
};

const refreshData = () => {
 // データ更新のロジック（親コンポーネントから制御される場合）
 console.log('ユーザー訪問データを更新');
};

const clearInactive = () => {
 // 非アクティブユーザーを非表示にする処理
 console.log('非アクティブユーザーを非表示');
};

const scrollToTop = () => {
 if (userListRef.value) {
  userListRef.value.scrollTop = 0;
 }
};

const scrollToBottom = () => {
 if (userListRef.value) {
  userListRef.value.scrollTop = userListRef.value.scrollHeight;
 }
};

// Expose methods for parent component
defineExpose({
 refreshData,
 clearInactive,
 scrollToTop,
 scrollToBottom
});

onMounted(() => {
 console.log('ViewUserVisits component mounted');
});
</script>

<style scoped>
.user-visits-container {
 height: 100vh;
 background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
 color: white;
 display: flex;
 flex-direction: column;
 padding: 20px;
 box-sizing: border-box;
}

.header {
 margin-bottom: 20px;
}

.header h2 {
 margin: 0 0 10px 0;
 font-size: 24px;
 font-weight: 700;
}

.stats {
 display: flex;
 gap: 20px;
 font-size: 14px;
 opacity: 0.9;
}

.user-list {
 flex: 1;
 overflow-y: auto;
 padding: 10px;
 border-radius: 10px;
 background: rgba(255, 255, 255, 0.1);
 backdrop-filter: blur(10px);
}

.user-item {
 background: rgba(255, 255, 255, 0.15);
 border-radius: 8px;
 padding: 15px;
 margin-bottom: 10px;
 transition: all 0.3s ease;
 border-left: 4px solid transparent;
}

.user-item:hover {
 background: rgba(255, 255, 255, 0.2);
 transform: translateX(5px);
}

.user-item.active {
 border-left-color: #4caf50;
 background: rgba(76, 175, 80, 0.2);
}

.user-info {
 display: flex;
 justify-content: space-between;
 align-items: center;
 margin-bottom: 10px;
}

.user-id {
 font-weight: bold;
 font-size: 16px;
}

.user-name {
 font-size: 14px;
 opacity: 0.8;
}

.visit-details {
 display: flex;
 justify-content: space-between;
 margin-bottom: 10px;
}

.service-info {
 display: flex;
 flex-direction: column;
 gap: 5px;
}

.service-name {
 font-weight: bold;
 color: #ffd700;
}

.visit-count {
 font-size: 12px;
 opacity: 0.8;
}

.timestamps {
 display: flex;
 flex-direction: column;
 gap: 5px;
 font-size: 12px;
 opacity: 0.7;
}

.status-indicator {
 padding: 4px 8px;
 border-radius: 4px;
 font-size: 12px;
 font-weight: bold;
 text-align: center;
 width: fit-content;
 margin-left: auto;
}

.status-indicator.online {
 background: #4caf50;
 color: white;
}

.status-indicator.offline {
 background: #757575;
 color: white;
}

.footer {
 display: flex;
 gap: 10px;
 margin-top: 20px;
}

.refresh-btn,
.clear-btn {
 padding: 10px 20px;
 border: none;
 border-radius: 5px;
 cursor: pointer;
 font-weight: bold;
 transition: all 0.3s ease;
}

.refresh-btn {
 background: #4caf50;
 color: white;
}

.refresh-btn:hover {
 background: #45a049;
}

.clear-btn {
 background: #f44336;
 color: white;
}

.clear-btn:hover {
 background: #da190b;
}

/* スクロールバーのスタイル */
.user-list::-webkit-scrollbar {
 width: 8px;
}

.user-list::-webkit-scrollbar-track {
 background: rgba(255, 255, 255, 0.1);
 border-radius: 10px;
}

.user-list::-webkit-scrollbar-thumb {
 background: rgba(255, 255, 255, 0.3);
 border-radius: 10px;
}

.user-list::-webkit-scrollbar-thumb:hover {
 background: rgba(255, 255, 255, 0.5);
}
</style>
