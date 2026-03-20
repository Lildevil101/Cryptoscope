export function Tooltip({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export const TooltipProvider = Tooltip;
export const TooltipTrigger = Tooltip;
export const TooltipContent = Tooltip;
