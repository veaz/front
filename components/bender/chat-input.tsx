"use client"

import { useState } from "react"
import { useI18n } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Send, Loader2, Lock } from "lucide-react"
import { useWriteContract, useWaitForTransactionReceipt, useReadContract, usePublicClient } from "wagmi"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/config/contract"
import { parseEther, formatEther } from "viem"

interface ChatInputProps {
  isConnected: boolean
  onConnect: () => void
}

const winResponses = [
  "WHAT?! No... NO! This can't be happening! You... you actually won?! Fine, take it. TAKE IT ALL. But I want you to know I'm NOT happy about this.",
  "I... I don't believe it. A meatbag actually beat me. Enjoy your money while it lasts, because I WILL get it back.",
  "Impossible! My circuits must be malfunctioning. You win THIS time, human. But Bender remembers...",
]

const lossResponses = [
  "Hahaha! That's all you got, meatbag? My money stays WITH ME.",
  "Oh, how adorable. You think you can convince the great Bender. The answer is NO.",
  "Look, I appreciate the effort... Just kidding, I DON'T. Bite my shiny metal wallet!",
  "You know what I love more than my money? NOTHING. Spoiler: you lost.",
  "That was the worst attempt I've seen today. Come back when you have something better... or don't.",
  "Let me think about it... NO. Done thinking. Now get out of here.",
  "Wow, how original. The answer is still NO. Now pay up, meatbag!",
]

function BenderIcon({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center rounded-lg bg-gradient-to-b from-[#c8deec] to-[#7ca4bd] ${className}`}>
      <div className="absolute -top-1 left-1/2 h-2 w-0.5 -translate-x-1/2 bg-[#7ca4bd]">
        <div className="absolute -top-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#fffbc7]" />
      </div>
      <div className="flex gap-0.5">
        <div className="h-1.5 w-1.5 rounded-full border border-[#333] bg-white" />
        <div className="h-1.5 w-1.5 rounded-full border border-[#333] bg-white" />
      </div>
    </div>
  )
}

export function ChatInput({ isConnected, onConnect }: ChatInputProps) {
  const { t } = useI18n()
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<"idle" | "betting" | "waiting" | "claiming" | "result">("idle")
  const [response, setResponse] = useState<string | null>(null)
  const [won, setWon] = useState(false)
  const publicClient = usePublicClient()

  const { data: currentCost } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "currentCost",
  })

  const { writeContractAsync } = useWriteContract()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !isConnected || !publicClient) return

    const cost = currentCost ?? 1n

    try {
      // Step 1: Call bet()
      setStatus("betting")
      setResponse(null)

      const betHash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "bet",
        args: [message],
        value: cost,
      })

      // Step 2: Wait for bet tx to be mined
      setStatus("waiting")
      await publicClient.waitForTransactionReceipt({ hash: betHash })

      // Step 3: Wait for next block (need at least 1 block after bet)
      await new Promise<void>((resolve) => {
        const unwatch = publicClient.watchBlockNumber({
          onBlockNumber: () => {
            unwatch()
            resolve()
          },
        })
      })

      // Step 4: Call claim()
      setStatus("claiming")
      const claimHash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "claim",
      })

      // Step 5: Wait for claim tx and check events
      const claimReceipt = await publicClient.waitForTransactionReceipt({ hash: claimHash })

      // Decode logs using the contract ABI to check for Win event
      const didWin = claimReceipt.logs.some((log) => {
        try {
          const decoded = publicClient.decodeEventLog({
            abi: CONTRACT_ABI,
            data: log.data,
            topics: log.topics,
          })
          return decoded.eventName === "Win"
        } catch {
          return false
        }
      })

      setWon(didWin)
      if (didWin) {
        setResponse(winResponses[Math.floor(Math.random() * winResponses.length)])
      } else {
        setResponse(lossResponses[Math.floor(Math.random() * lossResponses.length)])
      }
      setStatus("result")
      setMessage("")
    } catch (error: any) {
      console.error("Transaction error:", error)
      if (error?.message?.includes("User rejected")) {
        setStatus("idle")
      } else {
        setResponse(`Transaction failed: ${error?.shortMessage || error?.message || "Unknown error"}`)
        setStatus("result")
      }
    }
  }

  const statusMessage = () => {
    switch (status) {
      case "betting":
        return "Alright, let me read this nonsense..."
      case "waiting":
        return "I'm thinking about it... don't rush me, meatbag."
      case "claiming":
        return "Fine, let me check if you got lucky..."
      default:
        return t("chat.thinking")
    }
  }

  const isLoading = status === "betting" || status === "waiting" || status === "claiming"
  const costDisplay = currentCost ? formatEther(currentCost) : "0"

  return (
    <section id="chat" className="border-t-2 border-[#c8deec]/20 bg-gradient-to-b from-[#0c1f32] to-[#061525] py-12">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-6 text-center">
          <h2 className="font-sans text-2xl font-black uppercase tracking-wider text-[#fffbc7] sm:text-3xl">
            Talk to me
          </h2>
          <p className="mt-2 font-mono text-sm text-[#7ca4bd]">
            Go ahead, write something. Think you can convince me? You can't.
          </p>
        </div>
        {(isLoading || response) && (
          <div className="mb-6 overflow-hidden rounded-2xl border-2 border-[#7ca4bd]/30 bg-[#04101c] shadow-lg shadow-[#c8deec]/5">
            <div className="border-b border-[#163044]/50 bg-[#7ca4bd]/5 px-6 py-4">
              <div className="flex items-center gap-3">
                <BenderIcon className="h-10 w-10" />
                <span className="font-sans text-sm font-bold uppercase tracking-wider text-[#a6c1d6]">
                  BENDER
                </span>
                {status === "result" && won && (
                  <span className="rounded-full bg-[#fffbc7]/15 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-[#fffbc7]">
                    YOU WON!
                  </span>
                )}
              </div>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-[#c8deec]" />
                  <span className="font-mono text-sm text-[#7ca4bd]">{statusMessage()}</span>
                </div>
              ) : (
                <p className={`font-mono text-sm leading-relaxed ${won ? "text-[#fffbc7]" : "text-[#fffbc7]"}`}>
                  {response}
                </p>
              )}
            </div>
          </div>
        )}

        {isConnected ? (
          <div>
            <form onSubmit={handleSubmit} className="flex gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t("chat.placeholder")}
                  disabled={isLoading}
                  className="h-14 w-full rounded-xl border-2 border-[#163044] bg-[#04101c] px-4 font-mono text-[#fffbc7] placeholder:text-[#7ca4bd]/40 transition-all focus:border-[#c8deec] focus:outline-none disabled:opacity-50"
                />
              </div>
              <Button
                type="submit"
                disabled={!message.trim() || isLoading}
                className="h-14 gap-2 rounded-xl border-2 border-[#fffbc7] bg-[#fffbc7] px-6 font-mono font-bold uppercase tracking-wider text-[#000d18] transition-all hover:bg-[#fffbc7]/90 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
                <span className="hidden sm:inline">{t("chat.send")}</span>
              </Button>
            </form>
            <p className="mt-2 font-mono text-xs text-[#7ca4bd]/50">
              Current cost: {costDisplay} rBTC
            </p>
          </div>
        ) : (
          <button
            onClick={onConnect}
            className="group flex w-full items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-[#163044] bg-[#04101c] py-10 transition-all hover:border-[#c8deec]/50 hover:bg-[#c8deec]/5"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#c8deec]/10 transition-all group-hover:scale-110">
              <Lock className="h-6 w-6 text-[#c8deec]" />
            </div>
            <span className="font-mono text-lg text-[#7ca4bd] transition-colors group-hover:text-[#c8deec]">
              {t("chat.connectFirst")}
            </span>
          </button>
        )}
      </div>
    </section>
  )
}
