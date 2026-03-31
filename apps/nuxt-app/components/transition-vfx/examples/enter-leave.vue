<!--&lt;!&ndash; #region main-code &ndash;&gt;-->
<!--<script setup lang="ts">-->
<!--import { computed, ref } from 'vue'-->
<!--import { useI18n } from 'vue-i18n'-->
<!--import BaseCheckbox from '../../base-checkbox.vue'-->
<!--import BaseInput from '../../base-input.vue'-->
<!--import TransitionVfx from '../transition-vfx.vue'-->
<!--import { TransitionName } from '../type'-->

<!--const { t } = useI18n()-->

<!--const text = ref(t('inputPlaceholder'))-->
<!--const styles = ref({-->
<!--  bold: false,-->
<!--  italic: false,-->
<!--})-->

<!--const isTransitioning = ref(false)-->
<!--const visible = ref(true)-->
<!--const enterName = ref<`${TransitionName}`>('shatter')-->
<!--const leaveName = ref<`${TransitionName}`>('shatter')-->

<!--const params = computed(() => ({-->
<!--  enter: { name: enterName.value },-->
<!--  leave: { name: leaveName.value },-->
<!--}))-->

<!--const options = Object.values(TransitionName)-->
<!--</script>-->

<!--<template>-->
<!--  <div class="w-full flex flex-col gap-4">-->
<!--    <div class="grid grid-cols-6 items-center gap-2 border rounded p-4">-->
<!--      <div class="col-span-2 md:col-span-1">-->
<!--        {{ t('enterEffect') }}-->
<!--      </div>-->

<!--      <div class="col-span-4 border rounded md:col-span-2">-->
<!--        <select-->
<!--          v-model="enterName"-->
<!--          class="w-full p-2"-->
<!--        >-->
<!--          <option-->
<!--            v-for="option in options"-->
<!--            :key="option"-->
<!--            :value="option"-->
<!--          >-->
<!--            {{ option }}-->
<!--          </option>-->
<!--        </select>-->
<!--      </div>-->

<!--      <div class="col-span-2 md:col-span-1">-->
<!--        {{ t('leaveEffect') }}-->
<!--      </div>-->

<!--      <div class="col-span-4 border rounded md:col-span-2">-->
<!--        <select-->
<!--          v-model="leaveName"-->
<!--          class="w-full p-2"-->
<!--        >-->
<!--          <option-->
<!--            v-for="option in options"-->
<!--            :key="option"-->
<!--            :value="option"-->
<!--          >-->
<!--            {{ option }}-->
<!--          </option>-->
<!--        </select>-->
<!--      </div>-->

<!--      <div-->
<!--        class="col-span-6 border rounded-lg duration-300"-->
<!--        :class="{-->
<!--          'cursor-not-allowed opacity-30': isTransitioning,-->
<!--          'cursor-pointer': !isTransitioning,-->
<!--        }"-->
<!--      >-->
<!--        <BaseCheckbox-->
<!--          v-model="visible"-->
<!--          :label="t('show')"-->
<!--          class="w-full cursor-pointer p-4"-->
<!--          :class="{ 'pointer-events-none': isTransitioning }"-->
<!--        />-->
<!--      </div>-->
<!--    </div>-->

<!--    <div-->
<!--      class="min-h-[60vmax] flex items-center justify-center"-->
<!--      :class="{ 'pointer-events-none': isTransitioning }"-->
<!--    >-->
<!--      <TransitionVfx-->
<!--        :enter-params="params.enter"-->
<!--        :leave-params="params.leave"-->
<!--        @enter="isTransitioning = true"-->
<!--        @leave="isTransitioning = true"-->
<!--        @after-enter="isTransitioning = false"-->
<!--        @after-leave="isTransitioning = false"-->
<!--      >-->
<!--        <div-->
<!--          v-if="visible"-->
<!--          class="card flex flex-col items-center gap-4 border rounded-xl p-6"-->
<!--        >-->
<!--          <img-->
<!--            src="/low/profile.webp"-->
<!--            class="mb-4 h-[180px] w-[180px] overflow-hidden border-4 border-white rounded-full shadow-xl"-->
<!--          >-->

<!--          <div class="text-xl font-bold">-->
<!--            {{ t('codfishName') }}-->
<!--          </div>-->

<!--          <BaseInput-->
<!--            v-model="text"-->
<!--            class="text-center md:w-[22rem]"-->
<!--            :class="{-->
<!--              'font-bold': styles.bold,-->
<!--              'italic': styles.italic,-->
<!--            }"-->
<!--          />-->

<!--          <div class="flex gap-2">-->
<!--            <BaseCheckbox-->
<!--              v-model="styles.bold"-->
<!--              :label="t('bold')"-->
<!--            />-->

<!--            <BaseCheckbox-->
<!--              v-model="styles.italic"-->
<!--              :label="t('italic')"-->
<!--            />-->
<!--          </div>-->
<!--        </div>-->
<!--      </TransitionVfx>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<style scoped lang="sass">-->
<!--.card-->
<!--  background-color: light-dark(#edf0f2, #383e45)-->
<!--</style>-->
<!--&lt;!&ndash; #endregion main-code &ndash;&gt;-->

<!--<i18n lang="json">-->
<!--{-->
<!--  "zh-hant": {-->
<!--    "enterEffect": "進入特效",-->
<!--    "leaveEffect": "離開特效",-->
<!--    "show": "顯示",-->
<!--    "codfishName": "鱈魚 Codfish",-->
<!--    "inputPlaceholder": "困擾買不到 IP69K 等級的防水電腦 (╥ω╥`)",-->
<!--    "bold": "粗體",-->
<!--    "italic": "斜體"-->
<!--  },-->
<!--  "en": {-->
<!--    "enterEffect": "Enter Effect",-->
<!--    "leaveEffect": "Leave Effect",-->
<!--    "show": "Show",-->
<!--    "codfishName": "Codfish",-->
<!--    "inputPlaceholder": "Frustrated about not finding an IP69K waterproof computer (╥ω╥`)",-->
<!--    "bold": "Bold",-->
<!--    "italic": "Italic"-->
<!--  }-->
<!--}-->
<!--</i18n>-->
