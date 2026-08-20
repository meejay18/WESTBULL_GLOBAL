import z from 'zod'

export const LOCATIONS = ['island', 'mainland']
export const COURSES = ['web development', 'cybersecurity', 'ai and machine learning'] as const

export const registrationValidator = z.object({
  name: z.string().min(2, {
    error: 'Name must be at least two characters',
  }),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(
      z.email({
        error: 'Invalid email address',
      }),
    ),
  phone: z
    .string()
    .min(10, {
      error: 'Invalid phone number',
    })
    .max(15, {
      error: 'Invalid phone number',
    }),
  location: z.enum(LOCATIONS, {
    error: 'Location must be either island or mainland',
  }),
  course: z.enum(COURSES, {
    error: `Course must be one of: ${COURSES.join(', ')}`,
  }),
  dateOfBirth: z.iso
    .date({
      error: 'Invalid date of birth',
    })
    .refine((value) => new Date(value) < new Date(), {
      error: 'Date of birth must be in the past',
    }),
})

export type CreateRegistrationDto = z.infer<typeof registrationValidator>
