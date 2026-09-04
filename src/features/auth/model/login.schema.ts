import { z } from 'zod'

/**
 * Login form validation schema
 * Messages are i18n keys resolved against the 'validation' namespace
 * Kept next to the auth feature (FSD: no cross-feature shared validation)
 */
export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, 'emailRequired')
    .email('emailInvalid'),
  password: z.string().min(6, 'passwordMin'),
})

export type LoginFormData = z.infer<typeof LoginSchema>
