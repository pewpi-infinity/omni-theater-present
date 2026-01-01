import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { 
  ShoppingCart, 
  VideoCamera, 
  Star, 
  Trophy, 
  Lightning, 
  Sparkle,
  Check,
  Lock,
  FilmSlate,
  Crown,
  Gift
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { UnifiedWallet, spendTokens, hasEnoughTokens } from '@/lib/tokenWallet'

interface StoreItem {
  id: string
  title: string
  description: string
  cost: number
  type: 'video' | 'feature' | 'badge' | 'boost'
  icon: 'video' | 'star' | 'trophy' | 'lightning' | 'crown' | 'gift' | 'sparkle'
  url?: string
  benefit?: string
  featured?: boolean
}

interface PurchasedItem {
  itemId: string
  title: string
  purchasedAt: number
  type: string
}

const STORE_ITEMS: StoreItem[] = [
  {
    id: 'retro-computing-pack',
    title: 'Retro Computing Collection',
    description: 'Unlock 10 rare computing documentaries from the 1970s-1990s era',
    cost: 100,
    type: 'video',
    icon: 'video',
    benefit: '10 exclusive videos',
    featured: true
  },
  {
    id: 'silicon-valley-legends',
    title: 'Silicon Valley Legends Series',
    description: 'Deep dive interviews with tech pioneers and industry legends',
    cost: 150,
    type: 'video',
    icon: 'crown',
    benefit: '15 exclusive interviews',
    featured: true
  },
  {
    id: 'ai-revolution-pack',
    title: 'AI Revolution Pack',
    description: 'Comprehensive documentary series on AI history and development',
    cost: 120,
    type: 'video',
    icon: 'video',
    benefit: '8 exclusive documentaries'
  },
  {
    id: 'quantum-curator-premium',
    title: 'Quantum Curator Premium',
    description: 'Enhanced AI curation with 20 recommendations per session',
    cost: 75,
    type: 'feature',
    icon: 'sparkle',
    benefit: '4x more recommendations'
  },
  {
    id: 'token-multiplier-2x',
    title: '2x Token Boost',
    description: 'Double your earning rate for 7 days',
    cost: 200,
    type: 'boost',
    icon: 'lightning',
    benefit: '7 days active',
    featured: true
  },
  {
    id: 'token-multiplier-3x',
    title: '3x Token Boost',
    description: 'Triple your earning rate for 7 days',
    cost: 350,
    type: 'boost',
    icon: 'lightning',
    benefit: '7 days active'
  },
  {
    id: 'early-adopter-badge',
    title: 'Early Adopter Badge',
    description: 'Exclusive badge showing you were an original theater patron',
    cost: 50,
    type: 'badge',
    icon: 'star',
    benefit: 'Displayed on profile'
  },
  {
    id: 'curator-badge',
    title: 'Curator Elite Badge',
    description: 'For users who have imported 50+ videos via Quantum Curator',
    cost: 100,
    type: 'badge',
    icon: 'trophy',
    benefit: 'Exclusive status'
  },
  {
    id: 'quantum-master-badge',
    title: 'Quantum Master Badge',
    description: 'Achieved 1000+ tokens earned - a true theater devotee',
    cost: 250,
    type: 'badge',
    icon: 'crown',
    benefit: 'Legendary status'
  },
  {
    id: 'mystery-pack',
    title: 'Mystery Content Pack',
    description: 'Random selection of 5 rare computing videos and docs',
    cost: 80,
    type: 'video',
    icon: 'gift',
    benefit: '5 surprise videos'
  },
  {
    id: 'ad-free-week',
    title: 'Ad-Free Experience',
    description: 'Hide community ads for 7 days of pure theater viewing',
    cost: 60,
    type: 'feature',
    icon: 'star',
    benefit: '7 days active'
  },
  {
    id: 'custom-facts-pack',
    title: 'Custom Facts Package',
    description: 'Add 50 custom facts to your personal fact rotation',
    cost: 90,
    type: 'feature',
    icon: 'sparkle',
    benefit: '50 custom slots'
  }
]

interface TokenRedemptionStoreProps {
  userLogin: string | null
}

export function TokenRedemptionStore({ userLogin }: TokenRedemptionStoreProps) {
  const [wallet, setWallet] = useKV<UnifiedWallet | null>('unified-wallet', null)
  const [purchases, setPurchases] = useKV<PurchasedItem[]>('store-purchases', [])
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const handlePurchase = (item: StoreItem) => {
    if (!userLogin) {
      toast.error('Please sign in to make purchases')
      return
    }

    if (!wallet) {
      toast.error('Wallet not initialized')
      return
    }

    if (!hasEnoughTokens(wallet, item.cost)) {
      toast.error(`Insufficient tokens. You need ${item.cost} tokens.`)
      return
    }

    const updatedWallet = spendTokens(wallet, item.cost, `Store: ${item.title}`)
    
    if (!updatedWallet) {
      toast.error('Purchase failed')
      return
    }

    setWallet(updatedWallet)

    const purchase: PurchasedItem = {
      itemId: item.id,
      title: item.title,
      purchasedAt: Date.now(),
      type: item.type
    }

    setPurchases((prev) => [...(prev || []), purchase])

    toast.success(`Purchased: ${item.title}!`, {
      description: 'Check your library for new content'
    })

    setIsConfirmOpen(false)
    setSelectedItem(null)
  }

  const hasPurchased = (itemId: string): boolean => {
    return (purchases || []).some(p => p.itemId === itemId)
  }

  const getIcon = (iconName: string) => {
    const icons = {
      video: VideoCamera,
      star: Star,
      trophy: Trophy,
      lightning: Lightning,
      crown: Crown,
      gift: Gift,
      sparkle: Sparkle
    }
    const Icon = icons[iconName as keyof typeof icons] || Sparkle
    return <Icon size={24} weight="duotone" />
  }

  const filterByType = (type: string) => {
    if (type === 'all') return STORE_ITEMS
    return STORE_ITEMS.filter(item => item.type === type)
  }

  if (!userLogin) {
    return (
      <Card className="p-8 border-accent/30 bg-card/50 backdrop-blur text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center">
            <Lock className="text-accent" size={32} weight="bold" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Sign In Required</h3>
            <p className="text-muted-foreground text-sm">
              Sign in to access the Token Redemption Store
            </p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 border-accent/30 bg-gradient-to-br from-card/80 to-accent/5 backdrop-blur">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center glow-magenta">
              <ShoppingCart className="text-background" size={28} weight="fill" />
            </div>
            <div>
              <h2 className="text-2xl font-bold uppercase tracking-wide">Token Redemption Store</h2>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-mono">
                Exclusive Content & Features
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-mono mb-1">
              Your Balance
            </div>
            <div className="text-2xl font-bold text-secondary">
              {wallet?.totalTokens || 0} Tokens
            </div>
          </div>
        </div>

        <Separator className="mb-6 bg-accent/20" />

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="video" className="text-xs">Videos</TabsTrigger>
            <TabsTrigger value="feature" className="text-xs">Features</TabsTrigger>
            <TabsTrigger value="badge" className="text-xs">Badges</TabsTrigger>
            <TabsTrigger value="boost" className="text-xs">Boosts</TabsTrigger>
          </TabsList>

          {['all', 'video', 'feature', 'badge', 'boost'].map((type) => (
            <TabsContent key={type} value={type}>
              <ScrollArea className="h-[500px]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
                  {filterByType(type).map((item) => {
                    const purchased = hasPurchased(item.id)
                    const canAfford = wallet ? hasEnoughTokens(wallet, item.cost) : false

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card
                          className={`p-4 border transition-all cursor-pointer h-full flex flex-col ${
                            item.featured
                              ? 'border-accent bg-accent/5 glow-magenta'
                              : purchased
                              ? 'border-secondary bg-secondary/5'
                              : 'border-border/50 bg-card/30 hover:border-primary/50 hover:glow-cyan'
                          }`}
                          onClick={() => {
                            if (!purchased) {
                              setSelectedItem(item)
                              setIsConfirmOpen(true)
                            }
                          }}
                        >
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                              purchased
                                ? 'bg-secondary/20 text-secondary'
                                : item.featured
                                ? 'bg-accent/20 text-accent'
                                : 'bg-primary/20 text-primary'
                            }`}>
                              {purchased ? <Check size={24} weight="bold" /> : getIcon(item.icon)}
                            </div>
                            {item.featured && !purchased && (
                              <Badge className="bg-accent text-accent-foreground text-xs">
                                Featured
                              </Badge>
                            )}
                            {purchased && (
                              <Badge className="bg-secondary text-secondary-foreground text-xs">
                                Owned
                              </Badge>
                            )}
                          </div>

                          <h3 className="font-bold text-sm mb-2 line-clamp-2">
                            {item.title}
                          </h3>

                          <p className="text-xs text-muted-foreground mb-3 line-clamp-3 flex-1">
                            {item.description}
                          </p>

                          {item.benefit && (
                            <div className="mb-3">
                              <Badge variant="outline" className="border-primary/50 text-primary text-xs">
                                {item.benefit}
                              </Badge>
                            </div>
                          )}

                          <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/30">
                            <div className="text-lg font-bold font-mono text-accent">
                              {item.cost} Tokens
                            </div>
                            {purchased ? (
                              <Badge className="bg-secondary/20 text-secondary border-secondary/40">
                                <Check size={14} weight="bold" className="mr-1" />
                                Purchased
                              </Badge>
                            ) : canAfford ? (
                              <FilmSlate className="text-primary" size={20} weight="duotone" />
                            ) : (
                              <Lock className="text-muted-foreground" size={20} weight="bold" />
                            )}
                          </div>
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </Card>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="border-accent/30 bg-card">
          <DialogHeader>
            <DialogTitle className="text-accent text-xl">Confirm Purchase</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Review your purchase before completing the transaction
            </DialogDescription>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-6 pt-4">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-accent">{getIcon(selectedItem.icon)}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2">{selectedItem.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {selectedItem.description}
                  </p>
                  {selectedItem.benefit && (
                    <Badge variant="outline" className="border-primary/50 text-primary">
                      {selectedItem.benefit}
                    </Badge>
                  )}
                </div>
              </div>

              <Separator className="bg-border/30" />

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Item Cost</span>
                  <span className="font-mono font-bold text-accent">{selectedItem.cost} Tokens</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Current Balance</span>
                  <span className="font-mono font-bold">{wallet?.totalTokens || 0} Tokens</span>
                </div>
                <Separator className="bg-border/30" />
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Balance After Purchase</span>
                  <span className="font-mono font-bold text-lg text-secondary">
                    {(wallet?.totalTokens || 0) - selectedItem.cost} Tokens
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setIsConfirmOpen(false)
                    setSelectedItem(null)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-accent hover:bg-accent/80 text-accent-foreground glow-magenta"
                  onClick={() => selectedItem && handlePurchase(selectedItem)}
                  disabled={!wallet || !hasEnoughTokens(wallet, selectedItem.cost)}
                >
                  <ShoppingCart size={18} weight="bold" className="mr-2" />
                  Confirm Purchase
                </Button>
              </div>

              {wallet && !hasEnoughTokens(wallet, selectedItem.cost) && (
                <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                  <p className="text-sm text-destructive font-medium">
                    Insufficient tokens. You need {selectedItem.cost - (wallet?.totalTokens || 0)} more tokens.
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
