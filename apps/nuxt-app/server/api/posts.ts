/**
 * Mock 文章 API（用於 SSR 示範）
 * GET /api/posts
 */
export default defineEventHandler(() => {
  return [
    {
      id: 1,
      title: 'SSR 實驗文章 1',
      content: '這是服務器端渲染的內容，搜索引擎可以看到。查看網頁源碼可以找到這段文字！',
    },
    {
      id: 2,
      title: 'SSR 實驗文章 2',
      content: 'Server-Side Rendering 會在服務器端預先渲染 HTML，提升 SEO 和首屏性能。',
    },
    {
      id: 3,
      title: 'SSR 實驗文章 3',
      content: '與客戶端渲染（CSR）不同，SSR 的內容直接包含在 HTML 中，無需等待 JavaScript 載入。',
    },
  ]
})