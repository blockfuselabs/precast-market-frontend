"use client";

import { Search, Bell, Command, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Precastlogo from "../icons/precastlogo";
import { usePrivy } from "@privy-io/react-auth";
import { useUserRights } from "@/hooks/useUserRights";

export function Navbar() {
  const { login, authenticated, user } = usePrivy();
  const { hasCreationRights } = useUserRights();

  return (
    <nav className="glass sticky top-0 z-50 w-full">
      <div className="container-app flex items-center justify-between py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Precastlogo />
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 w-full max-w-md mx-8">
          <Search className="w-4 h-4 text-muted-foreground" />
          <span className="text-body text-muted-foreground flex-1">
            Search markets...
          </span>
          <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-secondary rounded border border-border">
            <Command className="w-3 h-3 text-muted-foreground" />
            <span className="text-kbd-sm text-muted-foreground">K</span>
          </div>
        </div>

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
          <button
            className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              console.log("Sign In clicked!", { authenticated, user, appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID });
              if (!authenticated) {
                console.log("Calling privy login()...");
                login();
              }
            }}
            className="inline-flex items-center px-6 py-2 rounded-full bg-white text-black font-medium transition-colors hover:bg-secondary  gap-2"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.6667 4.66667V2.66667C12.6667 2.48986 12.5964 2.32029 12.4714 2.19526C12.3464 2.07024 12.1768 2 12 2H3.33333C2.97971 2 2.64057 2.14048 2.39052 2.39052C2.14048 2.64057 2 2.97971 2 3.33333C2 3.68696 2.14048 4.02609 2.39052 4.27614C2.64057 4.52619 2.97971 4.66667 3.33333 4.66667H13.3333C13.5101 4.66667 13.6797 4.7369 13.8047 4.86193C13.9298 4.98695 14 5.15652 14 5.33333V8M14 8H12C11.6464 8 11.3072 8.14048 11.0572 8.39052C10.8071 8.64057 10.6667 8.97971 10.6667 9.33333C10.6667 9.68696 10.8071 10.0261 11.0572 10.2761C11.3072 10.5262 11.6464 10.6667 12 10.6667H14C14.1768 10.6667 14.3464 10.5964 14.4714 10.4714C14.5964 10.3464 14.6667 10.1768 14.6667 10V8.66667C14.6667 8.48986 14.5964 8.32029 14.4714 8.19526C14.3464 8.07024 14.1768 8 14 8Z"
                stroke="#000A00"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 3.33301V12.6663C2 13.02 2.14048 13.3591 2.39052 13.6092C2.64057 13.8592 2.97971 13.9997 3.33333 13.9997H13.3333C13.5101 13.9997 13.6797 13.9294 13.8047 13.8044C13.9298 13.6794 14 13.5098 14 13.333V10.6663"
                stroke="#000A00"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {authenticated
              ? (user?.wallet?.address ? `${user.wallet.address.slice(0, 4)}...${user.wallet.address.slice(-4)}` : "Connected")
              : "Sign In"}
          </button>
        </div>
      </div>
    </nav>
  );
}
