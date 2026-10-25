import { z } from 'zod'
import { isValidCardNumber, isValidExpiry } from './card'

const email = z
  .string()
  .trim()
  .min(1, 'validation.emailRequired')
  .email('validation.emailInvalid')

export const newPassword = z
  .string()
  .min(8,'validation.passwordMin')
  .regex(/[A-Za-z]/, 'validation.passwordLetter')
  .regex(/\d/, 'validation.passwordDigit')

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'validation.passwordRequired'),
})

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'validation.nameMin'),
    email,
    password: newPassword,
    confirmPassword: z.string().min(1, 'validation.passwordRepeat'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'validation.passwordsMismatch',
    path: ['confirmPassword'],
  })

export const forgotSchema = z.object({ email })

export const codeSchema = z.object({
  code: z.string().trim().regex(/^\d{6}$/, 'validation.codeFormat'),
})

export const newPasswordSchema = z
  .object({
    password: newPassword,
    confirmPassword: z.string().min(1, 'validation.passwordRepeat'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'validation.passwordsMismatch',
    path: ['confirmPassword'],
  })
export const profileSchema = z
  .object({
    name: z.string().trim().min(2, 	'validation.nameMin'),
    email: z.string().trim().min(1, 'validation.emailRequired').email('validation.emailInvalid'),
    newPassword: z.string(),
    confirmNewPassword: z.string(),
    currentPassword: z.string().min(1, 'validation.currentPasswordRequired'),
  })
  .superRefine((values, ctx) => {
    if (!values.newPassword) return

    const result = newPassword.safeParse(values.newPassword)
    if (!result.success) {
      ctx.addIssue({
        code: 'custom',
        path: ['newPassword'],
        message: result.error.issues[0].message,
      })
    }

    if (values.newPassword !== values.confirmNewPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmNewPassword'],
        message: 'validation.passwordsMismatch',
      })
    }
  })
export const addressSchema = z.object({
  label: z.string().trim().max(30, 'validation.max30'),
  fullName: z.string().trim().min(2, 'validation.min2'),
  phone: z
    .string()
    .trim()
    .min(9, 'validation.phoneLength')
    .max(20, 'validation.phoneLength'),
  city: z.string().trim().min(2, 'validation.min2'),
  address: z.string().trim().min(5, 	'validation.min5'),
  isDefault: z.boolean(),
})
export const checkoutSchema = z.object({
  shipping: z.object({
    fullName: z.string().trim().min(2, 'validation.min2'),
    phone: z
      .string()
      .trim()
      .min(9, 'validation.phoneLength')
      .max(20, 'validation.phoneLength'),
    city: z.string().trim().min(1, 'validation.cityRequired'),
    address: z.string().trim().min(5, 	'validation.min5'),
  }),
  card: z.object({
    number: z.string().refine(isValidCardNumber, 'validation.cardNumberInvalid'),
    holder: z.string().trim().min(2, 'validation.min2'),
    expiry: z.string().refine(isValidExpiry, 'validation.expiryInvalid'),
    cvc: z.string().regex(/^\d{3,4}$/, 'validation.cvcFormat'),
  }),
})