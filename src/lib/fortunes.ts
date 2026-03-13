export interface Fortune {
  id: string
  text: string
  date: string
  slug: string
  category: string
  interpretation: string
}

export async function loadFortunes(): Promise<Fortune[]> {
  const response = await fetch("/fortunes.csv")
  const csv = await response.text()
  return parseCsv(csv)
}

function parseCsv(csv: string): Fortune[] {
  const lines = csv.trim().split("\n")
  //   const headers = lines[0].split(",")

  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line)
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
      inQuotes = !inQuotes
    } else if (char === "," && !inQuotes) {
      result.push(current.trim().replace(/^"|"$/g, ""))
      current = ""
    } else {
      current += char
    }
  }

  result.push(current.trim().replace(/^"|"$/g, ""))
  return result
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
