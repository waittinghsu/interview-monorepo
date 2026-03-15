<script setup>
import MemberCard from '@/components/member/MemberCard.vue'
import { getCompanyById, getGroupById, getMembersByGroup } from '@/data/kpop.js'

const route = useRoute()
const router = useRouter()

const group = computed(() => getGroupById(route.params.id))
const company = computed(() => group.value ? getCompanyById(group.value.companyId) : null)
const members = computed(() => group.value ? getMembersByGroup(group.value.id) : [])

watchEffect(() => {
  if (group.value === undefined)
    router.replace({ name: 'Home' })
})

function goToMember(memberId) {
  router.push({ name: 'Member', params: { id: memberId } })
}
</script>

<template>
  <div v-if="group" class="flex justify-center min-h-full -mx-4 -mt-4">
    <div class="w-full max-w-[480px] pb-6">
      <!-- Hero 封面圖 -->
      <div class="relative h-[220px] overflow-hidden">
        <img
          v-if="group.cover"
          :src="group.cover"
          :alt="group.name"
          class="w-full h-full object-cover"
        >
        <div
          v-else
          class="w-full h-full"
          :style="{ background: `linear-gradient(135deg, ${group.gradientFrom || '#1e1b4b'}, ${group.gradientTo || '#312e81'})` }"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div class="absolute bottom-4 left-4 right-4">
          <p v-if="company" class="text-white/60 text-xs m-0 mb-0.5">
            {{ company.name }}
          </p>
          <h1 class="text-white text-2xl font-bold m-0 leading-tight">
            {{ group.name }}
          </h1>
          <p class="text-white/70 text-sm m-0 mt-0.5">
            {{ group.koreanName }}
          </p>
        </div>
      </div>

      <!-- Info Chips -->
      <div class="flex flex-wrap gap-2 px-4 py-3 border-b border-sys-border">
        <span
          class="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full"
          :style="{ background: `${group.color}22`, color: group.color }"
        >
          <q-icon name="favorite" size="0.75rem" />
          {{ group.fandomName }}
        </span>
        <span class="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-sys-raised text-textSecondary">
          <q-icon name="calendar_today" size="0.75rem" />
          出道 {{ group.debut }}
        </span>
        <span class="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-sys-raised text-textSecondary">
          <q-icon name="group" size="0.75rem" />
          {{ members.length }} 位成員
        </span>
      </div>

      <!-- 簡介 -->
      <div class="px-4 pt-3 pb-4 border-b border-sys-border">
        <p class="text-textSecondary text-sm leading-relaxed m-0">
          {{ group.description }}
        </p>
      </div>

      <!-- 成員列表 -->
      <div class="px-4 pt-4">
        <h2 class="text-textBase text-sm font-bold mb-4 m-0">
          成員
        </h2>
        <div
          class="grid gap-4"
          :class="members.length <= 4 ? 'grid-cols-4' : members.length <= 6 ? 'grid-cols-3' : 'grid-cols-4'"
        >
          <MemberCard
            v-for="member in members"
            :key="member.id"
            :member="member"
            :clickable="true"
            @click="goToMember"
          />
        </div>
      </div>
    </div>
  </div>
</template>
