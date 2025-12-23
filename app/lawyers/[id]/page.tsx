'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface LawyerProfile {
  id: string
  firstName: string
  lastName: string
  profilePhotoUrl?: string | null
  bio?: string | null
  barNumber: string
  barState: string
  city?: string | null
  state?: string | null
  zipCode?: string | null
  officeAddress?: string | null
  phoneNumber?: string | null
  websiteUrl?: string | null
  hourlyRate?: number | null
  consultationFee?: number | null
  yearsOfExperience?: number | null
  education?: string | null
  certifications?: string | null
  averageRating?: number | null
  totalConsultations?: number
  status: string
  user: {
    email: string
    locale: string
  }
  categories: Array<{
    isPrimary: boolean
    category: {
      key: string
      nameEn: string
      icon: string
    }
  }>
  languages: Array<{
    language: string
    isPrimary: boolean
  }>
  reviews: Array<{
    id: string
    overallRating: number
    professionalismRating?: number | null
    communicationRating?: number | null
    valueRating?: number | null
    reviewText?: string | null
    reviewTextZhCn?: string | null
    reviewTextZhTw?: string | null
    createdAt: string
    consultation?: {
      client?: {
        firstName?: string | null
        lastName?: string | null
        user: {
          email: string
        }
      } | null
    } | null
  }>
  _count: {
    reviews: number
    consultations: number
  }
}

export default function LawyerProfilePage() {
  const params = useParams()
  const lawyerId = params?.id as string

  const [lawyer, setLawyer] = useState<LawyerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!lawyerId) return

    fetch(`/api/lawyers/${lawyerId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load lawyer profile')
        return res.json()
      })
      .then(data => {
        setLawyer(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading lawyer:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [lawyerId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lawyer profile...</p>
        </div>
      </div>
    )
  }

  if (error || !lawyer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Lawyer Not Found'}
          </h1>
          <Link href="/lawyers" className="text-blue-600 hover:underline">
            Browse All Lawyers
          </Link>
        </div>
      </div>
    )
  }

  const fullName = `${lawyer.firstName} ${lawyer.lastName}`
  const location = [lawyer.city, lawyer.state].filter(Boolean).join(', ')
  const rating = lawyer.averageRating ? Number(lawyer.averageRating).toFixed(1) : null
  const primaryCategory = lawyer.categories.find(c => c.isPrimary)?.category
  const otherCategories = lawyer.categories.filter(c => !c.isPrimary)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/lawyers" className="text-blue-100 hover:text-white mb-4 inline-block">
            ← Back to Lawyers
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex flex-col sm:flex-row gap-6 mb-6">
                {/* Photo */}
                <div className="flex-shrink-0">
                  {lawyer.profilePhotoUrl ? (
                    <img
                      src={lawyer.profilePhotoUrl}
                      alt={fullName}
                      className="w-32 h-32 rounded-full object-cover border-4 border-blue-200"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold">
                      {lawyer.firstName[0]}{lawyer.lastName[0]}
                    </div>
                  )}
                </div>

                {/* Name and Basic Info */}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{fullName}</h1>
                  {location && (
                    <p className="text-gray-600 mb-2">📍 {location}</p>
                  )}
                  {lawyer.yearsOfExperience && (
                    <p className="text-gray-600 mb-2">
                      💼 {lawyer.yearsOfExperience} years of experience
                    </p>
                  )}
                  <p className="text-gray-600 mb-4">
                    🏛️ Bar: {lawyer.barState} #{lawyer.barNumber}
                  </p>

                  {/* Rating */}
                  {rating && (
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center">
                        <span className="text-yellow-500 text-2xl">★</span>
                        <span className="text-2xl font-bold text-gray-900 ml-2">{rating}</span>
                      </div>
                      <span className="text-gray-600">
                        ({lawyer._count.reviews} {lawyer._count.reviews === 1 ? 'review' : 'reviews'})
                      </span>
                    </div>
                  )}

                  {/* Categories */}
                  <div className="flex flex-wrap gap-2">
                    {primaryCategory && (
                      <span className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-full flex items-center gap-2">
                        <span>{primaryCategory.icon}</span>
                        {primaryCategory.nameEn}
                      </span>
                    )}
                    {otherCategories.map(cat => (
                      <span
                        key={cat.category.key}
                        className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-full"
                      >
                        {cat.category.nameEn}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bio */}
              {lawyer.bio && (
                <div className="border-t pt-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">About</h2>
                  <p className="text-gray-700 whitespace-pre-wrap">{lawyer.bio}</p>
                </div>
              )}

              {/* Education & Certifications */}
              {(lawyer.education || lawyer.certifications) && (
                <div className="border-t pt-6">
                  {lawyer.education && (
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Education</h3>
                      <p className="text-gray-700 whitespace-pre-wrap">{lawyer.education}</p>
                    </div>
                  )}
                  {lawyer.certifications && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Certifications</h3>
                      <p className="text-gray-700 whitespace-pre-wrap">{lawyer.certifications}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Languages */}
              {lawyer.languages.length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {lawyer.languages.map(lang => (
                      <span
                        key={lang.language}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {lang.language} {lang.isPrimary ? '(Primary)' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Client Reviews ({lawyer._count.reviews})
              </h2>

              {lawyer.reviews.length === 0 ? (
                <p className="text-gray-600">No reviews yet</p>
              ) : (
                <div className="space-y-6">
                  {lawyer.reviews.map(review => {
                    const clientProfile = review.consultation?.client
                    const clientEmail = clientProfile?.user?.email
                    const clientName = clientProfile?.firstName && clientProfile?.lastName
                      ? `${clientProfile.firstName} ${clientProfile.lastName}`
                      : clientEmail
                        ? clientEmail.split('@')[0]
                        : 'Anonymous client'
                    const comment = review.reviewText || review.reviewTextZhCn || review.reviewTextZhTw
                    const ratingValue = review.overallRating || 0

                    return (
                      <div key={review.id} className="border-b pb-6 last:border-b-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex">
                            {Array.from({ length: 5 }, (_, i) => (
                              <span
                                key={i}
                                className={`text-xl ${
                                  i < ratingValue ? 'text-yellow-500' : 'text-gray-300'
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-gray-600 text-sm">
                            by {clientName}
                          </span>
                          <span className="text-gray-400 text-sm">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {comment && (
                          <p className="text-gray-700">{comment}</p>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Contact & Pricing</h2>

              {/* Pricing */}
              <div className="mb-6">
                {lawyer.consultationFee !== null && lawyer.consultationFee !== undefined && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">Consultation Fee</p>
                    <p className="text-3xl font-bold text-gray-900">
                      ${Number(lawyer.consultationFee).toFixed(0)}
                    </p>
                  </div>
                )}
                {lawyer.hourlyRate !== null && lawyer.hourlyRate !== undefined && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Hourly Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${Number(lawyer.hourlyRate).toFixed(0)}/hr
                    </p>
                  </div>
                )}
                {lawyer.consultationFee === null && lawyer.hourlyRate === null && (
                  <p className="text-gray-600">Contact for rates</p>
                )}
              </div>

              {/* Contact Info */}
              <div className="space-y-3 mb-6 text-sm">
                {lawyer.phoneNumber && (
                  <div>
                    <p className="text-gray-600 mb-1">Phone</p>
                    <a
                      href={`tel:${lawyer.phoneNumber}`}
                      className="text-blue-600 hover:underline"
                    >
                      {lawyer.phoneNumber}
                    </a>
                  </div>
                )}
                {lawyer.websiteUrl && (
                  <div>
                    <p className="text-gray-600 mb-1">Website</p>
                    <a
                      href={lawyer.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Visit Website →
                    </a>
                  </div>
                )}
                {lawyer.officeAddress && (
                  <div>
                    <p className="text-gray-600 mb-1">Office</p>
                    <p className="text-gray-900">{lawyer.officeAddress}</p>
                    {location && <p className="text-gray-700">{location} {lawyer.zipCode}</p>}
                  </div>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <button className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                  Book Consultation
                </button>
                <button className="w-full px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors">
                  Send Message
                </button>
              </div>

              {/* Stats */}
              <div className="mt-6 pt-6 border-t">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {lawyer._count.consultations}
                    </p>
                    <p className="text-sm text-gray-600">Consultations</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {lawyer.yearsOfExperience || 0}
                    </p>
                    <p className="text-sm text-gray-600">Years Exp</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
