# Toolix AI

\*\*[Live Demo](https://toolix.khilesh.in)

![Toolix AI Demo](https://res.cloudinary.com/dna4sajpg/image/upload/v1774442316/Toolix-AI_aasiwn.gif)

Toolix AI is a tool-enabled AI agent built with Next.js 16, LangGraph, and Thesys C1 Generative UI. It goes beyond traditional chatbots by combining real-time tools with adaptive, interactive UI components that render directly in the chat.

## Features

### AI Tools

- **Web Search** - Real-time search powered by Tavily API
- **Weather Lookup** - Current weather conditions for any city via OpenWeatherMap
- **Calculator** - Mathematical calculations with step-by-step results
- **Image Generation** - AI-powered image generation using NVIDIA API & Cloudinary
- **Image Search** - Visual discovery using Google Custom Search
- **YouTube Summarizer** - Fetch and summarize YouTube video transcripts

### Generative UI

Unlike traditional chatbots, Toolix generates adaptive, interactive UI components including:

- Weather widgets
- Image galleries
- Data visualizations (charts, tables, carousels)
- Interactive learning modules with quizzes

## Tech Stack

- **Framework**: Next.js 16 with React 19
- **AI Agent**: LangGraph for orchestration
- **Generative UI**: Thesys C1
- **AI SDK**: Vercel AI SDK
- **UI Components**: shadcn/ui, Radix UI
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion, GSAP
- **Auth**: Clerk
- **Database**: MongoDB

## Getting Started

### Prerequisites

- Node.js 18+
- Bun (recommended) or npm/yarn/pnpm

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# AI & LLM
THESYS_API_KEY=your_thesys_api_key

# Tools
TAVILY_API_KEY=your_tavily_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
NVIDIA_API_KEY=your_nvidia_api_key

# Cloud Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NVIDIA_IMAGE_API_URL=https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.2-klein-4b

# Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Database
MONGODB_URI=your_mongodb_uri
```

### Installation

```bash
# Install dependencies
npm install
# or
bun install

# Run development server
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
toolix-ai/
├── app/                    # Next.js App Router pages
│   ├── api/chat/          # Chat API route
│   ├── chat/              # Chat interface pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   ├── ai-elements/       # AI-specific UI elements
│   └── chat-*.tsx         # Chat components
├── lib/                    # Core logic
│   ├── tools/             # Tool implementations
│   ├── model.ts           # LLM configuration
│   ├── graph.ts           # LangGraph agent
│   ├── system-prompt.ts   # AI system prompt
│   └── chat-store.ts      # Chat state management
└── public/                 # Static assets
```

## Available Scripts

- `npm run dev` - Start development server (with Turbo)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

Deploy to Vercel:

```bash
vercel deploy
```

Or connect your GitHub repository to Vercel for automatic deployments.

## License

MIT

---

Built with ❤️ by [Khilesh Jawale](https://khilesh.in)
