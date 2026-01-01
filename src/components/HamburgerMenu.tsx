import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { List, Trash, Play } from '@phosphor-icons/react'
import { UserContent } from '@/lib/types'
import { toast } from 'sonner'

interface HamburgerMenuProps {
  onSelectVideo: (url: string) => void
  currentVideo: string
  userLogin: string | null
}

export function HamburgerMenu({ onSelectVideo, currentVideo, userLogin }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [userContent, setUserContent] = useKV<UserContent[]>('user-content', [])

  const handlePlayContent = (url: string) => {
    onSelectVideo(url)
    setIsOpen(false)
    toast.success('Playing your content')
  }

  const handleRemoveContent = (id: string) => {
    setUserContent((current) => (current || []).filter((c) => c.id !== id))
    toast.success('Content removed')
  }

  const safeContent = userContent || []
  const userContentFiltered = userLogin 
    ? safeContent.filter((c) => c.userId === userLogin)
    : []

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="border border-primary/50 hover:border-primary hover:bg-primary/10 hover:glow-cyan transition-all"
        >
          <List className="text-primary" weight="bold" size={24} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="border-primary/30 bg-card/95 backdrop-blur w-[400px]">
        <SheetHeader>
          <SheetTitle className="text-primary text-xl uppercase tracking-wide">
            My Content Library
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6">
          {!userLogin ? (
            <div className="text-center py-12 space-y-2">
              <p className="text-muted-foreground font-mono text-sm">
                Please sign in to access your content
              </p>
            </div>
          ) : userContentFiltered.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <p className="text-muted-foreground font-mono text-sm">
                No content uploaded yet
              </p>
              <p className="text-xs text-muted-foreground/60">
                Add videos to your personal library
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-150px)]">
              <div className="space-y-3 pr-4">
                {userContentFiltered.map((content) => (
                  <Card
                    key={content.id}
                    className={`p-4 border transition-all ${
                      currentVideo === content.url
                        ? 'border-primary bg-primary/5 glow-cyan'
                        : 'border-border/50 bg-card/30 hover:border-primary/50 hover:glow-cyan'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-sm">
                          {content.title}
                        </h3>
                      </div>
                      <p className="text-xs text-muted-foreground font-mono truncate">
                        {content.url}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handlePlayContent(content.url)}
                          className="flex-1 bg-accent hover:bg-accent/80 text-accent-foreground glow-magenta"
                        >
                          <Play size={16} weight="fill" className="mr-2" />
                          Play
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleRemoveContent(content.id)}
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash size={16} weight="bold" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
