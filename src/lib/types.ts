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
