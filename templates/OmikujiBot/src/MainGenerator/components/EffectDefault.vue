<!-- src/MainGenerator/components/EffectDefault.vue -->
<template>
 <BaseCommentCard :comment="comment" />
</template>

<script setup lang="ts">
import BaseCommentCard from './BaseCommentCard.vue';
import { CommentBot } from '@/types';

const props = defineProps<{
 comment: CommentBot;
}>();
</script>
