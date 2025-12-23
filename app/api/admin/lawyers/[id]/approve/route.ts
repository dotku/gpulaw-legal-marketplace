import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth/rbac'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require admin role
    await requireAdmin()

    const { id } = await params
    const body = await request.json()
    const { action, notes } = body

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "approve" or "reject"' },
        { status: 400 }
      )
    }

    const lawyer = await prisma.lawyerProfile.findUnique({
      where: { id }
    })

    if (!lawyer) {
      return NextResponse.json(
        { error: 'Lawyer not found' },
        { status: 404 }
      )
    }

    if (lawyer.status !== 'PENDING_VERIFICATION') {
      return NextResponse.json(
        { error: 'Lawyer is not pending verification' },
        { status: 400 }
      )
    }

    // Update lawyer status
    const newStatus = action === 'approve' ? 'APPROVED' : 'REJECTED'
    const updatedLawyer = await prisma.lawyerProfile.update({
      where: { id },
      data: {
        status: newStatus,
        verificationNotes: notes || null,
        approvedAt: action === 'approve' ? new Date() : null
      }
    })

    // TODO: Send email notification to lawyer

    return NextResponse.json({
      success: true,
      lawyer: updatedLawyer,
      message: `Lawyer ${action === 'approve' ? 'approved' : 'rejected'} successfully`
    })
  } catch (error: any) {
    console.error('Error updating lawyer status:', error)

    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update lawyer status' },
      { status: 500 }
    )
  }
}
