import { useQuery } from '@tanstack/react-query'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { clustersApi } from '../api/clusters'
import { agentsApi } from '../api/agents'
import { AgentStatus } from '../types/agent'

export default function ClusterDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: cluster, isLoading: clusterLoading, error: clusterError } = useQuery({
    queryKey: ['clusters', id],
    queryFn: () => clustersApi.getById(id!),
    enabled: !!id,
  })

  const { data: agents, isLoading: agentsLoading, error: agentsError } = useQuery({
    queryKey: ['agents', 'cluster', id],
    queryFn: () => agentsApi.getAll(id),
    enabled: !!id,
  })

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleString()
    } catch {
      return dateString
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case AgentStatus.ACTIVE:
        return 'text-green-600 dark:text-green-400'
      case AgentStatus.INACTIVE:
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case AgentStatus.ACTIVE:
        return 'Active'
      case AgentStatus.INACTIVE:
        return 'Inactive'
      default:
        return 'Unknown'
    }
  }

  if (clusterLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600 dark:text-gray-400">Loading cluster details...</div>
      </div>
    )
  }

  if (clusterError) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-800 dark:text-red-400">
          Error loading cluster: {clusterError.message}
        </p>
        <button
          onClick={() => navigate('/clusters')}
          className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back to clusters
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/clusters"
          className="text-blue-600 dark:text-blue-400 hover:underline mb-2 inline-block"
        >
          ← Back to clusters
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {cluster?.name}
            </h1>
            {cluster?.description && (
              <p className="text-gray-600 dark:text-gray-400 mt-2">{cluster.description}</p>
            )}
          </div>
          <Link
            to={`/clusters/${id}/edit`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Edit Cluster
          </Link>
        </div>
      </div>

      {/* Cluster Info Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Cluster Information
        </h2>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Cluster ID</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white font-mono">{cluster?.id}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
              {formatDate(cluster?.createdAt)}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
              {formatDate(cluster?.updatedAt)}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Registered Agents</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
              {agents?.length || 0}
            </dd>
          </div>
        </dl>
      </div>

      {/* Agents Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Registered Agents
          </h2>
        </div>

        {agentsLoading ? (
          <div className="p-6 text-center text-gray-600 dark:text-gray-400">
            Loading agents...
          </div>
        ) : agentsError ? (
          <div className="p-6">
            <p className="text-red-600 dark:text-red-400">
              Error loading agents: {agentsError.message}
            </p>
          </div>
        ) : agents && agents.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              No agents registered to this cluster yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Hostname
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Version
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Last Seen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    NICs
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {agents?.map((agent) => (
                  <tr key={agent.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {agent.hostname || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 font-mono">
                      {agent.ipAddress || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`font-medium ${getStatusColor(agent.status)}`}>
                        {getStatusLabel(agent.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {agent.version || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {formatDate(agent.lastSeen)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {agent.networkInterfaces?.length || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
