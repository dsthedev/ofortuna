import { useState, useMemo } from "react"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { type Fortune, searchFortunes } from "@/lib/fortunes"

export interface FortuneListing {
  open: boolean
  onOpenChange: (open: boolean) => void
  fortunes: Fortune[]
}

export function FortuneListing({
  open,
  onOpenChange,
  fortunes,
}: FortuneListing) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredFortunes = useMemo(
    () => searchFortunes(fortunes, searchQuery),
    [fortunes, searchQuery]
  )

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col gap-4">
        <SheetHeader>
          <SheetTitle>All Fortunes</SheetTitle>
        </SheetHeader>

        <div className="relative">
          <Input
            placeholder="Search fortunes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          <Accordion type="single" collapsible className="w-full">
            {filteredFortunes.map((fortune) => (
              <AccordionItem key={fortune.id} value={fortune.id}>
                <AccordionTrigger className="text-sm font-normal hover:no-underline">
                  {fortune.text}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-semibold text-muted-foreground">
                        Category
                      </p>
                      <p>{fortune.category}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-muted-foreground">
                        Interpretation
                      </p>
                      <p>{fortune.interpretation}</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {filteredFortunes.length === 0 && (
            <div className="flex items-center justify-center py-8 text-center text-muted-foreground">
              <p>No fortunes found matching your search.</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
