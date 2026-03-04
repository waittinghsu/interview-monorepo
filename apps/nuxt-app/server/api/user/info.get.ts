export default defineEventHandler(() => {
  return {
    code: 200,
    msg: 'OK',
    data: {
      token: 'server-api-mock-token',
      user: {
        memberId: '12345',
        name: 'Server API User',
        nickname: 'server-user',
        phone: '0912345678',
        email: 'server@example.com',
        level: 5,
        avatarId: 3,
        role: 'user',
        bookmarks: [1, 2, 3],
        balance: '1000.00',
      },
    },
  }
})
