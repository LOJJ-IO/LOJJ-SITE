"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";

import { cn } from "@/lib/utils";

function Accordion({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("w-full", className)}
      {...props}
    />
  );
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b border-[rgba(34,61,20,0.14)]", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
          className={cn(
            "group flex flex-1 items-center justify-between gap-4 py-4 text-left text-base font-normal tracking-tight text-[var(--brand-green)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(34,61,20,0.35)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
            className,
          )}
        {...props}
      >
        <span className="pr-2">{children}</span>
        <span
          aria-hidden
          className={cn(
            "inline-flex h-7 w-7 items-center justify-center rounded-full border border-[rgba(34,61,20,0.2)] bg-[rgba(34,61,20,0.06)] text-[var(--brand-green)]",
            "transition-transform duration-200",
            "group-data-[state=open]:rotate-45",
          )}
        >
          <span className="text-lg leading-none">+</span>
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className={cn(
        "overflow-hidden text-[var(--brand-green)] data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        className,
      )}
      {...props}
    >
      <div className="pb-5 pt-1 text-sm leading-relaxed">{props.children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };

