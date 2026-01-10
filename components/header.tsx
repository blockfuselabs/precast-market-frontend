"use client"
import Link from "next/link"
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header() {
  // const [activeCategory, setActiveCategory] = useState("All")

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      {/* Navigation Bar */}
      <div className="border-b border-border">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center px-4 py-3">
          {/* Top Row on Mobile: Logo and Buttons */}
          <div className="flex w-full items-center justify-between md:w-auto md:contents">
            <div className="text-2xl font-bold">Precast</div>

            {/* Mobile Buttons (moved here to share row with logo) */}
            <div className="flex items-center gap-4 md:order-3 md:ml-auto">
              <Button asChild variant="ghost" size="sm">
                <Link href="/create-market">Create Market</Link>
              </Button>
              <ConnectButton showBalance={false} />
            </div>
          </div>

          {/* Search Bar - Second Row on Mobile, Middle on Desktop */}
          <div className="relative w-full mt-3 md:mt-0 md:flex-1 md:mx-4 md:max-w-xl md:order-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search markets..."
              className="w-full rounded-lg border border-muted-foreground/20 bg-card px-10 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </div>

      {/* Categories Scroll */}
      {/* <div className="border-b border-border">
        <div className="max-w-[1200px] mx-auto px-4 py-2">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${activeCategory === category
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div> */}
    </header>
  )
}
