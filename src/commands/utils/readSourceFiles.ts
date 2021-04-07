import {readDirRecursive} from './fs'
import {map} from 'rxjs/operators'
import path from 'path'

export function readSourceFiles(templateDir: string) {
  return readDirRecursive(templateDir).pipe(map(file => path.relative(templateDir, file)))
}
