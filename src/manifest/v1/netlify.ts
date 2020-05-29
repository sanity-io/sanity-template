import {SanityCorsOrigin, TemplateMedia} from './manifest'

export type ProviderRequirement = 'build-hook' // Add future requirement flags here

export interface NetlifyDeployment {
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

export interface TokenSpec {
  role: 'deploy-studio' | 'read' | 'write'
  label: string
}
