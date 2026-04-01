"use client"

import { useEffect, useState } from "react"
import { fetchWinLogs, fetchLossLogs } from "@/lib/blockscout"

export function useContractEvents() {
  const [wins, setWins] = useState(0)
  const [losses, setLosses] = useState(0)

  useEffect(() => {
    async function fetchEvents() {
      try {
        const winLogs = await fetchWinLogs()
        const lossLogs = await fetchLossLogs()
        setWins(winLogs.length)
        setLosses(lossLogs.length)
      } catch (error) {
        console.error("Error fetching events:", error)
      }
    }

    fetchEvents()
    const interval = setInterval(fetchEvents, 15000)
    return () => clearInterval(interval)
  }, [])

  return { wins, losses }
}
