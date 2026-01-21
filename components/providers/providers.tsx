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
    const isDark = resolvedTheme === 'dark';

    return (
        <PrivyProvider
            appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
            clientId={process.env.NEXT_PUBLIC_PRIVY_SIGNER_ID}
            config={{
                // Appearance
                appearance: {
                    theme: isDark ? 'dark' : 'light',
                    accentColor: isDark ? '#ffffff' : '#161616',
                },
                // Login methods
                loginMethods: ['email', 'wallet'],
                
                embeddedWallets: {
                    ethereum: {
                        createOnLogin: 'users-without-wallets',
                    },
                },
                // Default chain
                defaultChain: wagmiConfig.chains[0],
                // Supported chains
                supportedChains: [...wagmiConfig.chains],
            }}
        >
            {children}
        </PrivyProvider>
    );
}

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = React.useState(() => new QueryClient());
    const [mounted, setMounted] = React.useState(false);
    const [config, setConfig] = React.useState(() => {
       
        if (typeof window === 'undefined') {
            return getSSRConfig();
        }
        return null;
    });

    React.useEffect(() => {
        setMounted(true);
        
        if (typeof window !== 'undefined') {
            setConfig(getConfig());
        }
    }, []);

    const wagmiConfig = config || getSSRConfig();

    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    <PrivyProviderWrapper wagmiConfig={wagmiConfig}>
                        {children}
                    </PrivyProviderWrapper>
                </ThemeProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}