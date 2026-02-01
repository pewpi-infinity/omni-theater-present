import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Atom, X } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { QuantumReport } from '@/lib/types'

interface QuantumAnalyzerProps {
  movieTitle: string
}

export function QuantumAnalyzer({ movieTitle }: QuantumAnalyzerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [report, setReport] = useState<QuantumReport | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    setIsOpen(true)
    
    try {
      // @ts-expect-error - spark.llmPrompt template tag type inference issue
      const prompt = window.spark.llmPrompt`Analyze the movie title "${movieTitle}" from a quantum computing and tech innovation perspective. Provide:
1. A brief analysis of how the movie's themes relate to quantum computing, parallel universes, superposition, or computing innovation
2. List 5 "quantum factors" - brief one-line connections between the movie and quantum/computing concepts
Keep the tone educational but fun. Return as JSON with properties: analysis (string), quantumFactors (array of 5 strings)`

      const response = await window.spark.llm(prompt, 'gpt-4o-mini', true)
      const parsed = JSON.parse(response)
      
      const newReport: QuantumReport = {
        movieTitle,
        timestamp: Date.now(),
        analysis: parsed.analysis || 'Quantum analysis complete.',
        quantumFactors: parsed.quantumFactors || []
      }
      
      setReport(newReport)
    } catch (error) {
      toast.error('Quantum analysis failed')
      setIsOpen(false)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <>
      <Button
        onClick={handleAnalyze}
        variant="outline"
        size="sm"
        className="border-accent/50 hover:border-accent hover:bg-accent/10 hover:glow-magenta transition-all"
      >
        <Atom className="mr-2 text-accent" weight="duotone" />
        Quantum Report
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="border-accent/30 bg-card max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-accent flex items-center gap-2">
                <Atom size={24} weight="duotone" />
                Quantum Analysis
              </DialogTitle>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
              >
                <X size={18} />
              </Button>
            </div>
          </DialogHeader>

          <ScrollArea className="max-h-[500px] pr-4">
            <AnimatePresence mode="wait">
              {isAnalyzing ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 text-center space-y-4"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="inline-block"
                  >
                    <Atom size={48} className="text-accent" weight="duotone" />
                  </motion.div>
                  <p className="text-muted-foreground font-mono text-sm">
                    Analyzing quantum entanglement patterns...
                  </p>
                </motion.div>
              ) : report ? (
                <motion.div
                  key="report"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <Card className="p-4 border-accent/20 bg-accent/5">
                    <h3 className="text-sm font-mono uppercase tracking-wider text-accent mb-3">
                      Movie: {report.movieTitle}
                    </h3>
                    <p className="text-sm leading-relaxed text-foreground/90">
                      {report.analysis}
                    </p>
                  </Card>

                  <div className="space-y-3">
                    <h3 className="text-sm font-mono uppercase tracking-wider text-accent">
                      Quantum Factors
                    </h3>
                    {report.quantumFactors.map((factor, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <Card className="p-3 border-border/50 bg-card/30">
                          <div className="flex items-start gap-3">
                            <span className="text-accent font-mono text-sm font-bold shrink-0">
                              #{idx + 1}
                            </span>
                            <p className="text-sm text-foreground/80">
                              {factor}
                            </p>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}
