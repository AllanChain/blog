import type { AttributifyAttributes } from '@unocss/preset-attributify'

declare global {
  namespace astroHTML.JSX {
    interface HTMLAttributes<T> extends AttributifyAttributes {}
    export type Child =
      | Node
      | Node[]
      | string
      | number
      | boolean
      | null
      | undefined
      | unknown
    export type Children = Child | Child[]

    interface ElementChildrenAttribute {
      // eslint-disable-next-line @typescript-eslint/ban-types
      children: {}
    }

    interface IntrinsicAttributes
      extends AstroBuiltinProps,
        AstroBuiltinAttributes {
      slot?: string
      children?: Children
      class?: string
    }

    type AstroBuiltinProps = import('astro').AstroBuiltinProps
    type AstroBuiltinAttributes = import('astro').AstroBuiltinAttributes
  }
}
