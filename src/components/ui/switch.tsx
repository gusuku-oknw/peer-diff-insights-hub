
import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { CommentSlash } from "lucide-react"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> & {
    variant?: "default" | "comment-slash"
  }
>(({ className, variant = "default", ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      variant === "comment-slash" && "bg-transparent border-0 w-8 h-8 rounded-md hover:bg-gray-100",
      className
    )}
    {...props}
    ref={ref}
  >
    {variant === "default" ? (
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
        )}
      />
    ) : (
      <CommentSlash className={cn(
        "h-5 w-5 transition-colors",
        props.checked ? "text-blue-600" : "text-gray-500"
      )} />
    )}
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
