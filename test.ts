import { moduleSizeTree } from './'
import type { File, Module } from './'

function printFile(file: File) {
  console.log(file.size.toString().padStart(8, ' '), file.filename)
}

function printModule(mod: Module) {
  console.log()
  console.log(mod.name, mod.version)
  mod.fileSizes.map(printFile)
  console.log('--------')
  console.log(mod.fileSizes.reduce((m, f) => m + f.size, 0).toString().padStart(8, ' '))
  mod.dependencySizes.map(printModule)
}

moduleSizeTree('./').then(printModule)
