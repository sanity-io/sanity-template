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

export type TemplateMedia = TemplateImageMedia

export interface TemplateManifest {
  version: 1
  title: string
  description: string
  previewMedia?: TemplateMedia
  deployments: {
    netlify?: NetlifyDeployment
    vercel?: VercelDeployment
  }
  technologies?: TemplateTechnology[]
}

export interface SanityCorsOrigin {
  origin: string
  allowCredentials: boolean
}
