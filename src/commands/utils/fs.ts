import fs from 'fs'
import _mkdirp from 'mkdirp'
import path from 'path'
import _rimraf from 'rimraf'
import {promisify} from 'util'
import {from, Observable, of} from 'rxjs'
import {filter, map, mergeMap} from 'rxjs/operators'
import ignore from 'ignore'

export const copyFile = promisify(fs.copyFile)
export const mkdirp = promisify(_mkdirp)
export const readdir = promisify(fs.readdir)
export const stat = promisify(fs.stat)
export const readFile = promisify(fs.readFile)
export const rimraf = promisify(_rimraf)
export const writeFile = promisify(fs.writeFile)

function resolveIgnores(dir: string): string[] {
  if (dir === path.parse(dir).root) {
    return []
  }
  const candidate = path.resolve(dir, '.gitignore')
  return [...resolveIgnores(path.dirname(dir)), ...(fs.existsSync(candidate) ? [candidate] : [])]
}

function getBaseIgnore(dir: string) {
  return resolveIgnores(dir)
    .map(ignoreFile => fs.readFileSync(ignoreFile, 'utf-8'))
    .reduce((ig, source) => ig.add(source), ignore())
}

export function readDirRecursive(dir: string, ig = getBaseIgnore(dir)): Observable<string> {
  return from(readdir(dir)).pipe(
    mergeMap(files => {
      const gitignore = files.find(file => file === '.gitignore')
      if (gitignore) {
        ig.add(fs.readFileSync(path.resolve(dir, gitignore), 'utf-8'))
      }
      return from(files).pipe(
        filter(file => file !== '.git' && file !== '.github'),
        filter(file => !ig.ignores(file)),
        map(file => path.resolve(dir, file)),
        mergeMap(file =>
          from(stat(file)).pipe(
            mergeMap(stat => (stat.isDirectory() ? readDirRecursive(file, ig) : of(file)))
          )
        )
      )
    }),
    map(file => path.resolve(dir, file))
  )
}

export async function readJsonFile(filePath: string) {
  const buf = await readFile(filePath)
  return JSON.parse(buf.toString('utf-8'))
}
