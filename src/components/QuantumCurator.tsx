import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Sparkle, Plus, TrendUp } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

interface CuratedVideo {
  title: string
  url: string
  reason: string
  relevanceScore: number
  category: string
}

interface QuantumCuratorProps {
  userLogin: string | null
  onImportVideo: (url: string, title: string) => void
}

export function QuantumCurator({ userLogin, onImportVideo }: QuantumCuratorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [curatedVideos, setCuratedVideos] = useState<CuratedVideo[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [userIntentHistory, setUserIntentHistory] = useKV<string[]>('user-intent-history', [])

  const handleAnalyze = async () => {
    try {
      if (typeof window === 'undefined' || !window.spark || typeof window.spark.llmPrompt !== 'function' || typeof window.spark.llm !== 'function') {
        toast.error('SDK not ready. Please try again in a moment.')
        console.log('[QuantumCurator] Spark SDK not ready')
        return
      }
    } catch (error) {
      console.error('[QuantumCurator] Error checking SDK:', error)
      toast.error('Unable to access AI features')
      return
    }
    
    setIsAnalyzing(true)
    setIsOpen(true)
    
    try {
      const intentContext = userIntentHistory && userIntentHistory.length > 0 
        ? `User has previously shown interest in: ${userIntentHistory.slice(-5).join(', ')}` 
        : 'New user, focus on foundational computing documentaries'

      // @ts-expect-error - spark.llmPrompt template tag type inference issue
      const prompt = window.spark.llmPrompt`You are a quantum-powered content curator for a tech documentary theater. Analyze user intent and recommend the TOP 5 most relevant computing/tech documentaries or movies.

${intentContext}

Return a JSON object with a property "videos" containing an array of 5 video recommendations. Each video should have:
- title: Full movie/documentary title
- url: An actual archive.org embed URL (use format: https://archive.org/embed/VIDEO_ID)
- reason: One compelling sentence explaining why this is recommended
- relevanceScore: Number from 70-100 indicating match quality
- category: One of: "Computing History", "Tech Biography", "Programming", "Hardware", "Internet History", "Gaming", "AI & Robotics", "IoT & Embedded"

Focus on real, historically significant content from archive.org. Prioritize variety across different eras and topics.`

      const response = await window.spark.llm(prompt, 'gpt-4o', true)
      
      if (!response || typeof response !== 'string') {
        console.error('[QuantumCurator] Invalid LLM response:', response)
        toast.error('Invalid response from AI')
        setIsOpen(false)
        return
      }

      const parsed = JSON.parse(response)
      
      if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.videos)) {
        console.error('[QuantumCurator] Invalid parsed response:', parsed)
        toast.error('Invalid AI response format')
        setIsOpen(false)
        return
      }
      
      const videos = parsed.videos.filter((video: any) => 
        video && 
        typeof video === 'object' && 
        video.title && 
        video.url && 
        video.reason && 
        typeof video.relevanceScore === 'number' &&
        video.category
      )
      
      if (videos.length === 0) {
        toast.error('No valid recommendations received')
        setIsOpen(false)
        return
      }

      setCuratedVideos(videos)
      
      videos.forEach((video: CuratedVideo) => {
        setUserIntentHistory((current) => [...(current || []), video.category])
      })
      
    } catch (error) {
      console.error('[QuantumCurator] Quantum curation error:', error)
      toast.error('Quantum curation failed')
      setIsOpen(false)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleImport = (video: CuratedVideo) => {
    onImportVideo(video.url, video.title)
    toast.success(`Added "${video.title}" to queue`)
  }

  return (
    <>
      <Button
        onClick={handleAnalyze}
        variant="outline"
        size="lg"
        className="border-primary/50 hover:border-primary hover:bg-primary/10 hover:glow-cyan transition-all"
      >
        <Sparkle className="mr-2 text-primary" weight="fill" />
        Quantum Curation
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="border-primary/30 bg-card max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-primary flex items-center gap-2">
              <Sparkle size={24} weight="fill" />
              Quantum-Curated Recommendations
            </DialogTitle>
            <p className="text-sm text-muted-foreground font-mono">
              AI-analyzed content matching your viewing intent and logic platform
            </p>
          </DialogHeader>

          <ScrollArea className="max-h-[600px] pr-4">
            <AnimatePresence mode="wait">
              {isAnalyzing ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-16 text-center space-y-4"
                >
                  <motion.div
                    animate={{ 
                      rotate: 360,
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                      scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="inline-block"
                  >
                    <Sparkle size={64} className="text-primary" weight="fill" />
                  </motion.div>
                  <div className="space-y-2">
                    <p className="text-muted-foreground font-mono text-sm">
                      Analyzing quantum entanglement patterns...
                    </p>
                    <p className="text-muted-foreground/60 font-mono text-xs">
                      Mapping your intent across the multiverse of content...
                    </p>
                  </div>
                </motion.div>
              ) : curatedVideos.length > 0 ? (
                <motion.div
                  key="videos"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  {curatedVideos.map((video, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Card className="p-4 border-primary/20 bg-card/50 hover:border-primary/50 hover:bg-card/70 transition-all">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold text-foreground">
                                  {video.title}
                                </h3>
                                <Badge variant="outline" className="border-secondary/50 text-secondary text-xs">
                                  {video.category}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {video.reason}
                              </p>
                              <div className="flex items-center gap-2">
                                <TrendUp size={14} className="text-primary" weight="bold" />
                                <span className="text-xs font-mono text-primary">
                                  {video.relevanceScore}% Match
                                </span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleImport(video)}
                              className="bg-accent hover:bg-accent/80 text-accent-foreground glow-magenta shrink-0"
                            >
                              <Plus weight="bold" className="mr-1" size={16} />
                              Import
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </ScrollArea>

          {!isAnalyzing && curatedVideos.length > 0 && (
            <div className="pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground font-mono text-center">
                Recommendations adapt based on your viewing patterns and intent
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
