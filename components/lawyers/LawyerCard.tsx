import Link from 'next/link'

interface Lawyer {
  id: string
  firstName: string
  lastName: string
  profilePhotoUrl?: string | null
  bio?: string | null
  city?: string | null
  state?: string | null
  hourlyRate?: number | null
  consultationFee?: number | null
  averageRating?: number | null
  totalReviews?: number
  totalConsultations?: number
  yearsOfExperience?: number | null
  languages?: Array<{
    language: string
  }>
  categories?: Array<{
    category: {
      nameEn: string
    }
  }>
}

interface LawyerCardProps {
  lawyer: Lawyer
}

export default function LawyerCard({ lawyer }: LawyerCardProps) {
  const {
    id,
    firstName,
    lastName,
    profilePhotoUrl,
    bio,
    city,
    state,
    hourlyRate,
    consultationFee,
    averageRating,
    totalReviews = 0,
    yearsOfExperience,
    languages = [],
    categories = []
  } = lawyer

  const fullName = `${firstName} ${lastName}`
  const location = [city, state].filter(Boolean).join(', ')
  const rating = averageRating ? Number(averageRating).toFixed(1) : null

  return (
    <Link href={`/lawyers/${id}`}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all transform hover:scale-[1.02] cursor-pointer border border-gray-200 h-full">
        <div className="p-6">
          {/* Header with Photo and Name */}
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-shrink-0">
              {profilePhotoUrl ? (
                <img
                  src={profilePhotoUrl}
                  alt={fullName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                  {firstName[0]}{lastName[0]}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 truncate">
                {fullName}
              </h3>
              {location && (
                <p className="text-sm text-gray-600">{location}</p>
              )}
              {yearsOfExperience && (
                <p className="text-sm text-gray-500">{yearsOfExperience} years experience</p>
              )}
            </div>
          </div>

          {/* Rating */}
          {rating && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center">
                <span className="text-yellow-500 text-lg">★</span>
                <span className="text-gray-900 font-semibold ml-1">{rating}</span>
              </div>
              <span className="text-gray-500 text-sm">
                ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}

          {/* Bio */}
          {bio && (
            <p className="text-gray-700 text-sm mb-4 line-clamp-3">
              {bio}
            </p>
          )}

          {/* Categories */}
          {categories.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 2).map((cat, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
                  >
                    {cat.category.nameEn}
                  </span>
                ))}
                {categories.length > 2 && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                    +{categories.length - 2} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-1">Languages:</p>
              <p className="text-sm text-gray-700">
                {languages.map(l => l.language).join(', ')}
              </p>
            </div>
          )}

          {/* Pricing */}
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center">
              <div>
                {consultationFee !== null && consultationFee !== undefined ? (
                  <div>
                    <p className="text-xs text-gray-500">Consultation</p>
                    <p className="text-lg font-bold text-gray-900">
                      ${Number(consultationFee).toFixed(0)}
                    </p>
                  </div>
                ) : hourlyRate !== null && hourlyRate !== undefined ? (
                  <div>
                    <p className="text-xs text-gray-500">Hourly Rate</p>
                    <p className="text-lg font-bold text-gray-900">
                      ${Number(hourlyRate).toFixed(0)}/hr
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-500">Contact for rates</p>
                  </div>
                )}
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                View Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
