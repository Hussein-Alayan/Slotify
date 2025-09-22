"use client";
import React, { createContext, useContext, ReactNode } from "react";

interface BusinessContextType {
  businessId: number;
}

const BusinessContext = createContext<BusinessContextType | undefined>(
  undefined
);

export function BusinessProvider({
  children,
  businessId,
}: {
  children: ReactNode;
  businessId: number;
}) {
  return (
    <BusinessContext.Provider value={{ businessId }}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusinessContext() {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error(
      "useBusinessContext must be used within a BusinessProvider"
    );
  }
  return context;
}
