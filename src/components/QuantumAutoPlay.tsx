import { useEffect, useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkle, Play, X } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { QueueVideo } from '@/lib/types'

interface QuantumAutoPlayProps {
  queue: QueueVideo[]
  currentVideo: string
  currentVideoTitle: string
  onPlayNext: (url: string, title: string) => void
  userLogin: string | null
}

interface NextVideoRecommendation {
  video: QueueVideo
  reason: string
  relevanceScore: number
}

export function QuantumAutoPlay({ 
  queue, 
  currentVideo, 
  currentVideoTitle,
  onPlayNext,
  userLogin 
}: QuantumAutoPlayProps) {
  const [nextRecommendation, setNextRecommendation] = useState<NextVideoRecommendation | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [viewingHistory, setViewingHistory] = useKV<string[]>('viewing-history', [])
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    if (queue.length === 0 || isDismissed) return
    if (!window.spark || typeof window.spark.llmPrompt !== 'function' || typeof window.spark.llm !== 'function') {
      console.log('[QuantumAutoPlay] Spark SDK not ready, skipping analysis')
      return
    }

    const analyzeNextVideo = async () => {
      setIsAnalyzing(true)
      
      try {
        const historyContext = viewingHistory && viewingHistory.length > 0
          ? `User recently watched: ${viewingHistory.slice(-3).join(', ')}`
          : 'New viewing session'

        const queueTitles = queue.map(v => v.title).join(', ')

        // @ts-expect-error - spark.llmPrompt template tag type inference issue
        const prompt = window.spark.llmPrompt`You are a quantum-powered video recommendation engine. Based on the current video and viewing context, determine the BEST next video to play.

Current Video: "${currentVideoTitle}"
${historyContext}

Available Queue: ${queueTitles}

Analyze which video from the queue would provide the best viewing experience next. Consider:
- Topical relevance and natural progression
- Variety to prevent fatigue
- Educational value flow
- Historical chronology if applicable

Return a JSON object with:
- videoIndex: The index (0-based) of the best video from the queue
- reason: One compelling sentence explaining why this video should play next
- relevanceScore: Number from 70-100 indicating match quality

If the queue is empty or no good match exists, return videoIndex as -1.`

        const response = await window.spark.llm(prompt, 'gpt-4o', true)
        
        if (!response || typeof response !== 'string') {
          console.error('[QuantumAutoPlay] Invalid LLM response:', response)
          return
        }

        const parsed = JSON.parse(response)
        
        if (!parsed || typeof parsed !== 'object') {
          console.error('[QuantumAutoPlay] Invalid parsed response:', parsed)
          return
        }
        
        if (parsed.videoIndex >= 0 && parsed.videoIndex < queue.length && parsed.reason && parsed.relevanceScore) {
          setNextRecommendation({
            video: queue[parsed.videoIndex],
            reason: parsed.reason,
            relevanceScore: parsed.relevanceScore
          })
        }
      } catch (error) {
        console.error('[QuantumAutoPlay] Quantum analysis failed:', error)
      } finally {
        setIsAnalyzing(false)
      }
    }

    const timer = setTimeout(analyzeNextVideo, 2000)
    return () => clearTimeout(timer)
  }, [queue, currentVideo, currentVideoTitle, viewingHistory, isDismissed])

  const handlePlayNext = () => {
    if (!nextRecommendation) return
    
    setViewingHistory((current) => [...(current || []), currentVideoTitle])
    onPlayNext(nextRecommendation.video.url, nextRecommendation.video.title)
    setNextRecommendation(null)
    setIsDismissed(false)
    toast.success('Playing quantum-recommended video')
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    setNextRecommendation(null)
  }

  if (!nextRecommendation || isDismissed) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-4 border-primary/30 bg-gradient-to-br from-card/95 to-primary/5 backdrop-blur glow-cyan">
          <div className="flex items-start gap-4">
            <div className="shrink-0">
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <Sparkle size={32} className="text-primary" weight="fill" />
              </motion.div>
            </div>
            
            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-mono uppercase tracking-wider text-primary">
                      Quantum Recommendation
                    </h3>
                    <Badge variant="outline" className="border-primary/50 text-primary text-xs">
                      {nextRecommendation.relevanceScore}% Match
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    AI-analyzed next best presentation
                  </p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleDismiss}
                  className="h-6 w-6 text-muted-foreground hover:text-foreground"
                >
                  <X size={14} weight="bold" />
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">
                  {nextRecommendation.video.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {nextRecommendation.reason}
                </p>
              </div>

              <Button
                onClick={handlePlayNext}
                className="w-full bg-accent hover:bg-accent/80 text-accent-foreground glow-magenta"
              >
                <Play weight="fill" className="mr-2" size={16} />
                Play Next Video
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
