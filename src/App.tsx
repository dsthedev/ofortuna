import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Ghost } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Kbd } from "@/components/ui/kbd"
import { FortuneSkeleton } from "@/components/fortune-skeleton"
import { FortuneListing } from "@/components/fortune-listing"
import { type Fortune, loadFortunes, getRandomFortune } from "@/lib/fortunes"

export function App() {
  const [fortunes, setFortunes] = useState<Fortune[]>([])
  const [currentFortune, setCurrentFortune] = useState<Fortune | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isListingOpen, setIsListingOpen] = useState(false)

  // Load fortunes on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const data = await loadFortunes()
        setFortunes(data)
        setCurrentFortune(getRandomFortune(data))
      } catch (error) {
        console.error("Failed to load fortunes:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrevFortune()
      } else if (e.key === "ArrowRight") {
        handleNextFortune()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [fortunes, currentFortune])

  const handleNextFortune = () => {
    if (fortunes.length > 0) {
      setCurrentFortune(getRandomFortune(fortunes))
    }
  }

  const handlePrevFortune = () => {
    if (fortunes.length > 0 && currentFortune) {
      const currentIndex = fortunes.findIndex(
        (f) => f.id === currentFortune.id
      )
      const prevIndex =
        currentIndex === 0 ? fortunes.length - 1 : currentIndex - 1
      setCurrentFortune(fortunes[prevIndex])
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 p-6">
      {/* Header */}
      <h1 className="absolute left-6 top-6 font-serif text-3xl font-medium text-foreground">
        O Fortuna
      </h1>

      {isLoading ? (
        <FortuneSkeleton />
      ) : currentFortune ? (
        <>
          {/* Main Fortune Display with Navigation */}
          <div className="flex w-full max-w-4xl items-center justify-center gap-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevFortune}
              aria-label="Previous fortune"
              className="shrink-0"
            >
              <ChevronLeft className="h-12 w-12" />
            </Button>

            <div className="flex-1">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className="cursor-help select-none rounded-lg p-8 transition-colors hover:bg-muted">
                    <p className="font-serif text-4xl leading-relaxed text-foreground">
                      {currentFortune.text}
                    </p>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">
                        Category
                      </p>
                      <p className="text-sm">{currentFortune.category}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">
                        Interpretation
                      </p>
                      <p className="text-sm">{currentFortune.interpretation}</p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextFortune}
              aria-label="Next fortune"
              className="shrink-0"
            >
              <ChevronRight className="h-12 w-12" />
            </Button>
          </div>
        </>
      ) : null}

      {/* Keyboard Shortcuts Help */}
      <div className="absolute bottom-6 left-6 flex flex-col gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Kbd>←</Kbd>
          <Kbd>→</Kbd>
          <span>to view other fortunes</span>
        </div>
        <div className="flex items-center gap-2">
          <Kbd>d</Kbd>
          <span>to toggle dark mode</span>
        </div>
      </div>

      {/* Ghost Button - Open Listing */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsListingOpen(true)}
        className="absolute bottom-6 right-6"
        aria-label="View all fortunes"
      >
        <Ghost className="h-5 w-5" />
      </Button>

      {/* Fortune Listing Sheet */}
      <FortuneListing
        open={isListingOpen}
        onOpenChange={setIsListingOpen}
        fortunes={fortunes}
      />
    </div>
  )
}

export default App
