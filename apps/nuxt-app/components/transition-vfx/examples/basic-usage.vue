<!--&lt;!&ndash; #region main-code &ndash;&gt;-->
<!--<script setup lang="ts">-->
<!--import { ref } from 'vue'-->
<!--import BaseCheckbox from '../../base-checkbox.vue'-->
<!--import TransitionVfx from '../transition-vfx.vue'-->

<!--const visible = ref(true)-->
<!--</script>-->

<!--<template>-->
<!--  <div class="w-full flex flex-col gap-4 border border-gray-200 rounded-xl p-6">-->
<!--    <div class="flex flex-col gap-4 border rounded">-->
<!--      <BaseCheckbox-->
<!--        v-model="visible"-->
<!--        :label="$t('show')"-->
<!--        class="p-4"-->
<!--      />-->
<!--    </div>-->

<!--    <div class="flex justify-center">-->
<!--      <TransitionVfx>-->
<!--        <div-->
<!--          v-if="visible"-->
<!--          class="card rounded p-6"-->
<!--        >-->
<!--          {{ $t('hello') }}-->
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
<!--    "show": "顯示",-->
<!--    "hello": "安安"-->
<!--  },-->
<!--  "en": {-->
<!--    "show": "Show",-->
<!--    "hello": "Hello"-->
<!--  }-->
<!--}-->
<!--</i18n>-->
