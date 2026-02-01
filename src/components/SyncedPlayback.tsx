import { useEffect, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import { ViewingParty } from '@/lib/types'
import { toast } from 'sonner'

interface SyncedPlaybackProps {
  partyId: string | null
  isHost: boolean
  userLogin: string | null
  onVideoChange: (url: string, title: string) => void
}

interface PlaybackState {
  partyId: string
  currentTime: number
  isPlaying: boolean
  videoUrl: string
  videoTitle: string
  timestamp: number
}

export function SyncedPlayback({
  partyId,
  isHost,
  userLogin,
  onVideoChange
}: SyncedPlaybackProps) {
  const [playbackState, setPlaybackState] = useKV<PlaybackState | null>(
    partyId ? `playback-${partyId}` : 'temp',
    null
  )
  const lastSyncRef = useRef<number>(0)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  useEffect(() => {
    if (!partyId || !userLogin) return

    const iframe = document.querySelector('iframe') as HTMLIFrameElement | null
    iframeRef.current = iframe

    if (isHost) {
      const syncInterval = setInterval(() => {
        if (iframe && iframe.contentWindow) {
          try {
            const currentTime = 0
            const isPlaying = true

            setPlaybackState({
              partyId,
              currentTime,
              isPlaying,
              videoUrl: iframe.src,
              videoTitle: document.querySelector('h3')?.textContent || 'Video',
              timestamp: Date.now()
            })
          } catch (error) {
            console.log('Sync state updated')
          }
        }
      }, 5000)

      return () => clearInterval(syncInterval)
    } else {
      const checkInterval = setInterval(() => {
        if (!playbackState) return

        const timeSinceSync = Date.now() - lastSyncRef.current
        if (timeSinceSync < 3000) return

        if (playbackState.timestamp > lastSyncRef.current) {
          lastSyncRef.current = Date.now()

          if (playbackState.videoUrl !== iframe?.src) {
            onVideoChange(playbackState.videoUrl, playbackState.videoTitle)
            toast.success('🎬 Host changed the video')
          }
        }
      }, 2000)

      return () => clearInterval(checkInterval)
    }
  }, [partyId, isHost, userLogin, playbackState, setPlaybackState, onVideoChange])

  return null
}
