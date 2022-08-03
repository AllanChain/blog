import { resolve as resolvePath } from 'node:path'
import { access, cp, rmdir, stat } from 'node:fs/promises'

/** @type {() => import('astro').AstroIntegration} */
export default function myIntegration() {
  return {
    name: 'astro-copy-blog-image',
    hooks: {
      'astro:build:done': async () => {
        const publicImgDir = resolvePath(process.cwd(), 'public/img')
        const buildImgDir = resolvePath(process.cwd(), 'dist/img')
        try {
          await access(buildImgDir)
          await rmdir(buildImgDir)
        } catch {}
        console.log('Copying public/img to dist/')
        await cp(publicImgDir, buildImgDir, { recursive: true })
      },
    },
  }
}
