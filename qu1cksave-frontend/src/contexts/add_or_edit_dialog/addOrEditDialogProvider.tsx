import { ReactNode } from "react";
import { DialogJobProvider } from "./DialogJobContext";
import { IsAddProvider } from "./IsAddContext";
import { OpenProvider } from "./OpenContext";

export function AddOrEditDialogProvider({ children } : { children: ReactNode }) {
  return (
    <DialogJobProvider>
      <IsAddProvider>
        <OpenProvider>
          { children }
        </OpenProvider>
      </IsAddProvider>
    </DialogJobProvider>
  );
}