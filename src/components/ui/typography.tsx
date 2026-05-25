import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const typographyVariants = cva("", {
    variants: {
        variant: {
            h1: "scroll-m-20 text-4xl font-bold tracking-tight",
            h2: "scroll-m-16 text-3xl font-semibold tracking-tight",
            h3: "scroll-m-12 text-2xl font-semibold",
            h4: "scroll-m-8 text-xl font-medium",
            h5: "text-lg font-semibold",
            h6: "text-base font-medium",
            body1: "text-base font-normal leading-7",
            body2: "text-sm font-normal leading-6",
        },
    },
    defaultVariants: { variant: "body1" },
});
  
type TypographyProps = {
    as?: React.ElementType;
    children: React.ReactNode;
    className?: string;
} & VariantProps<typeof typographyVariants>;

const variantMapping: Record<NonNullable<TypographyProps["variant"]>, React.ElementType> = {
    h1: "h1", h2: "h2", h3: "h3", h4: "h4", h5: "h5", h6: "h6",
    body1: "p",
    body2: "p",
};

const Typography = ({ variant, as, className, children }: TypographyProps) => {

  const Component: React.ElementType = as ?? variantMapping[variant ?? "body1"];

  return (
    <Component className={cn(typographyVariants({ variant }), className)}>
        {children}
    </Component>
  )
};

export default Typography;