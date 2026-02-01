import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { User, SignOut, Sparkle } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

interface AuthComponentProps {
  userLogin: string | null
  onLoginChange: (login: string | null) => void
}

export function AuthComponent({ userLogin, onLoginChange }: AuthComponentProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    if (!window.spark) {
      toast.error('SDK not ready. Please wait a moment.')
      return
    }
    
    setIsLoading(true)
    try {
      const user = await window.spark.user()
      if (user && user.login) {
        onLoginChange(user.login)
        toast.success(`Welcome, ${user.login}!`)
      } else {
        toast.error('Unable to retrieve user information')
      }
    } catch (error) {
      console.error('Sign in error:', error)
      toast.error('Failed to sign in')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = () => {
    onLoginChange(null)
    toast.success('Signed out successfully')
  }

  return (
    <AnimatePresence mode="wait">
      {!userLogin ? (
        <motion.div
          key="signed-out"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            onClick={handleSignIn}
            disabled={isLoading}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground glow-cyan"
          >
            <User className="mr-2" weight="bold" />
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </motion.div>
      ) : (
        <motion.div
          key="signed-in"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="border-secondary/30 bg-card/50 backdrop-blur">
            <div className="flex items-center gap-3 p-3">
              <div className="flex items-center gap-2 flex-1">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-cyan">
                  <Sparkle className="text-background" size={16} weight="fill" />
                </div>
                <span className="text-sm font-mono text-foreground">
                  {userLogin}
                </span>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleSignOut}
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <SignOut size={18} weight="bold" />
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
