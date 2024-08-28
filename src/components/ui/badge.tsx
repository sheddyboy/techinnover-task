import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center px-[6px] rounded-[4px] font-inter leading-[24px] border py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#DDDDDD] text-[#6F6F6F] hover:bg-[#DDDDDD]/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        high: "bg-[#EBFAE2] text-[#4F9C20] uppercase text-[12px] font-medium border-none  hover:bg-[#EBFAE2]/80",
        low: "bg-[#FDF2F2] text-[#EC5962] uppercase text-[12px] font-medium border-none  hover:bg-[#FDF2F2]/80",
        medium:
          "bg-[#EEF3FF] text-[#3069FE] uppercase text-[12px] font-medium border-none  hover:bg-[#EEF3FF]/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
