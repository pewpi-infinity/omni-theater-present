import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Warning, ArrowClockwise } from '@phosphor-icons/react'

interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-lg w-full p-6 border-destructive/30 bg-card space-y-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-destructive/10 rounded-lg">
            <Warning size={32} className="text-destructive" weight="fill" />
          </div>
          <div className="flex-1 space-y-2">
            <h2 className="text-xl font-bold text-destructive">
              Application Error
            </h2>
            <p className="text-sm text-muted-foreground">
              Something went wrong and the application crashed.
            </p>
          </div>
        </div>
        
        <div className="p-4 bg-background rounded-lg border border-border">
          <p className="text-xs font-mono text-destructive break-words">
            {error.message}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={resetErrorBoundary}
            className="flex-1 bg-primary hover:bg-primary/80"
          >
            <ArrowClockwise size={16} className="mr-2" weight="bold" />
            Reload Application
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          If this error persists, please check the browser console for more details.
        </p>
      </Card>
    </div>
  )
}
