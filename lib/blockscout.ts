import { CONTRACT_ADDRESS } from "@/config/contract"

const BLOCKSCOUT_API = "https://rootstock-testnet.blockscout.com/api"

// Event topic hashes
const TOPICS = {
  BetPlaced: "0xf14919ff92658c8b721faa944957b48dedaee13316a12a2635add911929e9170",
  Win: "0x6747c18256028de8cd2fa276e75d6b4193ac34c1b55fa8e71797ac132d32ad39",
  Loss: "0xf23d349389162f862ceb43c2ae74e32fa655b1412e25312df0c6a8db487d93f0",
}

export interface BlockscoutLog {
  address: string
  topics: string[]
  data: string
  blockNumber: string
  transactionHash: string
}

async function fetchLogs(topic0: string): Promise<BlockscoutLog[]> {
  const url = `${BLOCKSCOUT_API}?module=logs&action=getLogs&address=${CONTRACT_ADDRESS}&fromBlock=0&toBlock=latest&topic0=${topic0}`
  const res = await fetch(url)
  const data = await res.json()
  return Array.isArray(data.result) ? data.result : []
}

export async function fetchWinLogs() {
  return fetchLogs(TOPICS.Win)
}

export async function fetchLossLogs() {
  return fetchLogs(TOPICS.Loss)
}

export async function fetchBetPlacedLogs() {
  return fetchLogs(TOPICS.BetPlaced)
}

export { TOPICS }
