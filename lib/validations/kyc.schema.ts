import { z } from 'zod';

export const ninjaKycSchema = z.object({
  nin: z
    .string()
    .length(11, 'NIN must be exactly 11 digits')
    .regex(/^\d+$/, 'NIN must contain only numbers'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
});

export type NinjaKYCInput = z.infer<typeof ninjaKycSchema>;
