export interface Fact {
  id: string
  text: string
  category: 'IBM' | 'Apple' | 'Microsoft' | 'Steve Jobs' | '1984' | 'Programming' | 'Hardware' | 'Bill Gates' | 'Steve Wozniak' | 'Unix' | 'Internet' | 'Gaming' | 'Xerox PARC' | 'Early Computing' | 'Silicon Valley' | 'AI History'
}

export interface QueueVideo {
  id: string
  url: string
  title: string
  addedAt: number
}
