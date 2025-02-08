<template>
 <div class="ranking-container mx-5 p-5 text-4xl rounded-3xl">
  <div class="text-center mb-2.5">
   <span class="ranking-title"> 🍉スイカランキング🍉 </span>
  </div>

  <ul class="list-none p-0 m-0">
   <li
    v-for="(player, index) in rankings"
    :key="index"
    class="py-0 px-2.5 flex items-center font-bold"
    :class="getRankingClass(index)"
   >
    <template v-if="index < 3">
     <img
      v-if="iconUrls[player.userId]"
      :src="iconUrls[player.userId]"
      :alt="`${index + 1}位の画像`"
      class="inline-block w-20 h-20 mr-5"
     />
     <img
      v-else
      src="/default-icon2.png"
      :alt="`${index + 1}位の画像`"
      class="inline-block w-20 h-20 mr-5"
     />
    </template>
    <template v-else>
     <span class="inline-block w-20 h-20 mr-5 text-center">[{{ index + 1 }}]</span>
    </template>

    <span class="flex justify-center items-center w-full">
     <span class="text-base">{{ player.points }}</span>
     <span class="text-sm">({{ player.name }})</span>
    </span>
   </li>
  </ul>

  <div class="text-sm flex justify-center items-center w-full">
   Average: {{ averagePoint }} ( {{ totalCount }} / {{ totalPoint }} )
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { getListenerList } from '@common/ApiHandler';
import type { UserRankingType } from './type';
import { UserStoreData } from '@onecomme.com/onesdk/types/UserData';

interface Props {
 rankings: UserRankingType[];
 averagePoint: number;
 totalCount: number;
 totalPoint: number;
}

const props = defineProps<Props>();

const rankingClasses = {
 0: 'ranking-gold',
 1: 'ranking-silver',
 2: 'ranking-bronze',
 default: 'ranking-normal'
} as const;

const getRankingClass = (index: number): string => {
 return rankingClasses[index as keyof typeof rankingClasses] || rankingClasses.default;
};

const iconUrls = ref<Record<string, string>>({});

const getUserIconUrl = async (userId: string) => {
 const ListenerList = (await getListenerList()) as UserStoreData;
 if (ListenerList[userId]?.icon) {
  iconUrls.value[userId] = ListenerList[userId].icon;
 }
};

// rankingsが変更されたときに上位3位のアイコンを取得
watch(
 () => props.rankings,
 async (newRankings) => {
  for (let i = 0; i < Math.min(3, newRankings.length); i++) {
   await getUserIconUrl(newRankings[i].userId);
  }
 },
 { immediate: true }
); // コンポーネント初期化時にも実行
</script>

<style>
.ranking-container {
 background-color: #ffeeb3;
 border: 3px solid #ffcc00;
}

.ranking-title {
 color: #f5e5bc;
 text-shadow:
  -3px -3px 3px #b3843a,
  3px -3px 3px #b3843a,
  -3px 3px 3px #b3843a,
  3px 3px 3px #b3843a;
}

.ranking-gold {
 background: linear-gradient(to right, #f4d777, #fff2c6);
 color: #b99f4f;
}

.ranking-silver {
 background: linear-gradient(to right, #a1bccc, #d5e5f2);
 color: #5380b3;
}

.ranking-bronze {
 background: linear-gradient(to right, #f0b16e, #ffe1bd);
 color: #bc7851;
}

.ranking-normal {
 background: linear-gradient(to right, #d9e9f7, #f2f9ff);
 color: #4d6f8c;
}
</style>
