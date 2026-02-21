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
      // business code 解包後，response 即 data 欄位的內容 { token, user }
      const data = await userApi.login(credentials, { useYApiMock: true })
      token.value = data.token
      user.value = data.user
      localStorage.setItem('token', data.token)
      return data
    }
    finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await userApi.logout({ silentError: true, useYApiMock: true })
    }
    catch {
      // silentError = true，登出失敗時仍清除本地狀態
    }
    finally {
      token.value = ''
      user.value = null
      localStorage.removeItem('token')
    }
  }

  async function fetchUser() {
    if (!token.value)
      return
    loading.value = true
    try {
      const data = await userApi.getUserInfo({ useYApiMock: true })
      user.value = data
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
