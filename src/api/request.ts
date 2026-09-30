import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { API_RESULT_CODE, APP_STORAGE_KEYS, APP_TOKEN_PREFIX } from '@/constants'
import i18n from '@/locales/setup'
import { toastError } from '@/utils'
import type { ApiResponse } from './types'

/** 请求配置扩展 */
interface RequestConfig extends AxiosRequestConfig {
  /** 是否跳过重复请求拦截 */
  skipDuplicate?: boolean
  /** 重试次数 */
  retryCount?: number
}

/** 进行中的请求 Map */
const pendingRequests = new Map<string, AbortController>()

/** 生成请求唯一标识 */
function getRequestKey(config: InternalAxiosRequestConfig): string {
  const { method, url, params, data } = config
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&')
}

/** 移除重复请求 */
function removePendingRequest(config: InternalAxiosRequestConfig): void {
  const key = getRequestKey(config)
  if (pendingRequests.has(key)) {
    pendingRequests.get(key)?.abort()
    pendingRequests.delete(key)
  }
}

/** 创建 Axios 实例 */
function createAxiosInstance(): AxiosInstance {
  const t = i18n.global.t

  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 0,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const reqConfig = config as InternalAxiosRequestConfig & RequestConfig

      if (!reqConfig.skipDuplicate) {
        removePendingRequest(config)
        const controller = new AbortController()
        config.signal = controller.signal
        pendingRequests.set(getRequestKey(config), controller)
      }

      if (config.method?.toUpperCase() === 'GET') {
        config.params = {
          ...config.params,
          _t: Date.now(),
        }
      }

      const token = localStorage.getItem(APP_STORAGE_KEYS.TOKEN)
      if (token) {
        config.headers.Authorization = `${APP_TOKEN_PREFIX}${token}`
      }

      return config
    },
    (error) => Promise.reject(error),
  )

  instance.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
      removePendingRequest(response.config as InternalAxiosRequestConfig)

      const { code, message } = response.data

      if (code === API_RESULT_CODE.SUCCESS) {
        return { ...response, data: response.data }
      }

      toastError(message || t('common.requestFail'))
      return Promise.reject(new Error(message))
    },
    async (error) => {
      if (error.config) {
        removePendingRequest(error.config as InternalAxiosRequestConfig)
      }

      if (axios.isCancel(error)) {
        return Promise.reject(error)
      }

      const reqConfig = error.config as (InternalAxiosRequestConfig & RequestConfig) | undefined
      const status = error.response?.status

      if (reqConfig && reqConfig.retryCount && reqConfig.retryCount > 0) {
        reqConfig.retryCount -= 1
        await new Promise((r) => setTimeout(r, 1000))
        return instance(reqConfig)
      }

      const message =
        error.response?.data?.message ||
        (status ? `${t('common.requestFail')} (${status})` : t('common.networkError'))

      toastError(message)
      return Promise.reject(error)
    },
  )

  return instance
}

const http = createAxiosInstance()

export async function request<T>(config: RequestConfig): Promise<T> {
  const response = await http.request<ApiResponse<T>>(config)
  return response.data.data
}

export function get<T>(url: string, params?: object, config?: RequestConfig): Promise<T> {
  return request<T>({ ...config, method: 'GET', url, params })
}

export function post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
  return request<T>({ ...config, method: 'POST', url, data })
}

export function put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
  return request<T>({ ...config, method: 'PUT', url, data })
}

export function del<T>(url: string, config?: RequestConfig): Promise<T> {
  return request<T>({ ...config, method: 'DELETE', url })
}

export default http
