import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Style aligné sur le projet myatps (shadcn « new-york ») : rayon `rounded-md`,
 * `cursor-pointer` dès la base, gabarits h-9 / h-8 / h-10, survol en /90.
 * On conserve en revanche la primitive base-ui de ce projet et notre couleur de
 * marque (le vert vient du token `--primary`, jamais codé en dur ici).
 * Note : `rounded-md` vaut 8px dans les deux projets — les formules de --radius
 * diffèrent mais convergent, donc le rendu est identique au pixel.
 *
 * Animation : reprise du bouton CTA de myatps (`components/pricing/pricing-cards.tsx`)
 * — un reflet en dégradé traverse le bouton au survol (700ms) et `active:scale-[0.98]`
 * au clic. Chez eux c'est un `<div>` enfant + un `<span className="relative">` ;
 * ici c'est un pseudo-élément `before:`, ce qui évite d'ajouter du DOM dans chaque
 * usage (nos CTA sont des `<Link>` stylés par `buttonVariants()`).
 * `transform` reste sur le compositeur et `prefers-reduced-motion` (globals.css)
 * neutralise l'effet automatiquement.
 */
/**
 * Le reflet qui traverse le bouton au survol. La teinte (`before:via-*`) est
 * laissée à chaque variante : un reflet blanc est invisible sur un bouton clair.
 */
const shine =
  "before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:to-transparent before:transition-transform before:duration-700 hover:before:translate-x-full"

const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-md border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all duration-200 outline-none select-none active:scale-[0.98] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: `bg-primary text-primary-foreground hover:bg-primary/90 ${shine} before:via-white/20`,
        // Pas de changement de fond au survol : seul le reflet anime le bouton.
        outline: `border-border bg-background shadow-xs ${shine} before:via-foreground/10 dark:border-input dark:bg-input/30`,
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary",
        ghost:
          "hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent dark:hover:bg-accent/50",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
