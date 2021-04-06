import type {WatchOptions} from 'chokidar'
import chokidar from 'chokidar'
import {Observable} from 'rxjs'

type FileEventType = 'add' | 'addDir' | 'change' | 'unlink' | 'unlinkDir'

export function watchFiles(patternOrArray: string | string[], options: WatchOptions = {}) {
  return new Observable<{type: FileEventType; file: string}>(observer => {
    let watcher = chokidar.watch(patternOrArray, options)
    watcher.on('all', (event, file) => observer.next({type: event, file}))
    watcher.on('error', error => observer.error(error))
    return () => {
      watcher.close()
    }
  })
}
