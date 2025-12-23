import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const lawyer = await prisma.lawyerProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            email: true,
            locale: true
          }
        },
        categories: {
          include: {
            category: {
              select: {
                key: true,
                nameEn: true,
                nameZhCn: true,
                nameZhTw: true,
                icon: true
              }
            }
          },
          orderBy: {
            isPrimary: 'desc'
          }
        },
        languages: {
          select: {
            language: true,
            isPrimary: true
          },
          orderBy: {
            language: 'asc'
          }
        },
        reviews: {
          include: {
            consultation: {
              include: {
                client: {
                  include: {
                    user: {
                      select: {
                        email: true
                      }
                    }
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        },
        _count: {
          select: {
            reviews: true,
            consultations: true
          }
        }
      }
    })

    if (!lawyer) {
      return NextResponse.json(
        { error: 'Lawyer not found' },
        { status: 404 }
      )
    }

    // Only show approved lawyers
    if (lawyer.status !== 'APPROVED') {
      return NextResponse.json(
        { error: 'Lawyer profile not available' },
        { status: 403 }
      )
    }

    return NextResponse.json(lawyer)
  } catch (error) {
    console.error('Error fetching lawyer:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lawyer profile' },
      { status: 500 }
    )
  }
}
