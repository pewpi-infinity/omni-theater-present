import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Warning } from '@phosphor-icons/react'

interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-6 border-destructive/30 bg-card/50">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Warning size={32} className="text-destructive shrink-0" weight="fill" />
            <div>
              <h1 className="text-xl font-bold text-destructive">Application Error</h1>
              <p className="text-sm text-muted-foreground">
                Something went wrong. Please try refreshing the page.
              </p>
            </div>
          </div>
          
          <div className="bg-background/50 p-4 rounded border border-border/50">
            <p className="text-sm font-mono text-foreground/80">
              {error.message}
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={resetErrorBoundary}
              className="bg-primary hover:bg-primary/80"
            >
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
