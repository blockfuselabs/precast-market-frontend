"use client";

import React, { useRef, useState, useEffect } from "react"
import { Search, Bell, Command, Plus, Wallet, Copy, LogOut, ChevronDown, Droplets, Loader2, Check, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Precastlogo from "../icons/precastlogo";
import { usePrivy } from "@privy-io/react-auth";
import { useUserRights } from "@/hooks/useUserRights";
import { FaucetButton } from "./FaucetButton";
import { useRouter } from "next/navigation";
import { useBalance, useReadContract } from "wagmi";
import { erc20Abi, formatUnits } from "viem";
import { USDC_ADDRESS } from "@/lib/constants";
import { useFaucet } from "@/hooks/useFaucet";
import { toast } from "sonner";

export function Navbar() {
  const { login, authenticated, user, logout } = usePrivy();
  const { hasCreationRights } = useUserRights();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  const { data: ethBalance } = useBalance({
    address: user?.wallet?.address as `0x${string}`,
  });

  const { data: usdcBalance } = useReadContract({
    address: USDC_ADDRESS as `0x${string}`,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: user?.wallet?.address ? [user.wallet.address as `0x${string}`] : undefined,
    query: {
      enabled: !!user?.wallet?.address,
    }
  });

  console.log(usdcBalance);

  const { claimEth, claimTokens, hasClaimedEth, canClaimTokens, isClaiming } = useFaucet();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setIsAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const copyAddress = () => {
    if (user?.wallet?.address) {
      navigator.clipboard.writeText(user.wallet.address);
      toast.success("Address copied to clipboard");
    }
  };

  return (
    <nav className="glass sticky top-0 z-50 w-full">
      <div className="container-app flex items-center justify-between py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Precastlogo />
        </Link>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 w-full max-w-md mx-8 focus-within:border-primary/50 transition-colors"
        >
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search markets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-body text-foreground placeholder:text-muted-foreground flex-1"
          />
          <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-secondary rounded border border-border pointer-events-none">
            <Command className="w-3 h-3 text-muted-foreground" />
            <span className="text-kbd-sm text-muted-foreground">K</span>
          </div>
        </form>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {authenticated && hasCreationRights && (
            <Link
              href="/admin/create-market"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-btn"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create Market</span>
            </Link>
          )}
          {authenticated && (
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-btn"
            >
              <span className="hidden sm:inline">Portfolio</span>
            </Link>
          )}
          {authenticated && (
            <FaucetButton />
          )}
          <button
            className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
          </button>

          {!authenticated ? (
            <button
              onClick={login}
              className="inline-flex items-center px-6 py-2 rounded-full bg-white text-black font-medium transition-colors hover:bg-secondary gap-2"
            >
              Sign In
            </button>
          ) : (
            <div className="relative" ref={accountRef}>
              <button
                onClick={() => setIsAccountOpen(!isAccountOpen)}
                className="flex items-center gap-2 rounded-full border border-border bg-card pr-4 pl-2 py-1.5 text-sm font-medium hover:border-primary/50 transition-colors"
              >
                <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-primary to-primary/50 flex items-center justify-center text-[10px] text-white font-bold shadow-sm">
                  {user?.email?.address?.[0].toUpperCase() || user?.wallet?.address?.slice(2, 3).toUpperCase() || 'U'}
                </div>
                <span className="text-foreground">
                  {user?.wallet?.address ? `${user.wallet.address.slice(0, 4)}...${user.wallet.address.slice(-4)}` : "Connected"}
                </span>
                <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${isAccountOpen ? "rotate-180" : ""}`} />
              </button>

              {isAccountOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl border border-border bg-card shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Account Header */}
                  <div className="px-4 py-3 border-b border-border bg-secondary/30">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">My Account</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm font-mono text-foreground">
                        {user?.wallet?.address?.slice(0, 6)}...{user?.wallet?.address?.slice(-4)}
                      </p>
                      <button onClick={copyAddress} className="p-1 hover:bg-secondary rounded transition-colors text-muted-foreground hover:text-foreground">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Balances */}
                  <div className="px-4 py-3 space-y-3 border-b border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <Wallet className="w-4 h-4 text-muted-foreground" />
                        <span>ETH</span>
                      </div>
                      <span className="text-sm font-semibold">
                        {ethBalance ? Number(formatUnits(ethBalance.value, ethBalance.decimals)).toFixed(4) : "0.0000"} {ethBalance?.symbol}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <Wallet className="w-4 h-4 text-muted-foreground" />
                        <span>USDC</span>
                      </div>
                      <span className="text-sm font-semibold">
                        {usdcBalance !== undefined ? Number(formatUnits(usdcBalance as bigint, 18)).toFixed(2) : "0.00"} USDC
                      </span>
                    </div>
                  </div>

                  {/* Faucets (Quick Action) */}
                  {((ethBalance?.value || BigInt(0)) === BigInt(0) || (usdcBalance as bigint || BigInt(0)) === BigInt(0)) && (
                    <div className="px-2 py-2 border-b border-border space-y-1">
                      {(ethBalance?.value || BigInt(0)) === BigInt(0) && !hasClaimedEth && (
                        <button
                          onClick={claimEth}
                          disabled={isClaiming}
                          className="flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
                        >
                          <span className="flex items-center gap-2"><Droplets className="w-3 h-3" /> Get Test ETH</span>
                          {isClaiming ? <Loader2 className="w-3 h-3 animate-spin" /> : "Claim"}
                        </button>
                      )}
                      {Number(usdcBalance || 0) === 0 && canClaimTokens && (
                        <button
                          onClick={claimTokens}
                          disabled={isClaiming}
                          className="flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
                        >
                          <span className="flex items-center gap-2"><Droplets className="w-3 h-3" /> Get Test USDC</span>
                          {isClaiming ? <Loader2 className="w-3 h-3 animate-spin" /> : "Claim"}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Menu Links */}
                  <div className="py-1">
                    <Link
                      href="/portfolio"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                      onClick={() => setIsAccountOpen(false)}
                    >
                      <Wallet className="w-4 h-4 text-muted-foreground" />
                      Manage Wallet
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsAccountOpen(false);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-destructive hover:bg-destructive/5 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 text-destructive" />
                      Disconnect
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
