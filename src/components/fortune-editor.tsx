import { type ChangeEvent, useMemo, useRef, useState } from "react"
import { Download, Trash2, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  type Fortune,
  fortunesToCsv,
  parseFortunesCsv,
  sanitizeSlug,
} from "@/lib/fortunes"

interface FortuneEditorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fortunes: Fortune[]
  onFortunesChange: (fortunes: Fortune[]) => void
}

function getNextFortuneId(fortunes: Fortune[]): string {
  const maxId = fortunes.reduce((currentMax, fortune) => {
    const id = Number.parseInt(fortune.id, 10)
    if (Number.isNaN(id)) {
      return currentMax
    }

    return Math.max(currentMax, id)
  }, 0)

  return String(maxId + 1)
}

function downloadCsvFile(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")

  link.href = url
  link.download = filename
  link.click()

  URL.revokeObjectURL(url)
}

export function FortuneEditor({
  open,
  onOpenChange,
  fortunes,
  onFortunesChange,
}: FortuneEditorProps) {
  const uploadRef = useRef<HTMLInputElement | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredFortunes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    if (!query) {
      return fortunes
    }

    return fortunes.filter((fortune) => {
      const searchText =
        `${fortune.text} ${fortune.interpretation}`.toLowerCase()
      return searchText.includes(query)
    })
  }, [fortunes, searchQuery])

  const updateFortune = (
    fortuneId: string,
    field: keyof Fortune,
    value: string
  ) => {
    onFortunesChange(
      fortunes.map((fortune) => {
        if (fortune.id !== fortuneId) {
          return fortune
        }

        return {
          ...fortune,
          [field]: value,
        }
      })
    )
  }

  const handleTextKeyUp = (fortuneId: string, value: string) => {
    updateFortune(fortuneId, "slug", sanitizeSlug(value))
  }

  const handleAddFortune = () => {
    const id = getNextFortuneId(fortunes)
    const today = new Date().toISOString().slice(0, 10)

    onFortunesChange([
      ...fortunes,
      {
        id,
        text: "",
        date: today,
        slug: "",
        category: "",
        interpretation: "",
      },
    ])
  }

  const handleExport = () => {
    const csv = fortunesToCsv(fortunes)
    downloadCsvFile(csv, "fortunes.csv")
  }

  const handleUploadClick = () => {
    uploadRef.current?.click()
  }

  const handleDeleteFortune = () => {
    if (!pendingDeleteId) return
    onFortunesChange(
      fortunes.filter((fortune) => fortune.id !== pendingDeleteId)
    )
    setPendingDeleteId(null)
  }

  const isPracticallyEmptyFortune = (fortune: Fortune) => {
    return (
      fortune.text.trim().length <= 1 &&
      fortune.category.trim().length <= 1 &&
      fortune.interpretation.trim().length <= 1
    )
  }

  const handleDeleteRequest = (fortune: Fortune) => {
    if (isPracticallyEmptyFortune(fortune)) {
      onFortunesChange(fortunes.filter((item) => item.id !== fortune.id))
      setPendingDeleteId(null)
      return
    }

    setPendingDeleteId(fortune.id)
  }

  const handleUploadFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    const text = await file.text()
    const parsedFortunes = parseFortunesCsv(text)
    onFortunesChange(parsedFortunes)

    event.target.value = ""
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="h-[92svh] max-w-[96vw] p-0 sm:max-w-[96vw]">
          <DialogHeader className="border-b px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              <DialogTitle>Fortune Editor</DialogTitle>
              <div className="mr-8 flex items-center gap-2">
                <input
                  ref={uploadRef}
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={handleUploadFile}
                />
                <Button variant="purple" size="sm" onClick={handleUploadClick}>
                  <Upload className="h-3.5 w-3.5" />
                  Upload CSV
                </Button>
                <Button variant="yellow" size="sm" onClick={handleExport}>
                  <Download className="h-3.5 w-3.5" />
                  Export CSV
                </Button>
              </div>
            </div>

            <div className="relative mt-3 max-w-sm flex items-center">
              <Input
                placeholder="Search by fortune or interpretation..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pr-10"
              />
              {searchQuery && (
                <Button
                  onClick={() => setSearchQuery("")}
                  className="text-muted-foreground hover:text-foreground"
                  variant="ghost"
                  aria-label="Clear search"
                >Clear <X className="h-4 w-4" />
                </Button>
              )}
                <Button onClick={handleAddFortune} variant="lime" size="lg">
                  Add Fortune
                </Button>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-4 py-3">
            <table className="w-full min-w-[980px] border-collapse">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="px-2 py-2 font-medium">Text</th>
                  <th className="px-2 py-2 font-medium">Category</th>
                  <th className="px-2 py-2 font-medium">Interpretation</th>
                  <th className="w-10 px-2 py-2" />
                </tr>
              </thead>
              <tbody>
                {filteredFortunes.map((fortune) => (
                  <tr key={fortune.id} className="border-b align-top">
                    <td className="hidden w-24 px-2 py-2">
                      <Input
                        value={fortune.id}
                        disabled
                        className="bg-muted/40 text-muted-foreground"
                      />
                    </td>
                    <td className="min-w-[260px] px-2 py-2">
                      <Input
                        value={fortune.text}
                        maxLength={140}
                        onChange={(event) =>
                          updateFortune(fortune.id, "text", event.target.value)
                        }
                        onKeyUp={(event) =>
                          handleTextKeyUp(
                            fortune.id,
                            (event.target as HTMLInputElement).value
                          )
                        }
                      />
                    </td>
                    <td className="hidden min-w-[220px] px-2 py-2">
                      <Input
                        value={fortune.slug}
                        readOnly
                        className="bg-muted/40 text-muted-foreground"
                      />
                    </td>
                    <td className="min-w-[180px] px-2 py-2">
                      <Input
                        value={fortune.category}
                        onChange={(event) =>
                          updateFortune(
                            fortune.id,
                            "category",
                            event.target.value
                          )
                        }
                      />
                    </td>
                    <td className="min-w-[320px] px-2 py-2">
                      <textarea
                        value={fortune.interpretation}
                        rows={1}
                        onChange={(event) =>
                          updateFortune(
                            fortune.id,
                            "interpretation",
                            event.target.value
                          )
                        }
                        className="h-7 w-full min-w-0 rounded-md border border-input bg-input/20 px-2 py-0.5 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-xs/relaxed dark:bg-input/30"
                      />
                    </td>
                    <td className="w-10 px-2 py-2">
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteRequest(fortune)}
                        aria-label="Delete fortune"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredFortunes.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-2 py-8 text-center text-sm text-muted-foreground"
                    >
                      No fortunes found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t px-4 py-3">
            <Button onClick={handleAddFortune} variant="lime" size="xl">
              Add Fortune
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={pendingDeleteId !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setPendingDeleteId(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Fortune</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this fortune? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteFortune}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
