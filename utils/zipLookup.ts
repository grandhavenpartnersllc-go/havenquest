export async function lookupZipCityState(zip: string): Promise<{ city: string; state: string } | null> {
  try {
    const res = await fetch(`https://api.zippopotam.us/us/${zip}`)
    if (!res.ok) return null
    const json = await res.json()
    const place = json?.places?.[0]
    if (!place) return null
    const city = place['place name']
    const state = place['state abbreviation']
    if (!city && !state) return null
    return { city, state }
  } catch {
    return null
  }
}
