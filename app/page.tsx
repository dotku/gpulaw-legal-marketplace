'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Category {
  id: string
  key: string
  nameEn: string
  descEn: string
  icon: string
  _count: {
    lawyers: number
  }
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load categories:', err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Find the Right Lawyer for Your Legal Needs
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              AI-Powered Legal Guidance + Expert Attorneys
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#categories"
                className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-blue-50 transition-all transform hover:scale-105"
              >
                Get Started with AI Assistant
              </Link>
              <Link
                href="/lawyers"
                className="px-8 py-4 bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-800 transition-all border-2 border-blue-400"
              >
                Browse Lawyers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 sm:gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Chat with AI Assistant</h3>
              <p className="text-gray-600">
                Get free legal guidance and understand your issue better
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Find Your Lawyer</h3>
              <p className="text-gray-600">
                Browse vetted attorneys by category, location, and reviews
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Book Consultation</h3>
              <p className="text-gray-600">
                Schedule and meet with your chosen attorney
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Categories */}
      <section id="categories" className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-4">
            Legal Categories
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Select a category to start with AI guidance or browse lawyers in that specialty
          </p>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-md animate-pulse">
                  <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map(category => (
                <Link
                  key={category.id}
                  href={`/categories/${category.key.toLowerCase()}`}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer border-2 border-transparent hover:border-blue-500"
                >
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {category.nameEn}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {category.descEn}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-600 font-medium">
                      Learn More →
                    </span>
                    <span className="text-gray-500">
                      {category._count.lawyers} lawyers
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose GPULaw */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            Why Choose GPULaw Legal Marketplace
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">AI-Powered Matching</h3>
              <p className="text-gray-600 text-sm">
                Get personalized lawyer recommendations based on your specific needs
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">✓</div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Vetted Attorneys</h3>
              <p className="text-gray-600 text-sm">
                All lawyers verified with bar certification and malpractice insurance
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Transparent Pricing</h3>
              <p className="text-gray-600 text-sm">
                See rates upfront with no hidden fees
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Multi-Language Support</h3>
              <p className="text-gray-600 text-sm">
                Available in English, Chinese (Simplified & Traditional), and more
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA for Lawyers */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Are You a Lawyer?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join our platform and connect with clients seeking legal help
          </p>
          <Link
            href="/lawyer/onboarding"
            className="inline-block px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-blue-50 transition-all transform hover:scale-105"
          >
            Join GPULaw Platform
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">GPULaw</h3>
              <p className="text-sm">
                Connecting clients with expert legal help through AI-powered guidance
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">For Clients</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/lawyers" className="hover:text-white">Find Lawyers</Link></li>
                <li><Link href="#categories" className="hover:text-white">Legal Categories</Link></li>
                <li><Link href="/how-it-works" className="hover:text-white">How It Works</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">For Lawyers</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/lawyer/onboarding" className="hover:text-white">Join Platform</Link></li>
                <li><Link href="/lawyer/dashboard" className="hover:text-white">Lawyer Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>© 2025 GPULaw Legal Marketplace. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
