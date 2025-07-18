'use client'

import { ReactNode } from "react";
import { JobsProvider } from "@/contexts/JobsContext";
import { JobsLoadingProvider } from "@/contexts/JobsLoadingContext";
import { JobsLayoutProvider } from "@/contexts/JobsLayoutProvider";

export default function JobsLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <JobsLoadingProvider>
      <JobsProvider>
        <JobsLayoutProvider>
          { children }
        </JobsLayoutProvider>
      </JobsProvider>
    </JobsLoadingProvider>
  );
}