import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Megaphone, Sparkle, Link as LinkIcon } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Advertisement } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'
import { UnifiedWallet, AD_COST, hasEnoughTokens } from '@/lib/tokenWallet'

interface AdvertisingAgentProps {
  userLogin: string | null
}

export function AdvertisingAgent({ userLogin }: AdvertisingAgentProps) {
  const [wallet, setWallet] = useKV<UnifiedWallet | null>('unified-wallet', null)
  const [advertisements, setAdvertisements] = useKV<Advertisement[]>('advertisements', [])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [targetUrl, setTargetUrl] = useState('')

  const handleGenerateAd = async () => {
    if (!title.trim()) {
      toast.error('Please enter an ad title')
      return
    }

    if (!window.spark || typeof window.spark.llmPrompt !== 'function' || typeof window.spark.llm !== 'function') {
      toast.error('SDK not ready. Please try again in a moment.')
      console.log('[AdvertisingAgent] Spark SDK not ready')
      return
    }

    setIsGenerating(true)
    try {
      // @ts-expect-error - spark.llmPrompt template tag type inference issue
      const prompt = window.spark.llmPrompt`Generate a compelling advertisement description for: "${title}". Make it engaging, professional, and concise (2-3 sentences). Focus on benefits and call-to-action. Return only the description text, no JSON.`
      
      const generatedDescription = await window.spark.llm(prompt, 'gpt-4o-mini', false)
      
      if (!generatedDescription || typeof generatedDescription !== 'string') {
        console.error('[AdvertisingAgent] Invalid LLM response:', generatedDescription)
        toast.error('Invalid response from AI')
        return
      }

      const cleanDescription = generatedDescription.trim()
      if (cleanDescription.length === 0) {
        toast.error('AI returned empty description')
        return
      }

      setDescription(cleanDescription)
      toast.success('AI generated your ad description!')
    } catch (error) {
      console.error('[AdvertisingAgent] Ad generation error:', error)
      toast.error('Failed to generate ad')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmitAd = () => {
    if (!userLogin) {
      toast.error('Please sign in to advertise')
      return
    }

    if (!wallet || !hasEnoughTokens(wallet, AD_COST)) {
      toast.error(`You need ${AD_COST} tokens to advertise. Keep watching to earn more!`)
      return
    }

    if (!title.trim() || !description.trim()) {
      toast.error('Please fill in title and description')
      return
    }

    const newAd: Advertisement = {
      id: Date.now().toString(),
      userId: userLogin,
      title: title.trim(),
      description: description.trim(),
      targetUrl: targetUrl.trim(),
      createdAt: Date.now(),
      tokensSpent: AD_COST,
      impressions: 0
    }

    setAdvertisements((current) => [...(current || []), newAd])
    setWallet((prev) => {
      if (!prev) return null
      return {
        ...prev,
        totalTokens: prev.totalTokens - AD_COST,
        adsCreated: prev.adsCreated + 1,
        transactions: [
          ...prev.transactions,
          {
            id: Date.now().toString(),
            type: 'spent',
            amount: AD_COST,
            reason: 'Advertisement created',
            timestamp: Date.now()
          }
        ],
        lastActivity: Date.now()
      }
    })

    toast.success('Advertisement created! Visible to all theater visitors.')
    setTitle('')
    setDescription('')
    setTargetUrl('')
    setIsDialogOpen(false)
  }

  const safeAds = advertisements || []
  const displayAds = safeAds.slice(-3).reverse()

  return (
    <Card className="p-6 border-accent/30 bg-card/50 backdrop-blur">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Megaphone className="text-accent" size={28} weight="duotone" />
            <div>
              <h2 className="text-lg font-semibold uppercase tracking-wide">
                Quantum Advertising Agent
              </h2>
              <p className="text-xs text-muted-foreground font-mono">
                AI-powered ads • {AD_COST} tokens each
              </p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-accent hover:bg-accent/80 text-accent-foreground glow-magenta"
                disabled={!userLogin}
              >
                <Sparkle weight="fill" className="mr-2" />
                Create Ad
              </Button>
            </DialogTrigger>
            <DialogContent className="border-primary/30 bg-card">
              <DialogHeader>
                <DialogTitle className="text-primary">Create Your Advertisement</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="ad-title" className="text-sm uppercase tracking-wide">
                    Title
                  </Label>
                  <Input
                    id="ad-title"
                    placeholder="Your project or service name"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border-primary/30 focus:border-primary focus:glow-cyan bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="ad-description" className="text-sm uppercase tracking-wide">
                      Description
                    </Label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleGenerateAd}
                      disabled={!title.trim() || isGenerating}
                      className="border-secondary/50 hover:border-secondary hover:bg-secondary/10 text-xs"
                    >
                      <Sparkle weight="fill" className="mr-1" size={14} />
                      {isGenerating ? 'Generating...' : 'AI Generate'}
                    </Button>
                  </div>
                  <Textarea
                    id="ad-description"
                    placeholder="Describe what you're advertising..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="border-primary/30 focus:border-primary focus:glow-cyan bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ad-url" className="text-sm uppercase tracking-wide">
                    Link (Optional)
                  </Label>
                  <Input
                    id="ad-url"
                    placeholder="https://your-project.com"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    className="border-primary/30 focus:border-primary focus:glow-cyan bg-background/50 font-mono text-sm"
                  />
                </div>
                <div className="p-3 bg-accent/10 border border-accent/30 rounded">
                  <p className="text-xs text-muted-foreground">
                    Cost: <span className="font-bold text-accent">{AD_COST} tokens</span>
                    {wallet && (
                      <span className="ml-2">
                        (You have: <span className="font-bold">{wallet.totalTokens}</span>)
                      </span>
                    )}
                  </p>
                </div>
                <Button
                  onClick={handleSubmitAd}
                  className="w-full bg-accent hover:bg-accent/80 text-accent-foreground glow-magenta"
                >
                  Submit Advertisement
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <ScrollArea className="h-[280px]">
          <div className="space-y-3 pr-4">
            <AnimatePresence mode="popLayout">
              {displayAds.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8"
                >
                  <p className="text-muted-foreground font-mono text-sm">
                    No advertisements yet
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-2">
                    Be the first to advertise your project!
                  </p>
                </motion.div>
              ) : (
                displayAds.map((ad, index) => (
                  <motion.div
                    key={ad.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-4 border-accent/20 bg-gradient-to-br from-accent/5 to-transparent hover:border-accent/40 transition-all">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-base text-foreground">
                            {ad.title}
                          </h3>
                          <span className="text-xs px-2 py-0.5 bg-accent/20 text-accent rounded font-mono shrink-0">
                            AD
                          </span>
                        </div>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                          {ad.description}
                        </p>
                        {ad.targetUrl && (
                          <a
                            href={ad.targetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-accent hover:text-accent/80 font-mono transition-colors"
                          >
                            <LinkIcon size={12} weight="bold" />
                            Learn More
                          </a>
                        )}
                        <div className="flex items-center justify-between pt-2 border-t border-border/30">
                          <span className="text-xs text-muted-foreground font-mono">
                            by {ad.userId}
                          </span>
                          <span className="text-xs text-muted-foreground font-mono">
                            {new Date(ad.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </div>
    </Card>
  )
}
