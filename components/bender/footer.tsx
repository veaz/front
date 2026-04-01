"use client"

import { useI18n } from "@/lib/i18n"
import { ExternalLink, Github } from "lucide-react"

export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="relative border-t border-[#163044] bg-[#000d18]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7ca4bd]/20 to-transparent" />

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
        <div className="flex items-center gap-3">
          <img src="/bender.png" alt="Bender" className="h-8 w-8 object-contain" />
          <p className="font-mono text-sm text-[#7ca4bd]/50">
            {t("footer.disclaimer")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/veaz/Bite-My-Shiny-Contract"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 rounded-lg border border-[#163044] px-4 py-2 font-mono text-sm text-[#7ca4bd] transition-all hover:border-[#7ca4bd] hover:text-[#c8deec]"
          >
            <Github className="h-4 w-4" />
            <span>{t("footer.contract")}</span>
            <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>

      <div className="border-t border-[#163044]/50 py-4 text-center">
        <p className="font-sans text-xs font-bold uppercase tracking-[0.3em] text-[#fffbc7]/20">
          I'm 100% blockchain. And 100% keeping your money.
        </p>
      </div>
    </footer>
  )
}
