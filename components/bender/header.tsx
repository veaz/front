"use client"

import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"
import { Wallet } from "lucide-react"

interface HeaderProps {
  isConnected: boolean
  onConnect: () => void
  onShowModal: () => void
}

export function Header({ isConnected, onConnect, onShowModal }: HeaderProps) {
  const { t } = useI18n()

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-[#163044]/50 bg-[#000d18]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="relative h-6 w-6">
              <div className="absolute bottom-0 left-1/2 h-4 w-0.5 -translate-x-1/2 bg-[#7ca4bd]" />
              <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-[#c8deec]" />
            </div>
            <span className="font-sans text-xl font-black uppercase tracking-wider text-[#fffbc7]">
              BENDER
            </span>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            <button
              onClick={onShowModal}
              className="font-mono text-sm uppercase tracking-wider text-[#7ca4bd] transition-colors hover:text-[#c8deec]"
            >
              {t("nav.howItWorks")}
            </button>
            <a
              href="#history"
              className="font-mono text-sm uppercase tracking-wider text-[#7ca4bd] transition-colors hover:text-[#c8deec]"
            >
              {t("nav.history")}
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {isConnected ? (
            <appkit-button size="sm" />
          ) : (
            <Button
              onClick={onConnect}
              size="sm"
              className="gap-2 rounded-lg border-2 border-[#fffbc7] bg-[#fffbc7] text-[#000d18] hover:bg-[#fffbc7]/90 font-mono text-sm font-bold uppercase tracking-wider transition-all"
            >
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">
                {t("nav.connectWallet")}
              </span>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
