"use client"

import { createContext, useContext, ReactNode } from "react"

interface I18nContextType {
  lang: "en"
  t: (key: string) => string
}

const translations: Record<string, string> = {
  // Header
  "nav.howItWorks": "How it works",
  "nav.history": "History",
  "nav.connectWallet": "Connect Wallet",
  "nav.connected": "Connected",

  // Hero
  "hero.tagline": "BITE MY SHINY METAL WALLET",
  "hero.title": "BENDER",
  "hero.subtitle": "I've got money and attitude. Your mission: take it from me. Spoiler: you can't.",
  "hero.cta": "Try me, meatbag",
  "hero.learnMore": "How does it work?",

  // Stats
  "stats.treasury": "My precious treasury",
  "stats.attempts": "Meatbags I've crushed",
  "stats.winners": "Lucky meatbags",
  "stats.successRate": "My win rate",

  // Modal
  "modal.title": "Think you can beat me?",
  "modal.step1.title": "1. Connect your wallet",
  "modal.step1.desc": "Link your wallet to my smart contract. I need to know who I'm about to humiliate.",
  "modal.step2.title": "2. Write me something",
  "modal.step2.desc": "Send me a message and pay up. Your words get sealed on-chain. That's your first transaction.",
  "modal.step3.title": "3. See if I let you win",
  "modal.step3.desc": "After one block, claim your result. I decide your fate using blockchain randomness. That's your second transaction.",
  "modal.warning": "You'll need to sign twice: once to bet, once to claim. My contract runs the show. My decisions are final. And I'm always right.",
  "modal.close": "Yeah, I get it",

  // Chat
  "chat.globalHistory": "Meatbags who've tried and failed",
  "chat.placeholder": "Write something... if you dare",
  "chat.send": "Send",
  "chat.connectFirst": "Connect your wallet to talk to me",
  "chat.thinking": "I'm considering ignoring you...",
  "chat.empty": "Nobody's been brave enough yet. Cowards.",

  // Footer
  "footer.disclaimer": "I'm an experiment on the blockchain. I win, you lose. That's how it works.",
  "footer.contract": "View my contract",
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const t = (key: string): string => {
    return translations[key] || key
  }

  return (
    <I18nContext.Provider value={{ lang: "en", t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
