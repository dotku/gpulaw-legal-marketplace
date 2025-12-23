'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface PendingLawyer {
  id: string
  firstName: string
  lastName: string
  barNumber: string
  barState: string
  bio?: string | null
  phoneNumber?: string | null
  city?: string | null
  state?: string | null
  yearsOfExperience?: number | null
  education?: string | null
  createdAt: string
  user: {
    email: string
    createdAt: string
  }
  categories: Array<{
    isPrimary: boolean
    category: {
      nameEn: string
      icon: string
    }
  }>
  languages: Array<{
    language: string
  }>
  documents: Array<{
    id: string
    documentType: string
    fileUrl: string
    uploadedAt: string
  }>
}

export default function AdminPendingLawyersPage() {
  const [lawyers, setLawyers] = useState<PendingLawyer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    loadPendingLawyers()
  }, [])

  const loadPendingLawyers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/lawyers/pending')
      if (!response.ok) throw new Error('Failed to load pending lawyers')
      const data = await response.json()
      setLawyers(data)
      setLoading(false)
    } catch (err: any) {
      console.error('Error loading pending lawyers:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  const handleApprove = async (lawyerId: string, notes?: string) => {
    if (!confirm('Are you sure you want to approve this lawyer?')) return

    try {
      setProcessingId(lawyerId)
      const response = await fetch(`/api/admin/lawyers/${lawyerId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve', notes })
      })

      if (!response.ok) throw new Error('Failed to approve lawyer')

      const data = await response.json()
      alert(data.message)

      // Reload the list
      await loadPendingLawyers()
    } catch (err: any) {
      console.error('Error approving lawyer:', err)
      alert('Failed to approve lawyer: ' + err.message)
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (lawyerId: string) => {
    const notes = prompt('Enter rejection reason (optional):')
    if (notes === null) return // User clicked cancel

    if (!confirm('Are you sure you want to reject this lawyer?')) return

    try {
      setProcessingId(lawyerId)
      const response = await fetch(`/api/admin/lawyers/${lawyerId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject', notes })
      })

      if (!response.ok) throw new Error('Failed to reject lawyer')

      const data = await response.json()
      alert(data.message)

      // Reload the list
      await loadPendingLawyers()
    } catch (err: any) {
      console.error('Error rejecting lawyer:', err)
      alert('Failed to reject lawyer: ' + err.message)
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pending lawyers...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/admin" className="text-blue-600 hover:underline">
            Return to Admin Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/admin" className="text-blue-100 hover:text-white mb-4 inline-block">
            ← Back to Admin Dashboard
          </Link>
          <h1 className="text-3xl font-bold">Pending Lawyer Approvals</h1>
          <p className="text-blue-100 mt-2">
            Review and approve lawyers waiting for verification
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {lawyers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">All Caught Up!</h2>
            <p className="text-gray-600">No pending lawyer approvals at this time</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-4">
              <p className="text-gray-900 font-semibold">
                {lawyers.length} {lawyers.length === 1 ? 'lawyer' : 'lawyers'} pending approval
              </p>
            </div>

            {lawyers.map(lawyer => {
              const fullName = `${lawyer.firstName} ${lawyer.lastName}`
              const location = [lawyer.city, lawyer.state].filter(Boolean).join(', ')
              const primaryCategory = lawyer.categories.find(c => c.isPrimary)
              const isProcessing = processingId === lawyer.id

              return (
                <div key={lawyer.id} className="bg-white rounded-lg shadow-md p-6">
                  {/* Header */}
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{fullName}</h3>
                      <div className="space-y-1 text-gray-600">
                        <p>📧 {lawyer.user.email}</p>
                        {lawyer.phoneNumber && <p>📱 {lawyer.phoneNumber}</p>}
                        {location && <p>📍 {location}</p>}
                        <p>🏛️ Bar: {lawyer.barState} #{lawyer.barNumber}</p>
                        {lawyer.yearsOfExperience && (
                          <p>💼 {lawyer.yearsOfExperience} years of experience</p>
                        )}
                        <p className="text-sm text-gray-500">
                          Applied: {new Date(lawyer.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 lg:mt-0 flex gap-3">
                      <button
                        onClick={() => handleApprove(lawyer.id)}
                        disabled={isProcessing}
                        className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? 'Processing...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleReject(lawyer.id)}
                        disabled={isProcessing}
                        className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? 'Processing...' : 'Reject'}
                      </button>
                    </div>
                  </div>

                  {/* Categories */}
                  {lawyer.categories.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Categories:</p>
                      <div className="flex flex-wrap gap-2">
                        {lawyer.categories.map((cat, idx) => (
                          <span
                            key={idx}
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              cat.isPrimary
                                ? 'bg-blue-600 text-white'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {cat.category.icon} {cat.category.nameEn}
                            {cat.isPrimary && ' (Primary)'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Languages */}
                  {lawyer.languages.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Languages:</p>
                      <p className="text-gray-600">
                        {lawyer.languages.map(l => l.language).join(', ')}
                      </p>
                    </div>
                  )}

                  {/* Bio */}
                  {lawyer.bio && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Bio:</p>
                      <p className="text-gray-700 whitespace-pre-wrap">{lawyer.bio}</p>
                    </div>
                  )}

                  {/* Education */}
                  {lawyer.education && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Education:</p>
                      <p className="text-gray-700 whitespace-pre-wrap">{lawyer.education}</p>
                    </div>
                  )}

                  {/* Documents */}
                  {lawyer.documents.length > 0 && (
                    <div className="border-t pt-4">
                      <p className="text-sm font-semibold text-gray-700 mb-3">
                        Uploaded Documents ({lawyer.documents.length}):
                      </p>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {lawyer.documents.map(doc => (
                          <a
                            key={doc.id}
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <span className="text-2xl">📄</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {doc.documentType.replace(/_/g, ' ')}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(doc.uploadedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <span className="text-blue-600">→</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
