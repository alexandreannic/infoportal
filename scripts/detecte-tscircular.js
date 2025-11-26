// detect-tsref-cycles.js
const fs = require('fs')
const path = require('path')

const packagesDir = path.resolve(__dirname, 'packages')

function readTsconfigs(dir) {
  return fs
    .readdirSync(dir, {withFileTypes: true})
    .filter(d => d.isDirectory())
    .map(d => {
      const cfgPath = path.join(dir, d.name, 'tsconfig.json')
      if (!fs.existsSync(cfgPath)) return null
      try {
        const json = JSON.parse(fs.readFileSync(cfgPath, 'utf8'))
        const refs = (json.references || []).map(r => r.path)
        return {name: d.name, cfgPath, refs}
      } catch (e) {
        console.error(`Failed to parse ${cfgPath}:`, e.message)
        return null
      }
    })
    .filter(Boolean)
}

const pkgs = readTsconfigs(packagesDir)
const nameToPkg = Object.fromEntries(pkgs.map(p => [p.name, p]))
// resolve reference path -> package name
const adj = {}
pkgs.forEach(p => {
  adj[p.name] = (p.refs || []).map(r => {
    const refResolved = path.normalize(path.join(packagesDir, p.name, r))
    const match = pkgs.find(
      x =>
        path.normalize(path.join(packagesDir, x.name)) === refResolved ||
        path.normalize(x.cfgPath) === path.join(refResolved, 'tsconfig.json'),
    )
    return match ? match.name : `?${r}`
  })
})

console.log('Adjacency:', adj)

// detect cycles with DFS
const visited = {}
const stack = []
const cycles = []

function dfs(node) {
  if (stack.includes(node)) {
    const idx = stack.indexOf(node)
    cycles.push(stack.slice(idx).concat(node))
    return
  }
  if (visited[node]) return
  visited[node] = true
  stack.push(node)
  ;(adj[node] || []).forEach(n => {
    if (n.startsWith('?')) return // unresolved ref
    dfs(n)
  })
  stack.pop()
}

Object.keys(adj).forEach(n => dfs(n))

if (cycles.length) {
  console.log('Found cycles:')
  cycles.forEach((c, i) => console.log(`${i + 1}: ${c.join(' -> ')}`))
} else {
  console.log('No cycles in tsconfig references detected.')
}
