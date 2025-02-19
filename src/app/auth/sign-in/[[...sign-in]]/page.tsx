"use client"

import { useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  const { isSignedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isSignedIn) {
      router.push('/dashboard')
    }
  }, [isSignedIn, router]) // Include router in dependencies

  return <SignIn />
}


/*import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <SignIn
      path="/sign-in"
      appearance={{
        elements: {
          formButtonPrimary: "bg-blue-500 hover:bg-blue-600",
          footerActionLink: "text-blue-500 hover:text-blue-600",
        },
      }}
      routing="path"
      signUpUrl="/sign-up"
      redirectUrl="/dashboard"
      />
    </div>
  );
}
*/