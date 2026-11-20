import type { AxiosRequestConfig } from 'axios'
import { apiClient } from './client'

export const baseApi = {
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await apiClient.get<T>(url, config)
    return data
  },

  async post<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await apiClient.post<T>(url, body, config)
    return data
  }
}
