export const baseUrl = (urlString: string) => {
  const url = new URL(urlString, "localhost:8000")
  return url.toString()
}
