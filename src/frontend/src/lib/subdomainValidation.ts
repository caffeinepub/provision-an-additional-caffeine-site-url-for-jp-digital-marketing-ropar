export const RESERVED_SUBDOMAIN = 'jpdigitalmarketingropar';

/**
 * Validates a subdomain string according to DNS naming rules and business constraints.
 * Returns an error message if invalid, or null if valid.
 */
export function validateSubdomain(subdomain: string): string | null {
  // Normalize input
  const normalized = subdomain.trim().toLowerCase();

  // Check if empty
  if (!normalized) {
    return 'Subdomain cannot be empty.';
  }

  // Check length constraints
  if (normalized.length < 3) {
    return 'Subdomain must be at least 3 characters long.';
  }

  if (normalized.length > 63) {
    return 'Subdomain cannot exceed 63 characters.';
  }

  // Check for valid characters (lowercase letters, numbers, hyphens)
  const validPattern = /^[a-z0-9-]+$/;
  if (!validPattern.test(normalized)) {
    return 'Subdomain can only contain lowercase letters, numbers, and hyphens.';
  }

  // Check that it doesn't start or end with a hyphen
  if (normalized.startsWith('-') || normalized.endsWith('-')) {
    return 'Subdomain cannot start or end with a hyphen.';
  }

  // Check for consecutive hyphens
  if (normalized.includes('--')) {
    return 'Subdomain cannot contain consecutive hyphens.';
  }

  // Check against reserved subdomain
  if (normalized === RESERVED_SUBDOMAIN) {
    return `The subdomain "${RESERVED_SUBDOMAIN}.caffeine.xyz" is already in use. Please choose a different name.`;
  }

  // All checks passed
  return null;
}

/**
 * Normalizes a subdomain string to lowercase and trimmed.
 */
export function normalizeSubdomain(subdomain: string): string {
  return subdomain.trim().toLowerCase();
}
