import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Brain, Check, X, Sparkle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Quiz } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'
import { UnifiedWallet, getQuizReward } from '@/lib/tokenWallet'

interface BonusQuizProps {
  userLogin: string | null
  currentVideoTitle: string
  isDocumentary: boolean
}

export function BonusQuiz({ userLogin, currentVideoTitle, isDocumentary }: BonusQuizProps) {
  const [wallet, setWallet] = useKV<UnifiedWallet | null>('unified-wallet', null)
  const [completedQuizzes, setCompletedQuizzes] = useKV<string[]>('completed-quizzes', [])
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isRevealed, setIsRevealed] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const quizKey = `quiz-${currentVideoTitle}`
  const hasCompleted = completedQuizzes?.includes(quizKey) || false

  const handleGenerateQuiz = async () => {
    if (!userLogin) {
      toast.error('Please sign in to take the quiz')
      return
    }

    if (hasCompleted) {
      toast.error('You already completed this quiz!')
      return
    }

    setIsGenerating(true)
    try {
      const bonusTokens = getQuizReward(isDocumentary)

      // @ts-expect-error - spark.llmPrompt template tag type inference issue
      const prompt = window.spark.llmPrompt`Generate a trivia question about the movie/content titled: "${currentVideoTitle}". 
      Return as JSON with properties:
      - question: string (a specific trivia question)
      - options: array of 4 answer options (strings)
      - correctAnswer: number (index 0-3 of the correct option)
      
      Make the question challenging but fair. Focus on computing history, technology, or the content's themes.`
      
      const response = await window.spark.llm(prompt, 'gpt-4o-mini', true)
      const parsed = JSON.parse(response)

      const quiz: Quiz = {
        id: Date.now().toString(),
        videoTitle: currentVideoTitle,
        question: parsed.question,
        options: parsed.options,
        correctAnswer: parsed.correctAnswer,
        bonusTokens
      }

      setCurrentQuiz(quiz)
      setSelectedAnswer(null)
      setIsRevealed(false)
    } catch (error) {
      toast.error('Failed to generate quiz')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || !currentQuiz) return

    setIsRevealed(true)
    const isCorrect = selectedAnswer === currentQuiz.correctAnswer

    if (isCorrect) {
      setWallet((prev) => {
        if (!prev) return null
        return {
          ...prev,
          totalTokens: prev.totalTokens + currentQuiz.bonusTokens,
          quizzesPassed: prev.quizzesPassed + 1,
          transactions: [
            ...prev.transactions,
            {
              id: Date.now().toString(),
              type: 'bonus',
              amount: currentQuiz.bonusTokens,
              reason: 'Quiz passed',
              timestamp: Date.now(),
              videoTitle: currentVideoTitle
            }
          ],
          lastActivity: Date.now()
        }
      })
      setCompletedQuizzes((prev) => [...(prev || []), quizKey])
      toast.success(`Correct! +${currentQuiz.bonusTokens} bonus tokens!`)
    } else {
      toast.error('Incorrect answer. Try again later!')
    }
  }

  if (!userLogin) return null

  return (
    <Card className="p-6 border-secondary/30 bg-card/50 backdrop-blur">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="text-secondary" size={28} weight="duotone" />
            <div>
              <h2 className="text-lg font-semibold uppercase tracking-wide">
                Bonus Quiz Challenge
              </h2>
              <p className="text-xs text-muted-foreground font-mono">
                Earn {isDocumentary ? '10' : '5'} bonus tokens per correct answer
              </p>
            </div>
          </div>
          {!currentQuiz && (
            <Button
              onClick={handleGenerateQuiz}
              disabled={isGenerating || hasCompleted}
              className="bg-secondary hover:bg-secondary/80 text-secondary-foreground"
            >
              <Sparkle weight="fill" className="mr-2" />
              {isGenerating ? 'Generating...' : hasCompleted ? 'Completed' : 'Start Quiz'}
            </Button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {currentQuiz && (
            <motion.div
              key={currentQuiz.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <Card className="p-4 border-secondary/20 bg-secondary/5">
                <p className="text-sm font-medium leading-relaxed text-foreground">
                  {currentQuiz.question}
                </p>
              </Card>

              <div className="space-y-2">
                {currentQuiz.options.map((option, index) => {
                  const isSelected = selectedAnswer === index
                  const isCorrect = index === currentQuiz.correctAnswer
                  const showCorrect = isRevealed && isCorrect
                  const showIncorrect = isRevealed && isSelected && !isCorrect

                  return (
                    <button
                      key={index}
                      onClick={() => !isRevealed && setSelectedAnswer(index)}
                      disabled={isRevealed}
                      className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                        showCorrect
                          ? 'border-secondary bg-secondary/20 text-foreground'
                          : showIncorrect
                          ? 'border-destructive bg-destructive/10 text-foreground'
                          : isSelected
                          ? 'border-secondary bg-secondary/10 text-foreground'
                          : 'border-border/50 bg-card/30 hover:border-secondary/50 text-foreground/80 hover:text-foreground'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{option}</span>
                        {isRevealed && (
                          <div>
                            {showCorrect && (
                              <Check className="text-secondary" size={20} weight="bold" />
                            )}
                            {showIncorrect && (
                              <X className="text-destructive" size={20} weight="bold" />
                            )}
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>

              {!isRevealed ? (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                >
                  Submit Answer
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={() => setCurrentQuiz(null)}
                    variant="outline"
                    className="flex-1"
                  >
                    Close
                  </Button>
                  {selectedAnswer === currentQuiz.correctAnswer && (
                    <div className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-secondary/20 text-secondary rounded-md font-mono text-sm font-bold">
                      <Sparkle weight="fill" />
                      +{currentQuiz.bonusTokens} Tokens!
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {!currentQuiz && !hasCompleted && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8"
            >
              <p className="text-muted-foreground font-mono text-sm">
                Test your knowledge about "{currentVideoTitle}"
              </p>
              <p className="text-xs text-muted-foreground/60 mt-2">
                Click "Start Quiz" to generate a question
              </p>
            </motion.div>
          )}

          {hasCompleted && !currentQuiz && (
            <motion.div
              key="completed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8"
            >
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-secondary/20 mb-3">
                <Check className="text-secondary" size={32} weight="bold" />
              </div>
              <p className="text-foreground font-mono text-sm font-bold">
                Quiz Completed!
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Watch other videos to earn more bonus tokens
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  )
}
