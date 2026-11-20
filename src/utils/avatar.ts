export function getAvatarUrl(path: string): string {
  return new URL(path, import.meta.env.VITE_API_URL).href
}
