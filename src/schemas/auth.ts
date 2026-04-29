import * as z from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(36, 'Password cannot exceed 36 characters'),
})

export const signupSchema = z.object({
  fullName: z.string().min(4),
  email: z.string().email(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(36, 'Password cannot exceed 36 characters'),
})
