export function mediaUrl(path: string) {
  if (!path) return ''
  return import.meta.env.BASE_URL + path.replace(/^\/+/, '')
}