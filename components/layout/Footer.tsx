import Link from "next/link"
import Precastlogo from "../icons/precastlogo"

const footerLinks = {
    categories: [
        { label: "Politics", href: "/category/politics" },
        { label: "Sports", href: "/category/sports" },
        { label: "Crypto", href: "/category/crypto" },
        { label: "Finance", href: "/category/finance" },
        { label: "Culture", href: "/category/culture" },
        { label: "World", href: "/category/world" },
        { label: "World", href: "/category/world-2" },
        { label: "Tech", href: "/category/tech" },
    ],
    precast: [
        { label: "About", href: "/about" },
        { label: "Terms", href: "/terms" },
        { label: "Privacy", href: "/privacy" },
    ],
    socials: [
        { label: "Discord", href: "https://discord.gg/precast" },
        { label: "Twitter", href: "https://twitter.com/precast" },
    ],
}

export function Footer() {
    return (
        <footer className="border-t border-border bg-muted/40 mt-12">
            <div className="container-app py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* Logo */}
                    <div className="flex items-start">
                        <Precastlogo />
                    </div>

                    {/* Market Categories */}
                    <div>
                        <h4 className="text-heading-3 text-foreground mb-4">
                            Market Categories
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                            {footerLinks.categories.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-body text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Precast */}
                    <div>
                        <h4 className="text-heading-3 text-foreground mb-4">
                            Precast
                        </h4>
                        <div className="flex flex-col gap-2">
                            {footerLinks.precast.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-body text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Socials */}
                    <div>
                        <h4 className="text-heading-3 text-foreground mb-4">
                            Socials
                        </h4>
                        <div className="flex flex-col gap-2">
                            {footerLinks.socials.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-body text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-10 pt-6 border-t border-border text-center">
                    <p className="text-caption">
                        © 2026 Precast. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
