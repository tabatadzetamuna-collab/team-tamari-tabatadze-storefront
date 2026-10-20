import { z } from 'zod'
import { isValidCardNumber, isValidExpiry } from './card'

const email = z
  .string()
  .trim()
  .min(1, 'ელფოსტა სავალდებულოა')
  .email('შეიყვანე სწორი ელფოსტა')

export const newPassword = z
  .string()
  .min(8,'პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს')
  .regex(/[A-Za-z]/, 'პაროლი უნდა შეიცავდეს მინიმუმ 1 ასოს')
  .regex(/\d/, 'პაროლი უნდა შეიცავდეს მინიმუმ 1 ციფრს')

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'პაროლი სავალდებულოა'),
})

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'სახელი მინიმუმ 2 სიმბოლო'),
    email,
    password: newPassword,
    confirmPassword: z.string().min(1, 'გაიმეორე პაროლი'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'პაროლები არ ემთხვევა',
    path: ['confirmPassword'],
  })

export const forgotSchema = z.object({ email })

export const codeSchema = z.object({
  code: z.string().trim().regex(/^\d{6}$/, 'კოდი უნდა შედგებოდეს 6 ციფრისგან'),
})

export const newPasswordSchema = z
  .object({
    password: newPassword,
    confirmPassword: z.string().min(1, 'გაიმეორე პაროლი'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'პაროლები არ ემთხვევა',
    path: ['confirmPassword'],
  })
export const profileSchema = z
  .object({
    name: z.string().trim().min(2, 'სახელი უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს'),
    email: z.string().trim().min(1, 'შეიყვანე ელფოსტა').email('ელფოსტა არასწორია'),
    newPassword: z.string(),
    confirmNewPassword: z.string(),
    currentPassword: z.string().min(1, 'შეიყვანე მიმდინარე პაროლი'),
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
        message: 'პაროლები არ ემთხვევა',
      })
    }
  })
export const addressSchema = z.object({
  label: z.string().trim().max(30, 'მაქსიმუმ 30 სიმბოლო'),
  fullName: z.string().trim().min(2, 'მინიმუმ 2 სიმბოლო'),
  phone: z
    .string()
    .trim()
    .min(9, 'ტელეფონი: 9–20 სიმბოლო')
    .max(20, 'ტელეფონი: 9–20 სიმბოლო'),
  city: z.string().trim().min(2, 'მინიმუმ 2 სიმბოლო'),
  address: z.string().trim().min(5, 'მინიმუმ 5 სიმბოლო'),
  isDefault: z.boolean(),
})
export const checkoutSchema = z.object({
  shipping: z.object({
    fullName: z.string().trim().min(2, 'მინიმუმ 2 სიმბოლო'),
    phone: z
      .string()
      .trim()
      .min(9, 'ტელეფონი: 9–20 სიმბოლო')
      .max(20, 'ტელეფონი: 9–20 სიმბოლო'),
    city: z.string().trim().min(1, 'შეიყვანე ქალაქი'),
    address: z.string().trim().min(5, 'მინიმუმ 5 სიმბოლო'),
  }),
  card: z.object({
    number: z.string().refine(isValidCardNumber, 'ბარათის ნომერი არასწორია'),
    holder: z.string().trim().min(2, 'მინიმუმ 2 სიმბოლო'),
    expiry: z.string().refine(isValidExpiry, 'ვადა არასწორია ან გასულია'),
    cvc: z.string().regex(/^\d{3,4}$/, '3–4 ციფრი'),
  }),
})