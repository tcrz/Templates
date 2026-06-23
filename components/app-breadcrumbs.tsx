"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  useBreadcrumbs,
  type BreadcrumbItem as BreadcrumbItemType,
} from "@/hooks/use-breadcrumbs";
import { Fragment } from "react";

function BreadcrumbContent({ item }: { item: BreadcrumbItemType }) {
  if (item.isCurrentPage) {
    return <BreadcrumbPage>{item.label}</BreadcrumbPage>;
  }

  if (!item.isNavigable) {
    return <span className="text-muted-foreground">{item.label}</span>;
  }

  return (
    <BreadcrumbLink asChild>
      <Link href={item.href}>{item.label}</Link>
    </BreadcrumbLink>
  );
}

export function AppBreadcrumbs() {
  const { breadcrumbs, backTo } = useBreadcrumbs();

  if (!backTo) {
    return null;
  }

  return (
    <div className="px-6 flex justify-between items-center">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((item, index) => (
            <Fragment key={item.href}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                <BreadcrumbContent item={item} />
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      {backTo && (
        <Link
          href={backTo.href}
          className="text-primary flex w-fit items-center gap-1 text-sm hover:underline"
        >
          <ArrowLeft className="size-4" />
          Back to {backTo.label}
        </Link>
      )}
    </div>
  );
}
