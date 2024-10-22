import { ReactNode } from "react";
import { DeleteJobIdProvider } from "./DeleteJobIdContext";
import { DeleteJobOpenProvider } from "./DeleteJobOpenContext";

export function DeleteDialogProvider({ children } : { children: ReactNode }) {
  return (
    <DeleteJobIdProvider>
      <DeleteJobOpenProvider>
        { children }
      </DeleteJobOpenProvider>
    </DeleteJobIdProvider>
  );
}