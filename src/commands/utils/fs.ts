import fs from 'fs'
import _mkdirp from 'mkdirp'
import path from 'path'
import _rimraf from 'rimraf'
import {promisify} from 'util'

export const copyFile = promisify(fs.copyFile)
export const lstat = promisify(fs.lstat)
export const mkdirp = promisify(_mkdirp)
export const readdir = promisify(fs.readdir)
export const readFile = promisify(fs.readFile)
export const rimraf = promisify(_rimraf)
export const writeFile = promisify(fs.writeFile)

export async function isDirectory(filePath: string) {
  const stats = await lstat(filePath)
  return stats.isDirectory()
}

export async function readDirRecursive(dir: string) {
  const files = await readdir(dir)
  const filesInfo: string[][] = await Promise.all(
    files.map(file => {
      const filePath = path.resolve(dir, file)

      if (fs.statSync(filePath).isDirectory()) {
        return readDirRecursive(filePath)
      } else {
        return Promise.resolve([filePath])
      }
    })
  )

  return filesInfo.reduce((acc: string[], arr) => acc.concat(arr), [])
}

export async function readJsonFile(filePath: string) {
  const buf = await readFile(filePath)
  return JSON.parse(buf.toString('utf-8'))
}
