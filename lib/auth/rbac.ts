import { auth } from "@/auth"
import { redirect } from "next/navigation"
import type { UserRole } from "@prisma/client"

/**
 * Require authentication - redirects to signin if not authenticated
 */
export async function requireAuth() {
  const session = await auth()
  if (!session?.user) {
    redirect('/auth/signin')
  }
  return session
}

/**
 * Require specific role(s) - redirects to unauthorized if user doesn't have required role
 */
export async function requireRole(allowedRoles: UserRole[]) {
  const session = await requireAuth()
  if (!allowedRoles.includes(session.user.role)) {
    redirect('/unauthorized')
  }
  return session
}

/**
 * Require CLIENT role
 */
export async function requireClient() {
  return requireRole(['CLIENT'])
}

/**
 * Require LAWYER role
 */
export async function requireLawyer() {
  return requireRole(['LAWYER'])
}

/**
 * Require FIRM_ADMIN role
 */
export async function requireFirmAdmin() {
  return requireRole(['FIRM_ADMIN'])
}

/**
 * Require PLATFORM_ADMIN role
 */
export async function requireAdmin() {
  return requireRole(['PLATFORM_ADMIN'])
}

/**
 * Require LAWYER or FIRM_ADMIN role
 */
export async function requireLawyerOrFirmAdmin() {
  return requireRole(['LAWYER', 'FIRM_ADMIN'])
}

/**
 * Require LAWYER, FIRM_ADMIN, or PLATFORM_ADMIN role
 */
export async function requireLawyerOrAdmin() {
  return requireRole(['LAWYER', 'FIRM_ADMIN', 'PLATFORM_ADMIN'])
}

/**
 * Check if user has specific role (doesn't redirect)
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const session = await auth()
  return session?.user?.role === role
}

/**
 * Check if user has any of the specified roles (doesn't redirect)
 */
export async function hasAnyRole(roles: UserRole[]): Promise<boolean> {
  const session = await auth()
  return session?.user ? roles.includes(session.user.role) : false
}

/**
 * Get current user session (doesn't redirect)
 */
export async function getCurrentUser() {
  const session = await auth()
  return session?.user
}
