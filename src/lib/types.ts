export interface Fact {
  id: string
  text: string
  category: 'IBM' | 'Apple' | 'Microsoft' | 'Steve Jobs' | '1984' | 'Programming' | 'Hardware'
}

export interface QueueVideo {
  id: string
  url: string
  title: string
  addedAt: number
}
