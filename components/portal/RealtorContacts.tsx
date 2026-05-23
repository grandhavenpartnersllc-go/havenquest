import { Location, UserProfile } from '../../types'
import RealtorCard from '../results/RealtorCard'
import { getTopRealtors } from '../../services/locationService'

interface RealtorContactsProps {
  city: Location
  profile: UserProfile
}

export default function RealtorContacts({ city, profile }: RealtorContactsProps) {
  const realtors = getTopRealtors(city.name, 3)

  if (realtors.length === 0) return null

  return (
    <div>
      <h3 className="font-medium text-gray-900 mb-4">Your matched realtors in {city.name}</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        {realtors.slice(0, 2).map(realtor => (
          <RealtorCard
            key={realtor.id}
            realtor={realtor}
            cityName={city.name}
            profile={{ movingTimeline: profile.movingTimeline }}
          />
        ))}
      </div>
    </div>
  )
}
