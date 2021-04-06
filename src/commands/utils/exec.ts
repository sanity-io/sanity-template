import type {ExecFileOptions} from 'child_process'
import {execFile as nodeExecFile} from 'child_process'
import {promisify} from 'util'

const execFile = promisify(nodeExecFile)

export function exec(file: string, args: string[], options: ExecFileOptions) {
  return execFile(file, args, options).then(({stderr, stdout}) => stdout)
}
