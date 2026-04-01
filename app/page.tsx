"use client"

import { useState, useEffect } from "react"
import { useAppKit, useAppKitAccount } from "@reown/appkit/react"
import { I18nProvider } from "@/lib/i18n"
import { Header } from "@/components/bender/header"
import { Hero } from "@/components/bender/hero"
import { Stats } from "@/components/bender/stats"
import { ChatHistory } from "@/components/bender/chat-history"
import { ChatInput } from "@/components/bender/chat-input"
import { Footer } from "@/components/bender/footer"
import { HowItWorksModal } from "@/components/bender/how-it-works-modal"

function BenderApp() {
  const { open } = useAppKit()
  const { isConnected } = useAppKitAccount()
  const [showModal, setShowModal] = useState(false)

  const handleConnect = () => {
    open()
  }

  const handleShowModal = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const handleStartPlaying = () => {
    if (!isConnected) {
      handleConnect()
    }
    // Scroll to chat input
    document.getElementById("chat")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header
        isConnected={isConnected}
        onConnect={handleConnect}
        onShowModal={handleShowModal}
      />

      <main className="flex-1">
        <Hero onShowModal={handleShowModal} onStartPlaying={handleStartPlaying} />
        <Stats />
        <ChatInput isConnected={isConnected} onConnect={handleConnect} />
        <ChatHistory />
      </main>

      <Footer />

      <HowItWorksModal
        isOpen={showModal}
        onClose={handleCloseModal}
      />
    </div>
  )
}

export default function Page() {
  return (
    <I18nProvider>
      <BenderApp />
    </I18nProvider>
  )
}
