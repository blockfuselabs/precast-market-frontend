import { request, RequestDocument, Variables } from 'graphql-request';

export const SUBGRAPH_URL = 'https://api.studio.thegraph.com/query/1723025/precast/version/latest';

const API_KEY = process.env.NEXT_PUBLIC_SUBGRAPH_API_KEY;

export const fetchSubgraph = async <T = any>(
    document: RequestDocument,
    variables?: Variables
): Promise<T> => {
    const headers: Record<string, string> = {};

    if (API_KEY) {
        headers['Authorization'] = `Bearer ${API_KEY}`;
    }

    return request(SUBGRAPH_URL, document, variables, headers);
};

// ── Types ────────────────────────────────────────────────────────────────────

export interface SubgraphMarketCreated {
    marketId: string;
    question: string;
    cId: string;
    startTime: string;
    endTime: string;
    blockTimestamp: string;
}

export interface SubgraphPriceUpdated {
    marketId: string;
    priceYES: string;
    priceNO: string;
    blockTimestamp: string;
}

export interface SubgraphMarketResolved {
    marketId: string;
    yesWon: boolean;
}

export interface SubgraphSharesBought {
    marketId: string;
    cost: string; // USDC (18-decimal) spent on this trade
    priceYES: string;
    priceNO: string;
    blockTimestamp: string;
}

export interface MarketsQueryResult {
    marketCreateds: SubgraphMarketCreated[];
    priceUpdateds: SubgraphPriceUpdated[];
    marketResolveds: SubgraphMarketResolved[];
    sharesBoughts: SubgraphSharesBought[];
}

// ── Queries ──────────────────────────────────────────────────────────────────

export const MARKETS_QUERY = /* GraphQL */ `
    query GetMarkets($where: MarketCreated_filter) {
        marketCreateds(
            first: 1000
            orderBy: blockTimestamp
            orderDirection: desc
            where: $where
        ) {
            marketId
            question
            cId
            startTime
            endTime
            blockTimestamp
        }

        priceUpdateds(
            first: 1000
            orderBy: blockTimestamp
            orderDirection: desc
        ) {
            marketId
            priceYES
            priceNO
            blockTimestamp
        }

        marketResolveds(first: 1000) {
            marketId
            yesWon
        }

        sharesBoughts(
            first: 1000
            orderBy: blockTimestamp
            orderDirection: desc
        ) {
            marketId
            cost
            priceYES
            priceNO
        }
    }
`;
