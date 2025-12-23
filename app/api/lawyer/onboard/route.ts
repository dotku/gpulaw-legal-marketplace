import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth/rbac'

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const session = await requireAuth()

    const body = await request.json()
    const {
      firstName,
      lastName,
      barNumber,
      barState,
      officePhone,
      city,
      state,
      zipCode,
      officeAddress,
      bio,
      yearsExperience,
      lawSchool,
      hourlyRate,
      consultationFee,
      website,
      categories,
      languages
    } = body

    // Validate required fields
    if (!firstName || !lastName || !barNumber || !barState) {
      return NextResponse.json(
        { error: 'Missing required fields: firstName, lastName, barNumber, barState' },
        { status: 400 }
      )
    }

    // Check if user already has a lawyer profile
    const existingProfile = await prisma.lawyerProfile.findUnique({
      where: { userId: session.user.id }
    })

    if (existingProfile) {
      return NextResponse.json(
        { error: 'You already have a lawyer profile' },
        { status: 400 }
      )
    }

    // Check if bar number is already registered
    const existingBarNumber = await prisma.lawyerProfile.findUnique({
      where: { barNumber }
    })

    if (existingBarNumber) {
      return NextResponse.json(
        { error: 'This bar number is already registered' },
        { status: 400 }
      )
    }

    // Calculate bar admission date based on years of experience
    const barAdmissionDate = new Date()
    if (yearsExperience) {
      barAdmissionDate.setFullYear(barAdmissionDate.getFullYear() - parseInt(yearsExperience))
    }

    // Create lawyer profile
    const lawyerProfile = await prisma.lawyerProfile.create({
      data: {
        userId: session.user.id,
        firstName,
        lastName,
        barNumber,
        barState,
        barAdmissionDate,
        officePhone,
        city,
        state,
        zipCode,
        officeAddress,
        bio,
        yearsExperience: yearsExperience ? parseInt(yearsExperience) : 0,
        lawSchool,
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
        consultationFee: consultationFee ? parseFloat(consultationFee) : null,
        website,
        status: 'PENDING_VERIFICATION'
      }
    })

    // Add categories if provided
    if (categories && Array.isArray(categories) && categories.length > 0) {
      const categoryRecords = await prisma.category.findMany({
        where: {
          key: {
            in: categories.map((c: any) => c.categoryKey)
          }
        }
      })

      await prisma.lawyerCategory.createMany({
        data: categories.map((c: any) => {
          const categoryRecord = categoryRecords.find(cr => cr.key === c.categoryKey)
          return {
            lawyerId: lawyerProfile.id,
            categoryId: categoryRecord!.id,
            isPrimary: c.isPrimary || false
          }
        })
      })
    }

    // Add languages if provided
    if (languages && Array.isArray(languages) && languages.length > 0) {
      await prisma.lawyerLanguage.createMany({
        data: languages.map((lang: any) => ({
          lawyerId: lawyerProfile.id,
          language: lang.language,
          isPrimary: lang.isPrimary || false
        }))
      })
    }

    // Update user role to LAWYER
    await prisma.user.update({
      where: { id: session.user.id },
      data: { role: 'LAWYER' }
    })

    return NextResponse.json({
      success: true,
      lawyerId: lawyerProfile.id,
      message: 'Lawyer profile created successfully. Your application is pending admin approval.'
    })
  } catch (error: any) {
    console.error('Error creating lawyer profile:', error)

    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create lawyer profile' },
      { status: 500 }
    )
  }
}
