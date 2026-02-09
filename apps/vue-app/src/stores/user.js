import { defineStore } from 'pinia'
import { userApi } from '@/api'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || '')
  const loading = ref(false)

  const isLoggedIn = computed(() => !!token.value)

  async function login(credentials) {
    loading.value = true
    try {
      const response = await userApi.login(credentials)
      token.value = response.token
      user.value = response.user
      localStorage.setItem('token', response.token)
      return response
    }
    finally {
      loading.value = false
    }
  }

  async function logout() {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
  }

  async function fetchUser() {
    if (!token.value)
      return
    loading.value = true
    try {
      const response = await userApi.getProfile()
      user.value = response
    }
    finally {
      loading.value = false
    }
  }

  return {
    user,
    token,
    loading,
    isLoggedIn,
    login,
    logout,
    fetchUser,
  }
})
