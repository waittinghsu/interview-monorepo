<!--&lt;!&ndash; #region main-code &ndash;&gt;-->
<!--<script setup lang="ts">-->
<!--import { vIntersectionObserver } from '@vueuse/components'-->
<!--import { promiseTimeout } from '@vueuse/core'-->
<!--import { computed, ref } from 'vue'-->
<!--import TransitionVfx from '../transition-vfx.vue'-->

<!--const visibleList = ref<boolean[]>([])-->
<!--const allGone = computed(() => visibleList.value.every(value => !value))-->

<!--async function handleIntersection(index: number, entry: IntersectionObserverEntry | undefined) {-->
<!--  if (visibleList.value[index] === undefined) {-->
<!--    visibleList.value[index] = true-->
<!--  }-->

<!--  const value = !entry?.isIntersecting && visibleList.value[index]-->

<!--  if (!value) {-->
<!--    await promiseTimeout(600)-->
<!--    visibleList.value[index] = value-->
<!--  }-->
<!--}-->

<!--const teamMembers = [-->
<!--  { name: '鱈魚', desc: '困擾買不到 IP69K 等級的防水電腦 (╥ω╥`)', img: '/low/profile.webp' },-->
<!--  { name: '玻璃魚', desc: '善成用舌頭清潔魚缸的玻璃 (๑•̀ㅂ•́)و✧', img: '/low/profile-2.webp' },-->
<!--  { name: '野餐魚', desc: '熱愛戶外活動的魚，總是帶著便當盒 ( ´ ▽ ` )ﾉ', img: '/low/profile-3.webp' },-->
<!--]-->
<!--</script>-->

<!--<template>-->
<!--  <div class="h-[70vh] w-full overflow-auto border border-gray-200 rounded-xl p-2">-->
<!--    <div class="h-[70vh] flex items-center justify-center text-xl text-gray-400">-->
<!--      {{ !allGone ? '滾動查看下方更多精彩資訊 ◝( •ω• )◟' : '歪歪，主機承受不住流量了 乁( ◔ ௰◔)「' }}-->
<!--    </div>-->

<!--    <div class="w-full flex flex-col gap-8 p-4">-->
<!--      <div v-intersection-observer="([entry]) => handleIntersection(0, entry)">-->
<!--        <TransitionVfx :duration="2000">-->
<!--          <div-->
<!--            v-if="visibleList[0]"-->
<!--            class="text-center text-6xl text-gray-600 font-extrabold"-->
<!--          >-->
<!--            歡迎來到 Cod 工作室-->
<!--          </div>-->
<!--        </TransitionVfx>-->
<!--      </div>-->

<!--      <div v-intersection-observer="([entry]) => handleIntersection(1, entry)">-->
<!--        <TransitionVfx :duration="2000">-->
<!--          <div-->
<!--            v-if="visibleList[1]"-->
<!--            class="mt-6 text-center text-xl text-gray-500"-->
<!--          >-->
<!--            專注於提供 Fish 解決方案，從 XX 設計、YY 互動到 ZZ 視覺，助你破壞品牌形象。-->
<!--          </div>-->
<!--        </TransitionVfx>-->
<!--      </div>-->

<!--      <div v-intersection-observer="([entry]) => handleIntersection(2, entry)">-->
<!--        <TransitionVfx :duration="2000">-->
<!--          <div-->
<!--            v-if="visibleList[2]"-->
<!--            class="my-12 w-full rounded-xl bg-gray-100 py-5 text-center text-gray-800"-->
<!--          >-->
<!--            需求一出手，回應不落空；使命必達、如影隨形-->
<!--          </div>-->
<!--        </TransitionVfx>-->
<!--      </div>-->

<!--      <div class="flex flex-col items-center gap-4">-->
<!--        <div v-intersection-observer="([entry]) => handleIntersection(3, entry)">-->
<!--          <TransitionVfx :duration="2000">-->
<!--            <button-->
<!--              v-if="visibleList[3]"-->
<!--              class="rounded-full bg-purple-500 px-10 py-6 text-2xl text-white shadow-lg"-->
<!--            >-->
<!--              即刻體驗-->
<!--            </button>-->
<!--          </TransitionVfx>-->
<!--        </div>-->

<!--        <div v-intersection-observer="([entry]) => handleIntersection(4, entry)">-->
<!--          <TransitionVfx :duration="2000">-->
<!--            <span-->
<!--              v-if="visibleList[4]"-->
<!--              class="mt-4 text-center text-base text-gray-400"-->
<!--            >-->
<!--              讓你的品牌立即炎上！-->
<!--            </span>-->
<!--          </TransitionVfx>-->
<!--        </div>-->
<!--      </div>-->

<!--      <div class="flex flex-col gap-4">-->
<!--        <div v-intersection-observer="([entry]) => handleIntersection(5, entry)">-->
<!--          <TransitionVfx :duration="2000">-->
<!--            <div-->
<!--              v-if="visibleList[5]"-->
<!--              class="rounded p-6"-->
<!--            >-->
<!--              <div class="mb-2 text-lg font-bold">-->
<!--                專業團隊-->
<!--              </div>-->
<!--              <div class="text-gray-600">-->
<!--                我們的團隊由經驗豐富且充滿熱情的專業人士組成，致力於為客戶提供最佳解決方案。-->
<!--              </div>-->
<!--            </div>-->
<!--          </TransitionVfx>-->
<!--        </div>-->

<!--        <div-->
<!--          v-for="(member, i) in teamMembers"-->
<!--          :key="member.name"-->
<!--          v-intersection-observer="([entry]) => handleIntersection(6 + i, entry)"-->
<!--        >-->
<!--          <TransitionVfx :duration="2000">-->
<!--            <div-->
<!--              v-if="visibleList[6 + i]"-->
<!--              class="card w-fll flex items-center gap-4 border rounded-xl p-6"-->
<!--            >-->
<!--              <img-->
<!--                :src="member.img"-->
<!--                class="mb-4 aspect-square w-[100px] shrink-0 overflow-hidden border-4 border-white rounded-full shadow-xl"-->
<!--              >-->

<!--              <div class="flex flex-col gap-4">-->
<!--                <div class="text-xl font-bold">-->
<!--                  {{ member.name }}-->
<!--                </div>-->

<!--                <div>-->
<!--                  {{ member.desc }}-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--          </TransitionVfx>-->
<!--        </div>-->
<!--      </div>-->

<!--      <div v-intersection-observer="([entry]) => handleIntersection(9, entry)">-->
<!--        <TransitionVfx :duration="2000">-->
<!--          <div-->
<!--            v-if="visibleList[9]"-->
<!--            class="mt-12 text-center text-sm text-gray-400"-->
<!--          >-->
<!--            © 2025 Cod 工作室。版權所有，不得轉載。-->
<!--          </div>-->
<!--        </TransitionVfx>-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<style scoped lang="sass">-->
<!--.card-->
<!--  background-color: light-dark(#edf0f2, #383e45)-->
<!--</style>-->

<!--&lt;!&ndash; #endregion main-code &ndash;&gt;-->
