import * as z from 'zod'
import {sanityCorsOrigin} from './common'
export const vercelDeployment = z.object({
  provider: z.literal('vercel'),
  corsOrigins: z.array(sanityCorsOrigin).optional()
})
export type VercelDeployment = z.infer<typeof vercelDeployment>
