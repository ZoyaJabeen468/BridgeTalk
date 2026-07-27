import { cn } from "@/lib/utils";

type ContainerTag = "div" | "section" | "header" | "footer" | "article";

interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  as?: ContainerTag;
}

export function Container({
  as = "div",
  className,
  children,
  ...props
}: ContainerProps) {
  const Component = as as "div";
  return (
    <Component
      className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}
      {...props}
    >
      {children}
    </Component>
  );
}
