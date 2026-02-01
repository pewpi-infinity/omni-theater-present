import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Users, Crown, SignIn, SignOut, Plus, Sparkle } from '@phosphor-icons/react'
import { ViewingParty, PartyMember } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

interface ViewingPartySystemProps {
  userLogin: string | null
  currentVideo: string
  currentVideoTitle: string
  onPartyJoin: (party: ViewingParty) => void
  onPartyLeave: () => void
  currentParty: ViewingParty | null
}

export function ViewingPartySystem({
  userLogin,
  currentVideo,
  currentVideoTitle,
  onPartyJoin,
  onPartyLeave,
  currentParty
}: ViewingPartySystemProps) {
  const [parties, setParties] = useKV<ViewingParty[]>('viewing-parties', [])
  const [partyMembers, setPartyMembers] = useKV<Record<string, PartyMember[]>>(
    'party-members',
    {}
  )
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newPartyName, setNewPartyName] = useState('')
  const [userInfo, setUserInfo] = useState<{ login: string; avatarUrl: string } | null>(null)

  useEffect(() => {
    if (userLogin && window.spark && typeof window.spark.user === 'function') {
      window.spark.user().then((user) => {
        if (user) {
          setUserInfo({ login: user.login, avatarUrl: user.avatarUrl })
        }
      }).catch((error) => {
        console.error('[ViewingPartySystem] Failed to fetch user info:', error)
        setUserInfo({ login: userLogin, avatarUrl: '' })
      })
    } else if (userLogin) {
      setUserInfo({ login: userLogin, avatarUrl: '' })
    }
  }, [userLogin])

  useEffect(() => {
    const interval = setInterval(() => {
      setParties((current) =>
        (current || []).map((party) => {
          if (Date.now() - party.lastSync > 300000) {
            return { ...party, isActive: false }
          }
          return party
        })
      )
    }, 60000)

    return () => clearInterval(interval)
  }, [setParties])

  const handleCreateParty = () => {
    if (!userLogin || !userInfo) {
      toast.error('Please sign in to create a viewing party')
      return
    }

    if (!newPartyName.trim()) {
      toast.error('Please enter a party name')
      return
    }

    const newParty: ViewingParty = {
      id: Date.now().toString(),
      name: newPartyName.trim(),
      hostId: userLogin,
      hostName: userInfo.login,
      videoUrl: currentVideo,
      videoTitle: currentVideoTitle,
      createdAt: Date.now(),
      isActive: true,
      memberCount: 1,
      currentTime: 0,
      isPlaying: false,
      lastSync: Date.now()
    }

    setParties((current) => [...(current || []), newParty])

    const newMember: PartyMember = {
      userId: userLogin,
      username: userInfo.login,
      avatarUrl: userInfo.avatarUrl,
      joinedAt: Date.now()
    }

    setPartyMembers((current) => ({
      ...(current || {}),
      [newParty.id]: [newMember]
    }))

    onPartyJoin(newParty)
    setNewPartyName('')
    setIsCreateDialogOpen(false)
    toast.success('🎉 Viewing party created! Share your watch experience.')
  }

  const handleJoinParty = (party: ViewingParty) => {
    if (!userLogin || !userInfo) {
      toast.error('Please sign in to join a viewing party')
      return
    }

    const members = partyMembers?.[party.id] || []
    if (members.some((m) => m.userId === userLogin)) {
      toast.error('You are already in this party')
      return
    }

    const newMember: PartyMember = {
      userId: userLogin,
      username: userInfo.login,
      avatarUrl: userInfo.avatarUrl,
      joinedAt: Date.now()
    }

    setPartyMembers((current) => ({
      ...(current || {}),
      [party.id]: [...(current?.[party.id] || []), newMember]
    }))

    setParties((current) =>
      (current || []).map((p) =>
        p.id === party.id
          ? { ...p, memberCount: p.memberCount + 1, lastSync: Date.now() }
          : p
      )
    )

    onPartyJoin(party)
    toast.success(`🎬 Joined ${party.name}! You'll earn bonus tokens.`)
  }

  const handleLeaveParty = () => {
    if (!currentParty || !userLogin) return

    setPartyMembers((current) => ({
      ...(current || {}),
      [currentParty.id]: (current?.[currentParty.id] || []).filter(
        (m) => m.userId !== userLogin
      )
    }))

    setParties((current) =>
      (current || []).map((p) =>
        p.id === currentParty.id
          ? { ...p, memberCount: Math.max(0, p.memberCount - 1), lastSync: Date.now() }
          : p
      )
    )

    onPartyLeave()
    toast.success('Left viewing party')
  }

  const activeParties = (parties || []).filter((p) => p.isActive)

  return (
    <Card className="border-secondary/30 bg-card/50 backdrop-blur p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users size={24} weight="duotone" className="text-secondary" />
          <h2 className="text-lg font-semibold uppercase tracking-wide">
            Viewing Parties
          </h2>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              disabled={!userLogin || !!currentParty}
              className="bg-accent hover:bg-accent/80 text-accent-foreground glow-magenta"
            >
              <Plus weight="bold" className="mr-2" size={16} />
              Create Party
            </Button>
          </DialogTrigger>
          <DialogContent className="border-primary/30 bg-card">
            <DialogHeader>
              <DialogTitle className="text-primary">Create Viewing Party</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="party-name" className="text-sm uppercase tracking-wide">
                  Party Name
                </Label>
                <Input
                  id="party-name"
                  placeholder="Friday Night Tech Theater"
                  value={newPartyName}
                  onChange={(e) => setNewPartyName(e.target.value)}
                  className="border-primary/30 focus:border-primary focus:glow-cyan bg-background/50"
                />
              </div>
              <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/30">
                <p className="text-xs text-muted-foreground mb-2">
                  Currently watching:
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {currentVideoTitle}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-accent/10 border border-accent/30 flex items-start gap-2">
                <Sparkle size={20} className="text-accent shrink-0 mt-0.5" weight="fill" />
                <p className="text-xs text-foreground">
                  <strong>Bonus Rewards:</strong> All party members earn extra tokens when watching together!
                </p>
              </div>
              <Button
                onClick={handleCreateParty}
                className="w-full bg-accent hover:bg-accent/80 text-accent-foreground glow-magenta"
              >
                Create Party
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Separator className="mb-4 bg-secondary/20" />

      {currentParty && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 rounded-lg bg-accent/10 border border-accent/30"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground">{currentParty.name}</h3>
                {currentParty.hostId === userLogin && (
                  <Badge className="bg-accent text-accent-foreground text-xs">
                    <Crown size={12} className="mr-1" weight="fill" />
                    Host
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {currentParty.videoTitle}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleLeaveParty}
              className="border-destructive/50 text-destructive hover:bg-destructive/10"
            >
              <SignOut size={16} weight="bold" className="mr-1" />
              Leave
            </Button>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users size={16} />
              <span>{currentParty.memberCount} watching</span>
            </div>
            <Badge variant="outline" className="border-accent/50 text-accent">
              <Sparkle size={12} className="mr-1" weight="fill" />
              Earning bonus tokens
            </Badge>
          </div>
        </motion.div>
      )}

      <ScrollArea className="h-64">
        {activeParties.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <Users size={48} className="mx-auto text-muted-foreground opacity-30" />
            <p className="text-muted-foreground font-mono text-sm">
              No active viewing parties
            </p>
            <p className="text-xs text-muted-foreground/60">
              Create one to watch together
            </p>
          </div>
        ) : (
          <div className="space-y-2 pr-4">
            <AnimatePresence mode="popLayout">
              {activeParties.map((party) => (
                <motion.div
                  key={party.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Card
                    className={`p-4 border transition-all ${
                      currentParty?.id === party.id
                        ? 'border-accent bg-accent/5 glow-magenta'
                        : 'border-border/50 bg-card/30 hover:border-secondary/50 hover:glow-cyan cursor-pointer'
                    }`}
                    onClick={() => {
                      if (currentParty?.id !== party.id && !currentParty) {
                        handleJoinParty(party)
                      }
                    }}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-sm truncate">
                              {party.name}
                            </h3>
                            {party.hostId === userLogin && (
                              <Badge className="bg-accent text-accent-foreground text-xs">
                                <Crown size={10} className="mr-1" weight="fill" />
                                Host
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {party.videoTitle}
                          </p>
                        </div>
                        {currentParty?.id !== party.id && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleJoinParty(party)
                            }}
                            disabled={!!currentParty}
                            className="border-secondary/50 hover:border-secondary hover:bg-secondary/10 shrink-0 ml-2"
                          >
                            <SignIn size={16} weight="bold" className="mr-1" />
                            Join
                          </Button>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Crown size={14} />
                          <span>{party.hostName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          <span>{party.memberCount} watching</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </ScrollArea>

      {!userLogin && (
        <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            Sign in to create or join viewing parties
          </p>
        </div>
      )}
    </Card>
  )
}
