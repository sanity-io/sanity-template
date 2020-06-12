import * as z from 'zod'
export const vercelDeployment = z.object({provider: z.literal('vercel')})
export type VercelDeployment = z.infer<typeof vercelDeployment>
