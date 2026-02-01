import { useState, useEffect, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ChatCircle, PaperPlaneRight, Users } from '@phosphor-icons/react'
import { ChatMessage } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

interface CommunityChatProps {
  userLogin: string | null
  partyId?: string
}

export function CommunityChat({ userLogin, partyId }: CommunityChatProps) {
  const [messages, setMessages] = useKV<ChatMessage[]>('community-chat', [])
  const [partyMessages, setPartyMessages] = useKV<ChatMessage[]>(
    `party-chat-${partyId || 'none'}`,
    []
  )
  const [newMessage, setNewMessage] = useState('')
  const [userInfo, setUserInfo] = useState<{ login: string; avatarUrl: string } | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const displayMessages = partyId ? partyMessages || [] : messages || []

  useEffect(() => {
    if (userLogin && window.spark && typeof window.spark.user === 'function') {
      window.spark.user().then((user) => {
        if (user) {
          setUserInfo({ login: user.login, avatarUrl: user.avatarUrl })
        }
      }).catch((error) => {
        console.error('[CommunityChat] Failed to fetch user info in chat:', error)
        setUserInfo({ login: userLogin, avatarUrl: '' })
      })
    } else if (userLogin) {
      setUserInfo({ login: userLogin, avatarUrl: '' })
    }
  }, [userLogin])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [displayMessages])

  const handleSendMessage = () => {
    if (!userLogin || !userInfo) {
      toast.error('Please sign in to chat')
      return
    }

    if (!newMessage.trim()) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: userLogin,
      username: userInfo.login,
      avatarUrl: userInfo.avatarUrl,
      message: newMessage.trim(),
      timestamp: Date.now(),
      partyId: partyId || undefined
    }

    if (partyId) {
      setPartyMessages((current) => [...(current || []), message])
    } else {
      setMessages((current) => [...(current || []), message])
    }

    setNewMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isExpanded) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          size="lg"
          onClick={() => setIsExpanded(true)}
          className="rounded-full h-16 w-16 bg-secondary hover:bg-secondary/80 shadow-lg glow-cyan"
        >
          <ChatCircle size={32} weight="fill" className="text-secondary-foreground" />
        </Button>
        {displayMessages.length > 0 && (
          <Badge
            className="absolute -top-2 -right-2 bg-accent text-accent-foreground"
          >
            {displayMessages.length}
          </Badge>
        )}
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      className="fixed bottom-6 right-6 z-50 w-96"
    >
      <Card className="border-secondary/30 bg-card/95 backdrop-blur-lg shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-secondary/20 flex items-center justify-between bg-secondary/10">
          <div className="flex items-center gap-2">
            <ChatCircle size={24} weight="duotone" className="text-secondary" />
            <h3 className="font-semibold uppercase tracking-wide text-sm">
              {partyId ? 'Party Chat' : 'Community Chat'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-secondary/50 text-xs">
              <Users size={14} className="mr-1" />
              {displayMessages.filter((m, i, arr) => 
                arr.findIndex(msg => msg.userId === m.userId) === i
              ).length}
            </Badge>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsExpanded(false)}
              className="h-8 w-8"
            >
              ✕
            </Button>
          </div>
        </div>

        <ScrollArea className="h-96">
          <div ref={scrollRef} className="p-4 space-y-4">
            <AnimatePresence mode="popLayout">
              {displayMessages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 text-muted-foreground text-sm"
                >
                  <ChatCircle size={48} className="mx-auto mb-3 opacity-30" />
                  <p>No messages yet</p>
                  <p className="text-xs mt-1">Start the conversation!</p>
                </motion.div>
              ) : (
                displayMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`flex gap-3 ${
                      msg.userId === userLogin ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <Avatar className="h-8 w-8 shrink-0 border-2 border-primary/30">
                      <AvatarImage src={msg.avatarUrl} alt={msg.username} />
                      <AvatarFallback>{msg.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div
                      className={`flex-1 ${
                        msg.userId === userLogin ? 'items-end' : 'items-start'
                      } flex flex-col`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-muted-foreground">
                          {msg.username}
                        </span>
                        <span className="text-xs text-muted-foreground/60 font-mono">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div
                        className={`px-3 py-2 rounded-lg max-w-[85%] ${
                          msg.userId === userLogin
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        <p className="text-sm leading-relaxed break-words">
                          {msg.message}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-secondary/20 bg-background/50">
          <div className="flex gap-2">
            <Input
              placeholder={
                userLogin
                  ? 'Type a message...'
                  : 'Sign in to chat'
              }
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={!userLogin}
              className="border-primary/30 focus:border-primary focus:glow-cyan bg-background/50 font-mono text-sm"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!userLogin || !newMessage.trim()}
              className="bg-accent hover:bg-accent/80 text-accent-foreground glow-magenta shrink-0"
            >
              <PaperPlaneRight size={20} weight="fill" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
