import { Component, ReactNode } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Warning } from '@phosphor-icons/react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  componentName?: string
}

interface State {
  hasError: boolean
  error: Error | null
}

export class SafeComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error(`[SafeComponent: ${this.props.componentName || 'Unknown'}] Error:`, error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Card className="p-4 border-destructive/30 bg-card/50">
          <div className="flex items-start gap-3">
            <Warning size={20} className="text-destructive shrink-0 mt-0.5" />
            <div className="flex-1 space-y-2">
              <p className="text-sm font-semibold text-destructive">
                Component Error: {this.props.componentName || 'Unknown Component'}
              </p>
              <p className="text-xs text-muted-foreground">
                {this.state.error?.message || 'Unknown error'}
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => this.setState({ hasError: false, error: null })}
                className="text-xs h-7"
              >
                Retry
              </Button>
            </div>
          </div>
        </Card>
      )
    }

    return this.props.children
  }
}
