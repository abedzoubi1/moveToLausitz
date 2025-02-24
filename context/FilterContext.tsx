"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface FilterState {
  address: string;
  location: { lat: number; lng: number } | null;
  suggestion: any | null;
}

interface FilterContextType {
  filterState: FilterState;
  setFilterState: (state: FilterState) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filterState, setFilterState] = useState<FilterState>({
    address: "03229 Altdöbern, Germany",
    location: { lat: 51.67355, lng: 14.060565 },
    suggestion: null,
  });

  return (
    <FilterContext.Provider value={{ filterState, setFilterState }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
};
