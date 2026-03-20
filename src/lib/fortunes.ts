export interface Fortune {
  id: string
  text: string
  date: string
  slug: string
  category: string
  interpretation: string
}

const CSV_HEADERS = ["id", "text", "date", "slug", "category", "interpretation"]

export async function loadFortunes(): Promise<Fortune[]> {
  const response = await fetch("/fortunes.csv")
  const csv = await response.text()
  return parseFortunesCsv(csv)
}

export function parseFortunesCsv(csv: string): Fortune[] {
  const lines = csv
    .trim()
    .split("\n")
    .filter((line) => line.trim().length > 0)

  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line).map((value) => value.replace(/\r$/, ""))
    return {
      id: values[0],
      text: values[1],
      date: values[2],
      slug: values[3],
      category: values[4],
      interpretation: values[5],
    }
  })
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
        continue
      }
      inQuotes = !inQuotes
    } else if (char === "," && !inQuotes) {
      result.push(current)
      current = ""
    } else {
      current += char
    }
  }

  result.push(current)
  return result
}

function escapeCsvValue(value: string): string {
  if (value.includes('"') || value.includes(",") || value.includes("\n")) {
    return `"${value.replaceAll('"', '""')}"`
  }

  return value
}

export function fortunesToCsv(fortunes: Fortune[]): string {
  const rows = fortunes.map((fortune) => {
    return [
      fortune.id,
      fortune.text,
      fortune.date,
      fortune.slug,
      fortune.category,
      fortune.interpretation,
    ]
      .map((value) => escapeCsvValue(value ?? ""))
      .join(",")
  })

  return `${CSV_HEADERS.join(",")}\n${rows.join("\n")}`
}

export function sanitizeSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export function getRandomFortune(fortunes: Fortune[]): Fortune {
  return fortunes[Math.floor(Math.random() * fortunes.length)]
}

export function searchFortunes(fortunes: Fortune[], query: string): Fortune[] {
  if (!query.trim()) return fortunes

  const lowerQuery = query.toLowerCase()
  return fortunes.filter((fortune) => {
    const searchText =
      `${fortune.text} ${fortune.category} ${fortune.interpretation}`.toLowerCase()
    return searchText.includes(lowerQuery)
  })
}
