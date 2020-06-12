import * as z from 'zod'

import {sanityCorsOrigin, templateMedia, tokenSpec} from './manifest'

export const providerRequirement = z.literal('build-hook') // Add future requirement flags here
export type ProviderRequirement = z.infer<typeof providerRequirement>

const netlifySite = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  dir: z.string(),
  buildSettings: z.object({
    base: z.string(),
    dir: z.string(),
    cmd: z.string(),
  }),
  requiredTokens: z.array(tokenSpec).optional(),
  requirements: z.array(providerRequirement).optional(),
  previewMedia: templateMedia.optional(),
  requiredCorsOrigins: z.array(sanityCorsOrigin).optional(),
})
export type NetlifySite = z.infer<typeof netlifySite>

export const netlifyDeployment = z.object({
  provider: z.literal('netlify'),
  sites: z.array(netlifySite),
})
export type NetlifyDeployment = z.infer<typeof netlifyDeployment>
