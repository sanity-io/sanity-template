import * as z from 'zod'
import {sanityCorsOrigin, tokenSpec} from './common'

const envVarMap = z.object({
  projectId: z.array(z.string()),
  dataset: z.array(z.string())
})

export const vercelDeployment = z.object({
  provider: z.literal('vercel'),
  corsOrigins: z.array(sanityCorsOrigin).optional(),
  tokens: z
    .array(
      tokenSpec.extend({
        envVar: z.string().optional()
      })
    )
    .optional(),
  // The env vars `SANITY_STUDIO_API_DATASET` and `SANITY_STUDIO_API_PROJECT_ID` will always be added
  envVars: envVarMap.optional(),
  studio: z.object({basePath: z.string()}).optional()
})
export type VercelDeployment = z.infer<typeof vercelDeployment>
