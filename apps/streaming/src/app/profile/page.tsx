import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { UserProfile } from '@clerk/nextjs'

export default async function ProfilePage() {
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <main className="pt-20 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
            <p className="text-gray-400 mt-2">
              Manage your account settings and preferences
            </p>
          </div>
          
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <UserProfile 
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-red-600 hover:bg-red-700 text-white',
                  card: 'bg-transparent border-0 shadow-none',
                  navbar: 'bg-gray-800 border border-gray-700',
                  navbarButton: 'text-gray-300 hover:text-white',
                  navbarButtonActive: 'text-white bg-red-600',
                  headerTitle: 'text-white',
                  headerSubtitle: 'text-gray-300',
                  formFieldInput: 'bg-gray-800 border border-gray-700 text-white',
                  formFieldLabel: 'text-gray-300',
                  footerActionLink: 'text-red-400 hover:text-red-300',
                  identityPreviewText: 'text-gray-300',
                  formButtonReset: 'text-gray-400 hover:text-gray-300',
                },
              }}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}