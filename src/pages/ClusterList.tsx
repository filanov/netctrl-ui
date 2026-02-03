import { useState, useRef, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { clustersApi } from '../api/clusters'

export default function ClusterList() {
  const queryClient = useQueryClient()
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const { data: clusters, isLoading, error } = useQuery({
    queryKey: ['clusters'],
    queryFn: clustersApi.getAll,
  })

  console.log('ClusterList state:', { clusters, isLoading, error })

  const deleteMutation = useMutation({
    mutationFn: clustersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clusters'] })
    },
  })

  const handleDelete = (id: string, name: string) => {
    setOpenMenuId(null)
    if (window.confirm(`Are you sure you want to delete cluster "${name}"?`)) {
      deleteMutation.mutate(id)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleString()
    } catch {
      return dateString
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Network Clusters
        </h1>
        <Link
          to="/clusters/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Create Cluster
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600 dark:text-gray-400">Loading clusters...</div>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-400">
            Error loading clusters: {error.message}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Make sure netctrl-server is running on http://localhost:8080
          </p>
        </div>
      ) : clusters && clusters.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">No clusters configured yet.</p>
          <Link
            to="/clusters/new"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Create your first cluster
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Updated
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {clusters?.map((cluster) => (
                <tr key={cluster.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/clusters/${cluster.id}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {cluster.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {cluster.description || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    {formatDate(cluster.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    {formatDate(cluster.updatedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <DropdownMenu
                      isOpen={openMenuId === cluster.id}
                      onToggle={() => setOpenMenuId(openMenuId === cluster.id ? null : cluster.id!)}
                      onClose={() => setOpenMenuId(null)}
                    >
                      <Link
                        to={`/clusters/${cluster.id}`}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setOpenMenuId(null)}
                      >
                        View Details
                      </Link>
                      <Link
                        to={`/clusters/${cluster.id}/edit`}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setOpenMenuId(null)}
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(cluster.id!, cluster.name)}
                        disabled={deleteMutation.isPending}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

interface DropdownMenuProps {
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
  children: React.ReactNode
}

function DropdownMenu({ isOpen, onToggle, onClose, children }: DropdownMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={onToggle}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Options"
      >
        <svg
          className="w-5 h-5 text-gray-600 dark:text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}
