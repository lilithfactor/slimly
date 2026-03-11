import crypto from 'crypto';

/**
 * Normalizes a URL for consistent slug generation.
 */
export function normalizeUrl(url: string): string {
    let trimmed = url.trim();

    // Ensure protocol
    if (!trimmed.toLowerCase().startsWith('http://') && !trimmed.toLowerCase().startsWith('https://')) {
        trimmed = 'https://' + trimmed;
    }

    try {
        const urlObj = new URL(trimmed);

        // Scheme and Host are case-insensitive, everything else usually isn't
        urlObj.protocol = urlObj.protocol.toLowerCase();
        urlObj.hostname = urlObj.hostname.toLowerCase();

        // Sort search params for consistency (keys and values)
        // Note: URLSearchParams sorting is stable, but doesn't change case.
        urlObj.searchParams.sort();

        let result = urlObj.toString();

        // Remove trailing slash if it's just the root path
        if (result.endsWith('/') && urlObj.pathname === '/') {
            result = result.slice(0, -1);
        }

        return result;
    } catch (e) {
        // Fallback for extremely malformed URLs
        return trimmed;
    }
}

/**
 * Generates a deterministic slug from a normalized URL.
 */
export function generateSlug(url: string, salt: string = ''): string {
    const hash = crypto.createHash('sha256').update(url + salt).digest('base64url');
    // Take the first 7 characters for a compact slug
    return hash.substring(0, 7);
}

/**
 * Generates a random, non-deterministic slug.
 */
export function generateRandomSlug(length: number = 7): string {
    return crypto.randomBytes(Math.ceil(length * 3 / 4))
        .toString('base64url')
        .substring(0, length);
}
