import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const location = searchParams.get('location')
    const language = searchParams.get('language')
    const minRate = searchParams.get('minRate')
    const maxRate = searchParams.get('maxRate')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    const where: any = {
      status: 'APPROVED',
    }

    // Category filter
    if (category) {
      where.categories = {
        some: {
          category: {
            key: category
          }
        }
      }
    }

    // Location filter (city or state)
    if (location) {
      where.OR = [
        { city: { contains: location, mode: 'insensitive' } },
        { state: { contains: location, mode: 'insensitive' } }
      ]
    }

    // Language filter
    if (language) {
      where.languages = {
        some: {
          language: language as any
        }
      }
    }

    // Rate filter
    if (minRate || maxRate) {
      where.hourlyRate = {}
      if (minRate) where.hourlyRate.gte = parseFloat(minRate)
      if (maxRate) where.hourlyRate.lte = parseFloat(maxRate)
    }

    const [lawyers, total] = await Promise.all([
      prisma.lawyerProfile.findMany({
        where,
        include: {
          user: {
            select: {
              email: true,
              name: true,
              image: true
            }
          },
          categories: {
            include: {
              category: true
            }
          },
          languages: true,
          reviews: {
            take: 5,
            orderBy: { createdAt: 'desc' }
          },
          _count: {
            select: {
              reviews: true,
              consultations: true
            }
          }
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [
          { averageRating: 'desc' },
          { totalConsultations: 'desc' }
        ]
      }),
      prisma.lawyerProfile.count({ where })
    ])

    return NextResponse.json({
      lawyers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching lawyers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lawyers' },
      { status: 500 }
    )
  }
}
