/**
 * Parses a Google Private Key from an environment variable.
 * Handles escaped newlines and surrounding quotes common in different hosting environments.
 */
export function parsePrivateKey(key: string | undefined): string | undefined {
    if (!key) return undefined;

    // Replace escaped newlines (common in .env files)
    let parsedKey = key.replace(/\\n/g, '\n');

    // Remove surrounding quotes if present (common when copy-pasting from .env to dashboard)
    parsedKey = parsedKey.replace(/^"(.*)"$/, '$1');

    // If the key is multiline but not formatted correctly, this might help
    // (though PEM usually needs specific spacing, this is a common fallback)

    return parsedKey;
}
