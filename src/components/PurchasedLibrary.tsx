import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Package, 
  VideoCamera, 
  Star, 
  Trophy, 
  Lightning, 
  Crown,
  Gift,
  Sparkle
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface PurchasedItem {
  itemId: string
  title: string
  purchasedAt: number
  type: string
}

interface PurchasedLibraryProps {
  userLogin: string | null
}

export function PurchasedLibrary({ userLogin }: PurchasedLibraryProps) {
  const [purchases, setPurchases] = useKV<PurchasedItem[]>('store-purchases', [])

  if (!userLogin) {
    return null
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <VideoCamera size={20} weight="duotone" />
      case 'badge': return <Trophy size={20} weight="duotone" />
      case 'boost': return <Lightning size={20} weight="duotone" />
      case 'feature': return <Sparkle size={20} weight="duotone" />
      default: return <Star size={20} weight="duotone" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'text-primary border-primary/50 bg-primary/10'
      case 'badge': return 'text-accent border-accent/50 bg-accent/10'
      case 'boost': return 'text-secondary border-secondary/50 bg-secondary/10'
      case 'feature': return 'text-foreground border-border/50 bg-muted/30'
      default: return 'text-muted-foreground border-border/50 bg-muted/20'
    }
  }

  const sortedPurchases = [...(purchases || [])].sort((a, b) => b.purchasedAt - a.purchasedAt)

  if (sortedPurchases.length === 0) {
    return (
      <Card className="p-6 border-border/50 bg-card/50 backdrop-blur text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-muted/30 flex items-center justify-center">
            <Package className="text-muted-foreground" size={28} weight="duotone" />
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-1">No Purchases Yet</h3>
            <p className="text-xs text-muted-foreground">
              Visit the Token Store to redeem exclusive content
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
      <Card className="p-6 border-primary/30 bg-card/50 backdrop-blur">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-cyan">
              <Package className="text-background" size={22} weight="fill" />
            </div>
            <div>
              <h2 className="text-lg font-bold uppercase tracking-wide">My Purchases</h2>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-mono">
                {sortedPurchases.length} {sortedPurchases.length === 1 ? 'Item' : 'Items'} Owned
              </p>
            </div>
          </div>
        </div>

        <Separator className="mb-4 bg-primary/20" />

        <ScrollArea className="h-[300px]">
          <div className="space-y-2 pr-4">
            {sortedPurchases.map((purchase, index) => (
              <motion.div
                key={purchase.itemId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="p-3 border-border/50 bg-card/30 hover:border-primary/30 transition-all">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${getTypeColor(purchase.type)}`}>
                        {getTypeIcon(purchase.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">
                          {purchase.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs border-border/50">
                            {purchase.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground font-mono">
                            {new Date(purchase.purchasedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-secondary/20 text-secondary border-secondary/40 shrink-0">
                      Owned
                    </Badge>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </motion.div>
  )
}
