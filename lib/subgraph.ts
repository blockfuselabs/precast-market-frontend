import { request, RequestDocument, Variables } from 'graphql-request';

export const SUBGRAPH_URL = 'https://api.studio.thegraph.com/query/1723025/precast/version/latest';

// Use a default key for development if not provided, or better yet, error if missing in prod.
// For now we warn if missing.
const API_KEY = process.env.NEXT_PUBLIC_SUBGRAPH_API_KEY;

export const fetchSubgraph = async <T = any>(
    document: RequestDocument,
    variables?: Variables
): Promise<T> => {
    const headers: Record<string, string> = {};

    if (API_KEY) {
        headers['Authorization'] = `Bearer ${API_KEY}`;
    } else {
        console.warn('NEXT_PUBLIC_SUBGRAPH_API_KEY is not set. Subgraph requests may fail.');
    }

    return request(SUBGRAPH_URL, document, variables, headers);
};
