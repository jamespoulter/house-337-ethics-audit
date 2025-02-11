'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
      <Alert variant="destructive" className="max-w-lg mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error.message || 'Something went wrong while loading the audits.'}
        </AlertDescription>
      </Alert>

      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={() => window.location.href = '/audits'}
        >
          Go Back
        </Button>
        <Button onClick={() => reset()}>Try Again</Button>
      </div>
    </div>
  )
} 