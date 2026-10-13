import { z } from 'zod'

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