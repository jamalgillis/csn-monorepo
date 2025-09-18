import { auth, clerkClient } from '@clerk/nextjs/server'

/**
 * Check if the current user is a member of the CSN organization
 * @returns Promise<boolean>
 */
export async function isCsnMember(): Promise<boolean> {
  try {
    const { userId } = await auth()
    
    if (!userId) return false

    const memberships = await clerkClient().users.getOrganizationMembershipList({
      userId
    })

    return memberships.data.some(membership => 
      membership.organization.slug === 'csn-staff' || 
      membership.organization.name.toLowerCase().includes('csn')
    )
  } catch (error) {
    console.error('Error checking CSN membership:', error)
    return false
  }
}

/**
 * Check if the current user has admin role in CSN organization
 * @returns Promise<boolean>
 */
export async function isCsnAdmin(): Promise<boolean> {
  try {
    const { userId } = await auth()
    
    if (!userId) return false

    const memberships = await clerkClient().users.getOrganizationMembershipList({
      userId
    })

    const csnMembership = memberships.data.find(membership => 
      membership.organization.slug === 'csn-staff' || 
      membership.organization.name.toLowerCase().includes('csn')
    )

    return csnMembership?.role === 'org:admin'
  } catch (error) {
    console.error('Error checking CSN admin status:', error)
    return false
  }
}

/**
 * Require CSN membership (server-side)
 * Throws an error if user is not a CSN member
 */
export async function requireCsnMember() {
  const isMember = await isCsnMember()
  
  if (!isMember) {
    throw new Error('CSN organization membership required')
  }
}

/**
 * Require CSN admin (server-side)  
 * Throws an error if user is not a CSN admin
 */
export async function requireCsnAdmin() {
  const isAdmin = await isCsnAdmin()
  
  if (!isAdmin) {
    throw new Error('CSN admin role required')
  }
}