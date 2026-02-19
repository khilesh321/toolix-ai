import React from "react";

export default function page() {
  return (
    <main className="min-h-screen relative overflow-hidden font-sans">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#050816] via-[#0b0820] to-[#02030a]" />

      <section className="relative py-24 px-6 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-400 to-cyan-300">
                Toolix AI – Beyond Chat. Into Action.
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl">
                A tool-enabled AI agent with Generative UI, intelligent
                workflows, and real-time streaming responses.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a className="inline-flex items-center gap-3 px-5 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-500 shadow-lg hover:from-purple-500 hover:to-indigo-400 transition-all text-white">
                  Try Toolix
                </a>
                <a className="inline-flex items-center gap-3 px-5 py-3 rounded-lg border border-white/10 text-gray-100/90 hover:bg-white/5 transition">
                  Watch Demo
                </a>
              </div>

              <p className="mt-6 text-sm text-gray-400">
                It doesn’t just answer. It performs.
              </p>
            </div>

            <div className="w-full lg:w-1/2">
              <div className="relative mx-auto max-w-3xl">
                <div className="rounded-2xl bg-white/3 backdrop-blur-md border border-white/6 p-6 shadow-[0_10px_40px_rgba(10,8,30,0.6)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="h-2 w-36 rounded-full bg-gradient-to-r from-purple-400 to-cyan-300 animate-pulse" />
                      <p className="mt-3 text-sm text-gray-300">
                        Live demo • Real-time streaming
                      </p>
                    </div>
                    <div className="text-xs text-gray-400">
                      Agent: LangGraph • Vercel AI
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-gradient-to-b from-white/6 to-white/3 border border-white/5">
                      <h4 className="text-sm font-semibold text-white">
                        Generative UI
                      </h4>
                      <p className="mt-2 text-xs text-gray-300">
                        Components adapt to AI responses.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-b from-white/6 to-white/3 border border-white/5">
                      <h4 className="text-sm font-semibold text-white">
                        Real-Time
                      </h4>
                      <p className="mt-2 text-xs text-gray-300">
                        Streaming updates with low latency.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-8 -bottom-12 w-72 h-72 rounded-full blur-3xl bg-gradient-to-br from-purple-500/30 to-cyan-400/20 mix-blend-screen animate-blob" />
                <div className="absolute -left-12 top-8 w-40 h-40 rounded-full blur-2xl bg-gradient-to-tr from-indigo-600/25 to-purple-500/10 mix-blend-screen animate-blob delay-2000" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="col-span-2 rounded-2xl p-8 bg-gradient-to-b from-white/3 to-white/5 border border-white/6 backdrop-blur-md">
              <h3 className="text-2xl font-semibold text-white">
                About Toolix AI
              </h3>
              <p className="mt-4 text-gray-300 max-w-3xl">
                Toolix AI is a next-generation AI assistant built with Next.js
                16 & React 19, LangGraph agents for multi-step workflows, Thesys
                C1 for generative UI, Vercel AI SDK for real-time streaming, and
                shadcn UI for design system.
              </p>
              <p className="mt-4 font-medium text-indigo-300">
                It doesn’t just answer. It performs.
              </p>
            </div>

            <aside className="rounded-2xl p-6 bg-white/3 border border-white/6 backdrop-blur-md">
              <h4 className="text-lg font-semibold text-white">Tech Stack</h4>
              <ul className="mt-4 space-y-2 text-sm text-gray-300">
                <li>Next.js 16 & React 19</li>
                <li>LangGraph agents</li>
                <li>Thesys C1 (Generative UI)</li>
                <li>Vercel AI SDK</li>
                <li>shadcn UI</li>
              </ul>
            </aside>
          </div>
        </div>
      </section>

      <section className="py-12 px-6 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-semibold text-white">Core Features</h3>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              [
                "Generative UI",
                "Dynamic interface that adapts based on AI responses",
              ],
              [
                "Intelligent Workflows",
                "Multi-step agent execution using LangGraph",
              ],
              [
                "Real-Time Streaming",
                "Instant response updates powered by Vercel AI SDK",
              ],
              ["Tool Integration", "Executes tasks, not just conversation"],
              ["Multi-Model Support", "Compatible with various AI models"],
            ].map((f, i) => (
              <div
                key={i}
                className="p-6 rounded-xl bg-gradient-to-br from-white/4 to-white/6 border border-white/6 backdrop-blur-md hover:scale-[1.02] transition"
              >
                <h4 className="font-semibold text-white">{f[0]}</h4>
                <p className="mt-2 text-sm text-gray-300">{f[1]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-6 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-semibold text-white">
            Why Toolix AI is Different
          </h3>
          <p className="mt-3 font-medium text-indigo-300">
            Chatbots respond. Toolix executes.
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-sm text-gray-400">
                  <th className="py-3 pr-6">Traditional Chat AI</th>
                  <th className="py-3">Toolix AI</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-300">
                <tr className="border-t border-white/6">
                  <td className="py-4 pr-6">Static text responses</td>
                  <td className="py-4">Dynamic generative UI</td>
                </tr>
                <tr className="border-t border-white/6">
                  <td className="py-4 pr-6">Basic prompt interaction</td>
                  <td className="py-4">Multi-step intelligent workflows</td>
                </tr>
                <tr className="border-t border-white/6">
                  <td className="py-4 pr-6">Manual summarization</td>
                  <td className="py-4">
                    Structured YouTube summarizer with UI cards
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-12 px-6 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-semibold text-white">
            YouTube Video Summarizer Showcase
          </h3>
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="rounded-2xl p-6 bg-white/3 border border-white/6 backdrop-blur-md">
              <label className="text-sm text-gray-300">YouTube Link</label>
              <div className="mt-3 flex gap-3">
                <input
                  placeholder="https://youtube.com/watch?v=..."
                  className="flex-1 rounded-lg p-3 bg-transparent border border-white/8 text-white placeholder:text-gray-500"
                />
                <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-indigo-500 text-black font-semibold">
                  Summarize
                </button>
              </div>

              <div className="mt-6 space-y-4">
                <div className="p-4 rounded-lg bg-gradient-to-b from-white/6 to-white/4 border border-white/6">
                  <h5 className="font-semibold text-white">Summary</h5>
                  <p className="mt-2 text-sm text-gray-300">
                    AI-generated concise summary displayed as a card with
                    highlights.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-b from-white/6 to-white/4 border border-white/6">
                  <h5 className="font-semibold text-white">
                    Key Points & Timestamps
                  </h5>
                  <ul className="mt-2 text-sm text-gray-300 space-y-2">
                    <li>• 00:34 — Concept intro</li>
                    <li>• 02:10 — Architecture overview</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-b from-white/6 to-white/4 border border-white/6">
                  <h5 className="font-semibold text-white">
                    Actionable Insights
                  </h5>
                  <p className="mt-2 text-sm text-gray-300">
                    Suggested next steps and snippets for integration.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-6 bg-white/3 border border-white/6 backdrop-blur-md">
              <h4 className="text-white font-semibold">Architecture</h4>
              <div className="mt-6">
                <svg viewBox="0 0 800 220" className="w-full h-48">
                  <defs>
                    <marker
                      id="arrow"
                      markerWidth="10"
                      markerHeight="10"
                      refX="8"
                      refY="5"
                      orient="auto"
                    >
                      <path d="M0 0 L10 5 L0 10 z" fill="#9f7aea" />
                    </marker>
                  </defs>
                  <g fill="none" stroke="#6b7280" strokeWidth="2">
                    <rect
                      x="20"
                      y="40"
                      width="120"
                      height="40"
                      rx="8"
                      fill="#0b1220"
                      stroke="#4338ca"
                    />
                    <rect
                      x="180"
                      y="40"
                      width="160"
                      height="40"
                      rx="8"
                      fill="#0b1220"
                      stroke="#6366f1"
                    />
                    <rect
                      x="360"
                      y="40"
                      width="140"
                      height="40"
                      rx="8"
                      fill="#0b1220"
                      stroke="#06b6d4"
                    />
                    <rect
                      x="520"
                      y="40"
                      width="200"
                      height="40"
                      rx="8"
                      fill="#0b1220"
                      stroke="#8b5cf6"
                    />
                    <path
                      d="M140 60 L180 60"
                      stroke="#9f7aea"
                      markerEnd="url(#arrow)"
                    />
                    <path
                      d="M340 60 L360 60"
                      stroke="#9f7aea"
                      markerEnd="url(#arrow)"
                    />
                    <path
                      d="M500 60 L520 60"
                      stroke="#9f7aea"
                      markerEnd="url(#arrow)"
                    />
                    <text x="40" y="70" fill="#9ca3af" fontSize="12">
                      User
                    </text>
                    <text x="210" y="70" fill="#9ca3af" fontSize="12">
                      Next.js UI
                    </text>
                    <text x="380" y="70" fill="#9ca3af" fontSize="12">
                      Vercel AI SDK
                    </text>
                    <text x="540" y="70" fill="#9ca3af" fontSize="12">
                      LangGraph → Tools
                    </text>
                  </g>
                </svg>

                <p className="mt-4 text-sm text-gray-300">
                  Flow: User → Next.js UI → Vercel AI SDK → LangGraph Agent →
                  Tools → Generative UI Output
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 sm:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-cyan-300">
            Ready to Experience AI Beyond Chat?
          </h2>
          <p className="mt-4 text-gray-300">
            Launch Toolix and let your agents do the work.
          </p>
          <div className="mt-8">
            <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-500 text-white shadow-xl hover:scale-105 transition-transform">
              Launch Toolix
            </button>
          </div>
        </div>
      </section>

      <footer className="py-8 px-6 sm:px-12 lg:px-24 border-t border-white/6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-300">
            Built by Khilesh Jawale •{" "}
            <a
              className="text-indigo-300"
              href="https://github.com/khileshjawale"
            >
              GitHub
            </a>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-300">
            <span className="px-2 py-1 bg-white/4 rounded">Next.js</span>
            <span className="px-2 py-1 bg-white/4 rounded">Vercel AI</span>
            <span className="px-2 py-1 bg-white/4 rounded">LangGraph</span>
            <span className="px-2 py-1 bg-white/4 rounded">shadcn UI</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
