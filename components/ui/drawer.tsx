"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Drawer component temporarily disabled due to vaul React 19 compatibility issues
// TODO: Replace with React 19 compatible drawer solution

export function Drawer({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props}>{children}</div>
}

export function DrawerTrigger({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props}>{children}</div>
}

export function DrawerContent({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("bg-background border rounded-lg p-4", className)} {...props}>
      {children}
    </div>
  )
}

export function DrawerHeader({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("text-center sm:text-left", className)} {...props}>
      {children}
    </div>
  )
}

export function DrawerFooter({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props}>
      {children}
    </div>
  )
}

export function DrawerTitle({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props}>
      {children}
    </h2>
  )
}

export function DrawerDescription({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props}>
      {children}
    </p>
  )
}