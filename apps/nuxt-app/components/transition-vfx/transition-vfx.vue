<script lang="ts">
</script>

<script setup lang="ts">
import type { CSSProperties, TransitionProps } from 'vue'
import type { ActorInstance, TransitionParams } from './type'
import { vIntersectionObserver } from '@vueuse/components'
import { until, useElementBounding } from '@vueuse/core'
import {
  computed,
  defineAsyncComponent,
  reactive,
  ref,
  useId,
  useTemplateRef,
} from 'vue'

// #region Props
interface Props {
  appear?: boolean
  enterParams?: TransitionParams
  leaveParams?: TransitionParams
  duration?: number
}
// #endregion Props
const props = withDefaults(defineProps<Props>(), {
  appear: false,
  enterParams: () => ({ name: 'shatter' }),
  leaveParams: () => ({ name: 'shatter' }),
})

// #region Emits
const emit = defineEmits<{
  (e: 'enter'): void
  (e: 'afterEnter'): void
  (e: 'leave'): void
  (e: 'afterLeave'): void
}>()
// #endregion Emits

// #region Slots
defineSlots<{
  default?: () => unknown
}>()
// #endregion Slots

/** 動態載入所有元件 */
const actorModules = import.meta.glob('./actors/*.vue')

/** 如果 appear 為 false，則需快速結束第一次動畫 */
let isFirst = true
const visible = ref(true)

/** actor 放大係數，避免被裁切 */
const scale = 3

const enterEl = ref<HTMLElement>()
const enterElBounding = reactive(useElementBounding(enterEl))

const enterActor = computed(() => {
  const { name } = props.enterParams

  const value = actorModules[`./actors/actor-${name}.vue`]
  if (!value)
    throw new Error(`找不到 enter actor：${props.enterParams.name}`)

  const module = value as Parameters<typeof defineAsyncComponent>[0]

  return defineAsyncComponent(module)
})
const enterActorRef = useTemplateRef<ActorInstance>('enterActorRef')
const enterActorStyle = computed<CSSProperties>(() => ({
  top: `${enterElBounding.top}px`,
  left: `${enterElBounding.left}px`,
  width: `${enterElBounding.width * scale}px`,
  height: `${enterElBounding.height * scale}px`,
}))

const leaveEl = ref<HTMLElement>()
const leaveElBounding = reactive(useElementBounding(leaveEl))

const leaveActor = computed(() => {
  const { name } = props.leaveParams

  const value = actorModules[`./actors/actor-${name}.vue`]
  if (!value)
    throw new Error(`找不到 leave actor：${props.leaveParams.name}`)

  const module = value as Parameters<typeof defineAsyncComponent>[0]

  return defineAsyncComponent(module)
})
const leaveActorRef = useTemplateRef<ActorInstance>('leaveActorRef')
const leaveActorStyle = computed<CSSProperties>(() => ({
  top: `${leaveElBounding.top}px`,
  left: `${leaveElBounding.left}px`,
  width: `${leaveElBounding.width * scale}px`,
  height: `${leaveElBounding.height * scale}px`,
}))

// 進入事件
const handleBeforeEnter: TransitionProps['onBeforeEnter'] = (el) => {
  if (!(el instanceof HTMLElement))
    return
  el.style.opacity = '0'
  el.classList.add('anchor')

  enterEl.value = el
}
const handleEnter: TransitionProps['onEnter'] = async (el, done) => {
  // console.log(`[handleEnter] ~ el:`, el)
  emit('enter')
  if (!(el instanceof HTMLElement)) {
    return done()
  }

  if (!props.appear && isFirst) {
    el.style.opacity = '1'
    isFirst = false
    return done()
  }

  // console.log(`[handleEnter] ~ init`)
  await until(enterActorRef).toBeTruthy()
  await enterActorRef.value?.init(el, 1)
  await enterActorRef.value?.enter()
  el.style.opacity = '1'

  // console.log(`[handleEnter] ~ enter done`)
  done()
}
const handleAfterEnter: TransitionProps['onAfterEnter'] = (el) => {
  emit('afterEnter')
  enterEl.value = undefined
}

// 離開事件
const handleBeforeLeave: TransitionProps['onBeforeLeave'] = (el) => {
  if (!(el instanceof HTMLElement))
    return
  el.classList.add('anchor')

  leaveEl.value = el
}
const handleLeave: TransitionProps['onLeave'] = async (el, done) => {
  // console.log(`[handleLeave] ~ el:`, el)
  emit('leave')
  if (!(el instanceof HTMLElement)) {
    // console.log(`[handleLeave] ~ done`)
    return done()
  }

  // console.log(`[handleLeave] ~ init`)
  await until(leaveActorRef).toBeTruthy()
  await leaveActorRef.value?.init(el, 0)
  el.style.opacity = '0'
  await leaveActorRef.value?.leave()

  // console.log(`[handleLeave] ~ leave done`)
  done()
}
const handleAfterLeave: TransitionProps['onAfterLeave'] = (el) => {
  emit('afterLeave')
  leaveEl.value = undefined
}

const anchorName = ref(`--${useId()}`)
</script>

<template>
  <transition
    v-intersection-observer="[
      ([entry]) => { visible = !!entry?.isIntersecting },
      { threshold: 1 },
    ]"
    appear
    :css="false"
    @before-enter="handleBeforeEnter"
    @enter="handleEnter"
    @after-enter="handleAfterEnter"
    @before-leave="handleBeforeLeave"
    @leave="handleLeave"
    @after-leave="handleAfterLeave"
  >
    <slot />
  </transition>

  <!-- leave actor -->
  <client-only>
    <component
      :is="leaveActor"
      ref="leaveActorRef"
      class="actor leave-actor fixed"
      :class="{ ' opacity-0': !visible }"
      :style="leaveActorStyle"
      :scale="scale"
      :duration="props.duration"
    />
  </client-only>

  <!-- enter actor -->
  <client-only>
    <component
      :is="enterActor"
      ref="enterActorRef"
      class="actor enter-actor fixed"
      :class="{ ' opacity-0': !visible }"
      :style="enterActorStyle"
      :scale="scale"
      :duration="props.duration"
    />
  </client-only>
</template>

<style lang="sass">
.actor
  position-anchor: v-bind(anchorName)
  top: anchor(50%) !important
  left: anchor(50%) !important
  transform: translate(-50%, -50%)

.anchor
  anchor-name: v-bind(anchorName)
</style>
