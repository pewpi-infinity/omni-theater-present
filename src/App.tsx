import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Plus, Trash, ArrowRight, FilmStrip, Pause, Play } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { INITIAL_FACTS } from '@/lib/facts'
import { QueueVideo, Fact, UserContent } from '@/lib/types'
import { HamburgerMenu } from '@/components/HamburgerMenu'
import { AuthComponent } from '@/components/AuthComponent'
import { QuantumAnalyzer } from '@/components/QuantumAnalyzer'
import { TokenDisplay } from '@/components/TokenDisplay'
import { AdvertisingAgent } from '@/components/AdvertisingAgent'
import { BonusQuiz } from '@/components/BonusQuiz'
import { ContentSubmission } from '@/components/ContentSubmission'
import { QuantumCurator } from '@/components/QuantumCurator'

function App() {
  const [facts, setFacts] = useKV<Fact[]>('facts', INITIAL_FACTS)
  const [queue, setQueue] = useKV<QueueVideo[]>('video-queue', [])
  const [currentVideo, setCurrentVideo] = useKV<string>('current-video', 'https://ia800204.us.archive.org/12/items/ComputerHackingDocumentriesMegaCollection/Hack%20-%20Pirates%20Of%20Silicon%20Valley%20%281999%29%20%28TNT%29.mp4')
  const [currentVideoTitle, setCurrentVideoTitle] = useKV<string>('current-video-title', 'Pirates of Silicon Valley')
  const [userLogin, setUserLogin] = useKV<string | null>('user-login', null)
  const [userContent, setUserContent] = useKV<UserContent[]>('user-content', [])
  const [factSpeed, setFactSpeed] = useKV<number>('fact-speed', 15)
  const [isDocumentary, setIsDocumentary] = useKV<boolean>('is-documentary', false)
  
  const [currentFactIndex, setCurrentFactIndex] = useState(0)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isAddContentDialogOpen, setIsAddContentDialogOpen] = useState(false)
  const [newVideoUrl, setNewVideoUrl] = useState('')
  const [newVideoTitle, setNewVideoTitle] = useState('')
  const [newContentUrl, setNewContentUrl] = useState('')
  const [newContentTitle, setNewContentTitle] = useState('')
  const [isPaused, setIsPaused] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    if (!facts || facts.length === 0 || isPaused) return
    const speed = factSpeed ?? 15
    const interval = setInterval(() => {
      if (!isDragging) {
        setCurrentFactIndex((prev) => (prev + 1) % facts.length)
      }
    }, speed * 1000)
    return () => clearInterval(interval)
  }, [facts, factSpeed, isPaused, isDragging])

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

  const handleAddContent = () => {
    if (!userLogin) {
      toast.error('Please sign in to add content')
      return
    }

    if (!newContentUrl.trim()) {
      toast.error('Please enter a video URL')
      return
    }

    const newContent: UserContent = {
      id: Date.now().toString(),
      url: newContentUrl.trim(),
      title: newContentTitle.trim() || 'Untitled Content',
      uploadedAt: Date.now(),
      userId: userLogin
    }

    setUserContent((current) => [...(current || []), newContent])
    
    toast.success('Content added to your library')
    setNewContentUrl('')
    setNewContentTitle('')
    setIsAddContentDialogOpen(false)
  }

  const handleRemoveVideo = (id: string) => {
    setQueue((current) => (current || []).filter((v) => v.id !== id))
    toast.success('Video removed from queue')
  }

  const handlePlayVideo = (url: string, title?: string) => {
    setCurrentVideo(url)
    setCurrentVideoTitle(title || 'Video')
    
    const titleLower = (title || '').toLowerCase()
    const isDoc = titleLower.includes('documentary') || 
                  titleLower.includes('educational') || 
                  titleLower.includes('history') ||
                  titleLower.includes('tech talk') ||
                  titleLower.includes('presentation')
    setIsDocumentary(isDoc)
    
    toast.success('Now playing')
  }

  const handleNextFact = () => {
    if (!facts || facts.length === 0) return
    setCurrentFactIndex((prev) => (prev + 1) % facts.length)
  }

  const handlePreviousFact = () => {
    if (!facts || facts.length === 0) return
    setCurrentFactIndex((prev) => (prev - 1 + facts.length) % facts.length)
  }

  const handleFactDragStart = () => {
    setIsDragging(true)
  }

  const handleFactDragEnd = () => {
    setIsDragging(false)
  }

  const currentFact = facts?.[currentFactIndex]
  const safeQueue = queue || []
  const safeFacts = facts || []

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <HamburgerMenu
              onSelectVideo={handlePlayVideo}
              currentVideo={currentVideo ?? ''}
              userLogin={userLogin ?? null}
            />
            <div className="flex-1 text-center space-y-2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-primary glow-cyan">
                Omni Theater Presents
              </h1>
              <p className="text-sm md:text-base text-muted-foreground uppercase tracking-widest font-mono">
                A Journey Through Computing History
              </p>
            </div>
            <div className="flex items-center gap-2">
              <AuthComponent userLogin={userLogin ?? null} onLoginChange={setUserLogin} />
            </div>
          </div>

          {userLogin && (
            <div className="flex justify-center">
              <Dialog open={isAddContentDialogOpen} onOpenChange={setIsAddContentDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-secondary/50 hover:border-secondary hover:bg-secondary/10 text-sm"
                  >
                    <Plus weight="bold" className="mr-2" size={16} />
                    Add to My Library
                  </Button>
                </DialogTrigger>
                <DialogContent className="border-primary/30 bg-card">
                  <DialogHeader>
                    <DialogTitle className="text-primary">Add to Your Content Library</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="content-title" className="text-sm uppercase tracking-wide">
                        Title
                      </Label>
                      <Input
                        id="content-title"
                        placeholder="Enter content title"
                        value={newContentTitle}
                        onChange={(e) => setNewContentTitle(e.target.value)}
                        className="border-primary/30 focus:border-primary focus:glow-cyan bg-background/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="content-url" className="text-sm uppercase tracking-wide">
                        Video URL
                      </Label>
                      <Input
                        id="content-url"
                        placeholder="https://archive.org/embed/..."
                        value={newContentUrl}
                        onChange={(e) => setNewContentUrl(e.target.value)}
                        className="border-primary/30 focus:border-primary focus:glow-cyan bg-background/50 font-mono text-sm"
                      />
                    </div>
                    <Button
                      onClick={handleAddContent}
                      className="w-full bg-accent hover:bg-accent/80 text-accent-foreground glow-magenta"
                    >
                      Add to Library
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}

          <div className="flex justify-center">
            <QuantumCurator 
              userLogin={userLogin ?? null}
              onImportVideo={(url, title) => {
                const newVideo: QueueVideo = {
                  id: Date.now().toString(),
                  url,
                  title,
                  addedAt: Date.now()
                }
                setQueue((current) => [...(current || []), newVideo])
              }}
            />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden border-primary/30 glow-cyan scan-lines">
              <div className="aspect-video bg-black">
                <iframe
                  src={currentVideo || ''}
                  className="w-full h-full"
                  allowFullScreen
                  title="Video Player"
                />
              </div>
              <div className="p-4 bg-card/50 backdrop-blur border-t border-primary/20">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm uppercase tracking-wide text-foreground">
                    {currentVideoTitle}
                  </h3>
                  <QuantumAnalyzer movieTitle={currentVideoTitle || 'Video'} />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-secondary/30 bg-card/50 backdrop-blur">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                      Fact Speed
                    </span>
                    <span className="text-xs font-mono text-foreground px-2 py-0.5 bg-secondary/20 rounded">
                      {factSpeed}s
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setIsPaused(!isPaused)}
                      className="h-8 w-8 border-secondary/50 hover:border-secondary hover:bg-secondary/10"
                    >
                      {isPaused ? (
                        <Play className="text-secondary" weight="fill" size={16} />
                      ) : (
                        <Pause className="text-secondary" weight="fill" size={16} />
                      )}
                    </Button>
                  </div>
                </div>
                
                <Slider
                  value={[factSpeed ?? 15]}
                  onValueChange={(vals) => setFactSpeed(vals[0])}
                  min={5}
                  max={30}
                  step={1}
                  className="w-full"
                />

                <div className="flex items-start justify-between gap-4">
                  <div 
                    className="flex-1 min-h-[120px] cursor-grab active:cursor-grabbing"
                    onMouseDown={handleFactDragStart}
                    onMouseUp={handleFactDragEnd}
                    onTouchStart={handleFactDragStart}
                    onTouchEnd={handleFactDragEnd}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentFactIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-3"
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.2}
                        onDragEnd={(e, info) => {
                          if (info.offset.x > 100) {
                            handlePreviousFact()
                          } else if (info.offset.x < -100) {
                            handleNextFact()
                          }
                          handleFactDragEnd()
                        }}
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
                        onClick={() => handlePlayVideo(video.url, video.title)}
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

        {userLogin && (
          <TokenDisplay 
            userLogin={userLogin ?? null} 
            currentVideoTitle={currentVideoTitle ?? 'Video'} 
            isDocumentary={isDocumentary ?? false}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AdvertisingAgent userLogin={userLogin ?? null} />
          <ContentSubmission userLogin={userLogin ?? null} />
        </div>

        <BonusQuiz 
          userLogin={userLogin ?? null} 
          currentVideoTitle={currentVideoTitle ?? 'Video'} 
          isDocumentary={isDocumentary ?? false}
        />
      </div>
    </div>
  )
}

export default App