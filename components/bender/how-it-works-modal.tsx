"use client"

import { useI18n } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { X, Wallet, MessageSquare, Zap, AlertTriangle } from "lucide-react"
import { useEffect } from "react"

interface HowItWorksModalProps {
  isOpen: boolean
  onClose: () => void
}

function BenderModalFace() {
  return (
    <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
      <img src="/bender.png" alt="Bender" className="h-full w-full object-contain drop-shadow-[0_0_20px_rgba(200,222,236,0.3)]" />
    </div>
  )
}

export function HowItWorksModal({ isOpen, onClose }: HowItWorksModalProps) {
  const { t } = useI18n()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const steps = [
    {
      icon: Wallet,
      titleKey: "modal.step1.title",
      descKey: "modal.step1.desc",
      color: "#c8deec",
    },
    {
      icon: MessageSquare,
      titleKey: "modal.step2.title",
      descKey: "modal.step2.desc",
      color: "#a6c1d6",
    },
    {
      icon: Zap,
      titleKey: "modal.step3.title",
      descKey: "modal.step3.desc",
      color: "#fffbc7",
    },
  ]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#000d18]/95 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border-2 border-[#163044] bg-[#061525] shadow-xl">
        <div className="relative border-b border-[#163044] bg-[#04101c] px-6 py-4">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-2 text-[#7ca4bd] transition-all hover:bg-[#0c1f32] hover:text-[#c8deec]"
          >
            <X className="h-5 w-5" />
          </button>

          <BenderModalFace />

          <h2 className="text-center font-sans text-xl font-black uppercase tracking-wider text-[#fffbc7]">
            {t("modal.title")}
          </h2>
        </div>

        <div className="space-y-5 p-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex gap-4 rounded-xl border border-[#163044] bg-[#04101c] p-4 transition-all hover:bg-[#0c1f32]"
              style={{ borderLeftColor: step.color, borderLeftWidth: '3px' }}
            >
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: `${step.color}15`,
                }}
              >
                <step.icon className="h-6 w-6" style={{ color: step.color }} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-[#fffbc7]">
                  {t(step.titleKey)}
                </h3>
                <p className="font-mono text-sm leading-relaxed text-[#a6c1d6]">
                  {t(step.descKey)}
                </p>
              </div>
            </div>
          ))}

          <div className="flex gap-3 rounded-xl border border-[#fffbc7]/20 bg-[#fffbc7]/5 p-4">
            <AlertTriangle className="h-5 w-5 shrink-0 text-[#fffbc7]" />
            <p className="font-mono text-sm leading-relaxed text-[#fffbc7]/80">
              {t("modal.warning")}
            </p>
          </div>
        </div>

        <div className="border-t border-[#163044] bg-[#04101c] px-6 py-4">
          <Button
            onClick={onClose}
            className="w-full rounded-xl border-2 border-[#fffbc7] bg-[#fffbc7] py-6 font-sans font-bold uppercase tracking-wider text-[#000d18] transition-all hover:bg-[#fffbc7]/90"
          >
            {t("modal.close")}
          </Button>
        </div>
      </div>
    </div>
  )
}
