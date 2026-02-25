"use client"

import React, { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { usePrivy } from '@privy-io/react-auth'
import { Search, Trophy, Bell, Menu, Home, PlusCircle, LogOut, Copy, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useBalance, useReadContract } from "wagmi"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useUserRights } from "@/hooks/useUserRights"
import { toast } from "sonner"
import { erc20Abi } from "viem"
import { USDC_ADDRESS } from "@/lib/constants"
import { useFaucet } from "@/hooks/useFaucet"

export default function Header() {
  const pathname = usePathname()
  const { hasCreationRights } = useUserRights()
  const { ready, authenticated, user, login, logout } = usePrivy()
  const { claimEth, claimTokens, hasClaimedEth, canClaimTokens, isClaiming } = useFaucet()
  const [searchOpen, setSearchOpen] = useState(false)

  const { data: balanceData, refetch: refetchBalance } = useBalance({
    address: user?.wallet?.address as `0x${string}`,
  })
  const { data: erc20Amount, refetch: refetchUSDC } = useReadContract({
    address: USDC_ADDRESS as `0x${string}`,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: user?.wallet?.address ? [user.wallet.address as `0x${string}`] : undefined,
    query: {
      enabled: !!user?.wallet?.address,
    }
  })

  // ⌘K keyboard shortcut to focus search
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault()
      const searchInput = document.getElementById("header-search-input")
      if (searchInput) {
        searchInput.focus()
      }
      setSearchOpen(true)
    }
    if (e.key === "Escape") {
      setSearchOpen(false)
      const searchInput = document.getElementById("header-search-input")
      if (searchInput) {
        searchInput.blur()
      }
    }
  }, [])

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  const claimETHFaucet = async () => {
    try {
      if (hasClaimedEth) {
        toast.error("You have already claimed ETH from the faucet.")
        return
      }
      toast.info("Claiming ETH...")
      await claimEth()
      toast.success("ETH claimed successfully!")
      refetchBalance()
    } catch (error) {
      console.error("Failed to claim ETH:", error)
      toast.error("Failed to claim ETH. Please try again.")
    }
  }

  const claimUSDCFaucet = async () => {
    try {
      if (!canClaimTokens) {
        toast.error("You need to wait 24 hours between token claims.")
        return
      }
      toast.info("Claiming USDC...")
      await claimTokens()
      toast.success("USDC claimed successfully!")
      refetchUSDC()
    } catch (error) {
      console.error("Failed to claim USDC:", error)
      toast.error("Failed to claim USDC. Please try again.")
    }
  }

  const disableLogin = !ready || (ready && authenticated)

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0a0f0a]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80 flex-shrink-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-black">
            <Trophy className="h-4 w-4" />
          </div>
          <span className="text-base font-bold tracking-tight text-white">
            precast
          </span>
        </Link>

        {/* Search Bar — Desktop */}
        <div className="hidden flex-1 items-center justify-center md:flex">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              id="header-search-input"
              type="text"
              placeholder="Search markets..."
              onFocus={() => setSearchOpen(true)}
              onBlur={() => setSearchOpen(false)}
              className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] py-2 pl-10 pr-16 text-sm text-white placeholder:text-white/30 transition-all duration-200 hover:bg-white/[0.06] hover:border-white/[0.12] focus:bg-white/[0.08] focus:border-white/[0.15] focus:outline-none focus:ring-1 focus:ring-white/[0.08]"
            />
            {/* ⌘K shortcut badge */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 pointer-events-none">
              <kbd className="flex h-5 items-center rounded border border-white/[0.1] bg-white/[0.06] px-1.5 text-[10px] font-medium text-white/30">
                ⌘
              </kbd>
              <kbd className="flex h-5 items-center rounded border border-white/[0.1] bg-white/[0.06] px-1.5 text-[10px] font-medium text-white/30">
                K
              </kbd>
            </div>
          </div>
        </div>

        {/* Search Icon — Mobile */}
        <button
          className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg text-white/50 transition-colors hover:text-white/80 hover:bg-white/[0.06] md:hidden"
          onClick={() => setSearchOpen(!searchOpen)}
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </button>

        {/* Right Side Actions */}
        <div className="flex items-center gap-1 md:ml-auto md:gap-2">
          {/* Notification Bell */}
          <button
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-white/50 transition-colors hover:text-white/80 hover:bg-white/[0.06]"
            aria-label="Notifications"
          >
            <Bell className="h-[18px] w-[18px]" />
            {/* Notification dot */}
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-[#0a0f0a]" />
          </button>

          {/* Auth Section */}
          {!authenticated ? (
            <Button
              onClick={login}
              disabled={disableLogin}
              size="sm"
              className="ml-1 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#0a0f0a] shadow-none transition-all hover:bg-white/90 disabled:opacity-50"
            >
              <Wallet className="h-4 w-4" />
              Sign In
            </Button>
          ) : (
            <React.Fragment key="auth-actions">
              {/* Wallet Link */}
              <Link
                href="/wallet"
                className={`hidden sm:flex items-center gap-2 h-9 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${pathname === '/wallet'
                  ? 'bg-white/[0.1] text-white'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/[0.06]'
                  }`}
              >
                <Wallet className="h-4 w-4" />
              </Link>

              {/* Create Market */}
              {hasCreationRights && (
                <Link
                  href="/create-market"
                  className={`hidden sm:flex items-center gap-2 h-9 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${pathname === '/create-market'
                    ? 'bg-white/[0.1] text-white'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/[0.06]'
                    }`}
                >
                  <PlusCircle className="h-4 w-4" />
                </Link>
              )}

              {/* User Avatar Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 text-[11px] font-bold text-white cursor-pointer transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-[#0a0f0a] ml-1">
                    {user?.email?.address?.[0].toUpperCase() || 'U'}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.email?.address ? user.email.address.split('@')[0] : 'User'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground truncate">
                        {user?.wallet?.address
                          ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}`
                          : ''}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      if (user?.wallet?.address) {
                        navigator.clipboard.writeText(user.wallet.address)
                        toast.success('Address copied to clipboard')
                      }
                    }}
                    className="cursor-pointer"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Address
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled className="opacity-100">
                    <Wallet className="mr-2 h-4 w-4" />
                    <span>
                      {balanceData ? `${Number(Number(balanceData.value) / 10e17).toFixed(4)} ${balanceData.symbol}` : 'Loading...'}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled className="opacity-100">
                    <Wallet className="mr-2 h-4 w-4" />
                    <span>
                      {erc20Amount !== undefined ? `${Number(Number(erc20Amount) / 10e5).toFixed(2)} USDC` : 'Loading...'}
                    </span>
                  </DropdownMenuItem>
                  {balanceData && Number(balanceData.value) == 0 ? (
                    <React.Fragment key="eth-faucet">
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={claimETHFaucet}
                        disabled={isClaiming || hasClaimedEth}
                        className={`cursor-pointer ${(isClaiming || hasClaimedEth) ? 'opacity-50' : ''}`}
                      >
                        <Wallet className="mr-2 h-4 w-4" />
                        <span>{hasClaimedEth ? 'Eth Claimed' : 'Claim Faucet (ETH)'}</span>
                      </DropdownMenuItem>
                    </React.Fragment>
                  ) : null}
                  {erc20Amount !== undefined && Number(erc20Amount) == 0 ? (
                    <React.Fragment key="usdc-faucet">
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={claimUSDCFaucet}
                        disabled={isClaiming || !canClaimTokens}
                        className={`cursor-pointer ${(isClaiming || !canClaimTokens) ? 'opacity-50' : ''}`}
                      >
                        <Wallet className="mr-2 h-4 w-4" />
                        <span>{!canClaimTokens ? 'Cooldown Active' : 'Claim Faucet (USDC)'}</span>
                      </DropdownMenuItem>
                    </React.Fragment>
                  ) : null}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/wallet">
                      <Wallet className="mr-2 h-4 w-4" />
                      Manage Wallet
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </React.Fragment>
          )}

          {/* Mobile Hamburger Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="flex h-9 w-9 items-center justify-center rounded-lg text-white/50 transition-colors hover:text-white/80 hover:bg-white/[0.06] md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] border-l border-white/[0.06] bg-[#0a0f0a]">
              <SheetHeader>
                <SheetTitle className="text-left flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-black">
                    <Trophy className="h-3.5 w-3.5" />
                  </div>
                  <span className="font-bold text-white">precast</span>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col gap-4">
                {/* Mobile Search */}
                <div className="relative px-1">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    placeholder="Search markets..."
                    className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/[0.1]"
                  />
                </div>

                {authenticated && user && (
                  <div className="flex flex-col gap-3 px-4 py-4 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-xs font-bold text-white">
                          {user?.email?.address?.[0].toUpperCase() || 'U'}
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm font-medium text-white truncate max-w-[150px]">
                            {user?.email?.address ||
                              user?.wallet?.address?.slice(0, 6) + '...' + user?.wallet?.address?.slice(-4) ||
                              'User'}
                          </p>
                        </div>
                      </div>
                      <button
                        className="h-8 w-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white/70 transition-colors"
                        onClick={() => {
                          if (user?.wallet?.address) {
                            navigator.clipboard.writeText(user.wallet.address)
                            toast.success('Address copied to clipboard')
                          }
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex flex-col gap-2 pt-2 border-t border-white/[0.06]">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/40 flex items-center gap-1">
                          <Wallet className="h-3 w-3" /> ETH
                        </span>
                        <span className="font-medium text-white">
                          {balanceData ? `${Number(Number(balanceData.value) / 10e17).toFixed(4)} ${balanceData.symbol}` : 'Loading...'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/40 flex items-center gap-1">
                          <Wallet className="h-3 w-3" /> USDC
                        </span>
                        <span className="font-medium text-white">
                          {erc20Amount !== undefined ? `${Number(Number(erc20Amount) / 10e5).toFixed(2)} USDC` : 'Loading...'}
                        </span>
                      </div>
                      {balanceData && Number(balanceData.value) == 0 && (
                        <div
                          className={`flex items-center justify-between text-sm cursor-pointer hover:opacity-80 ${(isClaiming || hasClaimedEth) ? 'opacity-50' : ''}`}
                          onClick={claimETHFaucet}
                        >
                          <span className="text-white/40 flex items-center gap-1">
                            <Wallet className="h-3 w-3" /> ETH Faucet
                          </span>
                          <span className="font-medium text-emerald-400">
                            {hasClaimedEth ? 'Claimed' : 'Claim'}
                          </span>
                        </div>
                      )}
                      {erc20Amount !== undefined && Number(erc20Amount) == 0 && (
                        <div
                          className={`flex items-center justify-between text-sm cursor-pointer hover:opacity-80 ${(isClaiming || !canClaimTokens) ? 'opacity-50' : ''}`}
                          onClick={claimUSDCFaucet}
                        >
                          <span className="text-white/40 flex items-center gap-1">
                            USDC Faucet
                          </span>
                          <span className="font-medium text-emerald-400">
                            {!canClaimTokens ? 'Cooldown' : 'Claim'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <Link href="/" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/[0.04] transition-colors text-white/70 hover:text-white">
                  <Home className="h-5 w-5" />
                  <span className="font-medium">Home</span>
                </Link>

                {authenticated && (
                  <Link href="/wallet" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/[0.04] transition-colors text-white/70 hover:text-white">
                    <Wallet className="h-5 w-5" />
                    <span className="font-medium">Wallet</span>
                  </Link>
                )}

                {authenticated && hasCreationRights && (
                  <Link href="/create-market" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/[0.04] transition-colors text-white/70 hover:text-white">
                    <PlusCircle className="h-5 w-5" />
                    <span className="font-medium">Create Market</span>
                  </Link>
                )}

                {authenticated ? (
                  <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-red-500/10 transition-colors text-red-400 w-full text-left"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                ) : (
                  <button
                    onClick={login}
                    disabled={disableLogin}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-white text-[#0a0f0a] transition-all hover:bg-white/90 w-full text-left font-semibold disabled:opacity-50"
                  >
                    <Wallet className="h-5 w-5" />
                    <span className="font-semibold">Sign In</span>
                  </button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {searchOpen && (
        <div className="border-t border-white/[0.06] px-4 py-3 md:hidden bg-[#0a0f0a]/98 backdrop-blur-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search markets..."
              autoFocus
              className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/[0.1]"
            />
          </div>
        </div>
      )}
    </header>
  )
}