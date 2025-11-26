#!/usr/bin/env ts-node

import {promises as fs} from 'fs'
import {glob} from 'glob'
import {en} from '@infoportal/client-i18n/dist/localization/en'

// ------------------------------
// 1. Extract all i18n keys
// ------------------------------

function extractKeys(obj: any, prefix = 'messages'): string[] {
  const keys: string[] = []

  for (const key of Object.keys(obj)) {
    const value = obj[key]
    const full = `${prefix}.${key}`

    if (typeof value === 'string') {
      keys.push(full)
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys.push(...extractKeys(value, full))
    }
  }

  return keys
}

const fullKeys = extractKeys(en.messages)

// Remove "messages." prefix → we want "lightTheme.light"
const flatKeys = fullKeys.map(k => k.replace(/^messages\./, ''))

// --------------------------------------------------
// 2. Find all source files in the repo
// --------------------------------------------------

function getAllSourceFiles(): Promise<string[]> {
  return new Promise(resolve => {
    glob(
      '**/*.{ts,tsx,js,jsx}',
      {
        cwd: process.cwd(),
        ignore: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/.next/**'],
      },
      (_, matches) => resolve(matches),
    )
  })
}

// --------------------------------------------------
// 3. Scan for m.<key> usages
// --------------------------------------------------

async function findUnusedKeys() {
  const files = await getAllSourceFiles()

  const used = new Set<string>()

  for (const file of files) {
    const content = await fs.readFile(file, 'utf8')

    for (const key of flatKeys) {
      // precise pattern like: m.lightTheme.dark
      const regex = new RegExp(`\\bm\\.${key.replace(/\./g, '\\.')}\\b`)

      if (regex.test(content)) {
        used.add(key)
      }
    }
  }

  const unused = flatKeys.filter(k => !used.has(k))

  console.log('------------------------------------------------')
  console.log(' Unused i18n keys (based on m.<key> usage)')
  console.log('------------------------------------------------\n')

  if (unused.length === 0) {
    console.log('🎉 No unused keys! Everything is referenced.')
  } else {
    unused.forEach(k => console.log('•', k))
  }

  console.log(`\nTotal keys: ${flatKeys.length}`)
  console.log(`Unused keys: ${unused.length}`)
  console.log('------------------------------------------------\n')
}

findUnusedKeys()
