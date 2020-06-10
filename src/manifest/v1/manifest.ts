import {NetlifyDeployment} from './netlify'
import {VercelDeployment} from './vercel'

export interface TemplateTechnology {
  id: string
  name: string
  url: string
}

export interface TemplateImageMedia {
  type: 'image'
  alt: string
  src: string
}

export interface TokenSpec {
  role: 'deploy-studio' | 'read' | 'write'
  label: string
}

export type SupportedDeploymentProvider = VercelDeployment | NetlifyDeployment

export type TemplateMedia = TemplateImageMedia

export interface TemplateManifest {
  version: 1
  title: string
  description: string
  previewMedia?: TemplateMedia
  deployment?: SupportedDeploymentProvider
  technologies?: TemplateTechnology[]
}

export interface SanityCorsOrigin {
  origin: string
  allowCredentials: boolean
}
