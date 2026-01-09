/**
 * API utility functions
 */

/**
 * Build query string from object
 */
export function buildQueryString(
  params: Record<string, string | number | boolean | undefined>
): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  }

  return searchParams.toString();
}

/**
 * Parse query string to object
 */
export function parseQueryString(queryString: string): Record<string, string | string[]> {
  const params = new URLSearchParams(queryString);
  const result: Record<string, string | string[]> = {};

  for (const [key, value] of params.entries()) {
    if (result[key]) {
      const existing = result[key];
      result[key] = Array.isArray(existing) ? [...existing, value] : [existing as string, value];
    } else {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Handle API errors
 */
export function handleApiError(error: unknown): { message: string; status?: number } {
  if (error instanceof Error) {
    return { message: error.message };
  }

  if (typeof error === "object" && error !== null && "message" in error) {
    return { message: String((error as { message: unknown }).message) };
  }

  return { message: "An unknown error occurred" };
}

/**
 * Retry API call with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }

  throw new Error("Max retries exceeded");
}
