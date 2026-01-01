import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { VideoCamera, Plus } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { QueueVideo } from '@/lib/types'

interface ContentSubmissionProps {
  userLogin: string | null
}

export function ContentSubmission({ userLogin }: ContentSubmissionProps) {
  const [queue, setQueue] = useKV<QueueVideo[]>('video-queue', [])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [isTvShow, setIsTvShow] = useState(false)
  const [isEvent, setIsEvent] = useState(false)

  const handleSubmit = () => {
    if (!userLogin) {
      toast.error('Please sign in to submit content')
      return
    }

    if (!title.trim() || !url.trim()) {
      toast.error('Please fill in title and URL')
      return
    }

    let videoTitle = title.trim()
    if (isTvShow) videoTitle += ' [TV Show]'
    if (isEvent) videoTitle += ' [Event]'

    const newVideo: QueueVideo = {
      id: Date.now().toString(),
      url: url.trim(),
      title: videoTitle,
      addedAt: Date.now()
    }

    setQueue((current) => [...(current || []), newVideo])
    toast.success('Content submitted to theater queue!')
    
    setTitle('')
    setUrl('')
    setDescription('')
    setIsTvShow(false)
    setIsEvent(false)
    setIsDialogOpen(false)
  }

  return (
    <Card className="p-6 border-primary/30 bg-card/50 backdrop-blur">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <VideoCamera className="text-primary" size={28} weight="duotone" />
            <div>
              <h2 className="text-lg font-semibold uppercase tracking-wide">
                Community Content Submission
              </h2>
              <p className="text-xs text-muted-foreground font-mono">
                Suggest videos, TV shows, and events
              </p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-primary hover:bg-primary/80 text-primary-foreground glow-cyan"
                disabled={!userLogin}
              >
                <Plus weight="bold" className="mr-2" />
                Submit Content
              </Button>
            </DialogTrigger>
            <DialogContent className="border-primary/30 bg-card">
              <DialogHeader>
                <DialogTitle className="text-primary">Submit Your Content</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="content-title" className="text-sm uppercase tracking-wide">
                    Title
                  </Label>
                  <Input
                    id="content-title"
                    placeholder="Video, show, or event title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
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
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="border-primary/30 focus:border-primary focus:glow-cyan bg-background/50 font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content-description" className="text-sm uppercase tracking-wide">
                    Description (Optional)
                  </Label>
                  <Textarea
                    id="content-description"
                    placeholder="Brief description of the content..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="border-primary/30 focus:border-primary focus:glow-cyan bg-background/50"
                  />
                </div>

                <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-border/50">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground font-mono">
                    Content Type
                  </p>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="tv-show" className="text-sm">
                      TV Show
                    </Label>
                    <Switch
                      id="tv-show"
                      checked={isTvShow}
                      onCheckedChange={setIsTvShow}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="event" className="text-sm">
                      Live Event
                    </Label>
                    <Switch
                      id="event"
                      checked={isEvent}
                      onCheckedChange={setIsEvent}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  className="w-full bg-primary hover:bg-primary/80 text-primary-foreground glow-cyan"
                >
                  Submit to Queue
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="text-sm text-muted-foreground leading-relaxed">
          <p>
            Share educational documentaries, tech presentations, classic computing content, or live events with the community. 
            All submissions appear in the theater queue for everyone to enjoy.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="text-center p-3 bg-muted/20 rounded-lg border border-border/30">
            <p className="text-xs uppercase tracking-wide text-muted-foreground font-mono mb-1">
              Movies
            </p>
            <p className="text-lg font-bold text-foreground">1 token/hr</p>
          </div>
          <div className="text-center p-3 bg-muted/20 rounded-lg border border-border/30">
            <p className="text-xs uppercase tracking-wide text-muted-foreground font-mono mb-1">
              Documentaries
            </p>
            <p className="text-lg font-bold text-secondary">3 tokens/hr</p>
          </div>
          <div className="text-center p-3 bg-muted/20 rounded-lg border border-border/30">
            <p className="text-xs uppercase tracking-wide text-muted-foreground font-mono mb-1">
              Quiz Bonus
            </p>
            <p className="text-lg font-bold text-accent">5-10 tokens</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
