import { cva, type VariantProps } from "class-variance-authority";

// Estilos compartidos para acciones (botones reales y enlaces de navegación).
// Áreas de toque grandes y separadas, alto contraste y foco visible heredado de
// los estilos globales. No dependen solo del color: usan tamaño, peso y borde.
export const buttonStyles = cva(
  "inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-lg font-bold leading-tight text-center no-underline transition-colors min-h-[3.5rem] sm:w-auto",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-text hover:bg-[#ffe07a]",
        secondary: "bg-surface-2 text-text border-2 border-border hover:bg-[#1d4459]",
        danger: "bg-danger text-primary-text hover:bg-[#ffa994]",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

export type ButtonVariant = VariantProps<typeof buttonStyles>["variant"];
