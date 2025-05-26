<!-- src/MainGenerator/components/EffectDefault.vue -->
<template>
 <BaseCommentCard :comment="comment" />
</template>

<script setup lang="ts">
import BaseCommentCard from './BaseCommentCard.vue';
import { CommentGod } from '@/types';

const props = defineProps<{
 comment: CommentGod;
}>();
</script>
