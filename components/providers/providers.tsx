'use client';
import * as React from 'react';
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { PrivyProvider } from '@privy-io/react-auth';
import { getConfig, getSSRConfig } from '@/lib/wagmi';
import { useTheme } from 'next-themes';
import { ThemeProvider } from "./theme-provider"

function PrivyProviderWrapper({ children, wagmiConfig }: { children: React.ReactNode; wagmiConfig: any }) {
    const { resolvedTheme } = useTheme();

    // We stabilize the theme to prevent mismatch during hydration
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = mounted && resolvedTheme === 'dark';

    const privyConfig = React.useMemo(() => ({
        appearance: {
            theme: (isDark ? 'dark' : 'light') as 'dark' | 'light',
            accentColor: (isDark ? '#ffffff' : '#161616') as `#${string}`,
            showWalletLoginFirst: true,
        },
        loginMethods: ['email', 'google', 'wallet'] as any,
        embeddedWallets: {
            ethereum: {
                createOnLogin: 'users-without-wallets' as any,
            },
        },
        defaultChain: wagmiConfig.chains[0],
        supportedChains: [...wagmiConfig.chains] as any,
    }), [isDark, wagmiConfig.chains]);

    return (
        <PrivyProvider
            appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
            clientId={process.env.NEXT_PUBLIC_PRIVY_SIGNER_ID}
            config={privyConfig as any}
        >
            {children}
        </PrivyProvider>
    );
}

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = React.useState(() => new QueryClient());
    const [mounted, setMounted] = React.useState(false);

    // Initialize with SSR config and update to client config after mount
    const [config, setConfig] = React.useState(() => getSSRConfig());

    React.useEffect(() => {
        setMounted(true);
        if (typeof window !== 'undefined') {
            setConfig(getConfig());
        }
    }, []);

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    <PrivyProviderWrapper wagmiConfig={config}>
                        {mounted ? children : <div style={{ visibility: 'hidden' }}>{children}</div>}
                    </PrivyProviderWrapper>
                </ThemeProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}