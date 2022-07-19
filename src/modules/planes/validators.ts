import { z } from 'zod'

export const createPlaneValidator = z.object({
  name: z.string().min(4).max(64),
  seats: z.number().gt(0).lte(100),
})
