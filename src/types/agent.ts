import { z } from 'zod'

// Enums matching agent.proto
export enum AgentStatus {
  UNSPECIFIED = 'AGENT_STATUS_UNSPECIFIED',
  ACTIVE = 'AGENT_STATUS_ACTIVE',
  INACTIVE = 'AGENT_STATUS_INACTIVE',
}

export enum PortState {
  UNSPECIFIED = 'PORT_STATE_UNSPECIFIED',
  DOWN = 'PORT_STATE_DOWN',
  UP = 'PORT_STATE_UP',
  TESTING = 'PORT_STATE_TESTING',
}

// Validation schemas matching netctrl-server agent proto (camelCase from API)
export const mellanoxPortSchema = z.object({
  number: z.number().optional(),
  state: z.string().optional(),
  speed: z.number().optional(),
  macAddress: z.string().optional(),
  mtu: z.number().optional(),
  guid: z.string().optional(),
  pciAddress: z.string().optional(),
  interfaceName: z.string().optional(),
})

export const mellanoxNICSchema = z.object({
  deviceName: z.string().optional(),
  pciAddress: z.string().optional(),
  partNumber: z.string().optional(),
  serialNumber: z.string().optional(),
  firmwareVersion: z.string().optional(),
  portCount: z.number().optional(),
  ports: z.array(mellanoxPortSchema).optional(),
  psid: z.string().optional(),
})

export const agentSchema = z.object({
  id: z.string().optional(),
  clusterId: z.string().optional(),
  hostname: z.string().optional(),
  ipAddress: z.string().optional(),
  version: z.string().optional(),
  status: z.string().optional(),
  lastSeen: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  networkInterfaces: z.array(mellanoxNICSchema).optional(),
  hardwareCollected: z.boolean().optional(),
})

export type MellanoxPort = z.infer<typeof mellanoxPortSchema>
export type MellanoxNIC = z.infer<typeof mellanoxNICSchema>
export type Agent = z.infer<typeof agentSchema>

export interface AgentListResponse {
  agents: Agent[]
}

export interface AgentResponse {
  agent: Agent
}
