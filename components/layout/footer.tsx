import Link from "next/link"
import { Trophy } from "lucide-react"

const marketCategories = [
    { label: "Politics", href: "#" },
    { label: "Culture", href: "#" },
    { label: "Sports", href: "#" },
    { label: "World", href: "#" },
    { label: "Crypto", href: "#" },
    { label: "Finance", href: "#" },
    { label: "Tech", href: "#" },
]

const precastLinks = [
    { label: "About", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Privacy Policy", href: "#" },
]

const socialLinks = [
    {
        label: "Discord",
        href: "https://discord.gg/precast",
        icon: (
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z" />
            </svg>
        ),
    },
    {
        label: "Twitter",
        href: "https://twitter.com/precast",
        icon: (
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        ),
    },
]

export function Footer() {
    return (
        <footer className="mt-auto border-t border-white/[0.06] bg-[#0a0f0a]">
            {/* Main Footer Content */}
            <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
                <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link
                            href="/"
                            className="flex items-center gap-2 transition-opacity hover:opacity-80"
                        >
                            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-black">
                                <Trophy className="h-3.5 w-3.5" />
                            </div>
                            <span className="text-base font-bold tracking-tight text-white">
                                precast
                            </span>
                        </Link>
                    </div>

                    {/* Link Columns */}
                    <div className="flex flex-col gap-8 sm:flex-row sm:gap-16 lg:gap-20">
                        {/* Market Categories */}
                        <div>
                            <h3 className="mb-4 text-sm font-semibold text-white/90">
                                Market Categories
                            </h3>
                            <div className="grid grid-cols-2 gap-x-10 gap-y-3">
                                {marketCategories.map((item) => (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className="text-sm text-white/50 transition-colors hover:text-white/80"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Precast Links */}
                        <div>
                            <h3 className="mb-4 text-sm font-semibold text-white/90">
                                Precast
                            </h3>
                            <ul className="flex flex-col gap-3">
                                {precastLinks.map((item) => (
                                    <li key={item.label}>
                                        <Link
                                            href={item.href}
                                            className="text-sm text-white/50 transition-colors hover:text-white/80"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Socials */}
                        <div>
                            <h3 className="mb-4 text-sm font-semibold text-white/90">
                                Socials
                            </h3>
                            <ul className="flex flex-col gap-3">
                                {socialLinks.map((item) => (
                                    <li key={item.label}>
                                        <a
                                            href={item.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white/80"
                                        >
                                            {item.icon}
                                            {item.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-white/[0.06] py-6">
                <p className="text-center text-xs text-white/40">
                    © 2026 Precast. All rights reserved.
                </p>
            </div>
        </footer>
    )
}
