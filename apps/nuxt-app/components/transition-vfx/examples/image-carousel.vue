<!--&lt;!&ndash; #region main-code &ndash;&gt;-->
<!--<script setup lang="ts">-->
<!--import { until, useCycleList } from '@vueuse/core'-->
<!--import { computed, ref } from 'vue'-->
<!--import BaseBtn from '../../base-btn.vue'-->
<!--import TransitionVfx from '../transition-vfx.vue'-->
<!--import { TransitionName } from '../type'-->

<!--const transitionCycle = useCycleList(Object.values(TransitionName))-->
<!--const transitionName = computed(() => ({ name: transitionCycle.state.value }))-->

<!--const imageList = [-->
<!--  '/low/painting-codfish-bakery.webp',-->
<!--  '/low/painting-codfish-rain.webp',-->
<!--  '/low/photography-fireworks.webp',-->
<!--  '/low/photography-morning-light-of-rice.webp',-->
<!--  '/low/photography-big-stupid-bird.webp',-->
<!--  '/low/photography-ears-of-rice.webp',-->
<!--  '/low/photography-gaomei-windmill.webp',-->
<!--  '/low/photography-spider-at-night.webp',-->
<!--  '/low/photography-street-cat.webp',-->
<!--]-->
<!--const imageCycle = useCycleList(imageList)-->

<!--const image = computed(() => imageCycle.state.value)-->

<!--const isStarted = ref(false)-->
<!--const isEntering = ref(false)-->
<!--const isLeaving = ref(false)-->

<!--const isTransitioning = computed(() => isEntering.value || isLeaving.value)-->

<!--async function changeTransition() {-->
<!--  await until(isEntering).toBe(true)-->
<!--  await until(isEntering).toBe(false)-->
<!--  transitionCycle.next()-->
<!--}-->

<!--async function next() {-->
<!--  isStarted.value = true-->
<!--  imageCycle.next()-->

<!--  await until(isLeaving).toBe(true)-->
<!--  await until(isLeaving).toBe(false)-->

<!--  isStarted.value = false-->

<!--  changeTransition()-->
<!--}-->

<!--async function prev() {-->
<!--  isStarted.value = true-->
<!--  imageCycle.prev()-->

<!--  await until(isEntering).toBe(true)-->
<!--  await until(isEntering).toBe(false)-->

<!--  isStarted.value = false-->

<!--  changeTransition()-->
<!--}-->
<!--</script>-->

<!--<template>-->
<!--  <div class="w-full flex flex-col gap-4">-->
<!--    <div class="relative h-[50vh]">-->
<!--      <TransitionVfx-->
<!--        :enter-params="transitionName"-->
<!--        :leave-params="transitionName"-->
<!--        @enter="isEntering = true"-->
<!--        @leave="isLeaving = true"-->
<!--        @after-enter="isEntering = false"-->
<!--        @after-leave="isLeaving = false"-->
<!--      >-->
<!--        <div-->
<!--          v-if="!isStarted"-->
<!--          class="absolute left-0 top-0 h-full w-full overflow-hidden rounded-lg"-->
<!--        >-->
<!--          <img-->
<!--            :src="image"-->
<!--            class="h-full w-full object-cover"-->
<!--          >-->
<!--        </div>-->
<!--      </TransitionVfx>-->
<!--    </div>-->

<!--    <div-->
<!--      class="flex gap-4 duration-300"-->
<!--      :class="{ ' cursor-not-allowed opacity-30': isTransitioning }"-->
<!--    >-->
<!--      <BaseBtn-->
<!--        label="上一個"-->
<!--        class="flex-1"-->
<!--        :class="{ 'pointer-events-none': isTransitioning }"-->
<!--        @click="prev()"-->
<!--      />-->
<!--      <BaseBtn-->
<!--        label="下一個"-->
<!--        class="flex-1"-->
<!--        :class="{ 'pointer-events-none': isTransitioning }"-->
<!--        @click="next()"-->
<!--      />-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--&lt;!&ndash; #endregion main-code &ndash;&gt;-->
