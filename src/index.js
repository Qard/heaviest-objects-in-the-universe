const { readdir, readFile, stat } = require('fs/promises')
const { dirname, join, resolve } = require('path')

function filterIgnored (list, ignored) {
  return list.filter(filename => !ignored.includes(filename))
}

async function directorySize (base, ignored) {
  const found = []

  const toCheck = filterIgnored(await readdir(base), ignored)

  while (toCheck.length) {
    const filename = toCheck.shift()
    const path = join(base, filename)
    const stats = await stat(path)

    if (stats.isFile()) {
      found.push({
        filename,
        size: stats.size
      })
    } else {
      const files = filterIgnored(await readdir(path), ignored)
        .map(v => join(filename, v))

      toCheck.push(...files)
    }
  }

  return found
}

function resolveFrom (base, dep, cwd) {
  base = resolve(cwd, base)
  const paths = [base]

  while (base !== cwd) {
    base = dirname(base)
    paths.push(base)
  }

  return require.resolve(dep, { paths })
}

function reduce (list, fn) {
  return list.reduce((m, v) => m + fn(v), 0)
}

function dedupDependencies (pkg, seen = new Map()) {
  const toCheck = pkg.dependencySizes.slice()

  while (toCheck.length) {
    const dep = toCheck.shift()
    const key = `${dep.name}@${dep.version}`
    if (seen.has(key)) continue

    seen.set(key, dep)
    toCheck.push(...dep.dependencySizes)
  }

  return Array.from(seen.values())
}

async function moduleSizeTree (base, {
  withDev = false,
  cwd = process.cwd(),
  ignored = [
    '.git',
    'node_modules'
  ]
} = {}) {
  const data = await readFile(join(base, 'package.json'), 'utf8')
  const realPkg = JSON.parse(data)

  const { dependencies = {}, devDependencies = {} } = realPkg

  const pkg = {
    name: realPkg.name,
    version: realPkg.version
  }

  pkg.fileSizes = await directorySize(base, ignored)
  pkg.totalFileSize = reduce(pkg.fileSizes, f => f.size)

  const dependencyNames = Object.keys(dependencies || {})
  if (withDev) {
    dependencyNames.push(...Object.keys(devDependencies || {}))
  }

  pkg.dependencySizes = await Promise.all(dependencyNames.map(dep => {
    // NOTE: Need to use package.json as if "main" is empty resolve fails.
    const resolved = resolveFrom(base, `${dep}/package.json`, cwd)
    return moduleSizeTree(join(resolved.split(dep)[0], dep), { cwd, ignored })
  }))
  pkg.totalDependencySizes = reduce(pkg.dependencySizes, d => d.totalFileSize + d.totalDependencySizes)
  pkg.totalSize = pkg.totalFileSize + pkg.totalDependencySizes

  pkg.totalDedupedDependencySizes = reduce(dedupDependencies(pkg), d => d.totalFileSize)
  pkg.totalDedupedSize = pkg.totalFileSize + pkg.totalDedupedDependencySizes

  return pkg
}

module.exports = moduleSizeTree
