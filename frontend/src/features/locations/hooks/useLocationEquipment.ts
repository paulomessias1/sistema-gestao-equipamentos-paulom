import { useCallback, useEffect, useState } from 'react'
import { locationService } from '../services/locationService'
import type { LocationEquipment, GetLocationEquipmentParams, PaginatedResult } from '../types/location'
import type { RequestState } from '../../../shared/hooks/requestState'
import { getRequestErrorMessage } from '../../../shared/http/getRequestErrorMessage'

export function useLocationEquipment(
  locationId?: string,
  params: GetLocationEquipmentParams = {},
): RequestState<PaginatedResult<LocationEquipment>> {
  const { status, page, pageSize } = params
  const [data, setData] = useState<PaginatedResult<LocationEquipment>>()
  const [isLoading, setIsLoading] = useState(Boolean(locationId))
  const [errorMessage, setErrorMessage] = useState('')

  const loadEquipment = useCallback(async () => {
    if (!locationId) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setErrorMessage('')

    try {
      const result = await locationService.getLocationEquipment(locationId, {
        status,
        page,
        pageSize,
      })
      setData(result)
    } catch (error) {
      setErrorMessage(getRequestErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }, [locationId, status, page, pageSize])

  useEffect(() => {
    void Promise.resolve().then(loadEquipment)
  }, [loadEquipment])

  return {
    data,
    isLoading,
    errorMessage,
    reload: loadEquipment,
  }
}
