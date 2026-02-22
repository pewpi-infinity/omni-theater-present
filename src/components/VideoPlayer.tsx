import { useRef, useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  SpeakerHigh,
  SpeakerX,
  CornersOut,
  CornersIn,
  Warning,
} from '@phosphor-icons/react'

interface VideoPlayerProps {
  url: string
  title?: string
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function isArchiveEmbed(url: string): boolean {
  return url.includes('archive.org/embed')
}

export function VideoPlayer({ url, title = 'Video' }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const useIframe = isArchiveEmbed(url)

  // Sync play/pause state with the video element
  const handlePlayPause = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play().catch(() => {
        setError('Unable to play this video.')
      })
    } else {
      video.pause()
    }
  }, [])

  const handleSkip = useCallback((seconds: number) => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = Math.min(Math.max(video.currentTime + seconds, 0), video.duration || 0)
  }, [])

  const handleSeek = useCallback((values: number[]) => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = values[0]
  }, [])

  const handleVolumeChange = useCallback((values: number[]) => {
    const video = videoRef.current
    if (!video) return
    const v = values[0]
    video.volume = v
    setVolume(v)
  }, [])

  const handleMuteToggle = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setIsMuted(video.muted)
  }, [])

  const handleFullscreen = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
    }
  }, [])

  // Video event listeners
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onTimeUpdate = () => setCurrentTime(video.currentTime)
    const onDurationChange = () => setDuration(video.duration)
    const onVolumeChange = () => {
      setVolume(video.muted ? 0 : video.volume)
      setIsMuted(video.muted)
    }
    const onError = () => setError('Failed to load video.')
    const onFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement)

    video.addEventListener('play', onPlay)
    video.addEventListener('pause', onPause)
    video.addEventListener('timeupdate', onTimeUpdate)
    video.addEventListener('durationchange', onDurationChange)
    video.addEventListener('volumechange', onVolumeChange)
    video.addEventListener('error', onError)
    document.addEventListener('fullscreenchange', onFullscreenChange)

    return () => {
      video.removeEventListener('play', onPlay)
      video.removeEventListener('pause', onPause)
      video.removeEventListener('timeupdate', onTimeUpdate)
      video.removeEventListener('durationchange', onDurationChange)
      video.removeEventListener('volumechange', onVolumeChange)
      video.removeEventListener('error', onError)
      document.removeEventListener('fullscreenchange', onFullscreenChange)
    }
  }, [url])

  // Reset state when URL changes
  useEffect(() => {
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
    setError(null)
  }, [url])

  if (useIframe) {
    return (
      <div className="w-full h-full">
        <iframe
          src={url}
          className="w-full h-full"
          allowFullScreen
          title={title}
        />
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative w-full h-full flex flex-col bg-black group">
      {error ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-3 text-destructive p-6">
          <Warning size={40} />
          <span className="text-sm font-mono text-center">{error}</span>
        </div>
      ) : (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video
          ref={videoRef}
          src={url}
          className="w-full flex-1 object-contain"
          preload="metadata"
        />
      )}

      {/* Controls overlay */}
      <div className="flex flex-col gap-1 bg-black/80 px-3 py-2">
        {/* Progress bar */}
        <Slider
          value={[currentTime]}
          min={0}
          max={duration || 100}
          step={0.1}
          onValueChange={handleSeek}
          className="w-full"
          aria-label="Seek"
        />

        {/* Buttons row */}
        <div className="flex items-center gap-2">
          {/* Skip backward */}
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-white hover:bg-white/20"
            onClick={() => handleSkip(-10)}
            aria-label="Skip back 10 seconds"
          >
            <SkipBack size={16} weight="fill" />
          </Button>

          {/* Play/Pause */}
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-white hover:bg-white/20"
            onClick={handlePlayPause}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause size={18} weight="fill" />
            ) : (
              <Play size={18} weight="fill" />
            )}
          </Button>

          {/* Skip forward */}
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-white hover:bg-white/20"
            onClick={() => handleSkip(10)}
            aria-label="Skip forward 10 seconds"
          >
            <SkipForward size={16} weight="fill" />
          </Button>

          {/* Timer */}
          <span className="text-xs font-mono text-white/80 tabular-nums ml-1">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <div className="flex-1" />

          {/* Volume */}
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-white hover:bg-white/20"
            onClick={handleMuteToggle}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <SpeakerX size={16} weight="fill" />
            ) : (
              <SpeakerHigh size={16} weight="fill" />
            )}
          </Button>
          <Slider
            value={[volume]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="w-20"
            aria-label="Volume"
          />

          {/* Fullscreen */}
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-white hover:bg-white/20"
            onClick={handleFullscreen}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? (
              <CornersIn size={16} weight="fill" />
            ) : (
              <CornersOut size={16} weight="fill" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
