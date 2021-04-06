import fs from 'fs'

// temporarily replace package name of package.json to allow for npm install
// this is needed since the package.name may include template variable syntax which
// makes npm install fail due to invalid characters

export function temporaryTransformPackage(
  pkgPath: string,
  transform: (packageDef: object) => object
) {
  const originalContents = fs.readFileSync(pkgPath, 'utf-8')
  const pkgDef = JSON.parse(originalContents)
  fs.writeFileSync(pkgPath, JSON.stringify(transform(pkgDef)))
  let restored = false
  const restore = () => {
    if (restored) {
      return
    }
    restored = true
    process.off('exit', restore)
    fs.writeFileSync(pkgPath, originalContents)
  }
  process.on('exit', restore)
  return restore
}
