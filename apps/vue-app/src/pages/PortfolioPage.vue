<script setup>
const activeFilter = ref('All')
const filters = ['All', 'UI', 'UX', 'Web Design']

const workCards = [
  {
    id: 1,
    title: 'Course Website',
    category: 'Web Design',
    images: ['/images/portfolio/work-card-1.png'],
  },
  {
    id: 2,
    title: 'UI Design',
    category: 'UI',
    images: ['/images/portfolio/work-card-2a.png', '/images/portfolio/work-card-2b.png'],
  },
  {
    id: 3,
    title: 'Mobile UI',
    category: 'UX',
    images: ['/images/portfolio/work-card-3a.png', '/images/portfolio/work-card-3b.png', '/images/portfolio/work-card-3c.png'],
  },
]

const filteredCards = computed(() =>
  activeFilter.value === 'All'
    ? workCards
    : workCards.filter(c => c.category === activeFilter.value),
)

const form = ref({ name: '', email: '', message: '' })

const submitted = ref(false)

function handleSubmit() {
  submitted.value = true
  form.value = { name: '', email: '', message: '' }
  setTimeout(() => {
    submitted.value = false
  }, 3000)
}
</script>

<template>
  <div class="min-h-screen bg-[#222831] text-[#EEEEEE]" style="font-family: 'Poppins', sans-serif;">
    <!-- Section 1: Hero -->
    <section class="relative flex items-center px-16 md:px-24 pt-24 pb-32 min-h-screen overflow-hidden">
      <!-- 左側文字 -->
      <div class="flex flex-col gap-8 z-10 max-w-xl">
        <div>
          <p class="text-lg tracking-widest text-[#EEEEEE] opacity-80 mb-2">
            Hello, It's Me
          </p>
          <h1 class="font-bold leading-tight" style="font-family: 'Oswald', 'Poppins', sans-serif; font-size: clamp(2.5rem, 5vw, 4rem);">
            Sarah Johnson
          </h1>
          <h2 class="font-bold leading-tight mt-2" style="font-family: 'Oswald', 'Poppins', sans-serif; font-size: clamp(1.8rem, 3.5vw, 2.8rem);">
            And I'm a <span style="color:#00ADB5">Creative UI</span>
          </h2>
          <h2 class="font-bold leading-tight" style="font-family: 'Oswald', 'Poppins', sans-serif; font-size: clamp(1.8rem, 3.5vw, 2.8rem); color:#00ADB5">
            Designer
          </h2>
        </div>
        <p class="text-[#EEEEEE] opacity-70 leading-relaxed max-w-md">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <div class="flex gap-4 flex-wrap">
          <button
            class="px-8 py-3 rounded-full font-semibold transition-all hover:scale-105"
            style="background: #00ADB5; color: #222831; border: 2px solid #00ADB5;"
          >
            Hire Me
          </button>
          <button
            class="px-8 py-3 rounded-full font-semibold flex items-center gap-2 transition-all hover:scale-105"
            style="background: transparent; color: #00ADB5; border: 2px solid #00ADB5;"
          >
            Download CV
            <img src="/images/portfolio/download-icon.svg" alt="download" class="w-4 h-4">
          </button>
        </div>
      </div>

      <!-- 右側插圖 -->
      <div class="absolute right-8 md:right-24 top-1/2 -translate-y-1/2 flex items-center justify-center">
        <div class="relative w-[320px] h-[320px] md:w-[420px] md:h-[420px]">
          <!-- Doodle 背景圓形 -->
          <img
            src="/images/portfolio/hero-doodles.png"
            alt="doodles"
            class="absolute inset-0 w-full h-full object-contain opacity-80"
          >
          <!-- 人物 -->
          <img
            src="/images/portfolio/hero-person.svg"
            alt="designer"
            class="absolute inset-0 w-full h-full object-contain"
          >
        </div>
      </div>
    </section>

    <!-- Section 2: About Me -->
    <section class="px-16 md:px-24 py-24 flex flex-col md:flex-row gap-16 items-center">
      <!-- 左側文字 -->
      <div class="flex-1 max-w-lg">
        <h2 class="font-bold mb-6" style="font-family: 'Oswald', 'Poppins', sans-serif; font-size: clamp(2rem, 4vw, 3rem);">
          About <span style="color:#00ADB5">Me</span>
        </h2>
        <p class="opacity-70 leading-relaxed mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        <p class="opacity-70 leading-relaxed mb-8">
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
        </p>
        <a href="#" style="color:#00ADB5" class="font-semibold border-b-2 border-[#00ADB5] pb-1 hover:opacity-80 transition-opacity">
          Read more →
        </a>
      </div>

      <!-- 右側圓形插圖佔位 -->
      <div class="flex-1 flex justify-center">
        <div
          class="w-[280px] h-[280px] md:w-[360px] md:h-[360px] rounded-full flex items-center justify-center"
          style="background: rgba(0,173,181,0.15); border: 3px solid #00ADB5;"
        >
          <span class="text-[#00ADB5] opacity-50 text-lg">Portrait</span>
        </div>
      </div>
    </section>

    <!-- Section 3: My Recent Works -->
    <section class="px-16 md:px-24 py-24">
      <h2 class="font-bold text-center mb-4" style="font-family: 'Oswald', 'Poppins', sans-serif; font-size: clamp(2rem, 4vw, 3rem);">
        My Recent <span style="color:#00ADB5">Works</span>
      </h2>

      <!-- Filter tabs -->
      <div class="flex justify-center gap-3 mb-12 flex-wrap">
        <button
          v-for="f in filters"
          :key="f"
          class="px-6 py-2 rounded-full font-medium transition-all hover:scale-105"
          :style="activeFilter === f
            ? 'background: #00ADB5; color: #222831;'
            : 'background: transparent; color: #EEEEEE; border: 1px solid rgba(238,238,238,0.3);'"
          @click="activeFilter = f"
        >
          {{ f }}
        </button>
      </div>

      <!-- Work cards -->
      <div class="flex flex-wrap justify-center gap-8">
        <div
          v-for="card in filteredCards"
          :key="card.id"
          class="rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-105 hover:shadow-xl"
          style="background: rgba(57,62,70,0.5); backdrop-filter: blur(8px); width: min(320px, 90vw);"
        >
          <!-- Card images -->
          <div class="relative h-[200px] bg-[#393E46] overflow-hidden">
            <img
              v-if="card.images.length === 1"
              :src="card.images[0]"
              :alt="card.title"
              class="w-full h-full object-cover"
            >
            <template v-else>
              <img
                :src="card.images[0]"
                :alt="card.title"
                class="absolute inset-0 w-full h-full object-cover"
              >
              <img
                v-for="(img, idx) in card.images.slice(1)"
                :key="idx"
                :src="img"
                :alt="`${card.title} ${idx + 2}`"
                class="absolute object-cover rounded-lg shadow-lg"
                :style="idx === 0 ? 'width:55%; height:70%; right:8px; bottom:8px;' : 'width:40%; height:55%; right:8px; top:8px;'"
              >
            </template>
          </div>
          <!-- Card info -->
          <div class="p-5">
            <span class="text-xs font-medium px-3 py-1 rounded-full" style="background: rgba(0,173,181,0.2); color: #00ADB5;">
              {{ card.category }}
            </span>
            <h3 class="font-semibold mt-3 mb-2 text-[#EEEEEE]">
              {{ card.title }}
            </h3>
            <a href="#" style="color:#00ADB5" class="text-sm hover:opacity-80 transition-opacity">
              View project →
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 4: Contact -->
    <section class="px-16 md:px-24 py-24 flex flex-col md:flex-row gap-16 items-start">
      <!-- 左側標題 -->
      <div class="md:w-72 flex-shrink-0">
        <h2 class="font-bold leading-tight" style="font-family: 'Oswald', 'Poppins', sans-serif; font-size: clamp(2rem, 4vw, 3rem);">
          Got a project<br>in <span style="color:#00ADB5">mind?</span>
        </h2>
        <p class="opacity-70 mt-4 leading-relaxed">
          Feel free to reach out. I'm always open to discussing new projects, creative ideas, or opportunities.
        </p>
      </div>

      <!-- 右側表單 -->
      <form class="flex-1 flex flex-col gap-5" @submit.prevent="handleSubmit">
        <div class="flex flex-col sm:flex-row gap-5">
          <input
            v-model="form.name"
            type="text"
            placeholder="Name"
            required
            class="flex-1 px-5 py-3 rounded-lg outline-none transition-all"
            style="background: rgba(57,62,70,0.8); border: 1px solid rgba(238,238,238,0.1); color: #EEEEEE;"
          >
          <input
            v-model="form.email"
            type="email"
            placeholder="Email"
            required
            class="flex-1 px-5 py-3 rounded-lg outline-none transition-all"
            style="background: rgba(57,62,70,0.8); border: 1px solid rgba(238,238,238,0.1); color: #EEEEEE;"
          >
        </div>
        <textarea
          v-model="form.message"
          placeholder="Message"
          rows="6"
          required
          class="px-5 py-3 rounded-lg outline-none resize-none transition-all"
          style="background: rgba(57,62,70,0.8); border: 1px solid rgba(238,238,238,0.1); color: #EEEEEE;"
        />
        <div class="flex items-center gap-4">
          <button
            type="submit"
            class="px-10 py-3 rounded-full font-semibold transition-all hover:scale-105 hover:shadow-lg"
            style="background: #00ADB5; color: #222831;"
          >
            Send Message →
          </button>
          <span v-if="submitted" style="color:#00ADB5" class="text-sm font-medium">
            Message sent!
          </span>
        </div>
      </form>
    </section>

    <!-- Footer -->
    <footer class="px-16 md:px-24 py-8 text-center opacity-50 text-sm border-t border-[rgba(238,238,238,0.1)]">
      © 2024 Sarah Johnson. All rights reserved.
    </footer>
  </div>
</template>

<style scoped>
input::placeholder,
textarea::placeholder {
  color: rgba(238, 238, 238, 0.4);
}

input:focus,
textarea:focus {
  border-color: #00ADB5 !important;
  box-shadow: 0 0 0 2px rgba(0, 173, 181, 0.2);
}
</style>
