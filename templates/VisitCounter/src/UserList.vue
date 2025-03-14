<!-- src/UserList.vue -->
<template>
 <div class="user-container" v-if="IS_VISIBLE_USERS">
  <div class="user-only" v-if="SVG_MODE < 0"></div>
  <div class="user-list" ref="userList">
   <div v-for="user in sortedUsers" :key="user.name" class="user-list-item">
    <span :class="{ 'first-visit-name': user.isFirstVisit }">{{ user.name }}</span>
    <span v-if="user.status" class="user-status">{{ user.status }}</span>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { UserVisit } from './parts/types';

const props = defineProps<{
 users: UserVisit[];
 SVG_MODE: number;
 IS_VISIBLE_USERS: boolean;
}>();

// 表示するユーザーリスト
const sortedUsers = computed(() =>
 props.users.sort((a, b) => {
  if ((a.isFirstVisit || a.kiriban) !== (b.isFirstVisit || b.kiriban))
   return b.isFirstVisit || b.kiriban ? 1 : -1;
  return b.timeStamp - a.timeStamp;
 })
);
</script>
