import { useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Coins, TrendUp } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { UserTokens, WatchSession } from '@/lib/types'

interface TokenDisplayProps {
  userLogin: string | null
  currentVideoTitle: string
  isDocumentary: boolean
}

export function TokenDisplay({ userLogin, currentVideoTitle, isDocumentary }: TokenDisplayProps) {
  const [userTokens, setUserTokens] = useKV<UserTokens | null>('user-tokens', null)
  const [currentSession, setCurrentSession] = useKV<WatchSession | null>('current-watch-session', null)

  useEffect(() => {
    if (!userLogin) return

    if (!userTokens) {
      setUserTokens({
        userId: userLogin,
        totalTokens: 0,
        watchSessions: [],
        quizzesPassed: 0
      })
    }
  }, [userLogin, userTokens, setUserTokens])

  useEffect(() => {
    if (!userLogin || !currentVideoTitle) return

    const startNewSession = () => {
      const newSession: WatchSession = {
        id: Date.now().toString(),
        videoTitle: currentVideoTitle,
        startTime: Date.now(),
        isDocumentary,
        tokensEarned: 0
      }
      setCurrentSession(newSession)
    }

    if (!currentSession || currentSession.videoTitle !== currentVideoTitle) {
      startNewSession()
    }
  }, [userLogin, currentVideoTitle, currentSession, setCurrentSession, isDocumentary])

  useEffect(() => {
    if (!userLogin || !currentSession) return

    const interval = setInterval(() => {
      const now = Date.now()
      const elapsedHours = (now - currentSession.startTime) / (1000 * 60 * 60)
      const tokensPerHour = currentSession.isDocumentary ? 3 : 1
      const earnedTokens = Math.floor(elapsedHours * tokensPerHour)

      if (earnedTokens > currentSession.tokensEarned) {
        const newTokens = earnedTokens - currentSession.tokensEarned

        setCurrentSession((prev) => {
          if (!prev) return null
          return {
            ...prev,
            tokensEarned: earnedTokens
          }
        })

        setUserTokens((prev) => {
          if (!prev) return null
          return {
            ...prev,
            totalTokens: prev.totalTokens + newTokens
          }
        })
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [userLogin, currentSession, setCurrentSession, setUserTokens])

  if (!userLogin || !userTokens) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-4 border-secondary/30 bg-gradient-to-br from-card/80 to-secondary/5 backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center glow-magenta">
              <Coins className="text-background" size={24} weight="fill" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-mono">
                Your Tokens
              </div>
              <div className="text-2xl font-bold text-foreground">
                {userTokens.totalTokens}
              </div>
            </div>
          </div>
          {currentSession && (
            <div className="text-right">
              <div className="flex items-center gap-1 text-xs text-secondary">
                <TrendUp size={14} weight="bold" />
                <span className="uppercase tracking-wide font-mono">
                  {currentSession.isDocumentary ? '3' : '1'} / hr
                </span>
              </div>
              <div className="text-xs text-muted-foreground font-mono mt-1">
                +{currentSession.tokensEarned} this session
              </div>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
