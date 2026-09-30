import { http, HttpResponse, delay } from 'msw'

const mockDelay = 0

function success<T>(data: T) {
  return { code: 0, message: 'success', data }
}

function error(message?: string, code = 500, data = null) {
  return { code, message, data }
}

function paginate<T>(list: T[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize
  return {
    list: list.slice(start, start + pageSize),
    total: list.length,
    page,
    pageSize,
  }
}

function filterList<
  T extends {
    title?: string
    description?: string
    summary?: string
    category?: string
    tags?: string[]
  },
>(list: T[], keyword?: string, category?: string, tag?: string) {
  return list.filter((item) => {
    if (keyword) {
      const text =
        `${item.title || ''} ${item.description || ''} ${item.summary || ''}`.toLowerCase()
      if (!text.includes(keyword.toLowerCase())) return false
    }
    if (category && item.category !== category) return false
    if (tag && !item.tags?.includes(tag)) return false
    return true
  })
}

export const handlers = [
  // get
  http.get('/api/test/get', async () => {
    await delay(mockDelay)
    return HttpResponse.json(
      success({
        id: 1,
        name: '测试数据',
      }),
    )
  }),
  // post
  http.post('/api/test/post', async ({ request }) => {
    await delay(mockDelay)
    const body = (await request.json()) as { data1: string; data2: string }
    const newMsg = {
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
      data1: body.data1,
      data2: body.data2,
    }
    return HttpResponse.json(success(newMsg))
  }),
  // get detail
  http.get('/api/test/get/:id', async ({ params }) => {
    await delay(mockDelay)
    const id = params.id
    const project = { id, name: '测试项目' }
    if (!project) return HttpResponse.json(error('项目不存在'))
    return HttpResponse.json(success(project))
  }),
  // get list
  http.get('/api/test/list', async ({ request }) => {
    await delay(mockDelay)
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page')) || 1
    const pageSize = Number(url.searchParams.get('pageSize')) || 10
    const keyword = url.searchParams.get('keyword') || undefined
    const category = url.searchParams.get('category') || undefined
    const tag = url.searchParams.get('tag') || undefined
    const filtered = filterList(mockProjects, keyword, category, tag)
    return HttpResponse.json(success(paginate(filtered, page, pageSize)))
  }),
]

const mockProjects = Array.from({ length: 30 }, (_, i) => {
  return {
    id: String(i + 1),
    title: `title${i + 1}`,
    description: `description${i + 1}`,
    category: `category${(i % 5) + 1}`,
    tags: [`tag${(i % 3) + 1}`, `tag${((i + 1) % 3) + 1}`],
  }
})
