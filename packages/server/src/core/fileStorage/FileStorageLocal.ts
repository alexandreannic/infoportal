import {promises as fs} from 'fs'
import * as path from 'path'
import {FileStorageInterface} from './FileStorage.js'
import {appConf} from '../AppConf.js'

export class FileStorageLocal implements FileStorageInterface {
  constructor(
    private conf = appConf,
    private root = conf.rootProjectDir + '/.file-storage',
  ) {
    console.log(conf.rootProjectDir + '/.file-storage')
  }

  private fullPath(p: string) {
    return path.join(this.root, p)
  }

  async upload({filePath, data}: Parameters<FileStorageInterface['upload']>[0]) {
    const file = this.fullPath(filePath)
    await fs.mkdir(path.dirname(file), {recursive: true})
    await fs.writeFile(file, data)
  }

  async get({filePath}: Parameters<FileStorageInterface['get']>[0]) {
    return fs.readFile(this.fullPath(filePath))
  }

  async delete({filePath}: Parameters<FileStorageInterface['delete']>[0]) {
    return fs.unlink(this.fullPath(filePath)).catch(() => {})
  }

  url({filePath}: Parameters<FileStorageInterface['url']>[0]) {
    return `/dev-files/${filePath}`
  }
}
