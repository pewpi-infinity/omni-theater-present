import { useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Coins, TrendUp, ArrowUp, ArrowDown, Sparkle, Clock } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { WatchSession } from '@/lib/types'
import { UnifiedWallet, createEmptyWallet, getTokenRate } from '@/lib/tokenWallet'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface UnifiedTokenWalletProps {
  userLogin: string | null
  currentVideoTitle: string
  isDocumentary: boolean
  inParty?: boolean
}

export function UnifiedTokenWallet({ userLogin, currentVideoTitle, isDocumentary, inParty = false }: UnifiedTokenWalletProps) {
  const [wallet, setWallet] = useKV<UnifiedWallet | null>('unified-wallet', null)
  const [currentSession, setCurrentSession] = useKV<WatchSession | null>('current-watch-session', null)

  useEffect(() => {
    if (!userLogin) return

    if (!wallet) {
      setWallet(createEmptyWallet(userLogin))
    }
  }, [userLogin, wallet, setWallet])

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
    if (!userLogin || !currentSession || !wallet) return

    const interval = setInterval(() => {
      const now = Date.now()
      const elapsedHours = (now - currentSession.startTime) / (1000 * 60 * 60)
      const baseTokensPerHour = getTokenRate(currentSession.isDocumentary)
      const tokensPerHour = inParty ? baseTokensPerHour * 1.5 : baseTokensPerHour
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

        setWallet((prev) => {
          if (!prev) return null
          return {
            ...prev,
            totalTokens: prev.totalTokens + newTokens,
            transactions: [
              ...prev.transactions,
              {
                id: Date.now().toString(),
                type: 'earned',
                amount: newTokens,
                reason: inParty ? 'Watch time (Party Bonus +50%)' : 'Watch time',
                timestamp: Date.now(),
                videoTitle: currentSession.videoTitle
              }
            ],
            lastActivity: Date.now()
          }
        })
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [userLogin, currentSession, wallet, setCurrentSession, setWallet, inParty])

  if (!userLogin || !wallet) return null

  const recentTransactions = wallet.transactions.slice(-10).reverse()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 border-secondary/30 bg-gradient-to-br from-card/80 to-secondary/5 backdrop-blur">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center glow-magenta">
              <Coins className="text-background" size={32} weight="fill" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-mono mb-1">
                Unified Token Wallet
              </div>
              <div className="text-3xl font-bold text-foreground">
                {wallet.totalTokens}
              </div>
              <div className="flex items-center gap-3 mt-2">
                <Badge variant="outline" className="border-secondary/50 text-secondary text-xs">
                  {wallet.quizzesPassed} Quizzes
                </Badge>
                <Badge variant="outline" className="border-accent/50 text-accent text-xs">
                  {wallet.adsCreated} Ads
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-right">
            {currentSession && (
              <div className="flex items-center gap-1.5 text-secondary">
                <TrendUp size={18} weight="bold" />
                <div>
                  <div className="text-sm font-bold uppercase tracking-wide font-mono">
                    {getTokenRate(currentSession.isDocumentary)} / hr
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    +{currentSession.tokensEarned} session
                  </div>
                </div>
              </div>
            )}
            
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="border-primary/50 hover:border-primary hover:bg-primary/10 text-xs"
                >
                  <Clock className="mr-1" size={14} weight="bold" />
                  History
                </Button>
              </DialogTrigger>
              <DialogContent className="border-primary/30 bg-card max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-primary">Transaction History</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[400px] mt-4">
                  <div className="space-y-2 pr-4">
                    {recentTransactions.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground text-sm font-mono">
                        No transactions yet
                      </div>
                    ) : (
                      recentTransactions.map((tx) => (
                        <Card key={tx.id} className="p-3 border-border/50 bg-card/30">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                tx.type === 'earned' 
                                  ? 'bg-secondary/20'
                                  : tx.type === 'bonus'
                                  ? 'bg-accent/20'
                                  : 'bg-destructive/20'
                              }`}>
                                {tx.type === 'earned' && <ArrowUp className="text-secondary" size={16} weight="bold" />}
                                {tx.type === 'bonus' && <Sparkle className="text-accent" size={16} weight="fill" />}
                                {tx.type === 'spent' && <ArrowDown className="text-destructive" size={16} weight="bold" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-foreground truncate">
                                  {tx.reason}
                                </div>
                                {tx.videoTitle && (
                                  <div className="text-xs text-muted-foreground truncate font-mono">
                                    {tx.videoTitle}
                                  </div>
                                )}
                                <div className="text-xs text-muted-foreground font-mono">
                                  {new Date(tx.timestamp).toLocaleString()}
                                </div>
                              </div>
                            </div>
                            <div className={`text-lg font-bold font-mono ${
                              tx.type === 'spent' ? 'text-destructive' : 'text-secondary'
                            }`}>
                              {tx.type === 'spent' ? '-' : '+'}{tx.amount}
                            </div>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border/30 flex items-center justify-between text-xs font-mono text-muted-foreground">
          <span>User: {wallet.userId}</span>
          <span>Last activity: {new Date(wallet.lastActivity).toLocaleTimeString()}</span>
        </div>
      </Card>
    </motion.div>
  )
}
