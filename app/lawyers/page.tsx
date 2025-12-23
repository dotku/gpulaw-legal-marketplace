'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import LawyerCard from '@/components/lawyers/LawyerCard'

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

interface Category {
  id: string
  key: string
  nameEn: string
}

export default function LawyersPage() {
  const [lawyers, setLawyers] = useState<Lawyer[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [languageFilter, setLanguageFilter] = useState('')
  const [minRate, setMinRate] = useState('')
  const [maxRate, setMaxRate] = useState('')
  const [sortBy, setSortBy] = useState('rating') // rating, experience, price

  // Fetch categories
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data || []))
      .catch(err => console.error('Failed to load categories:', err))
  }, [])

  // Fetch lawyers
  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: '12',
      ...(categoryFilter && { category: categoryFilter }),
      ...(locationFilter && { location: locationFilter }),
      ...(languageFilter && { language: languageFilter }),
      ...(minRate && { minRate }),
      ...(maxRate && { maxRate })
    })

    fetch(`/api/lawyers?${params}`)
      .then(res => res.json())
      .then(data => {
        setLawyers(data.lawyers || [])
        setTotalCount(data.pagination?.total || 0)
        setTotalPages(data.pagination?.totalPages || 1)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load lawyers:', err)
        setLoading(false)
      })
  }, [categoryFilter, locationFilter, languageFilter, minRate, maxRate, currentPage])

  const clearFilters = () => {
    setCategoryFilter('')
    setLocationFilter('')
    setLanguageFilter('')
    setMinRate('')
    setMaxRate('')
    setCurrentPage(1)
  }

  const hasFilters = categoryFilter || locationFilter || languageFilter || minRate || maxRate

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-blue-100 hover:text-white mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Find Your Lawyer</h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Browse our network of vetted attorneys across all legal categories
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Legal Category
                  </label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => {
                      setCategoryFilter(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.key}>
                        {cat.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={locationFilter}
                    onChange={(e) => {
                      setLocationFilter(e.target.value)
                      setCurrentPage(1)
                    }}
                    placeholder="City or State"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* Language Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={languageFilter}
                    onChange={(e) => {
                      setLanguageFilter(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">All Languages</option>
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Korean">Korean</option>
                    <option value="Vietnamese">Vietnamese</option>
                    <option value="French">French</option>
                    <option value="Arabic">Arabic</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hourly Rate Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={minRate}
                      onChange={(e) => {
                        setMinRate(e.target.value)
                        setCurrentPage(1)
                      }}
                      placeholder="Min"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <input
                      type="number"
                      value={maxRate}
                      onChange={(e) => {
                        setMaxRate(e.target.value)
                        setCurrentPage(1)
                      }}
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lawyers Grid */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {loading ? 'Loading...' : `${totalCount} Lawyers Found`}
                </h2>
                {hasFilters && !loading && (
                  <p className="text-sm text-gray-600 mt-1">
                    Showing results with active filters
                  </p>
                )}
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white rounded-xl p-6 shadow-md animate-pulse">
                    <div className="flex gap-4 mb-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-5 bg-gray-200 rounded w-2/3 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && lawyers.length === 0 && (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No lawyers found
                </h3>
                <p className="text-gray-600 mb-4">
                  {hasFilters
                    ? 'Try adjusting your filters to see more results'
                    : 'No lawyers are currently available'}
                </p>
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}

            {/* Results Grid */}
            {!loading && lawyers.length > 0 && (
              <>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {lawyers.map(lawyer => (
                    <LawyerCard key={lawyer.id} lawyer={lawyer} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <div className="flex gap-2">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum
                        if (totalPages <= 5) {
                          pageNum = i + 1
                        } else if (currentPage <= 3) {
                          pageNum = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i
                        } else {
                          pageNum = currentPage - 2 + i
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-10 h-10 rounded-lg ${
                              currentPage === pageNum
                                ? 'bg-blue-600 text-white'
                                : 'border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}
                    </div>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
