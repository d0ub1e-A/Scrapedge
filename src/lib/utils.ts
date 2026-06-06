import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'
import type { ErrorContext } from 'better-auth/react'
import { authClient } from './auth-client'
export * from 'lenis/react'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function handleSignOut(navigate: ReturnType<typeof useNavigate>) {
  await authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        toast.success('Signed out')
        navigate({ to: '/' })
      },
      onError: ({ error }: ErrorContext) => {
        toast.error(error.message)
      },
    },
  })
}
