import { ReactNode } from "react";
import { FiltersProvider } from "./FiltersContext";
import { JobsPerPageProvider } from "./JobsPerPageContext";
import { PageProvider } from "./PageContext";
import { SortByProvider } from "./SortByContext";
import { SortIncreasingProvider } from "./SortIncreasingContext";
import { AddOrEditDialogProvider } from "./add_or_edit_dialog/addOrEditDialogProvider";
import { DeleteDialogProvider } from "./delete_dialog/DeleteDialogProvider";

export function JobsLayoutProvider({ children } : { children: ReactNode }) {
  return (
    <FiltersProvider>
      <JobsPerPageProvider>
        <PageProvider>
          <SortByProvider>
            <SortIncreasingProvider>
              <AddOrEditDialogProvider>
                <DeleteDialogProvider>
                  { children }
                </DeleteDialogProvider>
              </AddOrEditDialogProvider>
            </SortIncreasingProvider>
          </SortByProvider>
        </PageProvider>
      </JobsPerPageProvider>
    </FiltersProvider>
  );
}