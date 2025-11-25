"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ElementLocatorContextType {
  selectedTestID: string | null;
  setSelectedTestID: (testID: string | null) => void;
}

const ElementLocatorContext = createContext<ElementLocatorContextType | undefined>(
  undefined
);

export function ElementLocatorProvider({ children }: { children: ReactNode }) {
  const [selectedTestID, setSelectedTestID] = useState<string | null>(null);

  return (
    <ElementLocatorContext.Provider value={{ selectedTestID, setSelectedTestID }}>
      {children}
    </ElementLocatorContext.Provider>
  );
}

export function useElementLocator() {
  const context = useContext(ElementLocatorContext);
  if (context === undefined) {
    throw new Error("useElementLocator must be used within ElementLocatorProvider");
  }
  return context;
}

