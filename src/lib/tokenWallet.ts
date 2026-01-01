import { UserTokens, WatchSession } from './types'

export interface TokenTransaction {
  id: string
  type: 'earned' | 'spent' | 'bonus'
  amount: number
  reason: string
  timestamp: number
  videoTitle?: string
}

export interface UnifiedWallet {
  userId: string
  totalTokens: number
  watchSessions: WatchSession[]
  quizzesPassed: number
  transactions: TokenTransaction[]
  adsCreated: number
  lastActivity: number
}

export const WATCH_RATE_NORMAL = 1
export const WATCH_RATE_DOCUMENTARY = 3
export const AD_COST = 50
export const QUIZ_REWARD_NORMAL = 5
export const QUIZ_REWARD_DOCUMENTARY = 10

export function createEmptyWallet(userId: string): UnifiedWallet {
  return {
    userId,
    totalTokens: 0,
    watchSessions: [],
    quizzesPassed: 0,
    transactions: [],
    adsCreated: 0,
    lastActivity: Date.now()
  }
}

export function addTokens(
  wallet: UnifiedWallet | null,
  amount: number,
  reason: string,
  videoTitle?: string
): UnifiedWallet | null {
  if (!wallet) return null
  
  const transaction: TokenTransaction = {
    id: Date.now().toString(),
    type: 'earned',
    amount,
    reason,
    timestamp: Date.now(),
    videoTitle
  }
  
  return {
    ...wallet,
    totalTokens: wallet.totalTokens + amount,
    transactions: [...wallet.transactions, transaction],
    lastActivity: Date.now()
  }
}

export function spendTokens(
  wallet: UnifiedWallet | null,
  amount: number,
  reason: string
): UnifiedWallet | null {
  if (!wallet) return null
  if (wallet.totalTokens < amount) return null
  
  const transaction: TokenTransaction = {
    id: Date.now().toString(),
    type: 'spent',
    amount,
    reason,
    timestamp: Date.now()
  }
  
  return {
    ...wallet,
    totalTokens: wallet.totalTokens - amount,
    transactions: [...wallet.transactions, transaction],
    lastActivity: Date.now()
  }
}

export function addBonusTokens(
  wallet: UnifiedWallet | null,
  amount: number,
  reason: string,
  videoTitle?: string
): UnifiedWallet | null {
  if (!wallet) return null
  
  const transaction: TokenTransaction = {
    id: Date.now().toString(),
    type: 'bonus',
    amount,
    reason,
    timestamp: Date.now(),
    videoTitle
  }
  
  return {
    ...wallet,
    totalTokens: wallet.totalTokens + amount,
    quizzesPassed: wallet.quizzesPassed + 1,
    transactions: [...wallet.transactions, transaction],
    lastActivity: Date.now()
  }
}

export function hasEnoughTokens(wallet: UnifiedWallet | null, amount: number): boolean {
  if (!wallet) return false
  return wallet.totalTokens >= amount
}

export function getTokenRate(isDocumentary: boolean): number {
  return isDocumentary ? WATCH_RATE_DOCUMENTARY : WATCH_RATE_NORMAL
}

export function getQuizReward(isDocumentary: boolean): number {
  return isDocumentary ? QUIZ_REWARD_DOCUMENTARY : QUIZ_REWARD_NORMAL
}
