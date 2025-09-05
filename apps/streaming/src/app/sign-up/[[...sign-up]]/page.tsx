import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="max-w-md w-full">
        <SignUp 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-red-600 hover:bg-red-700 text-white',
              card: 'bg-gray-900 border border-gray-700',
              headerTitle: 'text-white',
              headerSubtitle: 'text-gray-300',
              socialButtonsBlockButton: 'bg-gray-800 border border-gray-700 text-white hover:bg-gray-700',
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
  )
}