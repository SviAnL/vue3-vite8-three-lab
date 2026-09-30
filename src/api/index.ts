import { get, post } from '@/api/request'
import type { PaginatedResponse, PaginationParams } from './types'

interface TestType {
  id: string
  name: string
}

export const testApi = {
  getTest: () => get<TestType>('/test/get'),
  postTest: (data: TestType) => post<{ success: boolean }>('/test/post', data),
  getTestDetail: (id: string) => get<TestType>(`/test/get/${id}`),
  getTestList: (params: PaginationParams) => get<PaginatedResponse<TestType>>('/test/list', params),
}
