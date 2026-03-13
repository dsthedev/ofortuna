# o' fortuna

[![Netlify Status](https://api.netlify.com/api/v1/badges/970c6418-0ea8-4cb1-aa22-43b8c596a507/deploy-status)](https://app.netlify.com/projects/ofortuna/deploys)


A fortune cookie collection manager for discovering, browsing, and reflecting on fortunes. Each fortune includes interpretive guidance to help apply the wisdom to your life.

**Live Demo:** https://ofortuna.netlify.app

## Features

- **Random Fortune Discovery** - Display beautifully rendered fortunes one at a time
- **Hover Card Details** - Peek at category and interpretation without leaving the main view
- **Navigation** - Browse fortunes using arrow buttons or keyboard arrow keys
- **Full Listing** - View all fortunes in a searchable accordion sheet
- **Search & Filter** - Find fortunes by searching across text, category, and interpretation
- **Keyboard Shortcuts** - Use arrow keys to navigate, 'd' to toggle dark mode
- **Elegant Typography** - Fortunes rendered in Grenze Gotisch gothic serif font for a mystical feel
- **Loading States** - Skeleton loader while data is fetching
- **Responsive Design** - Works seamlessly on desktop and mobile

## Tech Stack

- React 19 with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- shadcn/ui components
- Radix UI for accessible UI primitives
- Lucide icons for navigation controls
- Google Fonts (Grenze Gotisch, Roboto Variable)

## Getting Started

### Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build project
pnpm build

# Type check
pnpm typecheck
```

### Project Structure

```
src/
  components/
    ui/                     # shadcn/ui components
    fortune-skeleton.tsx    # Loading state
    fortune-listing.tsx     # Searchable accordion sheet
  lib/
    fortunes.ts             # CSV parsing and utility functions
    utils.ts                # General utilities
  data/
    fortunes.csv            # Fortune database
  App.tsx                   # Main application
  index.css                 # Global styles & theme
```

## Data Format

Fortunes are stored in CSV format with the following fields:
- `id` - Unique identifier
- `text` - The fortune message (under 140 characters)
- `category` - Topic/theme (e.g., Creativity, Relationships, Destiny)
- `interpretation` - Guidance on applying the fortune
- `date` - Date added
- `slug` - URL-friendly identifier

## About

Created as a learning project to experiment with React tooling and component architecture while building something genuinely useful for daily reflection.

Made with ❤️ by [dsthedev](https://github.com/dsthedev)
