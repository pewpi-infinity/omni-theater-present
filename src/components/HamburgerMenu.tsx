import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { List, Trash, Play, Infinity, House, Sparkle, Package, Wrench, Factory, Plant } from '@phosphor-icons/react'
import { UserContent } from '@/lib/types'
import { toast } from 'sonner'

interface HamburgerMenuProps {
  onSelectVideo: (url: string, title?: string) => void
  currentVideo: string
  userLogin: string | null
}

const REPO_LINKS = [
  { name: "Mario's Castle", icon: House, url: '#', description: 'Main Hub' },
  { name: "Mario's Paradise", icon: Sparkle, url: '#', description: 'Knowledge Center' },
  { name: "Mario's Treasure Chest", icon: Package, url: '#', description: 'Resources' },
  { name: "Mario's AI Builder", icon: Wrench, url: '#', description: 'Tools' },
  { name: "Luigi's Factory", icon: Factory, url: '#', description: 'Production' },
  { name: "Luigi's Seed Repository", icon: Plant, url: '#', description: 'Heirloom Seeds' },
]

export function HamburgerMenu({ onSelectVideo, currentVideo, userLogin }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [userContent, setUserContent] = useKV<UserContent[]>('user-content', [])

  const handlePlayContent = (url: string, title: string) => {
    onSelectVideo(url, title)
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
            Theater Navigation
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Infinity className="text-secondary" size={20} weight="bold" />
              <h3 className="text-sm font-mono uppercase tracking-wider text-secondary">
                Infinity Links
              </h3>
            </div>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2 pr-4">
                {REPO_LINKS.map((link) => {
                  const IconComponent = link.icon
                  return (
                    <a
                      key={link.name}
                      href={link.url}
                      className="block"
                    >
                      <Card className="p-3 border-border/50 bg-card/30 hover:border-secondary/50 hover:bg-secondary/5 transition-all cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center">
                            <IconComponent className="text-secondary" size={20} weight="duotone" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm truncate">
                              {link.name}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {link.description}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </a>
                  )
                })}
              </div>
            </ScrollArea>
          </div>

          <Separator className="bg-border/50" />

          <div>
            <h3 className="text-sm font-mono uppercase tracking-wider text-primary mb-3">
              My Content Library
            </h3>
            {!userLogin ? (
              <div className="text-center py-8 space-y-2">
                <p className="text-muted-foreground font-mono text-sm">
                  Please sign in to access your content
                </p>
              </div>
            ) : userContentFiltered.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <p className="text-muted-foreground font-mono text-sm">
                  No content uploaded yet
                </p>
                <p className="text-xs text-muted-foreground/60">
                  Add videos to your personal library
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[calc(100vh-550px)]">
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
                            onClick={() => handlePlayContent(content.url, content.title)}
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
        </div>
      </SheetContent>
    </Sheet>
  )
}
