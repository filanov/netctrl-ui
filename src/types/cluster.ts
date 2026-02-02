import { z } from 'zod'

// Validation schemas matching netctrl-server API response (camelCase)
export const clusterSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  createdAt: z.string().optional(), // ISO 8601 timestamp (camelCase from API)
  updatedAt: z.string().optional(), // ISO 8601 timestamp (camelCase from API)
})

export type Cluster = z.infer<typeof clusterSchema>

export interface ClusterListResponse {
  clusters: Cluster[]
}

export interface ClusterResponse {
  cluster: Cluster
}
