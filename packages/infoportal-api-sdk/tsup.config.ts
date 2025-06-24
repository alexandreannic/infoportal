import {defineConfig} from 'tsup'
import {execSync} from 'child_process'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: false, // Turn off tsup's broken DTS
  onSuccess: async () => {
    // Generate declarations with tsc after tsup finishes
    execSync('tsc --declaration --emitDeclarationOnly --outDir dist', {stdio: 'inherit'})
  },
})
