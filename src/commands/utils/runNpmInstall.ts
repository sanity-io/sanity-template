import {exec} from './exec'
import resolveBin from 'resolve-bin'

const npmbinary = resolveBin.sync('npm')

export function runNpmInstall(directory: string) {
  return exec(
    npmbinary,
    ['install', '--prefix', directory, '--ignore-scripts', '--prefer-offline'],
    {
      cwd: directory
    }
  )
}
