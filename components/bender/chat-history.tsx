"use client"

import { useEffect, useState } from "react"
import { useI18n } from "@/lib/i18n"
import { MessageSquare, User } from "lucide-react"
import { fetchBetPlacedLogs, fetchWinLogs, fetchLossLogs, type BlockscoutLog } from "@/lib/blockscout"
import { decodeAbiParameters, formatEther } from "viem"

interface HistoryEntry {
  id: string
  wallet: string
  message: string
  won: boolean
  prize?: string
  blockNumber: string
}

function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function BenderIcon({ className = "" }: { className?: string }) {
  return (
    <img src="/bender.png" alt="Bender" className={`object-contain ${className}`} />
  )
}

const benderWinQuotes = [
  "WHAT?! Fine... take it. But I'm NOT happy.",
  "You got lucky, meatbag. Don't let it go to your head.",
  "Impossible! My circuits must be broken...",
]

const benderLossQuotes = [
  "Hahaha! Another meatbag bites the dust!",
  "Did you really think that would work? Pathetic.",
  "Thanks for the donation, sucker!",
  "My treasury thanks you for your generous contribution.",
  "Better luck next time... actually, no. You'll lose again.",
]

function getBenderQuote(won: boolean, seed: string): string {
  const quotes = won ? benderWinQuotes : benderLossQuotes
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0
  }
  return quotes[Math.abs(hash) % quotes.length]
}

function decodeAddress(topic: string): string {
  return "0x" + topic.slice(26)
}

function decodeBetPlacedData(data: string): { amount: bigint; message: string } {
  try {
    const decoded = decodeAbiParameters(
      [
        { name: "amount", type: "uint256" },
        { name: "message", type: "string" },
      ],
      data as `0x${string}`
    )
    return { amount: decoded[0], message: decoded[1] }
  } catch {
    return { amount: 0n, message: "" }
  }
}

function decodeWinData(data: string): bigint {
  try {
    const decoded = decodeAbiParameters(
      [{ name: "prize", type: "uint256" }],
      data as `0x${string}`
    )
    return decoded[0]
  } catch {
    return 0n
  }
}

export function ChatHistory() {
  const { t } = useI18n()
  const [history, setHistory] = useState<HistoryEntry[]>([])

  useEffect(() => {
    async function fetchHistory() {
      try {
        const betLogs = await fetchBetPlacedLogs()
        const winLogs = await fetchWinLogs()

        // Build win lookup: address -> { blockNumber, prize }
        const winByAddress = new Map<string, { block: number; prize: bigint }[]>()
        for (const log of winLogs) {
          const addr = decodeAddress(log.topics[1]).toLowerCase()
          const prize = decodeWinData(log.data)
          const block = parseInt(log.blockNumber, 16)
          if (!winByAddress.has(addr)) winByAddress.set(addr, [])
          winByAddress.get(addr)!.push({ block, prize })
        }

        const entries: HistoryEntry[] = betLogs.map((log, i) => {
          const player = decodeAddress(log.topics[1]).toLowerCase()
          const { message } = decodeBetPlacedData(log.data)
          const betBlock = parseInt(log.blockNumber, 16)

          // Find matching win within 10 blocks
          let didWin = false
          let prize: string | undefined
          const playerWins = winByAddress.get(player) || []
          const winIndex = playerWins.findIndex(
            (w) => w.block > betBlock && w.block <= betBlock + 10
          )
          if (winIndex >= 0) {
            didWin = true
            prize = formatEther(playerWins[winIndex].prize)
            playerWins.splice(winIndex, 1) // consume
          }

          return {
            id: `${log.transactionHash}-${i}`,
            wallet: player,
            message,
            won: didWin,
            prize,
            blockNumber: log.blockNumber,
          }
        }).reverse()

        setHistory(entries)
      } catch (error) {
        console.error("Error fetching history:", error)
      }
    }

    fetchHistory()
    const interval = setInterval(fetchHistory, 15000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="history" className="relative py-16">
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="h-full w-full" style={{
          backgroundImage: `
            linear-gradient(90deg, #7ca4bd 1px, transparent 1px),
            linear-gradient(#7ca4bd 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#c8deec]/10">
            <MessageSquare className="h-6 w-6 text-[#c8deec]" />
          </div>
          <div>
            <h2 className="font-sans text-2xl font-black uppercase tracking-wider text-[#fffbc7]">
              {t("chat.globalHistory")}
            </h2>
            <p className="font-mono text-sm text-[#7ca4bd]">
              My latest victims
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#163044] bg-[#061525] py-16">
              <BenderIcon className="mb-4 h-16 w-16" />
              <p className="font-mono text-[#7ca4bd]">{t("chat.empty")}</p>
            </div>
          ) : (
            history.map((entry) => (
              <div
                key={entry.id}
                className="group overflow-hidden rounded-2xl border border-[#163044] bg-[#061525] transition-all hover:border-[#7ca4bd]/30"
              >
                <div className="border-b border-[#163044]/50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0c1f32]">
                        <User className="h-4 w-4 text-[#7ca4bd]" />
                      </div>
                      <span className="font-mono text-sm text-[#c8deec]">
                        {formatAddress(entry.wallet)}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-[#7ca4bd]/50">
                      Bet at block #{parseInt(entry.blockNumber, 16)}
                    </span>
                  </div>
                  <p className="font-mono text-sm leading-relaxed text-[#fffbc7]">{entry.message}</p>
                </div>

                <div className="bg-[#04101c] p-4">
                  <div className="mb-3 flex items-center gap-3">
                    <BenderIcon className="h-8 w-8" />
                    <span className="font-sans text-sm font-bold uppercase tracking-wider text-[#a6c1d6]">
                      BENDER
                    </span>
                    {entry.won && (
                      <span className="rounded-full bg-[#fffbc7]/15 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-[#fffbc7]">
                        WINNER — {entry.prize} tRBTC
                      </span>
                    )}
                    {!entry.won && (
                      <span className="rounded-full bg-red-500/15 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-red-400">
                        LOST
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-sm leading-relaxed text-[#a6c1d6]">
                    {getBenderQuote(entry.won, entry.id)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
