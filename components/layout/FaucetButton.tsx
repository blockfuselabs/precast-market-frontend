'use client'

import { useState, useRef, useEffect } from "react"
import { Droplets, Loader2, ChevronDown, Check, Clock } from "lucide-react"
import { useFaucet } from "@/hooks/useFaucet"
import { toast } from "sonner"

export function FaucetButton() {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const { claimEth, claimTokens, hasClaimedEth, canClaimTokens, isClaiming } = useFaucet()

    // Close on outside click
    useEffect(() => {
        function handler(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])

    const handleClaimEth = async () => {
        try {
            await claimEth()
            toast.success("Test ETH sent to your wallet!")
        } catch (err: any) {
            toast.error(err?.message || "Failed to claim ETH")
        }
    }

    const handleClaimUsdc = async () => {
        try {
            await claimTokens()
            toast.success("Test USDC sent to your wallet!")
        } catch (err: any) {
            toast.error(err?.message || "Failed to claim USDC")
        }
    }

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen(v => !v)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary border border-border transition-colors text-sm font-medium"
            >
                <Droplets className="w-4 h-4 text-primary" />
                <span className="hidden sm:inline">Faucet</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl border border-border bg-card shadow-xl z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-semibold text-foreground">Testnet Faucet</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Get test tokens to trade on Base Sepolia</p>
                    </div>

                    {/* ETH Row */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                        <div>
                            <p className="text-sm font-medium text-foreground">ETH (gas)</p>
                            <p className="text-xs text-muted-foreground">One-time claim</p>
                        </div>
                        <button
                            type="button"
                            onClick={handleClaimEth}
                            disabled={hasClaimedEth || isClaiming}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${hasClaimedEth
                                    ? "bg-secondary text-muted-foreground cursor-not-allowed"
                                    : "bg-primary text-primary-foreground hover:brightness-110"
                                }`}
                        >
                            {isClaiming ? <Loader2 className="w-3 h-3 animate-spin" /> : hasClaimedEth ? <Check className="w-3 h-3" /> : null}
                            {hasClaimedEth ? "Claimed" : "Claim"}
                        </button>
                    </div>

                    {/* USDC Row */}
                    <div className="flex items-center justify-between px-4 py-3">
                        <div>
                            <p className="text-sm font-medium text-foreground">USDC (trade)</p>
                            <p className="text-xs text-muted-foreground">Daily cooldown</p>
                        </div>
                        <button
                            type="button"
                            onClick={handleClaimUsdc}
                            disabled={!canClaimTokens || isClaiming}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${!canClaimTokens
                                    ? "bg-secondary text-muted-foreground cursor-not-allowed"
                                    : "bg-primary text-primary-foreground hover:brightness-110"
                                }`}
                        >
                            {isClaiming ? <Loader2 className="w-3 h-3 animate-spin" /> : !canClaimTokens ? <Clock className="w-3 h-3" /> : null}
                            {!canClaimTokens ? "Cooldown" : "Claim"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
