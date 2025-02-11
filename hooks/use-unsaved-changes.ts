import { useState, useEffect } from 'react'
import { useBeforeUnload } from 'react-use'

export function useUnsavedChanges(initialData: any) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [currentData, setCurrentData] = useState(initialData)

  useEffect(() => {
    const hasChanges = JSON.stringify(currentData) !== JSON.stringify(initialData)
    setHasUnsavedChanges(hasChanges)
  }, [currentData, initialData])

  // Show browser warning when trying to leave with unsaved changes
  useBeforeUnload(hasUnsavedChanges, 'You have unsaved changes. Are you sure you want to leave?')

  return {
    hasUnsavedChanges,
    setCurrentData,
    currentData
  }
} 