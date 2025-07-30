import { existsSync, readdirSync, statSync, unlinkSync, rmdirSync } from 'fs'
import { resolve, join } from 'path'
import type { Plugin } from 'vite'

export interface ConfigOptions {
  targetFiles?: string[]
}

function cleanFiles(dirPath) {
  if (existsSync(dirPath)) {
    const files = readdirSync(dirPath)

    files.forEach((file) => {
      const path = join(dirPath, file)

      if (statSync(path).isDirectory()) {
        cleanFiles(path)
        rmdirSync(path)
      }
      else {
        unlinkSync(path)
      }
    })
  }
}

export function Delete(options: ConfigOptions = {}): Plugin {
  const { targetFiles = ['dist'] } = options

  return {
    name: 'vite-plugin-clean',
    enforce: 'pre',
    apply: 'build',
    buildStart: () => {
      const rootDirectory = process.cwd()

      if (Array.isArray(targetFiles)) {
        for (const target of targetFiles) {
          cleanFiles(resolve(rootDirectory, target))
        }
      }
      else {
        cleanFiles(resolve(rootDirectory, targetFiles))
      }
    }
  }
}

export default Delete
