import * as z from 'zod'

import {netlifyDeployment} from './netlify'
import {vercelDeployment} from './vercel'

export const templateTechnology = z.object({id: z.string(), name: z.string(), url: z.string()})
export const templateImageMedia = z.object({
  type: z.literal('image'),
  alt: z.string(),
  src: z.string(),
})
export type TemplateImageMedia = z.infer<typeof templateImageMedia>

// just keep as an alias for now
export const templateMedia = templateImageMedia
export type TemplateMedia = z.infer<typeof templateMedia>

export const tokenSpec = z.object({
  role: z.union([z.literal('deploy-studio'), z.literal('read'), z.literal('write')]),
  label: z.string(),
})
export type TokenSpec = z.infer<typeof tokenSpec>

export const supportedDeploymentProvider = z.union([netlifyDeployment, vercelDeployment])
export type SupportedDeploymentProvider = z.infer<typeof supportedDeploymentProvider>

export type TemplateTechnology = z.infer<typeof templateTechnology>

export const templateManifest = z.object({
  version: z.literal(1),
  title: z.string(),
  description: z.string(),
  previewMedia: templateMedia.optional(),
  deployment: supportedDeploymentProvider.optional(),
  technologies: z.array(templateTechnology).optional(),
})

export type TemplateManifest = z.infer<typeof templateManifest>

export const sanityCorsOrigin = z.object({origin: z.string(), allowCredentials: z.boolean()})
export type SanityCorsOrigin = z.infer<typeof sanityCorsOrigin>
