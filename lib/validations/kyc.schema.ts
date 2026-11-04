import { z } from 'zod';

const MIN_AGE_YEARS = 16;
const MAX_AGE_YEARS = 120;

export const ninjaKycSchema = z.object({
  nin: z
    .string()
    .transform((v) => v.replace(/\D/g, ''))
    .pipe(z.string().length(11, 'NIN must be exactly 11 digits')),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((v) => !Number.isNaN(Date.parse(v)), 'Enter a valid date')
    .refine((v) => {
      const dob = new Date(v);
      return dob.getTime() < Date.now();
    }, 'Date of birth must be in the past')
    .refine((v) => {
      const dob = new Date(v);
      const now = new Date();
      let age = now.getFullYear() - dob.getFullYear();
      const monthDelta = now.getMonth() - dob.getMonth();
      if (monthDelta < 0 || (monthDelta === 0 && now.getDate() < dob.getDate())) {
        age -= 1;
      }
      return age >= MIN_AGE_YEARS && age <= MAX_AGE_YEARS;
    }, `You must be at least ${MIN_AGE_YEARS} years old`),
});

export type NinjaKYCInput = z.infer<typeof ninjaKycSchema>;
