export default function Home() {
    return (
        <main className="container-app min-h-screen">
            {/* Hero Section */}
            <section className="py-12 space-y-3">
                <h1 className="text-hero text-foreground">Hello World</h1>
                <p className="text-body-lg text-muted-foreground">
                    Precast — The World&apos;s Largest Prediction Market
                </p>
            </section>

            {/* Typography Scale */}
            <section className="py-8 space-y-6 border-t border-border">
                <h2 className="text-heading-2-xl text-foreground">Typography Scale</h2>

                <div className="space-y-4">
                    <div className="space-y-1">
                        <span className="text-caption">Hero — Inter Bold 36/40</span>
                        <p className="text-hero">The quick brown fox</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-caption">Heading 2 XL — Inter Bold 24/32</span>
                        <p className="text-heading-2-xl">The quick brown fox</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-caption">Heading 2 LG — Inter Bold 20/28</span>
                        <p className="text-heading-2-lg">The quick brown fox</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-caption">Heading 1 — Inter Bold 18/28</span>
                        <p className="text-heading-1">The quick brown fox</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-caption">Heading 3 — Inter Bold 14/20</span>
                        <p className="text-heading-3">The quick brown fox</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-caption">Body LG — Inter Medium 16/24</span>
                        <p className="text-body-lg">The quick brown fox jumps over the lazy dog</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-caption">Body — Inter Regular 14/20</span>
                        <p className="text-body">The quick brown fox jumps over the lazy dog</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-caption">Label — Inter Medium 14/14</span>
                        <p className="text-label">Market Category</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-caption">Caption — Inter Medium 12/16</span>
                        <p className="text-caption">$15.7M Vol · 15,678 traders</p>
                    </div>
                </div>
            </section>

            {/* Color Swatches */}
            <section className="py-8 space-y-6 border-t border-border">
                <h2 className="text-heading-2-xl text-foreground">Color Palette</h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {[
                        { name: "Background", var: "bg-background", hex: "#000A00" },
                        { name: "Card", var: "bg-card", hex: "#141F14" },
                        { name: "Primary", var: "bg-primary", hex: "#1E993B" },
                        { name: "Destructive", var: "bg-destructive", hex: "#EF4343" },
                        { name: "Warning", var: "bg-warning", hex: "#EAE243" },
                        { name: "Secondary", var: "bg-secondary", hex: "#1E2A1E" },
                        { name: "Muted", var: "bg-muted", hex: "#0D160D" },
                        { name: "Border", var: "bg-border", hex: "#1A2E1A" },
                        { name: "Info", var: "bg-info", hex: "#6495ED" },
                    ].map((color) => (
                        <div key={color.name} className="space-y-2">
                            <div className={`h-16 rounded-xl ${color.var} border border-border`} />
                            <div>
                                <p className="text-heading-3 text-foreground">{color.name}</p>
                                <p className="text-caption">{color.hex}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Button Styles */}
            <section className="py-8 space-y-6 border-t border-border">
                <h2 className="text-heading-2-xl text-foreground">Buttons</h2>

                <div className="flex flex-wrap gap-4">
                    <button className="inline-flex items-center px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-btn-lg transition-opacity hover:opacity-90">
                        Buy Yes
                    </button>
                    <button className="inline-flex items-center px-5 py-2.5 rounded-lg bg-destructive text-destructive-foreground text-btn-lg transition-opacity hover:opacity-90">
                        Buy No
                    </button>
                    <button className="inline-flex items-center px-4 py-2 rounded-md bg-secondary text-secondary-foreground text-btn transition-opacity hover:opacity-90">
                        Secondary
                    </button>
                    <button className="inline-flex items-center px-4 py-2 rounded-md border border-border text-muted-foreground text-btn transition-colors hover:text-foreground">
                        Outline
                    </button>
                </div>

                <div className="flex flex-wrap gap-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-md bg-primary/10 text-primary text-btn">
                        Yes 45¢
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-md bg-destructive/10 text-destructive text-btn">
                        No 55¢
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-md bg-warning/10 text-warning text-label">
                        Featured
                    </span>
                </div>
            </section>

            {/* Spacing Scale */}
            <section className="py-8 space-y-6 border-t border-border">
                <h2 className="text-heading-2-xl text-foreground">Spacing Scale</h2>

                <div className="space-y-2">
                    {[4, 8, 12, 16, 20, 24, 32, 40, 48, 64].map((px) => (
                        <div key={px} className="flex items-center gap-4">
                            <span className="text-caption w-12 text-right">{px}px</span>
                            <div
                                className="h-3 rounded bg-primary/40"
                                style={{ width: `${px * 3}px` }}
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* Sample Card */}
            <section className="py-8 space-y-6 border-t border-border">
                <h2 className="text-heading-2-xl text-foreground">Sample Market Card</h2>

                <div className="max-w-md rounded-xl bg-card border border-border p-5 space-y-4">
                    <div className="flex items-center gap-2">
                        <span className="text-label text-primary">Finance</span>
                        <span className="text-caption">· chance</span>
                    </div>
                    <h3 className="text-heading-2 text-foreground">
                        Fed rate cut in March 2026?
                    </h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-hero text-primary">45%</span>
                        <span className="text-caption text-success">+2.1%</span>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex-1 py-2 rounded-md bg-primary text-primary-foreground text-btn">
                            Yes 45¢
                        </button>
                        <button className="flex-1 py-2 rounded-md bg-destructive text-destructive-foreground text-btn">
                            No 55¢
                        </button>
                    </div>
                    <div className="flex gap-4 text-caption">
                        <span>$6.3M Vol</span>
                        <span>5,621 traders</span>
                        <span>Mar 15</span>
                    </div>
                </div>
            </section>
        </main>
    )
}
