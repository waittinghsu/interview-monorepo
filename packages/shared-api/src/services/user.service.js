/**
 * User Service
 * @param {import('axios').AxiosInstance} httpClient
 */
export function createUserService(httpClient) {
  return {
    // 登入
    login(credentials) {
      return httpClient.post('/auth/login', credentials)
    },

    // 註冊
    register(data) {
      return httpClient.post('/auth/register', data)
    },

    // 取得用戶資料
    getProfile() {
      return httpClient.get('/user/profile')
    },

    // 更新用戶資料
    updateProfile(data) {
      return httpClient.put('/user/profile', data)
    },

    // 登出
    logout() {
      return httpClient.post('/auth/logout')
    },
  }
}