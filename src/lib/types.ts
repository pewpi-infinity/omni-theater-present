export interface Fact {
  id: string
  text: string
  category: 'IBM' | 'Apple' | 'Microsoft' | 'Steve Jobs' | '1984' | 'Programming' | 'Hardware' | 'Bill Gates' | 'Steve Wozniak' | 'Unix' | 'Internet' | 'Gaming' | 'Xerox PARC' | 'Early Computing' | 'Silicon Valley' | 'AI History' | 'Mongoose OS' | 'IoT' | 'Embedded Systems'
}

export interface QueueVideo {
  id: string
  url: string
  title: string
  addedAt: number
}

export interface QuantumReport {
  movieTitle: string
  timestamp: number
  analysis: string
  quantumFactors: string[]
}

export interface UserContent {
  id: string
  url: string
  title: string
  uploadedAt: number
  userId: string
}

export interface WatchSession {
  id: string
  videoTitle: string
  startTime: number
  endTime?: number
  isDocumentary: boolean
  tokensEarned: number
}

export interface UserTokens {
  userId: string
  totalTokens: number
  watchSessions: WatchSession[]
  quizzesPassed: number
}

export interface Advertisement {
  id: string
  userId: string
  title: string
  description: string
  targetUrl: string
  createdAt: number
  tokensSpent: number
  impressions: number
}

export interface Quiz {
  id: string
  videoTitle: string
  question: string
  options: string[]
  correctAnswer: number
  bonusTokens: number
}

export interface ChatMessage {
  id: string
  userId: string
  username: string
  avatarUrl: string
  message: string
  timestamp: number
  partyId?: string
}

export interface ViewingParty {
  id: string
  name: string
  hostId: string
  hostName: string
  videoUrl: string
  videoTitle: string
  createdAt: number
  isActive: boolean
  memberCount: number
  currentTime: number
  isPlaying: boolean
  lastSync: number
}

export interface PartyMember {
  userId: string
  username: string
  avatarUrl: string
  joinedAt: number
}
