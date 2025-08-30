// Utility for generating random IDs and tokens

export function randomId(prefix: string = ""): string {
  return `${prefix}${Math.random().toString(36).slice(2, 10)}`;
}

export function randomToken(): string {
  return (
    Math.random().toString(36).slice(2, 10) +
    Math.random().toString(36).slice(2, 10)
  );
}
