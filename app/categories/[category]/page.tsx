'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import AIChatInterface from '@/components/chat/AIChatInterface'
import LawyerCard from '@/components/lawyers/LawyerCard'

interface Category {
  id: string
  key: string
  nameEn: string
  descEn: string
  icon: string
  subcategories?: Array<{
    id: string
    nameEn: string
  }>
}

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
  languages?: Array<{ language: string }>
  categories?: Array<{ category: { nameEn: string } }>
}

export default function CategoryPage() {
  const params = useParams()
  const categoryKey = (params?.category as string)?.toUpperCase()

  const [category, setCategory] = useState<Category | null>(null)
  const [lawyers, setLawyers] = useState<Lawyer[]>([])
  const [loading, setLoading] = useState(true)
  const [lawyersLoading, setLawyersLoading] = useState(true)
  const [showChat, setShowChat] = useState(true)
  const [lawyerSuggestion, setLawyerSuggestion] = useState<any>(null)

  // Filters
  const [locationFilter, setLocationFilter] = useState('')
  const [languageFilter, setLanguageFilter] = useState('')
  const [minRate, setMinRate] = useState('')
  const [maxRate, setMaxRate] = useState('')

  // Fetch category details
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        const found = data.find((cat: Category) => cat.key === categoryKey)
        setCategory(found || null)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load category:', err)
        setLoading(false)
      })
  }, [categoryKey])

  // Fetch lawyers in this category
  useEffect(() => {
    if (!categoryKey) return

    setLawyersLoading(true)
    const params = new URLSearchParams({
      category: categoryKey,
      ...(locationFilter && { location: locationFilter }),
      ...(languageFilter && { language: languageFilter }),
      ...(minRate && { minRate }),
      ...(maxRate && { maxRate })
    })

    fetch(`/api/lawyers?${params}`)
      .then(res => res.json())
      .then(data => {
        setLawyers(data.lawyers || [])
        setLawyersLoading(false)
      })
      .catch(err => {
        console.error('Failed to load lawyers:', err)
        setLawyersLoading(false)
      })
  }, [categoryKey, locationFilter, languageFilter, minRate, maxRate])

  const handleLawyerSuggestion = (suggestion: any) => {
    setLawyerSuggestion(suggestion)
    // Could auto-scroll to lawyers section
    const lawyersSection = document.getElementById('lawyers-section')
    lawyersSection?.scrollIntoView({ behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading category...</p>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Return to Homepage
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-blue-100 hover:text-white mb-4 inline-block">
            ← Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{category.icon}</span>
            <div>
              <h1 className="text-4xl font-bold">{category.nameEn}</h1>
              <p className="text-blue-100 text-lg mt-2">{category.descEn}</p>
            </div>
          </div>
          {category.subcategories && category.subcategories.length > 0 && (
            <div className="mt-6">
              <p className="text-sm text-blue-100 mb-2">Common issues we can help with:</p>
              <div className="flex flex-wrap gap-2">
                {category.subcategories.map(sub => (
                  <span
                    key={sub.id}
                    className="px-3 py-1 bg-blue-500/30 rounded-full text-sm"
                  >
                    {sub.nameEn}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Chat/Lawyers View (Mobile) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:hidden">
        <div className="flex gap-2 bg-white rounded-lg p-1 shadow">
          <button
            onClick={() => setShowChat(true)}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              showChat
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            AI Assistant
          </button>
          <button
            onClick={() => setShowChat(false)}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              !showChat
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Find Lawyers ({lawyers.length})
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* AI Chat Section */}
          <div className={`${showChat ? 'block' : 'hidden'} lg:block`}>
            <div className="sticky top-4">
              <div className="h-[600px]">
                <AIChatInterface
                  category={categoryKey}
                  categoryName={category.nameEn}
                  onLawyerSuggestion={handleLawyerSuggestion}
                />
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                  <strong>💡 Tip:</strong> Chat with our AI to understand your legal situation better.
                  When you're ready, we'll help you connect with the right lawyer.
                </p>
              </div>
            </div>
          </div>

          {/* Lawyers Section */}
          <div className={`${!showChat ? 'block' : 'hidden'} lg:block`} id="lawyers-section">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Find {category.nameEn} Lawyers
              </h2>

              {/* Filters */}
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location (City or State)
                  </label>
                  <input
                    type="text"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    placeholder="e.g., New York, CA"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={languageFilter}
                    onChange={(e) => setLanguageFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Languages</option>
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Korean">Korean</option>
                    <option value="Vietnamese">Vietnamese</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Hourly Rate ($)
                  </label>
                  <input
                    type="number"
                    value={minRate}
                    onChange={(e) => setMinRate(e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Hourly Rate ($)
                  </label>
                  <input
                    type="number"
                    value={maxRate}
                    onChange={(e) => setMaxRate(e.target.value)}
                    placeholder="1000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Clear Filters */}
              {(locationFilter || languageFilter || minRate || maxRate) && (
                <button
                  onClick={() => {
                    setLocationFilter('')
                    setLanguageFilter('')
                    setMinRate('')
                    setMaxRate('')
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 mb-4"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Lawyer Suggestion from AI */}
            {lawyerSuggestion && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-green-900 mb-2">
                  ✓ AI Recommendation
                </h3>
                <p className="text-sm text-green-800">{lawyerSuggestion.message}</p>
              </div>
            )}

            {/* Lawyers Grid */}
            {lawyersLoading ? (
              <div className="grid gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-xl p-6 shadow-md animate-pulse">
                    <div className="flex gap-4 mb-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : lawyers.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No lawyers found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or browse all lawyers
                </p>
                <Link
                  href="/lawyers"
                  className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse All Lawyers
                </Link>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Found {lawyers.length} {lawyers.length === 1 ? 'lawyer' : 'lawyers'}
                </p>
                <div className="grid gap-6">
                  {lawyers.map(lawyer => (
                    <LawyerCard key={lawyer.id} lawyer={lawyer} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
