import { texasCities, texasMetros, getTopRealtors as _getTopRealtors, getRealtorsByCity as _getRealtorsByCity } from '../data'
import { Location, Realtor } from '../types'

export function getAllCities(): Location[] {
  return texasCities
}

export function getCityById(id: string): Location | undefined {
  return texasCities.find(city => city.id === id)
}

export function getCityBySlug(slug: string): Location | undefined {
  return texasCities.find(city => city.id === slug)
}

export function getCitiesByMetro(metro: string): Location[] {
  const metroData = texasMetros[metro as keyof typeof texasMetros]
  if (!metroData) return []
  return texasCities.filter(city => metroData.cityIds.includes(city.id as never))
}

export function getCityChildren(parentId: string): Location[] {
  return texasCities.filter(city => city.parentId === parentId)
}

export function getTopRealtors(city: string, limit = 3): Realtor[] {
  return _getTopRealtors(city, limit)
}

export function getRealtorsByCity(city: string): Realtor[] {
  return _getRealtorsByCity(city)
}

export function getFeaturedCities(count = 4): Location[] {
  const featured = ['frisco-tx', 'cedar-park-tx', 'the-woodlands-tx', 'new-braunfels-tx']
  return featured
    .map(id => texasCities.find(c => c.id === id))
    .filter((c): c is Location => c !== undefined)
    .slice(0, count)
}
