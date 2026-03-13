import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Ghost } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
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
      {isLoading ? (
        <FortuneSkeleton />
      ) : currentFortune ? (
        <>
          {/* Main Fortune Display */}
          <div className="w-full max-w-2xl text-center">
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="cursor-help select-none rounded-lg p-8 transition-colors hover:bg-muted">
                  <p className="text-4xl font-light leading-relaxed text-foreground">
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

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevFortune}
              aria-label="Previous fortune"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextFortune}
              aria-label="Next fortune"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </>
      ) : null}

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
