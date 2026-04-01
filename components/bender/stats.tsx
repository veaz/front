"use client"

import { useI18n } from "@/lib/i18n"
import { Coins, Users, Trophy, TrendingUp } from "lucide-react"
import { useBalance, useReadContract } from "wagmi"
import { useContractEvents } from "@/hooks/useContractEvents"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/config/contract"
import { formatEther } from "viem"

export function Stats() {
  const { t } = useI18n()

  // Read contract balance (treasury)
  const { data: balance } = useBalance({
    address: CONTRACT_ADDRESS,
  })

  // Read current cost
  const { data: currentCost } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'currentCost',
  })

  // Count wins and losses from events
  const { wins, losses } = useContractEvents()

  const treasuryRaw = balance ? parseFloat(formatEther(balance.value)) : 0
  const treasury = treasuryRaw === 0 ? "0" : treasuryRaw < 0.0001 ? treasuryRaw.toFixed(8) : treasuryRaw.toFixed(4)
  const totalAttempts = wins + losses
  const winRate = totalAttempts > 0
    ? ((losses / totalAttempts) * 100).toFixed(2)
    : "100"

  const stats = [
    { key: "treasury", value: `${treasury} ${balance?.symbol ?? 'ETH'}`, icon: Coins, color: "#fffbc7" },
    { key: "attempts", value: totalAttempts.toLocaleString(), icon: Users, color: "#c8deec" },
    { key: "winners", value: wins.toLocaleString(), icon: Trophy, color: "#fffbc7" },
    { key: "successRate", value: `${winRate}%`, icon: TrendingUp, color: "#c8deec" },
  ]

  return (
    <section className="relative border-y border-[#163044] bg-[#061525]">
      <div className="relative mx-auto grid max-w-7xl grid-cols-2 divide-x divide-[#163044] md:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.key}
            className="group flex flex-col items-center gap-3 px-4 py-10 transition-colors hover:bg-[#0c1f32]"
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl transition-all group-hover:scale-110"
              style={{
                backgroundColor: `${stat.color}15`,
              }}
            >
              <stat.icon className="h-6 w-6" style={{ color: stat.color }} />
            </div>
            <span
              className="font-sans text-3xl font-black tracking-tight sm:text-4xl"
              style={{ color: stat.color }}
            >
              {stat.value}
            </span>
            <span className="text-center font-mono text-xs uppercase tracking-[0.15em] text-[#7ca4bd]">
              {t(`stats.${stat.key}`)}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
