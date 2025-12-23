'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Stats {
  pendingLawyers: number
  totalLawyers: number
  totalClients: number
  totalConsultations: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    pendingLawyers: 0,
    totalLawyers: 0,
    totalClients: 0,
    totalConsultations: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch actual stats from API
    // For now, just set loading to false
    setTimeout(() => {
      setStats({
        pendingLawyers: 0,
        totalLawyers: 0,
        totalClients: 0,
        totalConsultations: 0
      })
      setLoading(false)
    }, 500)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-blue-100 hover:text-white mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-blue-100">Manage GPULaw Legal Marketplace platform</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600 text-sm font-medium">Pending Approvals</p>
                <span className="text-3xl">⏳</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.pendingLawyers}</p>
              <Link
                href="/admin/lawyers/pending"
                className="text-sm text-blue-600 hover:underline mt-2 inline-block"
              >
                Review now →
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600 text-sm font-medium">Total Lawyers</p>
                <span className="text-3xl">👨‍⚖️</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.totalLawyers}</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600 text-sm font-medium">Total Clients</p>
                <span className="text-3xl">👥</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.totalClients}</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600 text-sm font-medium">Consultations</p>
                <span className="text-3xl">📅</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.totalConsultations}</p>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/admin/lawyers/pending"
              className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <span className="text-3xl">⏳</span>
              <div>
                <p className="font-semibold text-gray-900">Pending Lawyers</p>
                <p className="text-sm text-gray-600">Review and approve lawyers</p>
              </div>
            </Link>

            <Link
              href="/admin/lawyers"
              className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <span className="text-3xl">👨‍⚖️</span>
              <div>
                <p className="font-semibold text-gray-900">All Lawyers</p>
                <p className="text-sm text-gray-600">View all lawyer profiles</p>
              </div>
            </Link>

            <Link
              href="/admin/categories"
              className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <span className="text-3xl">📂</span>
              <div>
                <p className="font-semibold text-gray-900">Categories</p>
                <p className="text-sm text-gray-600">Manage legal categories</p>
              </div>
            </Link>

            <Link
              href="/admin/consultations"
              className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <span className="text-3xl">📅</span>
              <div>
                <p className="font-semibold text-gray-900">Consultations</p>
                <p className="text-sm text-gray-600">View all consultations</p>
              </div>
            </Link>

            <Link
              href="/admin/analytics"
              className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <span className="text-3xl">📊</span>
              <div>
                <p className="font-semibold text-gray-900">Analytics</p>
                <p className="text-sm text-gray-600">Platform insights</p>
              </div>
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <span className="text-3xl">⚙️</span>
              <div>
                <p className="font-semibold text-gray-900">Settings</p>
                <p className="text-sm text-gray-600">Platform configuration</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
