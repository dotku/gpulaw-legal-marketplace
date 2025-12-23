'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface LawyerProfile {
  id: string
  firstName: string
  lastName: string
  status: string
  barNumber: string
  barState: string
  verifiedAt: string | null
  verificationNotes: string | null
  categories: Array<{
    isPrimary: boolean
    category: {
      nameEn: string
      icon: string
    }
  }>
}

export default function LawyerDashboard() {
  const [profile, setProfile] = useState<LawyerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // TODO: Fetch lawyer profile from API
    // For now, show a placeholder
    setTimeout(() => {
      setLoading(false)
      // setProfile(null) // Will be fetched from API
    }, 500)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // If no profile, show onboarding prompt
  if (!profile && !loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold">Lawyer Dashboard</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">👨‍⚖️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome to GPULaw Lawyer Portal
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              You haven't created a lawyer profile yet. Complete the onboarding process
              to start connecting with clients seeking legal help.
            </p>
            <Link
              href="/lawyer/onboarding"
              className="inline-block px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Onboarding
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const statusColor = {
    PENDING_VERIFICATION: 'yellow',
    APPROVED: 'green',
    REJECTED: 'red',
    SUSPENDED: 'gray'
  }[profile?.status || 'PENDING_VERIFICATION']

  const statusText = {
    PENDING_VERIFICATION: 'Pending Verification',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
    SUSPENDED: 'Suspended'
  }[profile?.status || 'PENDING_VERIFICATION']

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Lawyer Dashboard</h1>
          <p className="text-blue-100">
            Welcome back, {profile?.firstName} {profile?.lastName}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Application Status</h2>
              <div className="flex items-center gap-3">
                <span
                  className={`px-4 py-2 bg-${statusColor}-100 text-${statusColor}-800 font-semibold rounded-full`}
                >
                  {statusText}
                </span>
                {profile?.status === 'APPROVED' && profile.verifiedAt && (
                  <span className="text-sm text-gray-600">
                    Approved on {new Date(profile.verifiedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
            <Link
              href={`/lawyers/${profile?.id}`}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Public Profile
            </Link>
          </div>

          {profile?.status === 'PENDING_VERIFICATION' && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800">
                Your application is currently under review by our admin team. You will be
                notified once your profile is approved.
              </p>
            </div>
          )}

          {profile?.status === 'REJECTED' && profile.verificationNotes && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-semibold mb-2">Rejection Reason:</p>
              <p className="text-red-700">{profile.verificationNotes}</p>
            </div>
          )}

          {profile?.status === 'APPROVED' && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800">
                ✓ Your profile is live! Clients can now find and book consultations with you.
              </p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">Profile Views</p>
              <span className="text-2xl">👁️</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">Consultations</p>
              <span className="text-2xl">📅</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-500 mt-1">Total completed</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">Average Rating</p>
              <span className="text-2xl">⭐</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">—</p>
            <p className="text-sm text-gray-500 mt-1">No reviews yet</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/lawyer/profile/edit"
              className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <span className="text-3xl">✏️</span>
              <div>
                <p className="font-semibold text-gray-900">Edit Profile</p>
                <p className="text-sm text-gray-600">Update your information</p>
              </div>
            </Link>

            <Link
              href="/lawyer/availability"
              className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <span className="text-3xl">📅</span>
              <div>
                <p className="font-semibold text-gray-900">Set Availability</p>
                <p className="text-sm text-gray-600">Manage your schedule</p>
              </div>
            </Link>

            <Link
              href="/lawyer/consultations"
              className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <span className="text-3xl">💼</span>
              <div>
                <p className="font-semibold text-gray-900">Consultations</p>
                <p className="text-sm text-gray-600">View upcoming meetings</p>
              </div>
            </Link>

            <Link
              href="/lawyer/reviews"
              className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <span className="text-3xl">⭐</span>
              <div>
                <p className="font-semibold text-gray-900">Reviews</p>
                <p className="text-sm text-gray-600">See client feedback</p>
              </div>
            </Link>

            <Link
              href="/lawyer/earnings"
              className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <span className="text-3xl">💰</span>
              <div>
                <p className="font-semibold text-gray-900">Earnings</p>
                <p className="text-sm text-gray-600">Track your income</p>
              </div>
            </Link>

            <Link
              href="/lawyer/settings"
              className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <span className="text-3xl">⚙️</span>
              <div>
                <p className="font-semibold text-gray-900">Settings</p>
                <p className="text-sm text-gray-600">Account preferences</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
