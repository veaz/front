import type { JSX } from 'react'

declare namespace JSX {
  interface IntrinsicElements {
    'appkit-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { size?: string }, HTMLElement>
  }
}
