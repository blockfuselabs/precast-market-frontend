export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center">
            <div className="text-center space-y-6">
                <h1 className="text-4xl font-bold tracking-tight text-foreground">
                    Hello World
                </h1>
                <p className="text-muted-foreground text-lg">
                    Precast — The World&apos;s Largest Prediction Market
                </p>
                <div className="flex gap-4 justify-center">
                    <span className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm">
                        Yes 45¢
                    </span>
                    <span className="inline-flex items-center px-4 py-2 rounded-lg bg-destructive text-destructive-foreground font-semibold text-sm">
                        No 55¢
                    </span>
                </div>
            </div>
        </main>
    )
}
