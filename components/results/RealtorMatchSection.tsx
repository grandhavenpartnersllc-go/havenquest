import { getTopRealtors } from '../../services/locationService'
import { Location, UserProfile } from '../../types'
import RealtorCard from './RealtorCard'

interface RealtorMatchSectionProps {
  city: Location
  profile: UserProfile
}

export default function RealtorMatchSection({ city, profile }: RealtorMatchSectionProps) {
  const realtors = getTopRealtors(city.name, 3)

  if (realtors.length === 0) return null

  return (
    <div className="mt-8 pt-8 border-t-2 border-gray-100">
      <div className="mb-6">
        <h3 className="text-xl font-medium text-gray-900 mb-2">
          Ready to take the next step in {city.name}?
        </h3>
        <p className="text-gray-500 text-sm">
          These are your top matched realtors — verified, top-rated, and experienced in relocations.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {realtors.map(realtor => (
          <RealtorCard
            key={realtor.id}
            realtor={realtor}
            cityName={city.name}
            profile={{
              movingTimeline: profile.movingTimeline,
              annualIncome: profile.annualIncome,
              housingPreference: profile.housingPreference,
            }}
          />
        ))}
      </div>

      {realtors.length === 0 && (
        <p className="text-gray-500 text-sm">
          Realtor matches for this city are coming soon.
        </p>
      )}
    </div>
  )
}
