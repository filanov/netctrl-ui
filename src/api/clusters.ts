import apiClient from './client'
import type { Cluster, ClusterListResponse, ClusterResponse } from '../types/cluster'

export const clustersApi = {
  getAll: async (): Promise<Cluster[]> => {
    try {
      console.log('Fetching clusters from:', '/v1/clusters')
      const { data } = await apiClient.get<ClusterListResponse>('/v1/clusters')
      console.log('Clusters API response:', data)
      console.log('Clusters array:', data.clusters)
      return data.clusters || []
    } catch (error: any) {
      console.error('Error fetching clusters:', error)
      // Treat 404 as empty list (no clusters exist yet)
      if (error.response?.status === 404) {
        console.log('Got 404, returning empty array')
        return []
      }
      throw error
    }
  },

  getById: async (id: string): Promise<Cluster> => {
    const { data } = await apiClient.get<ClusterResponse>(`/v1/clusters/${id}`)
    return data.cluster
  },

  create: async (cluster: Omit<Cluster, 'id'>): Promise<Cluster> => {
    console.log('API create called with:', cluster)
    console.log('Sending POST to:', '/v1/clusters')
    const { data } = await apiClient.post<ClusterResponse>('/v1/clusters', cluster)
    console.log('API response:', data)
    return data.cluster
  },

  update: async (id: string, cluster: Omit<Cluster, 'id'>): Promise<Cluster> => {
    const { data } = await apiClient.patch<ClusterResponse>(`/v1/clusters/${id}`, cluster)
    return data.cluster
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/v1/clusters/${id}`)
  },

  healthCheck: async (): Promise<boolean> => {
    try {
      await apiClient.get('/health')
      return true
    } catch {
      return false
    }
  },
}
