'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function ClientDashboard() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch client data
    setTimeout(() => setLoading(false), 500)
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-blue-100 hover:text-white mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-2">Client Dashboard</h1>
          <p className="text-blue-100">Manage your legal consultations and AI chat history</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">AI Chats</p>
              <span className="text-2xl">💬</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-500 mt-1">Total conversations</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">Consultations</p>
              <span className="text-2xl">📅</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-500 mt-1">Booked with lawyers</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">Reviews</p>
              <span className="text-2xl">⭐</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-500 mt-1">Lawyers reviewed</p>
          </div>
        </div>

        {/* Get Started Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Get Started</h2>
          <p className="text-gray-600 mb-6">
            Not sure where to begin? Start with our AI assistant or browse lawyers by category.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/#categories"
              className="flex items-center gap-4 p-6 border-2 border-blue-500 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all"
            >
              <span className="text-4xl">🤖</span>
              <div>
                <p className="font-semibold text-gray-900 text-lg">Chat with AI Assistant</p>
                <p className="text-sm text-gray-600">
                  Get free legal guidance and understand your issue
                </p>
              </div>
            </Link>

            <Link
              href="/lawyers"
              className="flex items-center gap-4 p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <span className="text-4xl">👨‍⚖️</span>
              <div>
                <p className="font-semibold text-gray-900 text-lg">Browse Lawyers</p>
                <p className="text-sm text-gray-600">
                  Find and book consultations with attorneys
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/client/consultations"
              className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <span className="text-3xl">📅</span>
              <div>
                <p className="font-semibold text-gray-900">My Consultations</p>
                <p className="text-sm text-gray-600">View upcoming meetings</p>
              </div>
            </Link>

            <Link
              href="/client/chat-history"
              className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <span className="text-3xl">💬</span>
              <div>
                <p className="font-semibold text-gray-900">AI Chat History</p>
                <p className="text-sm text-gray-600">Review past conversations</p>
              </div>
            </Link>

            <Link
              href="/client/reviews"
              className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <span className="text-3xl">⭐</span>
              <div>
                <p className="font-semibold text-gray-900">My Reviews</p>
                <p className="text-sm text-gray-600">View your lawyer reviews</p>
              </div>
            </Link>

            <Link
              href="/client/profile"
              className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <span className="text-3xl">👤</span>
              <div>
                <p className="font-semibold text-gray-900">My Profile</p>
                <p className="text-sm text-gray-600">Update your information</p>
              </div>
            </Link>

            <Link
              href="/"
              className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <span className="text-3xl">🔍</span>
              <div>
                <p className="font-semibold text-gray-900">Find Lawyers</p>
                <p className="text-sm text-gray-600">Search by category or location</p>
              </div>
            </Link>

            <Link
              href="/client/settings"
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
