import React from "react";
import Link from "next/link";
import { HiOutlineChevronRight } from "react-icons/hi";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-white/40">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {item.href ? (
              <Link href={item.href} className="hover:text-white transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-[#72c043] font-medium" : "hover:text-white transition-colors cursor-pointer"}>
                {item.label}
              </span>
            )}
            {!isLast && <HiOutlineChevronRight size={14} className="shrink-0" />}
          </React.Fragment>
        );
      })}
    </div>
  );
};
