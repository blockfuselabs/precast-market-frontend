import { useState } from "react"
import { usePrivy, useSendTransaction, useWallets } from "@privy-io/react-auth"
import { useReadContract } from "wagmi"
import { CONTRACT_ADDRESS } from "@/lib/constants"
import LMSRABI from "@/lib/LMSRABI.json"
import type { Address } from "viem"
import { ShieldAlert, Loader2 } from "lucide-react"
import { useResolveMarket } from "@/hooks/useResolveMarket"
import { toast } from "sonner"
import type { Market } from "@/lib/types"

interface AdminResolvePanelProps {
    market: Market
    refetchMarket?: () => void
}

export function AdminResolvePanel({ market, refetchMarket }: AdminResolvePanelProps) {
    const { authenticated, user } = usePrivy()
    const walletAddress = user?.wallet?.address as Address | undefined
    const { sendTransaction } = useSendTransaction()
    const { wallets } = useWallets()
    const wallet = wallets?.[0]

    // DEFAULT_ADMIN_ROLE is 32 bytes of 0s
    const DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000"

    const { data: hasAdminRole } = useReadContract({
        address: CONTRACT_ADDRESS as Address,
        abi: LMSRABI as any,
        functionName: "hasRole",
        args: [DEFAULT_ADMIN_ROLE, walletAddress as Address],
        query: { enabled: !!walletAddress }
    })

    const { resolveMarket, isResolving } = useResolveMarket()
    const [actionSide, setActionSide] = useState<"yes" | "no" | null>(null)

    if (!authenticated || !hasAdminRole || market.resolved) {
        return null;
    }

    const handleResolve = async (yesWon: boolean) => {
        if (!wallet) return toast.error("Wallet not connected properly")

        setActionSide(yesWon ? "yes" : "no")
        const result = await resolveMarket(market.id, yesWon, sendTransaction, wallet)

        if (result.success) {
            toast.success(`Market resolved ${yesWon ? 'YES' : 'NO'} successfully!`)
            refetchMarket?.()
        } else {
            toast.error(`Failed to resolve market: ${(result.error as any)?.message || "Unknown error"}`)
        }
        setActionSide(null)
    }

    return (
        <aside className="rounded-2xl bg-destructive/10 border border-destructive/20 p-4 md:p-5 space-y-4">
            <div className="flex items-center gap-2 text-destructive">
                <ShieldAlert className="w-5 h-5" />
                <h2 className="font-semibold text-lg">Admin Override</h2>
            </div>

            <p className="text-sm text-destructive/80">
                You have the admin role. You can officially resolve this market early or close it out at expiry.
            </p>

            <div className="grid grid-cols-2 gap-3">
                <button
                    type="button"
                    onClick={() => handleResolve(true)}
                    disabled={isResolving}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-2.5 px-4 font-semibold transition-all hover:brightness-110 disabled:opacity-50"
                >
                    {isResolving && actionSide === "yes" ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {isResolving && actionSide === "yes" ? "Resolving..." : "Resolve YES"}
                </button>
                <button
                    type="button"
                    onClick={() => handleResolve(false)}
                    disabled={isResolving}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-destructive text-destructive-foreground py-2.5 px-4 font-semibold transition-all hover:brightness-110 disabled:opacity-50"
                >
                    {isResolving && actionSide === "no" ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {isResolving && actionSide === "no" ? "Resolving..." : "Resolve NO"}
                </button>
            </div>
        </aside>
    )
}
