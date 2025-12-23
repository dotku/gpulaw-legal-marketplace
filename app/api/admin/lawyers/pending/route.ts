import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth/rbac'

export async function GET(request: NextRequest) {
  try {
    // Require admin role
    await requireAdmin()

    const pendingLawyers = await prisma.lawyerProfile.findMany({
      where: {
        status: 'PENDING_VERIFICATION'
      },
      include: {
        user: {
          select: {
            email: true,
            createdAt: true
          }
        },
        categories: {
          include: {
            category: {
              select: {
                nameEn: true,
                icon: true
              }
            }
          }
        },
        languages: {
          select: {
            language: true
          }
        },
        documents: {
          select: {
            id: true,
            type: true,
            fileUrl: true,
            uploadedAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    return NextResponse.json(pendingLawyers)
  } catch (error: any) {
    console.error('Error fetching pending lawyers:', error)

    // Check if it's an auth error
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch pending lawyers' },
      { status: 500 }
    )
  }
}
