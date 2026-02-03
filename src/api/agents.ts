import apiClient from './client'
import type { Agent, AgentListResponse, AgentResponse } from '../types/agent'

export const agentsApi = {
  getAll: async (clusterId?: string): Promise<Agent[]> => {
    try {
      const params = clusterId ? { cluster_id: clusterId } : {}
      const { data } = await apiClient.get<AgentListResponse>('/v1/agents', { params })
      return data.agents || []
    } catch (error: any) {
      // Treat 404 as empty list (no agents exist yet)
      if (error.response?.status === 404) {
        return []
      }
      throw error
    }
  },

  getById: async (id: string): Promise<Agent> => {
    const { data } = await apiClient.get<AgentResponse>(`/v1/agents/${id}`)
    return data.agent
  },

  unregister: async (id: string): Promise<void> => {
    await apiClient.delete(`/v1/agents/${id}`)
  },
}
