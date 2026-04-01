'use client'

import { wagmiAdapter, projectId, networks } from '@/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

const queryClient = new QueryClient()

const metadata = {
  name: 'Bite My Shiny Metal Wallet',
  description: 'Think you can outsmart Bender? Connect your wallet and try to take his money.',
  url: 'http://localhost:3000',
  icons: ['/icon.svg'],
}

createAppKit({
  adapters: [wagmiAdapter],
  projectId: projectId!,
  networks,
  defaultNetwork: networks[0],
  metadata,
  customRpcUrls: {
    'eip155:31': [process.env.NEXT_PUBLIC_RSK_TESTNET_RPC || 'https://public-node.testnet.rsk.co'],
    'eip155:31337': ['http://127.0.0.1:8545'],
  },
  features: {
    analytics: true,
  },
})

export default function AppKitProvider({
  children,
  cookies,
}: {
  children: ReactNode
  cookies: string | null
}) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
