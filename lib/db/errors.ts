/**
 * Drizzle wraps driver errors in DrizzleQueryError, and some connection paths
 * use AggregateError. Walk both shapes so actions can turn expected database
 * constraints into inline form feedback instead of an error boundary.
 */
export function hasPostgresErrorCode(error: unknown, code: string): boolean {
  const pending: unknown[] = [error];
  const seen = new Set<unknown>();

  while (pending.length) {
    const current = pending.shift();
    if (!current || typeof current !== "object" || seen.has(current)) continue;
    seen.add(current);

    if ("code" in current && current.code === code) return true;
    if ("cause" in current) pending.push(current.cause);
    if ("errors" in current && Array.isArray(current.errors)) pending.push(...current.errors);
  }

  return false;
}
