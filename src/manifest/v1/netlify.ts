import {SanityCorsOrigin, TemplateMedia, TokenSpec} from './manifest'

export type ProviderRequirement = 'build-hook' // Add future requirement flags here

export interface NetlifyDeployment {
  provider: 'netlify'
  sites: NetlifySite[]
}

interface NetlifySite {
  id: string
  title: string
  description: string
  dir: string
  buildSettings: {
    base: string
    dir: string
    cmd: string
  }
  requiredTokens?: TokenSpec[]
  requirements?: ProviderRequirement[]
  previewMedia?: TemplateMedia
  requiredCorsOrigins?: SanityCorsOrigin[]
}
