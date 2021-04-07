import resolveFrom from 'resolve-from'

export const LEGACY_MANIFEST_PATH = 'sanity-template.json' as const
export const MANIFEST_PATH = '.sanity-template/manifest.json' as const

export const MANIFEST_PATHS = [MANIFEST_PATH, LEGACY_MANIFEST_PATH] as const

export function resolveManifestPath(
  basedir: string
): typeof LEGACY_MANIFEST_PATH | typeof MANIFEST_PATH | undefined {
  return MANIFEST_PATHS.find(candidate => resolveFrom.silent(basedir, `./${candidate}`))
}
