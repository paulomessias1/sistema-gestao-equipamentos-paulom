import { useState } from 'react'
import { locationService } from '../services/locationService'
import type { CreateLocationPayload, LocationDetails } from '../types/location'
import { getRequestErrorMessage } from '../../../shared/http/getRequestErrorMessage'

interface CreateLocationState {
  isLoading: boolean
  errorMessage: string
  create: (payload: CreateLocationPayload) => Promise<LocationDetails>
}

export function useCreateLocation(): CreateLocationState {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function create(payload: CreateLocationPayload) {
    setIsLoading(true)
    setErrorMessage('')

    try {
      return await locationService.createLocation(payload)
    } catch (error) {
      setErrorMessage(getRequestErrorMessage(error))
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    errorMessage,
    create,
  }
}
