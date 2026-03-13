<script setup>
import { getGroupById, getMemberById } from '@/data/kpop.js'

const route = useRoute()
const router = useRouter()

const member = computed(() => getMemberById(route.params.id))
const group = computed(() => member.value ? getGroupById(member.value.groupId) : null)

watchEffect(() => {
  if (member.value === undefined)
    router.replace({ name: 'Home' })
})

function goToGroup() {
  if (group.value)
    router.push({ name: 'Group', params: { id: group.value.id } })
}
</script>

<template>
  <div v-if="member" class="flex justify-center min-h-full -mx-4 -mt-4">
    <div class="w-full max-w-[480px] pb-8">
      <!-- 照片 Hero -->
      <div class="relative h-[300px] overflow-hidden">
        <img
          v-if="member.photo"
          :src="member.photo"
          :alt="member.name"
          class="w-full h-full object-cover object-top"
        >
        <!-- 無照片時用大漸層色塊 -->
        <div
          v-else
          class="w-full h-full flex items-center justify-center"
          :style="{ background: `radial-gradient(circle at 50% 30%, ${member.color || '#374151'}66, ${member.color || '#374151'}22 70%), linear-gradient(180deg, transparent 40%, black)` }"
        >
          <span class="text-white/20 font-bold select-none" style="font-size: 8rem; line-height: 1">
            {{ member.name.charAt(0) }}
          </span>
        </div>
        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        <!-- 返回團體連結 -->
        <button
          class="absolute top-4 left-4 flex items-center gap-1 bg-transparent border-none cursor-pointer p-0"
          @click="goToGroup"
        >
          <q-icon name="arrow_back_ios" size="0.875rem" class="text-white/70" />
          <span class="text-white/70 text-xs">{{ group?.name }}</span>
        </button>

        <!-- 姓名覆蓋 -->
        <div class="absolute bottom-4 left-4 right-4">
          <h1 class="text-white text-2xl font-bold m-0 leading-tight">
            {{ member.name }}
          </h1>
          <p class="text-white/70 text-sm m-0 mt-0.5">
            {{ member.koreanName }} · {{ member.englishName }}
          </p>
        </div>
      </div>

      <!-- 基本資料卡片 -->
      <div class="mx-4 mt-4 bg-sys-card rounded-2xl border border-sys-border p-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-textMuted text-[10px] uppercase tracking-wider m-0 mb-0.5">
              生日
            </p>
            <p class="text-textBase text-sm font-medium m-0">
              {{ member.birthday }}
            </p>
          </div>
          <div>
            <p class="text-textMuted text-[10px] uppercase tracking-wider m-0 mb-0.5">
              國籍
            </p>
            <p class="text-textBase text-sm font-medium m-0">
              {{ member.nationality }}
            </p>
          </div>
          <div v-if="group" class="col-span-2">
            <p class="text-textMuted text-[10px] uppercase tracking-wider m-0 mb-0.5">
              所屬團體
            </p>
            <button
              class="text-sm font-medium bg-transparent border-none cursor-pointer p-0 flex items-center gap-1"
              :style="{ color: group.color }"
              @click="goToGroup"
            >
              {{ group.name }}
              <q-icon name="open_in_new" size="0.75rem" />
            </button>
          </div>
        </div>
      </div>

      <!-- 擔當 -->
      <div class="px-4 mt-4">
        <h2 class="text-textBase text-sm font-bold mb-3 m-0">
          擔當
        </h2>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="pos in member.position"
            :key="pos"
            class="text-xs font-medium px-3 py-1.5 rounded-full"
            :style="{ background: `${member.color || '#374151'}22`, color: member.color || '#94a3b8' }"
          >
            {{ pos }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
