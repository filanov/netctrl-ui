import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { clustersApi } from '../api/clusters'
import { clusterSchema, type Cluster } from '../types/cluster'

export default function ClusterForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEditMode = !!id
  const [apiError, setApiError] = useState<string | null>(null)

  const { data: cluster } = useQuery({
    queryKey: ['clusters', id],
    queryFn: () => clustersApi.getById(id!),
    enabled: isEditMode,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Cluster>({
    resolver: zodResolver(clusterSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  useEffect(() => {
    if (cluster) {
      reset(cluster)
    }
  }, [cluster, reset])

  const mutation = useMutation({
    mutationFn: (data: Cluster) => {
      const { id: _, createdAt, updatedAt, ...payload } = data
      console.log('Form data:', data)
      console.log('Payload to send:', payload)
      console.log('isEditMode:', isEditMode)
      return isEditMode
        ? clustersApi.update(id!, payload)
        : clustersApi.create(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clusters'] })
      navigate('/clusters')
    },
    onError: (error: Error) => {
      console.error('Create/Update error:', error)
      setApiError(error.message)
    },
  })

  const onSubmit = (data: Cluster) => {
    setApiError(null)
    mutation.mutate(data)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        {isEditMode ? 'Edit Cluster' : 'Create New Cluster'}
      </h1>

      {apiError && (
        <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-400">{apiError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cluster Name *
          </label>
          <input
            {...register('name')}
            type="text"
            id="name"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="production-cluster"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            {...register('description')}
            id="description"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Optional description for this cluster"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            {mutation.isPending ? 'Saving...' : isEditMode ? 'Update Cluster' : 'Create Cluster'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/clusters')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
