'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface OnboardingData {
  // Step 1: Basic Info
  firstName: string
  lastName: string
  phoneNumber: string
  barNumber: string
  barState: string
  yearsOfExperience: string

  // Step 2: Location & Practice
  city: string
  state: string
  zipCode: string
  officeAddress: string
  websiteUrl: string

  // Step 3: About
  bio: string
  education: string
  certifications: string

  // Step 4: Pricing
  hourlyRate: string
  consultationFee: string

  // Step 5: Categories
  categories: Array<{ categoryKey: string; isPrimary: boolean }>

  // Step 6: Languages
  languages: Array<{ language: string; proficiency: string }>
}

const CATEGORIES = [
  { key: 'FAMILY_LAW', name: 'Family Law', icon: '👨‍👩‍👧‍👦' },
  { key: 'CONSUMER_DEBT', name: 'Consumer & Debt', icon: '💳' },
  { key: 'HOUSING_LANDLORD', name: 'Housing & Landlord-Tenant', icon: '🏠' },
  { key: 'WILLS_ESTATES', name: 'Wills, Estates & Probate', icon: '📜' },
  { key: 'IMMIGRATION', name: 'Immigration', icon: '🌍' },
  { key: 'CRYPTO_COMPLIANCE', name: 'Crypto Compliance', icon: '₿' }
]

const LANGUAGES = [
  'English', 'Spanish', 'Chinese', 'Korean', 'Vietnamese', 'French', 'Arabic', 'Russian', 'Portuguese', 'Japanese'
]

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
]

export default function LawyerOnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [data, setData] = useState<OnboardingData>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    barNumber: '',
    barState: '',
    yearsOfExperience: '',
    city: '',
    state: '',
    zipCode: '',
    officeAddress: '',
    websiteUrl: '',
    bio: '',
    education: '',
    certifications: '',
    hourlyRate: '',
    consultationFee: '',
    categories: [],
    languages: []
  })

  const updateData = (field: string, value: any) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    setError('')
    setStep(prev => Math.min(6, prev + 1))
  }

  const prevStep = () => {
    setError('')
    setStep(prev => Math.max(1, prev - 1))
  }

  const toggleCategory = (categoryKey: string) => {
    setData(prev => {
      const exists = prev.categories.find(c => c.categoryKey === categoryKey)
      if (exists) {
        return {
          ...prev,
          categories: prev.categories.filter(c => c.categoryKey !== categoryKey)
        }
      } else {
        return {
          ...prev,
          categories: [...prev.categories, { categoryKey, isPrimary: prev.categories.length === 0 }]
        }
      }
    })
  }

  const setPrimaryCategory = (categoryKey: string) => {
    setData(prev => ({
      ...prev,
      categories: prev.categories.map(c => ({
        ...c,
        isPrimary: c.categoryKey === categoryKey
      }))
    }))
  }

  const toggleLanguage = (language: string) => {
    setData(prev => {
      const exists = prev.languages.find(l => l.language === language)
      if (exists) {
        return {
          ...prev,
          languages: prev.languages.filter(l => l.language !== language)
        }
      } else {
        return {
          ...prev,
          languages: [...prev.languages, { language, proficiency: 'FLUENT' }]
        }
      }
    })
  }

  const handleSubmit = async () => {
    // Validate
    if (!data.firstName || !data.lastName || !data.barNumber || !data.barState) {
      setError('Please fill in all required fields')
      return
    }

    if (data.categories.length === 0) {
      setError('Please select at least one legal category')
      return
    }

    if (data.languages.length === 0) {
      setError('Please select at least one language')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/lawyer/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit application')
      }

      // Success
      alert(result.message)
      router.push('/lawyer/dashboard')
    } catch (err: any) {
      console.error('Error submitting application:', err)
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Link href="/" className="text-blue-100 hover:text-white mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold mb-2">Join GPULaw as a Lawyer</h1>
          <p className="text-blue-100">Step {step} of 6</p>
          <div className="mt-4 bg-blue-500/30 rounded-full h-2">
            <div
              className="bg-white rounded-full h-2 transition-all"
              style={{ width: `${(step / 6) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={data.firstName}
                      onChange={(e) => updateData('firstName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={data.lastName}
                      onChange={(e) => updateData('lastName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={data.phoneNumber}
                    onChange={(e) => updateData('phoneNumber', e.target.value)}
                    placeholder="(555) 123-4567"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bar Number *
                    </label>
                    <input
                      type="text"
                      value={data.barNumber}
                      onChange={(e) => updateData('barNumber', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bar State *
                    </label>
                    <select
                      value={data.barState}
                      onChange={(e) => updateData('barState', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select State</option>
                      {US_STATES.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    value={data.yearsOfExperience}
                    onChange={(e) => updateData('yearsOfExperience', e.target.value)}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location & Practice */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Location & Practice</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Office Address
                  </label>
                  <input
                    type="text"
                    value={data.officeAddress}
                    onChange={(e) => updateData('officeAddress', e.target.value)}
                    placeholder="123 Main St, Suite 100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      value={data.city}
                      onChange={(e) => updateData('city', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <select
                      value={data.state}
                      onChange={(e) => updateData('state', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select State</option>
                      {US_STATES.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                    <input
                      type="text"
                      value={data.zipCode}
                      onChange={(e) => updateData('zipCode', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={data.websiteUrl}
                    onChange={(e) => updateData('websiteUrl', e.target.value)}
                    placeholder="https://www.example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: About */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About You</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professional Bio
                  </label>
                  <textarea
                    value={data.bio}
                    onChange={(e) => updateData('bio', e.target.value)}
                    rows={5}
                    placeholder="Tell potential clients about your practice, experience, and approach..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Education
                  </label>
                  <textarea
                    value={data.education}
                    onChange={(e) => updateData('education', e.target.value)}
                    rows={3}
                    placeholder="Law school, degrees, etc."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certifications & Specializations
                  </label>
                  <textarea
                    value={data.certifications}
                    onChange={(e) => updateData('certifications', e.target.value)}
                    rows={3}
                    placeholder="Board certifications, specializations, awards, etc."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Pricing */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Pricing</h2>
              <p className="text-gray-600 mb-6">
                Set your rates (you can update these later)
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hourly Rate ($)
                  </label>
                  <input
                    type="number"
                    value={data.hourlyRate}
                    onChange={(e) => updateData('hourlyRate', e.target.value)}
                    min="0"
                    step="10"
                    placeholder="250"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Consultation Fee ($)
                  </label>
                  <input
                    type="number"
                    value={data.consultationFee}
                    onChange={(e) => updateData('consultationFee', e.target.value)}
                    min="0"
                    step="10"
                    placeholder="150"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Fee for initial consultation
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Categories */}
          {step === 5 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Legal Categories *</h2>
              <p className="text-gray-600 mb-6">
                Select the legal categories you practice (select 1-3)
              </p>
              <div className="space-y-3">
                {CATEGORIES.map(cat => {
                  const isSelected = data.categories.some(c => c.categoryKey === cat.key)
                  const isPrimary = data.categories.find(c => c.categoryKey === cat.key)?.isPrimary

                  return (
                    <div key={cat.key} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleCategory(cat.key)}
                        className="w-5 h-5 text-blue-600 rounded"
                      />
                      <span className="text-2xl">{cat.icon}</span>
                      <span className="flex-1 text-gray-900">{cat.name}</span>
                      {isSelected && (
                        <button
                          onClick={() => setPrimaryCategory(cat.key)}
                          className={`px-3 py-1 text-sm rounded-full ${
                            isPrimary
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {isPrimary ? 'Primary' : 'Set as Primary'}
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
              {data.categories.length > 0 && (
                <p className="text-sm text-gray-500 mt-4">
                  {data.categories.length} {data.categories.length === 1 ? 'category' : 'categories'} selected
                </p>
              )}
            </div>
          )}

          {/* Step 6: Languages */}
          {step === 6 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Languages *</h2>
              <p className="text-gray-600 mb-6">
                Select all languages you speak fluently
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {LANGUAGES.map(lang => {
                  const isSelected = data.languages.some(l => l.language === lang)

                  return (
                    <div key={lang} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleLanguage(lang)}
                        className="w-5 h-5 text-blue-600 rounded"
                      />
                      <span className="text-gray-900">{lang}</span>
                    </div>
                  )
                })}
              </div>
              {data.languages.length > 0 && (
                <p className="text-sm text-gray-500 mt-4">
                  {data.languages.length} {data.languages.length === 1 ? 'language' : 'languages'} selected
                </p>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className="px-6 py-3 text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {step < 6 ? (
              <button
                onClick={nextStep}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
