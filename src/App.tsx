import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Plus, Trash, ArrowRight, FilmStrip } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { INITIAL_FACTS } from '@/lib/facts'
import { QueueVideo, Fact } from '@/lib/types'

function App() {
  const [facts, setFacts] = useKV<Fact[]>('facts', INITIAL_FACTS)
  const [queue, setQueue] = useKV<QueueVideo[]>('video-queue', [])
  const [currentVideo, setCurrentVideo] = useKV<string>('current-video', 'https://ia800204.us.archive.org/12/items/ComputerHackingDocumentriesMegaCollection/Hack%20-%20Pirates%20Of%20Silicon%20Valley%20%281999%29%20%28TNT%29.mp4')
  
  const [currentFactIndex, setCurrentFactIndex] = useState(0)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newVideoUrl, setNewVideoUrl] = useState('')
  const [newVideoTitle, setNewVideoTitle] = useState('')

  useEffect(() => {
    if (!facts || facts.length === 0) return
    const interval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % facts.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [facts])

  const handleAddVideo = () => {
    if (!newVideoUrl.trim()) {
      toast.error('Please enter a video URL')
      return
    }

    const newVideo: QueueVideo = {
      id: Date.now().toString(),
      url: newVideoUrl.trim(),
      title: newVideoTitle.trim() || 'Untitled Video',
      addedAt: Date.now()
    }

    setQueue((current) => [...(current || []), newVideo])
    toast.success('Video added to queue')
    setNewVideoUrl('')
    setNewVideoTitle('')
    setIsAddDialogOpen(false)
  }

  const handleRemoveVideo = (id: string) => {
    setQueue((current) => (current || []).filter((v) => v.id !== id))
    toast.success('Video removed from queue')
  }

  const handlePlayVideo = (url: string) => {
    setCurrentVideo(url)
    toast.success('Now playing')
  }

  const handleNextFact = () => {
    if (!facts || facts.length === 0) return
    setCurrentFactIndex((prev) => (prev + 1) % facts.length)
  }

  const currentFact = facts?.[currentFactIndex]
  const safeQueue = queue || []
  const safeFacts = facts || []

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-primary glow-cyan">
            Omni Theater Presents
          </h1>
          <p className="text-sm md:text-base text-muted-foreground uppercase tracking-widest font-mono">
            A Journey Through Computing History
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden border-primary/30 glow-cyan scan-lines">
              <div className="aspect-video bg-black">
                <iframe
                  src={currentVideo}
                  className="w-full h-full"
                  allowFullScreen
                  title="Video Player"
                />
              </div>
            </Card>

            <Card className="p-6 border-secondary/30 bg-card/50 backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-h-[120px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentFactIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono uppercase tracking-wider px-2 py-1 bg-secondary/20 text-secondary rounded border border-secondary/40">
                          {currentFact?.category}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {currentFactIndex + 1} / {safeFacts.length}
                        </span>
                      </div>
                      <p className="text-base md:text-lg font-mono leading-relaxed text-foreground/90">
                        {currentFact?.text}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleNextFact}
                  className="shrink-0 border-primary/50 hover:border-primary hover:bg-primary/10 hover:glow-cyan transition-all"
                >
                  <ArrowRight className="text-primary" weight="bold" />
                </Button>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-4 border-accent/30 bg-card/50 backdrop-blur">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FilmStrip className="text-accent" size={24} weight="duotone" />
                  <h2 className="text-lg font-semibold uppercase tracking-wide">Queue</h2>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      size="icon" 
                      className="bg-accent hover:bg-accent/80 text-accent-foreground glow-magenta"
                    >
                      <Plus weight="bold" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="border-primary/30 bg-card">
                    <DialogHeader>
                      <DialogTitle className="text-primary">Add Video to Queue</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="video-title" className="text-sm uppercase tracking-wide">
                          Title
                        </Label>
                        <Input
                          id="video-title"
                          placeholder="Enter video title"
                          value={newVideoTitle}
                          onChange={(e) => setNewVideoTitle(e.target.value)}
                          className="border-primary/30 focus:border-primary focus:glow-cyan bg-background/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="video-url" className="text-sm uppercase tracking-wide">
                          Video URL
                        </Label>
                        <Input
                          id="video-url"
                          placeholder="https://archive.org/embed/..."
                          value={newVideoUrl}
                          onChange={(e) => setNewVideoUrl(e.target.value)}
                          className="border-primary/30 focus:border-primary focus:glow-cyan bg-background/50 font-mono text-sm"
                        />
                      </div>
                      <Button
                        onClick={handleAddVideo}
                        className="w-full bg-accent hover:bg-accent/80 text-accent-foreground glow-magenta"
                      >
                        Add to Queue
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <Separator className="mb-4 bg-accent/20" />
              
              <ScrollArea className="h-[400px] lg:h-[500px]">
                {safeQueue.length === 0 ? (
                  <div className="text-center py-12 space-y-2">
                    <p className="text-muted-foreground font-mono text-sm">
                      No videos in queue
                    </p>
                    <p className="text-xs text-muted-foreground/60">
                      Click + to add videos
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 pr-4">
                    {safeQueue.map((video) => (
                      <Card
                        key={video.id}
                        className={`p-3 border transition-all cursor-pointer hover:border-primary/50 hover:glow-cyan ${
                          currentVideo === video.url
                            ? 'border-primary bg-primary/5 glow-cyan'
                            : 'border-border/50 bg-card/30'
                        }`}
                        onClick={() => handlePlayVideo(video.url)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm truncate">
                              {video.title}
                            </h3>
                            <p className="text-xs text-muted-foreground font-mono mt-1 truncate">
                              {video.url}
                            </p>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRemoveVideo(video.id)
                            }}
                            className="shrink-0 h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash size={16} weight="bold" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App